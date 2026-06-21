from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    product_img: Optional[str] = ""
    price: float
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    total_amount: float
    shipping_amount: float
    tax_amount: float
    payment_method: str = "cod"
    full_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    state: str
    pincode: str


class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int]
    product_name: str
    product_img: Optional[str]
    price: float
    quantity: int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    shipping_amount: float
    tax_amount: float
    payment_method: str
    full_name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    pincode: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str
