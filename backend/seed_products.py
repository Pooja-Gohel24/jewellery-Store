import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.product import Product
from app.models import user  # noqa — register all models

Base.metadata.create_all(bind=engine)

PRODUCTS = [
    {
        "name": "Diamond Solitaire Ring",
        "category": "Rings",
        "price": 45000,
        "original_price": 55000,
        "rating": 4.8,
        "reviews": 124,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Diamond+Ring",
        "badge": "Best Seller",
        "description": "A stunning diamond solitaire ring crafted in 18K gold. Perfect for engagements and special occasions.",
    },
    {
        "name": "Gold Hoop Earrings",
        "category": "Earrings",
        "price": 12500,
        "original_price": 15000,
        "rating": 4.6,
        "reviews": 89,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Gold+Earrings",
        "badge": "New",
        "description": "Classic gold hoop earrings with a polished finish. Lightweight and comfortable for everyday wear.",
    },
    {
        "name": "Pearl Strand Necklace",
        "category": "Necklaces",
        "price": 28000,
        "original_price": 35000,
        "rating": 4.7,
        "reviews": 67,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Pearl+Necklace",
        "badge": "Sale",
        "description": "Elegant freshwater pearl strand necklace with a gold clasp. A timeless piece for any occasion.",
    },
    {
        "name": "Tennis Bracelet",
        "category": "Bracelets",
        "price": 38000,
        "original_price": 45000,
        "rating": 4.9,
        "reviews": 203,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Tennis+Bracelet",
        "badge": "Popular",
        "description": "A classic diamond tennis bracelet set in 18K white gold. The perfect luxury gift.",
    },
    {
        "name": "Ruby Pendant Necklace",
        "category": "Necklaces",
        "price": 22000,
        "original_price": 28000,
        "rating": 4.5,
        "reviews": 45,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Ruby+Pendant",
        "badge": "",
        "description": "A vibrant ruby pendant set in 22K gold. Rich color and exceptional clarity.",
    },
    {
        "name": "Gold Bangles Set",
        "category": "Bracelets",
        "price": 18000,
        "original_price": 22000,
        "rating": 4.4,
        "reviews": 78,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Gold+Bangles",
        "badge": "Sale",
        "description": "Set of 4 traditional gold bangles with intricate engraving. Perfect for festive occasions.",
    },
    {
        "name": "Emerald Drop Earrings",
        "category": "Earrings",
        "price": 32000,
        "original_price": 40000,
        "rating": 4.7,
        "reviews": 56,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Emerald+Earrings",
        "badge": "New",
        "description": "Stunning emerald drop earrings in 18K gold setting. A bold statement piece.",
    },
    {
        "name": "Sapphire Cocktail Ring",
        "category": "Rings",
        "price": 52000,
        "original_price": 65000,
        "rating": 4.8,
        "reviews": 91,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Sapphire+Ring",
        "badge": "Best Seller",
        "description": "A magnificent blue sapphire cocktail ring surrounded by diamonds in 18K gold.",
    },
    {
        "name": "Kundan Choker Necklace",
        "category": "Necklaces",
        "price": 15000,
        "original_price": 18000,
        "rating": 4.3,
        "reviews": 112,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Kundan+Choker",
        "badge": "",
        "description": "Traditional Kundan choker necklace with meenakari work. Perfect for weddings.",
    },
    {
        "name": "Diamond Stud Earrings",
        "category": "Earrings",
        "price": 25000,
        "original_price": 30000,
        "rating": 4.9,
        "reviews": 178,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Diamond+Studs",
        "badge": "Best Seller",
        "description": "Classic diamond stud earrings in 18K white gold. A must-have for every jewellery collection.",
    },
    {
        "name": "Rose Gold Chain",
        "category": "Necklaces",
        "price": 9500,
        "original_price": 12000,
        "rating": 4.2,
        "reviews": 63,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Rose+Gold+Chain",
        "badge": "Sale",
        "description": "Delicate rose gold chain necklace. Minimalist design perfect for layering.",
    },
    {
        "name": "Platinum Wedding Band",
        "category": "Rings",
        "price": 35000,
        "original_price": 42000,
        "rating": 4.6,
        "reviews": 88,
        "img": "https://placehold.co/400x400/f6f2ee/8b5e3c?text=Wedding+Band",
        "badge": "",
        "description": "Classic platinum wedding band with a comfort fit design. Engraving available.",
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Product).count()
        if existing > 0:
            print(f"Products table already has {existing} records. Skipping seed.")
            return
        for data in PRODUCTS:
            db.add(Product(**data))
        db.commit()
        print(f"✅ Seeded {len(PRODUCTS)} products into the database.")
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
