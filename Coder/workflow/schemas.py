from langchain_core.messages import BaseMessage
from typing_extensions import TypedDict, Literal , List
from typing import Annotated
from operator import add
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages

# =====================================================
# Agent State Definition
# =====================================================
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    router: Literal["code_reviewer", "code_generation", "end", "answer", "web"]
    code_generation: str
    code_debugger: str
    code_reviewer: str
    web: str

# =====================================================
# Structured Models
# =====================================================
class RouterDecision(BaseModel):
    router: Literal["code_reviewer", "code_generation", "end"]
    reply: str | None = Field(None, description="Only filled when router == 'end'")

class Judger(BaseModel):
    sufficient: bool


