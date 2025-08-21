from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from routers import user  # Auth routes
from routers import chat_routes  # Chat routes

app = FastAPI()

# Allow frontend origin
origins = [
    "https://coder-mver-mpm8iq05m-adeel1293satti-3082s-projects.vercel.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],            
)

@app.get("/")
def home():
    return {"message": "Welcome to FastAPI Backend!"}

# Include routers
app.include_router(user.router, prefix="/auth", tags=["Users"])
app.include_router(chat_routes.router, prefix="", tags=["Chat"])
