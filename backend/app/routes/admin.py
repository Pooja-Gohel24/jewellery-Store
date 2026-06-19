from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.product import Product
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.schemas.user import UserResponse
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


@router.get("/setup-admin")
def setup_admin(db: Session = Depends(get_db)):
    from app.services.auth import hash_password
    from sqlalchemy import text
    # Add is_admin column if it doesn't exist
    try:
        db.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE"))
        db.commit()
    except Exception:
        db.rollback()
    email = "admin@jewellery.com"
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        db.execute(text(f"UPDATE users SET is_admin = TRUE WHERE email = '{email}'"))
        db.commit()
        return {"message": "Admin already exists", "email": email, "password": "Admin@123"}
    admin = User(
        name="Admin",
        email=email,
        hashed_password=hash_password("Admin@123"),
        is_admin=True
    )
    db.add(admin)
    db.commit()
    return {"message": "Admin created", "email": email, "password": "Admin@123"}


# Dashboard Stats
@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    total_users = db.query(User).filter(User.is_admin == False).count()
    total_products = db.query(Product).count()
    categories = db.query(Product.category).distinct().count()
    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_categories": categories,
        "total_orders": 0
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
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
