from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to MongoDB Atlas
    await connect_to_mongo()
    yield
    # Shutdown: close connection
    await close_mongo_connection()


app = FastAPI(
    title=settings.APP_NAME,
    description="Unified B2B SaaS platform for content creators — powered by MongoDB Atlas",
    version="1.0.0",
    lifespan=lifespan,
)



# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "database": "MongoDB Atlas"}
