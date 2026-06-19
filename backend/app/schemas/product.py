from pydantic import BaseModel
from typing import Optional

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float
    original_price: float
    rating: float
    reviews: int
    img: str
    badge: str
    description: str

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    original_price: float
    rating: float = 0.0
    reviews: int = 0
    img: str
    badge: str = ""
    description: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    img: Optional[str] = None
    badge: Optional[str] = None
    description: Optional[str] = None