from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
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

# ── Google OAuth setup ────────────────────────────────────────────────
oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


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

    # Block Google-only users from password login
    if user.get("auth_provider") == "google" and not user.get("hashed_password"):
        raise HTTPException(
            status_code=400,
            detail="This account uses Google sign-in. Please use the 'Sign in with Google' button.",
        )

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


# ── Google OAuth ──────────────────────────────────────────────────────

@router.get("/google/login")
async def google_login(request: Request, role: str = "creator"):
    """Redirect user to Google consent screen."""
    redirect_uri = f"{settings.BACKEND_URL}/api/v1/auth/google/callback"
    # Store the role in session so callback knows what type of user to create
    request.session["oauth_role"] = role
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request):
    """Handle callback from Google after user authorization."""
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception:
        raise HTTPException(status_code=400, detail="Google authentication failed")

    # Extract user info from the ID token
    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(status_code=400, detail="Could not retrieve user info from Google")

    google_id = user_info.get("sub")
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")
    role = request.session.pop("oauth_role", "creator")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    db = get_db()

    # Look up user by google_id first, then by email
    user = await db.users.find_one({"google_id": google_id})

    if not user:
        user = await db.users.find_one({"email": email})

    if user:
        # Existing user — link Google account if not already linked
        update_fields = {}
        if not user.get("google_id"):
            update_fields["google_id"] = google_id
        if not user.get("avatar_url") and picture:
            update_fields["avatar_url"] = picture
        if user.get("auth_provider") == "local":
            update_fields["auth_provider"] = "google"

        if update_fields:
            await db.users.update_one({"_id": user["_id"]}, {"$set": update_fields})

        user_id = user["_id"]
    else:
        # Create new user from Google profile
        new_user = UserDocument(
            email=email,
            display_name=name,
            avatar_url=picture,
            auth_provider="google",
            google_id=google_id,
            user_type=role,
        )
        user_dict = new_user.model_dump(by_alias=True)
        await db.users.insert_one(user_dict)
        user_id = user_dict["_id"]

        # Create role-specific profile
        if role == "creator":
            profile = CreatorProfileDocument(user_id=user_id)
            await db.creator_profiles.insert_one(profile.model_dump(by_alias=True))
        elif role == "brand":
            profile = BrandProfileDocument(user_id=user_id, company_name=name)
            await db.brand_profiles.insert_one(profile.model_dump(by_alias=True))

    # Issue JWT tokens
    access_token = create_access_token({"sub": user_id})
    refresh_tok = create_refresh_token({"sub": user_id})

    # Redirect to frontend callback page with tokens
    redirect_url = (
        f"{settings.FRONTEND_URL}/auth/callback"
        f"?access_token={access_token}"
        f"&refresh_token={refresh_tok}"
    )
    return RedirectResponse(url=redirect_url)


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
