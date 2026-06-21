from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
import app.models  # noqa: registers all models
from app.routes.auth import router as auth_router
from app.routes.products import router as products_router
from app.routes.admin import router as admin_router
from app.routes.orders import router as orders_router
from app.config import settings
import threading
import time
import requests as _requests

app = FastAPI(
    title="Shimmer Jewelry Store API",
    description="Backend API for Shimmer Jewelry Store",
    version="1.0.0"
)

# Build allowed origins from env — set FRONTEND_URL in Render dashboard to your Vercel URL
_origins = [o.strip() for o in [
    "http://localhost:5173",
    settings.FRONTEND_URL,
] if o and o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(orders_router, prefix="/api")


@app.on_event("startup")
def on_startup():
    # Run alembic migrations so schema is always current on Render
    try:
        from alembic.config import Config
        from alembic import command
        import os
        alembic_cfg = Config(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
        alembic_cfg.set_main_option(
            "script_location",
            os.path.join(os.path.dirname(__file__), "..", "alembic")
        )
        command.upgrade(alembic_cfg, "head")
        print("[INFO] Alembic migrations applied.")
    except Exception as e:
        print(f"[WARN] Alembic migration skipped: {e}")

    # Seed products if table is empty
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


def _keep_alive():
    """Ping self every 10 minutes to prevent Render free-tier sleep."""
    time.sleep(60)
    import os
    self_url = os.getenv("RENDER_EXTERNAL_URL", "")
    if not self_url:
        return
    while True:
        try:
            _requests.get(self_url + "/", timeout=10)
        except Exception:
            pass
        time.sleep(600)


threading.Thread(target=_keep_alive, daemon=True).start()
