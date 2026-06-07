from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import RegisterRequest, LoginRequest, OTPRequest, ResendOTPRequest, TokenResponse, UserResponse, MessageResponse
from app.services.user import get_user_by_email, create_user
from app.services.auth import verify_password, create_access_token, decode_access_token
from app.services.otp import save_otp, verify_otp
from app.services.email import send_otp_email

router = APIRouter(prefix="/auth", tags=["Auth"])
security = HTTPBearer()


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 6 characters"
        )
    user = create_user(db, name=payload.name, email=payload.email, password=payload.password)
    # Auto-send OTP so user can verify right after registering
    otp = save_otp(user.email)
    send_otp_email(to_email=user.email, otp=otp, name=user.name)
    return MessageResponse(message="Registration successful. OTP sent to your email.")


@router.post("/login", response_model=MessageResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    # Generate OTP and send email
    otp = save_otp(user.email)
    send_otp_email(to_email=user.email, otp=otp, name=user.name)

    return MessageResponse(message="OTP sent to your email. Please verify.")


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp_route(payload: OTPRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not verify_otp(payload.email, payload.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    token = create_access_token({"sub": user.email, "id": user.id})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user.id, name=user.name, email=user.email)
    )


@router.post("/resend-otp", response_model=MessageResponse)
def resend_otp(payload: ResendOTPRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    otp = save_otp(user.email)
    send_otp_email(to_email=user.email, otp=otp, name=user.name)
    return MessageResponse(message="OTP resent successfully.")


@router.get("/me", response_model=UserResponse)
def get_me(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = get_user_by_email(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(id=user.id, name=user.name, email=user.email)
