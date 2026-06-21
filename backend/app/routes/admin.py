from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.schemas.user import UserResponse
from app.schemas.order import OrderResponse, OrderStatusUpdate
from app.services.auth import decode_access_token

router = APIRouter(prefix="/admin", tags=["Admin"])
security = HTTPBearer()


def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user


@router.post("/setup-admin", include_in_schema=False)
def setup_admin(secret: str, db: Session = Depends(get_db)):
    """Protected setup endpoint - requires secret query param."""
    from app.config import settings
    expected = settings.ADMIN_SETUP_SECRET
    if not expected or secret != expected:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid secret")
    from app.services.auth import hash_password
    email = "admin@jewellery.com"
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        existing.is_admin = True
        db.commit()
        return {"message": "Admin already exists", "email": email}
    admin = User(name="Admin", email=email, hashed_password=hash_password("Admin@123"), is_admin=True)
    db.add(admin)
    db.commit()
    return {"message": "Admin created", "email": email}


# Dashboard Stats
@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    total_users = db.query(User).filter(User.is_admin == False).count()
    total_products = db.query(Product).count()
    categories = db.query(Product.category).distinct().count()
    total_orders = db.query(Order).count()
    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_categories": categories,
        "total_orders": total_orders,
    }


# Products CRUD
@router.get("/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    return db.query(Product).all()


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}


# Users
@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    return db.query(User).filter(User.is_admin == False).all()


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete admin user")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


# Orders management
@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    return db.query(Order).order_by(Order.created_at.desc()).all()


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    valid_statuses = {"Processing", "Shipped", "Delivered", "Cancelled"}
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Status must be one of {valid_statuses}")
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
