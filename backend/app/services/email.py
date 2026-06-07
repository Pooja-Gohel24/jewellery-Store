import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import settings


def send_otp_email(to_email: str, otp: str, name: str = "User") -> None:
    email_user = settings.EMAIL_USERNAME
    email_pass = settings.EMAIL_PASSWORD

    if not email_user or not email_pass:
        print(f"[WARN] Email not configured. OTP for {to_email}: {otp}")
        return

    subject = "Your Jewellery Store OTP Code"

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
          If you did not request this, please ignore this email. Do not share this OTP with anyone.
        </p>
      </div>
      <div style="text-align: center; padding: 16px; color: #aaa; font-size: 11px;">
        &copy; 2025 Jewellery Store. All rights reserved.
      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = email_user
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_user, email_pass)
            server.send_message(msg)
        print(f"[INFO] OTP email sent to {to_email}")
    except Exception as e:
        print(f"[ERROR] Failed to send email to {to_email}: {e}")
        print(f"[DEBUG] OTP for testing: {otp}")
