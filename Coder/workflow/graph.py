from workflow.schemas import AgentState
from workflow.nodes import router_node, code_generation_node, code_reviewer_node, web_node, answer_node
from langchain_core.messages import HumanMessage
from utils.memory import checkpointer
from langgraph.graph import END, StateGraph
from langchain.schema import HumanMessage, AIMessage


# =====================================================
# Filtering the Human message 
# =====================================================
def filter_human_ai_pairs(messages):
    """
    Filters messages where a HumanMessage is directly followed by an AIMessage.
    Returns a list of (HumanMessage, AIMessage) tuples.
    """
    pairs = []
    for i in range(len(messages) - 1):
        if isinstance(messages[i], HumanMessage) and isinstance(messages[i + 1], AIMessage):
            pairs.append((messages[i], messages[i + 1]))
    return pairs


# =====================================================
# Build the LangGraph
# =====================================================
workflow = StateGraph(AgentState)

workflow.add_node("router", router_node)
workflow.add_node("code_generation", code_generation_node)
workflow.add_node("code_reviewer", code_reviewer_node)
workflow.add_node("web", web_node)
workflow.add_node("answer", answer_node)

workflow.set_entry_point("router")

workflow.add_conditional_edges("router", lambda x: x["router"], {
    "code_generation": "code_generation",
    "code_reviewer": "code_reviewer",
    "end": END
})
workflow.add_conditional_edges("code_generation", lambda x: x["router"], {
    "answer": "answer",
    "web": "web"
})
workflow.add_conditional_edges("code_reviewer", lambda x: x["router"], {
    "answer": "answer",
    "web": "web"
})
workflow.add_edge("web", "answer")

graph = workflow.compile(checkpointer=checkpointer)



# =====================================================
# Function to run the graph with just a thread_id and user message
# =====================================================
def run_graph_with_message(thread_id: str, user_input: str) -> str:
    config = {"configurable": {"thread_id": thread_id}}
    
    # Only add the new user message, checkpointer handles the rest
    result = graph.invoke({"messages": [HumanMessage(content=user_input)]}, config=config)
    
    # Return the last AI message
    return result["messages"][-1].content


def load_conversation(thread_id):
    messages=graph.get_state_history(config={'configurable': {'thread_id': thread_id}})
    first_snapshot = next(iter(messages))
    print(first_snapshot)
    # Assume `snapshot` is your StateSnapshot
    messages = first_snapshot.values["messages"]

    # Prepare the result list
    paired_messages = []

    # Iterate in pairs: HumanMessage followed by AIMessage
    for i in range(0, len(messages) - 1, 2):
        if isinstance(messages[i], HumanMessage) and isinstance(messages[i+1], AIMessage):
            pair = {
                "Human": messages[i].content,
                "Assistant": messages[i+1].content
            }
            paired_messages.append(pair)

    return paired_messages