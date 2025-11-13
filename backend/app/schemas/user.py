"""User Pydantic schemas."""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.db.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    role: UserRole


class UserCreate(UserBase):
    """Schema for user creation."""
    password: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response."""
    id: UUID
    did: str | None
    wallet_address: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for authentication token."""
    access_token: str
    token_type: str = "bearer"


