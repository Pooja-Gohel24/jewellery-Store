from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=False)
    rating = Column(Float, default=0.0)
    reviews = Column(Integer, default=0)
    stock = Column(Integer, default=100)
    img = Column(String, nullable=False)
    badge = Column(String, default="")
    description = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
