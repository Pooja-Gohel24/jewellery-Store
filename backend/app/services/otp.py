import random
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.otp import OTP

OTP_EXPIRY_MINUTES = 5


def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))


def save_otp(email: str, db: Session) -> str:
    otp = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)
    # Delete any existing OTPs for this email
    db.query(OTP).filter(OTP.email == email).delete()
    db.add(OTP(email=email, otp=otp, expires_at=expires_at))
    db.commit()
    return otp


def verify_otp(email: str, otp: str, db: Session) -> bool:
    record = db.query(OTP).filter(OTP.email == email).order_by(OTP.created_at.desc()).first()
    if not record:
        return False
    now = datetime.now(timezone.utc)
    # Handle both timezone-aware and naive datetimes
    expires = record.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if now > expires:
        db.delete(record)
        db.commit()
        return False
    if record.otp != otp:
        return False
    db.delete(record)
    db.commit()
    return True
