"""Configuration management using Pydantic Settings."""
from enum import Enum
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    """Environment types."""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Environment
    PIXELGENESIS_ENV: Environment = Environment.DEVELOPMENT

    # API URLs
    PIXELGENESIS_API_BASE_URL: str = "http://localhost:8000"
    PIXELGENESIS_WEB_BASE_URL: str = "http://localhost:3000"
    PIXELGENESIS_MOBILE_DEEPLINK_SCHEME: str = "pixelgenesis"

    # Blockchain Configuration
    PIXELGENESIS_CHAIN_ID: int = 80001
    PIXELGENESIS_RPC_URL: str = "https://rpc-mumbai.maticvigil.com"
    PIXELGENESIS_DID_REGISTRY_CONTRACT_ADDRESS: str = "0xDID_REGISTRY_PLACEHOLDER"
    PIXELGENESIS_VC_REGISTRY_CONTRACT_ADDRESS: str = "0xVC_REGISTRY_PLACEHOLDER"

    # IPFS Configuration
    PIXELGENESIS_IPFS_PROVIDER: str = "pinata"  # Options: "pinata" or "web3storage"
    PIXELGENESIS_IPFS_API_URL: str = "https://api.pinata.cloud"  # Pinata API URL
    PIXELGENESIS_IPFS_GATEWAY_URL: str = "https://gateway.pinata.cloud/ipfs"  # Pinata gateway
    PIXELGENESIS_IPFS_API_TOKEN: str = "YOUR_PINATA_JWT_TOKEN"  # Pinata JWT token
    # Alternative: For web3.storage
    # PIXELGENESIS_IPFS_PROVIDER: str = "web3storage"
    # PIXELGENESIS_IPFS_API_URL: str = "https://api.web3.storage"
    # PIXELGENESIS_IPFS_GATEWAY_URL: str = "https://w3s.link/ipfs"
    # PIXELGENESIS_IPFS_API_TOKEN: str = "YOUR_WEB3_STORAGE_TOKEN"

    # DID Configuration
    PIXELGENESIS_DID_METHOD: str = "did:example"

    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/pixelgenesis_db"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.PIXELGENESIS_ENV == Environment.DEVELOPMENT

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.PIXELGENESIS_ENV == Environment.PRODUCTION


# Global settings instance
settings = Settings()


