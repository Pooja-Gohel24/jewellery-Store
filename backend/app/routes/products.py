from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.product import Product
from app.models.review import Review
from app.schemas.product import ProductResponse
from app.schemas.review import ReviewCreate, ReviewResponse
from app.routes.orders import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category and category.lower() != "all":
        query = query.filter(Product.category == category)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    return query.all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


# Reviews endpoints
@router.get("/{product_id}/reviews", response_model=List[ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(Review.created_at.desc()).all()
    
    # Manually populate user_name for each review
    response_reviews = []
    for r in reviews:
        res = ReviewResponse.from_orm(r)
        res.user_name = r.user.name if r.user else "Anonymous"
        response_reviews.append(res)
        
    return response_reviews


@router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_product_review(
    product_id: int,
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    # Check if user already reviewed this product
    existing = db.query(Review).filter(Review.product_id == product_id, Review.user_id == current_user.id).first()
    if existing:
        # We can update the review, or raise error. Let's update it to make it flexible!
        existing.rating = payload.rating
        existing.comment = payload.comment
        db.commit()
        db.refresh(existing)
        review = existing
    else:
        review = Review(
            product_id=product_id,
            user_id=current_user.id,
            rating=payload.rating,
            comment=payload.comment
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        
    # Recalculate average rating & reviews count
    total_reviews = db.query(Review).filter(Review.product_id == product_id).count()
    if total_reviews > 0:
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.product_id == product_id).scalar()
        avg_rating = round(float(avg_rating), 1)
    else:
        avg_rating = 0.0
        
    product.rating = avg_rating
    product.reviews = total_reviews
    db.commit()
    
    # Return response with user_name populated
    res = ReviewResponse.from_orm(review)
    res.user_name = current_user.name
    return res
