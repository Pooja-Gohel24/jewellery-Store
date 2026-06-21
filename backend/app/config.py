from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str
    # Brevo SMTP API key (stored as EMAIL_PASSWORD for backward compat)
    EMAIL_PASSWORD: str
    EMAIL_FROM: str
    # Optional
    EMAIL_USERNAME: Optional[str] = ""   # not used by Brevo but kept for compat
    ADMIN_SETUP_SECRET: Optional[str] = ""
    FRONTEND_URL: Optional[str] = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
