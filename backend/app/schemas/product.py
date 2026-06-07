from pydantic import BaseModel

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
