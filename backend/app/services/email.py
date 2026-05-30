import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import settings

def send_otp_email(to_email: str, otp: str, name: str = "User"):
    subject = "Your Jewellery Store OTP Code"

    html = f"""
    <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 480px; margin: auto; background: #f6f2ee; border-radius: 16px; overflow: hidden;">
      <div style="background: #8b5e3c; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px; letter-spacing: 1px;">💎 Jewellery Store</h1>
      </div>
      <div style="padding: 36px 32px; background: white; margin: 20px; border-radius: 12px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 8px;">Hello, {name}!</h2>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Use the OTP below to complete your login. This code is valid for <strong>10 minutes</strong>.
        </p>
        <div style="background: #f6f2ee; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #8b5e3c; font-size: 36px; font-weight: 700; letter-spacing: 10px; margin: 0;">{otp}</p>
        </div>
        <p style="color: #999; font-size: 12px;">
          If you did not request this, please ignore this email. Do not share this OTP with anyone.
        </p>
      </div>
      <div style="text-align: center; padding: 16px; color: #aaa; font-size: 11px;">
        © {2025} Jewellery Store. All rights reserved.
      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
        server.starttls()
        server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD.replace(' ', ''))
        server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())
