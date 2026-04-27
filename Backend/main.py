import os
from fastapi import FastAPI, Response, status, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware

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
    status = Column(String, default="found") # e.g., 'lost', 'found', 'resolved'
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

class ItemUpdate(BaseModel):
    status: str

class Item(ItemCreate):
    id: int
    created_at: datetime
    
    # Allows Pydantic to read data directly from the SQLAlchemy model
    model_config = ConfigDict(from_attributes=True)

# FASTAPI APP
app = FastAPI()
# Configure CORS so the frontend can connect to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods 
    allow_headers=["*"],  # Allows all headers
)

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
    
    new_db_item = DBItem(
        title=item.title,
        description=item.description,
        category=item.category,
        location=item.location,
        status=item.status,
        contact_info=item.contact_info
    )
    
    db.add(new_db_item)
    db.commit()
    db.refresh(new_db_item) 
    
    response.headers["Location"] = f"/items/{new_db_item.id}"
    return new_db_item

@app.get("/items", response_model=List[Item])
def get_items(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Retrieve all items. Optionally filter by status (e.g., lost, found)."""
    
    # Start building the query
    query = db.query(DBItem)
    
    # Apply filter if the 'status' query parameter is provided
    if status:
        query = query.filter(DBItem.status == status)
        
    return query.all()

@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a single item by its ID."""
    
    item = db.query(DBItem).filter(DBItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        
    return item

@app.patch("/items/{item_id}", response_model=Item)
def update_item_status(item_id: int, item_update: ItemUpdate, db: Session = Depends(get_db)):
    """Update the status of a specific item."""
    
    item = db.query(DBItem).filter(DBItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        
    # Update the status field
    item.status = item_update.status
    
    db.commit()
    db.refresh(item)
    
    return item