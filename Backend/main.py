import os
from fastapi import FastAPI, Response, status, Depends
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# DATABASE CONFIGURATION
# Fetch the URL from docker-compose (environment variable)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:adminpassword@db:5432/app_db")

# SQLAlchemy requires the URL to start with postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLALCHEMY MODELS (Database Schema)
class DBItem(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    location = Column(String, nullable=True)
    status = Column(String, default="found")
    contact_info = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

# PYDANTIC MODELS (API Schema)
class ItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "found"  # Set default to "found" to match DB
    contact_info: Optional[str] = None

class Item(ItemCreate):
    id: int
    created_at: datetime
    
    # Allows Pydantic to read data directly from the SQLAlchemy model
    model_config = ConfigDict(from_attributes=True)

# FASTAPI APP
app = FastAPI()

# "Dependency" function that opens and closes the DB connection for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "LostNFound Backend is working!"}

@app.post("/items", response_model=Item, status_code=status.HTTP_201_CREATED)
def create_item(item: ItemCreate, response: Response, db: Session = Depends(get_db)):
    """Create a new found item and save it to PostgreSQL."""
    
    # Create the database object and map the new fields
    new_db_item = DBItem(
        title=item.title,
        description=item.description,
        category=item.category,
        location=item.location,
        status=item.status,
        contact_info=item.contact_info
    )
    
    # Insert it and save the changes
    db.add(new_db_item)
    db.commit()
    
    # Refresh the object to get the Postgres-generated ID
    db.refresh(new_db_item) 
    
    # Set the Location header (best practice for REST)
    response.headers["Location"] = f"/items/{new_db_item.id}"
    
    return new_db_item