import requests
from app.config import settings

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_otp_email(to_email: str, otp: str, name: str = "User") -> None:
    """Send OTP email via Brevo transactional API.
    EMAIL_PASSWORD env var must hold your Brevo API key (not a Gmail password).
    """
    api_key = settings.EMAIL_PASSWORD

    if not api_key:
        print(f"[WARN] EMAIL_PASSWORD (Brevo API key) not set. OTP for {to_email}: {otp}")
        return

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #f6f2ee; border-radius: 16px; overflow: hidden;">
      <div style="background: #8b5e3c; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px; letter-spacing: 1px;">Jewellery Store</h1>
      </div>
      <div style="padding: 36px 32px; background: white; margin: 20px; border-radius: 12px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 8px;">Hello, {name}!</h2>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Use the OTP below to complete your login. This code is valid for <strong>5 minutes</strong>.
        </p>
        <div style="background: #f6f2ee; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #8b5e3c; font-size: 36px; font-weight: 700; letter-spacing: 10px; margin: 0;">{otp}</p>
        </div>
        <p style="color: #999; font-size: 12px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    </div>
    """

    payload = {
        "sender": {"name": "Jewellery Store", "email": settings.EMAIL_FROM},
        "to": [{"email": to_email, "name": name}],
        "subject": "Your Jewellery Store OTP Code",
        "htmlContent": html,
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": api_key,
    }

    try:
        response = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=10)
        print(f"[DEBUG] Brevo status: {response.status_code}, body: {response.text}")
        if response.status_code == 201:
            print(f"[INFO] OTP email sent to {to_email}")
        else:
            print(f"[ERROR] Brevo error {response.status_code}: {response.text}")
            print(f"[DEV] OTP for {to_email}: {otp}")
    except requests.Timeout:
        print(f"[ERROR] Brevo request timed out for {to_email}")
        print(f"[DEV] OTP for {to_email}: {otp}")
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")
        print(f"[DEV] OTP for {to_email}: {otp}")
