from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.wishlist import WishlistItem
from app.models.product import Product
from app.schemas.product import ProductResponse
from app.services.auth import decode_access_token
from app.services.user import get_user_by_email

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = get_user_by_email(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("", response_model=List[ProductResponse])
def get_wishlist(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    items = db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).all()
    # Resolve products
    return [item.product for item in items if item.product is not None]

@router.post("/{product_id}", response_model=ProductResponse)
def add_to_wishlist(product_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    
    if not existing:
        db.add(WishlistItem(user_id=current_user.id, product_id=product_id))
        db.commit()
        
    return product

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    
    if item:
        db.delete(item)
        db.commit()
        
    return {"message": "Product removed from wishlist"}
