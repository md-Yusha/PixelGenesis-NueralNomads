"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.config import settings

# Create FastAPI app
app = FastAPI(
    title="PixelGenesis Backend API",
    description="Decentralized Digital Identity & Credential Vault",
    version="0.1.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.PIXELGENESIS_WEB_BASE_URL,
        "http://localhost:3000",
        "http://localhost:3001",
    ] if settings.is_development else [settings.PIXELGENESIS_WEB_BASE_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "name": "PixelGenesis Backend API",
        "version": "0.1.0",
        "status": "running",
        "environment": settings.PIXELGENESIS_ENV.value,
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.is_development,
    )

