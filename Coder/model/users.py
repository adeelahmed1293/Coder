from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from bson import ObjectId

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")  
    email: EmailStr
    name: str
    password: str
    thread_ids: List[str] = []

    class Config:
        validate_by_name = True        
        json_encoders = {ObjectId: str}


class UserSignup(BaseModel):
    email: EmailStr
    name : str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    thread_ids: List[str] = []


# ---------------- Request Schemas ----------------
class ChatRequest(BaseModel):
    message: str
    email: EmailStr
    thread_id: Optional[str] = None  # Optional: if not provided, backend generates a new one

# ---------------- Response Schemas ----------------
class ChatResponse(BaseModel):
    thread_id: str
    response: str

class ChatHistoryResponse(BaseModel):
    thread_id: str
    messages: List  

class UserThreadsResponse(BaseModel):
    thread_ids: List