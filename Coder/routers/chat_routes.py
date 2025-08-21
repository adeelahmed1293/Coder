from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import uuid
from utils.memory import user_collection
from workflow.graph import load_conversation , run_graph_with_message
from model.users import ChatHistoryResponse, ChatRequest,ChatResponse, UserThreadsResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def send_or_resume_chat(request: ChatRequest):
    """
    Send a message to AI workflow.
    - If thread_id exists, continue conversation.
    - If not, generate a new thread_id and only save it after a message is sent.
    """
    try:
        user = user_collection.find_one({"email": request.email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if request.thread_id:
            # Resume existing chat
            if request.thread_id not in user.get("thread_ids", []):
                raise HTTPException(status_code=404, detail="Thread ID not found for this user")
            thread_id = request.thread_id
        else:
            # Generate new thread_id, but don't save yet
            thread_id = str(uuid.uuid4())
        
        # Only push thread_id to DB if user sends a message
        if request.message.strip():
            if not request.thread_id:
                user_collection.update_one(
                    {"_id": user["_id"]},
                    {"$push": {"thread_ids": thread_id}}
                )
            # Run AI workflow
            response_text = run_graph_with_message(thread_id, request.message)
        else:
            response_text = ""
        
        return ChatResponse(
            thread_id=thread_id,
            response=response_text
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Handle unexpected errors
        print(f"Unexpected error in send_or_resume_chat: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/chat/history/{thread_id}", response_model=ChatHistoryResponse)
def get_chat_history(thread_id: str, email: str ):
    """
    Fetch full conversation history for a given thread_id
    """
    user = user_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if thread_id not in user.get("thread_ids", []):
        raise HTTPException(status_code=404, detail="Thread ID not found for this user")

    messages = load_conversation(thread_id)
    return ChatHistoryResponse(
        thread_id=thread_id,
        messages=messages
    )


@router.get("/chat/threads")
def get_user_threads(email: str):
    user = user_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    thread_ids = user.get("thread_ids", [])
    return UserThreadsResponse(thread_ids=thread_ids)

