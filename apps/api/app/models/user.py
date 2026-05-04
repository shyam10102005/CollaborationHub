"""
MongoDB document schemas for CollabarationOS.
These are Pydantic models representing MongoDB document structures.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timezone
import uuid


def generate_id() -> str:
    return str(uuid.uuid4())


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


# --- User Document ---
class UserDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    email: EmailStr
    hashed_password: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    niche: Optional[str] = None
    location: Optional[str] = None
    user_type: str = "creator"  # creator, brand, manager
    auth_provider: str = "local"  # "local" or "google"
    google_id: Optional[str] = None
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Creator Profile Document ---
class CreatorProfileDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    user_id: str
    niche: Optional[str] = None
    social_links: dict = {}  # {"instagram": "@handle", "youtube": "url", ...}
    follower_count: int = 0
    portfolio_links: List[str] = []
    content_categories: List[str] = []
    bio_text: Optional[str] = None
    engagement_rate: float = 0.0
    content_style: Optional[str] = None
    embedding: Optional[List[float]] = None  # Vector embedding for semantic search
    updated_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Brand Profile Document ---
class BrandProfileDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    user_id: str
    company_name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    budget_range: Optional[str] = None  # "5k-10k", "10k-50k", "50k+"
    logo_url: Optional[str] = None
    description: Optional[str] = None
    campaign_goals: List[str] = []
    updated_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Social Account Document ---
class SocialAccountDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    user_id: str
    platform: str  # instagram, youtube, tiktok, x
    platform_user_id: Optional[str] = None
    username: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expiry: Optional[datetime] = None
    follower_count: int = 0
    connected_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Link-in-Bio Documents ---
class LinkPageDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    user_id: str
    slug: str
    title: Optional[str] = None
    bio: Optional[str] = None
    theme: str = "default"
    custom_css: Optional[str] = None
    is_published: bool = False
    links: List[dict] = []  # [{title, url, icon, position, click_count}]
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


class LinkClickDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    link_page_id: str
    link_index: int
    ip_hash: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    country: Optional[str] = None
    clicked_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Content Post Document ---
class ContentPostDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    user_id: str
    platform: str
    content_type: str = "post"  # post, reel, story, video, short, thread
    caption: Optional[str] = None
    hashtags: List[str] = []
    media_urls: List[str] = []
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    status: str = "draft"  # draft, scheduled, publishing, published, failed
    published_id: Optional[str] = None
    analytics: dict = {}  # {views, likes, comments, shares, saves, reach}
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Campaign / Collaboration Documents ---
class CampaignDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    brand_user_id: str
    title: str
    description: Optional[str] = None
    budget_cents: int = 0
    status: str = "draft"  # draft, active, in_review, completed, cancelled
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    creators: List[dict] = []  # [{creator_id, status, agreed_rate_cents, deliverables, due_date}]
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Collaboration Request Document ---
class CollabRequestDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    from_user_id: str
    to_user_id: str
    title: str
    description: Optional[str] = None
    platforms: List[str] = []
    status: str = "pending"  # pending, accepted, rejected
    proposed_dates: Optional[str] = None
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Chat Documents ---
class ChatRoomDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    collab_id: Optional[str] = None
    members: List[str] = []
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


class ChatMessageDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    room_id: str
    sender_id: str
    content: str
    message_type: str = "text"  # text, image, file
    media_url: Optional[str] = None
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}


# --- Earnings Document ---
class TransactionDocument(BaseModel):
    id: str = Field(alias="_id", default_factory=generate_id)
    user_id: str
    campaign_id: Optional[str] = None
    amount_cents: int
    currency: str = "usd"
    type: str = "sponsorship"  # sponsorship, affiliate, split
    status: str = "pending"  # pending, completed, failed
    stripe_transfer_id: Optional[str] = None
    created_at: datetime = Field(default_factory=now_utc)

    model_config = {"populate_by_name": True}
