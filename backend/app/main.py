from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import user  # noqa: F401 — ensures model is registered
from app.routes.auth import router as auth_router

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Shimmer Jewelry Store API",
    description="Backend API for Shimmer Jewelry Store",
    version="1.0.0"
)

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Shimmer Jewelry Store API is running"}
