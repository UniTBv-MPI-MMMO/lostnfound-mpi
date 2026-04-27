import os
from collections.abc import Generator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure the app module can be imported without needing a live Postgres connection.
os.environ.setdefault("DATABASE_URL", "sqlite:///./unused.db")

from main import Base, DBItem, app, get_db  # noqa: E402


@pytest.fixture(scope="session")
def test_engine():
    """Creates a shared in-memory database for integration tests."""
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(scope="function")
def db_session(test_engine) -> Generator[Session, None, None]:
    """Provides an isolated database session and cleans data between tests."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        # Keep schema but clear rows to avoid test interference.
        Base.metadata.drop_all(bind=test_engine)
        Base.metadata.create_all(bind=test_engine)


@pytest_asyncio.fixture(scope="function")
async def async_client(db_session: Session):
    """Uses AsyncClient to simulate real asynchronous network requests to the API."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_item_persists_data_and_returns_201(async_client: AsyncClient, db_session: Session):
    """Business requirement: creating a Lost/Found item must persist data and return success."""
    payload = {
        "title": "Umbrela neagra",
        "description": "Uitata in PII3",
        "category": "Accesorii",
        "location": "PII3",
        "status": "found",
        "contact_info": "student@example.com",
    }

    response = await async_client.post("/items", json=payload)

    assert response.status_code == 201
    body = response.json()
    assert body["id"] > 0
    assert body["title"] == payload["title"]
    assert response.headers.get("Location") == f"/items/{body['id']}"

    persisted_item = db_session.query(DBItem).filter(DBItem.id == body["id"]).first()
    assert persisted_item is not None
    assert persisted_item.title == payload["title"]
    assert persisted_item.category == payload["category"]
    assert persisted_item.contact_info == payload["contact_info"]


@pytest.mark.asyncio
async def test_create_item_missing_required_field_returns_422(async_client: AsyncClient):
    """Business requirement: invalid input must be rejected with a 4xx validation error."""
    payload_missing_title = {
        "description": "Fara titlu",
        "category": "Electronice",
        "location": "Biblioteca",
    }

    response = await async_client.post("/items", json=payload_missing_title)

    assert response.status_code == 422
    error_fields = [err.get("loc", [])[-1] for err in response.json().get("detail", [])]
    assert "title" in error_fields


@pytest.mark.asyncio
async def test_root_endpoint_confirms_service_is_available(async_client: AsyncClient):
    """Business requirement: the backend must expose a basic smoke-check route for CI health validation."""
    response = await async_client.get("/")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
