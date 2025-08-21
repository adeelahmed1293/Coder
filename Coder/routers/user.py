from fastapi import APIRouter, HTTPException
from utils.memory import user_collection
from model.users import UserSignup, UserLogin, UserResponse
from config.password import hash_password, verify_password
from config.auth import create_access_token, verify_access_token

router = APIRouter(
    prefix="",
    tags=["User"]
)


@router.post("/signup", response_model=UserResponse)
def signup(user: UserSignup):
    existing_user = user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    user_dict = {"email": user.email,"name": user.name, "password": hashed_pw, "thread_ids": []}
    result = user_collection.insert_one(user_dict)
    new_user = user_collection.find_one({"_id": result.inserted_id})

    return UserResponse(
        id=str(new_user["_id"]),
        email=new_user["email"],
        thread_ids=new_user["thread_ids"]
    )


@router.post("/login")
def login(user: UserLogin):
    existing_user = user_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Generate JWT
    access_token = create_access_token({"sub": str(existing_user["_id"])})

    # Return user details along with token
    return {
        "message": "Login successful",
        "user": {
            "id": str(existing_user["_id"]),
            "name": existing_user.get("name", ""),
            "email": existing_user["email"]
        },
        "access_token": access_token,
        "token_type": "bearer"
    }
