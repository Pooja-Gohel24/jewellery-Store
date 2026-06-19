from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.models import user    # noqa: F401
from app.models import product # noqa: F401
from app.routes.auth import router as auth_router
from app.routes.products import router as products_router
from app.routes.admin import router as admin_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Shimmer Jewelry Store API",
    description="Backend API for Shimmer Jewelry Store",
    version="1.0.0"
)

import os

allowed_origins = [
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in allowed_origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.on_event("startup")
def seed_products():
    from app.models.product import Product
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            from seed_products import PRODUCTS
            for data in PRODUCTS:
                db.add(Product(**data))
            db.commit()
            print("[INFO] Products seeded.")
    except Exception as e:
        db.rollback()
        print(f"[WARN] Seed skipped: {e}")
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Shimmer Jewelry Store API is running"}
