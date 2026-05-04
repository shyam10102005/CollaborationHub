from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import get_settings

settings = get_settings()

# Global MongoDB client and database references
client: AsyncIOMotorClient = None  # type: ignore
db: AsyncIOMotorDatabase = None  # type: ignore


async def connect_to_mongo():
    """Initialize the MongoDB connection on application startup."""
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    # Create indexes for performance
    await db.users.create_index("email", unique=True)
    await db.creator_profiles.create_index("user_id", unique=True)
    await db.brand_profiles.create_index("user_id", unique=True)
    await db.social_accounts.create_index("user_id")
    await db.link_pages.create_index("slug", unique=True)
    await db.link_pages.create_index("user_id")
    await db.content_posts.create_index("user_id")
    await db.campaigns.create_index("brand_user_id")
    await db.chat_messages.create_index("room_id")
    await db.collab_requests.create_index([("from_user_id", 1), ("to_user_id", 1)])

    # Verify connection
    await client.admin.command("ping")
    print(f"[OK] Connected to MongoDB Atlas - database: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    """Close the MongoDB connection on application shutdown."""
    global client
    if client:
        client.close()
        print("[OK] MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    """Get the database instance for dependency injection."""
    return db
