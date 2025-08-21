from workflow.schemas import AgentState
from typing_extensions import Literal 

# ── Routing helpers ─────────────────────────────────────────────────
def from_router(st: AgentState) -> Literal["code_reviewer", "code_generation", "end"]:
    return st["route"]

def after_code_gen(st: AgentState) -> Literal["answer", "web"]:
    return st["route"]

def after_code_reviewer(st: AgentState) -> Literal["answer", "web"]:
    return st["route"]

def after_web(_) -> Literal["answer"]:
    return "answer"