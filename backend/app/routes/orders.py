from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse
from app.services.auth import decode_access_token
from app.services.user import get_user_by_email

router = APIRouter(prefix="/orders", tags=["Orders"])
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = get_user_by_email(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(payload: OrderCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # Validate stock for each item
    for item in payload.items:
        if item.product_id:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product and product.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.name}'"
                )

    order = Order(
        user_id=current_user.id,
        total_amount=payload.total_amount,
        shipping_amount=payload.shipping_amount,
        tax_amount=payload.tax_amount,
        payment_method=payload.payment_method,
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        address=payload.address,
        city=payload.city,
        state=payload.state,
        pincode=payload.pincode,
    )
    db.add(order)
    db.flush()  # get order.id before committing

    for item in payload.items:
        db.add(OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            product_img=item.product_img or "",
            price=item.price,
            quantity=item.quantity,
        ))
        # Decrement stock
        if item.product_id:
            db.query(Product).filter(Product.id == item.product_id).update(
                {"stock": Product.stock - item.quantity}
            )

    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=List[OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders


@router.put("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.status != "Processing":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order can only be cancelled if it is in Processing state"
        )
    
    # Restore stock for each item
    for item in order.items:
        if item.product_id:
            db.query(Product).filter(Product.id == item.product_id).update(
                {"stock": Product.stock + item.quantity}
            )
            
    order.status = "Cancelled"
    db.commit()
    db.refresh(order)
    return order
