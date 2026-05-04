from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/manager", tags=["Manager"])


def require_manager(current_user: dict = Depends(get_current_user)):
    """Dependency to ensure the current user is a manager."""
    if current_user.get("user_type") != "manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized as manager")
    return current_user


@router.get("/creators")
async def get_all_creators(current_user: dict = Depends(require_manager)):
    """Fetch all creators and their profiles."""
    db = get_db()
    creators_cursor = db.users.find({"user_type": "creator"})
    creators = await creators_cursor.to_list(1000)
    
    result = []
    for user in creators:
        profile = await db.creator_profiles.find_one({"user_id": user["_id"]})
        
        user_dict = {
            "id": user["_id"],
            "email": user["email"],
            "display_name": user.get("display_name"),
            "avatar_url": user.get("avatar_url"),
            "user_type": user.get("user_type"),
            "created_at": user.get("created_at"),
            "profile": None
        }
        
        if profile:
            profile["id"] = profile.pop("_id")
            user_dict["profile"] = profile
            
        result.append(user_dict)
        
    return result


@router.get("/brands")
async def get_all_brands(current_user: dict = Depends(require_manager)):
    """Fetch all brands and their profiles."""
    db = get_db()
    brands_cursor = db.users.find({"user_type": "brand"})
    brands = await brands_cursor.to_list(1000)
    
    result = []
    for user in brands:
        profile = await db.brand_profiles.find_one({"user_id": user["_id"]})
        
        user_dict = {
            "id": user["_id"],
            "email": user["email"],
            "display_name": user.get("display_name"),
            "avatar_url": user.get("avatar_url"),
            "user_type": user.get("user_type"),
            "created_at": user.get("created_at"),
            "profile": None
        }
        
        if profile:
            profile["id"] = profile.pop("_id")
            user_dict["profile"] = profile
            
        result.append(user_dict)
        
    return result
