import random
import string
from datetime import datetime, timedelta

# In-memory OTP store: { email: { otp, expires_at } }
otp_store: dict = {}

OTP_EXPIRY_MINUTES = 5

def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))

def save_otp(email: str) -> str:
    otp = generate_otp()
    otp_store[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    }
    return otp

def verify_otp(email: str, otp: str) -> bool:
    record = otp_store.get(email)
    if not record:
        return False
    if datetime.utcnow() > record["expires_at"]:
        otp_store.pop(email, None)
        return False
    if record["otp"] != otp:
        return False
    otp_store.pop(email, None)  # OTP used, remove it
    return True
