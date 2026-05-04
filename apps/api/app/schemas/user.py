from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import dns.resolver


# Common disposable / throwaway email domains to block
DISPOSABLE_DOMAINS = {
    "tempmail.com", "throwaway.email", "guerrillamail.com", "guerrillamail.de",
    "mailinator.com", "yopmail.com", "sharklasers.com", "guerrillamailblock.com",
    "grr.la", "dispostable.com", "trashmail.com", "trashmail.me", "trashmail.net",
    "10minutemail.com", "temp-mail.org", "fakeinbox.com", "mailnesia.com",
    "maildrop.cc", "discard.email", "getnada.com", "tempail.com",
    "mohmal.com", "burpcollaborator.net", "mailsac.com", "inboxkitten.com",
    "tmpmail.org", "tmpmail.net", "emailondeck.com", "mintemail.com",
    "tempr.email", "disposableemailcheck.com",
}


def validate_email_deliverability(email: str) -> str:
    """Check that the email domain has valid MX records (can actually receive mail)."""
    domain = email.rsplit("@", 1)[-1].lower()

    # Block disposable email providers
    if domain in DISPOSABLE_DOMAINS:
        raise ValueError(
            f"Disposable email addresses are not allowed. Please use a real email."
        )

    # Verify domain has MX records (proves mail server exists)
    try:
        mx_records = dns.resolver.resolve(domain, "MX")
        if not mx_records:
            raise ValueError(
                f"The domain '{domain}' cannot receive emails. Please check your address."
            )
    except dns.resolver.NoAnswer:
        raise ValueError(
            f"The domain '{domain}' has no mail server. Please use a valid email."
        )
    except dns.resolver.NXDOMAIN:
        raise ValueError(
            f"The domain '{domain}' does not exist. Please check your email address."
        )
    except dns.resolver.LifetimeTimeout:
        # DNS lookup timed out — allow registration but log a warning
        pass
    except Exception:
        # Other DNS errors — don't block the user for transient issues
        pass

    return email


# --- Auth Schemas ---
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: Optional[str] = None
    user_type: str = "creator"

    @field_validator("email")
    @classmethod
    def check_email_is_real(cls, v: str) -> str:
        return validate_email_deliverability(v)


class CreatorRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: Optional[str] = None
    niche: Optional[str] = None
    social_links: dict = {}  # {"instagram": "@handle", ...}
    follower_count: int = 0

    @field_validator("email")
    @classmethod
    def check_email_is_real(cls, v: str) -> str:
        return validate_email_deliverability(v)


class BrandRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    company_name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    budget_range: Optional[str] = None

    @field_validator("email")
    @classmethod
    def check_email_is_real(cls, v: str) -> str:
        return validate_email_deliverability(v)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


# --- User Schemas ---
class UserResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    niche: Optional[str] = None
    location: Optional[str] = None
    user_type: str = "creator"
    created_at: Optional[datetime] = None


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    niche: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None


# --- Profile Response Schemas ---
class CreatorProfileResponse(BaseModel):
    id: str
    user_id: str
    niche: Optional[str] = None
    social_links: dict = {}
    follower_count: int = 0
    portfolio_links: List[str] = []
    content_categories: List[str] = []
    bio_text: Optional[str] = None
    engagement_rate: float = 0.0


class BrandProfileResponse(BaseModel):
    id: str
    user_id: str
    company_name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    budget_range: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    campaign_goals: List[str] = []


# --- Social Account Schemas ---
class SocialAccountResponse(BaseModel):
    id: str
    platform: str
    username: Optional[str] = None
    follower_count: int = 0
    connected_at: Optional[datetime] = None
