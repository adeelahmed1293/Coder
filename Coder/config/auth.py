import jwt
from datetime import datetime, timedelta


import os
from dotenv import load_dotenv

load_dotenv()

# Get MONGO_URI from environment
SECRET_KEY = os.getenv("SECRET_KEY")

# Secret key (use env vars in production)
 
ALGORITHM =  os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 600  # 1 hour

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # e.g. {"sub": "user_id", "exp": 12345}
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
