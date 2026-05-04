from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from app.core.database import get_db
from app.core.config import get_settings
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
)
from app.models.user import UserDocument, CreatorProfileDocument, BrandProfileDocument
from app.schemas.user import (
    RegisterRequest,
    CreatorRegisterRequest,
    BrandRegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    UserResponse,
    UserUpdate,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


def user_doc_to_response(doc: dict) -> UserResponse:
    """Convert a MongoDB user document to a UserResponse."""
    return UserResponse(
        id=doc["_id"],
        email=doc["email"],
        display_name=doc.get("display_name"),
        avatar_url=doc.get("avatar_url"),
        bio=doc.get("bio"),
        niche=doc.get("niche"),
        location=doc.get("location"),
        user_type=doc.get("user_type", "creator"),
        created_at=doc.get("created_at"),
    )


# ── Email / Password auth ────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest):
    """Register a new user account (legacy/fallback, defaults to creator)."""
    db = get_db()

    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = UserDocument(
        email=data.email,
        hashed_password=hash_password(data.password),
        display_name=data.display_name,
        user_type=data.user_type,
        auth_provider="local",
    )

    user_dict = user.model_dump(by_alias=True)
    await db.users.insert_one(user_dict)

    access_token = create_access_token({"sub": user_dict["_id"]})
    refresh_token = create_refresh_token({"sub": user_dict["_id"]})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/register/creator", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_creator(data: CreatorRegisterRequest):
    """Register a new creator account with profile."""
    db = get_db()

    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = UserDocument(
        email=data.email,
        hashed_password=hash_password(data.password),
        display_name=data.display_name,
        user_type="creator",
        niche=data.niche,
        auth_provider="local",
    )

    user_dict = user.model_dump(by_alias=True)
    await db.users.insert_one(user_dict)

    # Create creator profile
    profile = CreatorProfileDocument(
        user_id=user_dict["_id"],
        niche=data.niche,
        social_links=data.social_links,
        follower_count=data.follower_count,
    )
    await db.creator_profiles.insert_one(profile.model_dump(by_alias=True))

    access_token = create_access_token({"sub": user_dict["_id"]})
    refresh_token = create_refresh_token({"sub": user_dict["_id"]})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/register/brand", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_brand(data: BrandRegisterRequest):
    """Register a new brand account with profile."""
    db = get_db()

    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = UserDocument(
        email=data.email,
        hashed_password=hash_password(data.password),
        display_name=data.company_name,
        user_type="brand",
        auth_provider="local",
    )

    user_dict = user.model_dump(by_alias=True)
    await db.users.insert_one(user_dict)

    # Create brand profile
    profile = BrandProfileDocument(
        user_id=user_dict["_id"],
        company_name=data.company_name,
        industry=data.industry,
        website=data.website,
        budget_range=data.budget_range,
    )
    await db.brand_profiles.insert_one(profile.model_dump(by_alias=True))

    access_token = create_access_token({"sub": user_dict["_id"]})
    refresh_token = create_refresh_token({"sub": user_dict["_id"]})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """Authenticate and receive tokens."""
    db = get_db()

    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": user["_id"]})
    refresh_token = create_refresh_token({"sub": user["_id"]})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshRequest):
    """Get a new access token using a refresh token."""
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token({"sub": payload["sub"]})
    refresh_token = create_refresh_token({"sub": payload["sub"]})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)



# ── Profile ───────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return user_doc_to_response(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update the current user's profile."""
    db = get_db()
    update_data = data.model_dump(exclude_unset=True)

    if update_data:
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data},
        )

    updated = await db.users.find_one({"_id": current_user["_id"]})
    return user_doc_to_response(updated)
