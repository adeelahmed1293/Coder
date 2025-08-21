from utils.models import get_groq_model, web_search
from workflow.schemas import RouterDecision , AgentState , Judger
from langchain_core.messages import HumanMessage , AIMessage , SystemMessage , BaseMessage
from typing_extensions import List

model = get_groq_model()
router_model = model.with_structured_output(RouterDecision)
judger_model = model.with_structured_output(Judger)



# =====================================================
# Helper Functions
# =====================================================
def get_conversation_summary(messages: List[BaseMessage], max_messages: int = 6) -> str:
    """Get a summary of recent conversation for context"""
    recent_messages = messages[-max_messages:] if len(messages) > max_messages else messages
    context = ""
    for msg in recent_messages:
        role = "User" if isinstance(msg, HumanMessage) else "Assistant"
        context += f"{role}: {msg.content[:200]}...\n"  # Limit length
    return context

# =====================================================
# Nodes - FIXED FOR STRUCTURED OUTPUT
# =====================================================


def router_node(state: AgentState) -> AgentState:
    messages = state.get("messages", [])
    
    # Get the latest user message
    current_query = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
    
    # Check if user is asking about capabilities
    capability_keywords = [
        "what can you help", "what can you do", "what are you capable", 
        "help me with", "what services", "what tasks", "capabilities",
        "what can coder do", "what is your purpose", "how can you assist"
    ]
    
    if any(keyword in current_query.lower() for keyword in capability_keywords):
        coder_capabilities = """
        Hi! I'm Coder, your specialized coding assistant. Here's what I can help you with:

        🔧 **Code Generation**:
        - Write code in various programming languages (Python, JavaScript, Java, C++, etc.)
        - Create functions, classes, and complete applications
        - Build scripts for automation and data processing
        - Generate code templates and boilerplates

        🔍 **Code Review & Debugging**:
        - Review your existing code for bugs and improvements
        - Debug errors and provide fixes
        - Optimize code performance and readability
        - Suggest best practices and coding standards
        - Refactor messy or inefficient code

        🌐 **Web Search Integration**:
        - Search for latest programming solutions and documentation
        - Find up-to-date libraries and frameworks information
        - Get current best practices and coding techniques

        💡 **What I specialize in**:
        - Algorithm development and data structures
        - API development and integration
        - Database queries and design
        - Web development (frontend/backend)
        - Automation scripts and tools
        - Code documentation and comments

        Just tell me what coding task you need help with - whether it's generating new code, reviewing existing code, or debugging an issue!
        """
        
        return {
            "messages": [AIMessage(content=coder_capabilities)],
            "router": "end",
            "code_generation": "",
            "code_debugger": "",
            "code_reviewer": "",
            "web": ""
        }
    
    # Get conversation context (but keep it concise for structured output)
    conversation_context = get_conversation_summary(messages, max_messages=4)

    # Create a focused prompt for classification - NO full message history for structured output
    classification_prompt = f"""
    Based on this conversation context and current query, classify the request:

    Recent conversation:
    {conversation_context}

    Current query: {current_query}

    Classify into:
    - "code_generation": User asks to generate/write code
    - "code_reviewer": User asks to review/debug existing code  
    - "end": Simple questions, greetings, or general chat that can be answered directly
    """

    try:
        # Use structured output with a clean, focused prompt
        response = router_model.invoke([
            SystemMessage(content="You are a request classifier. Classify the user's request into one of the specified categories."),
            HumanMessage(content=classification_prompt)
        ])

        if response.router == "end":
            # For direct answers, use the regular model with full context
            answer_prompt = f"""
            You are Coder, a specialized coding assistant.
            
            Conversation history:
            {conversation_context}
            
            Current question: {current_query}
            
            Please provide a helpful response as Coder, focusing on coding-related assistance.
            """
            
            direct_response = model.invoke([
                SystemMessage(content="You are Coder, a helpful coding assistant. Answer based on the conversation history with focus on coding topics."),
                HumanMessage(content=answer_prompt)
            ])
            
            return {
                "messages": [AIMessage(content=direct_response.content)],
                "router": response.router,
                "code_generation": "",
                "code_debugger": "",
                "code_reviewer": "",
                "web": ""
            }
        else:
            return {
                "router": response.router,
                "code_generation": "",
                "code_debugger": "",
                "code_reviewer": "",
                "web": ""
            }
    except Exception as e:
        print(f"Router error: {e}")
        # Fallback to simple text classification
        fallback_prompt = f"Is this a request for: 1) code generation, 2) code review, or 3) general chat? Query: {current_query}"
        fallback_response = model.invoke([HumanMessage(content=fallback_prompt)])
        
        # Simple keyword-based fallback
        response_text = fallback_response.content.lower()
        if "generation" in response_text or "generate" in response_text or "write code" in current_query.lower():
            router_decision = "code_generation"
        elif "review" in response_text or "debug" in response_text or "fix" in current_query.lower():
            router_decision = "code_reviewer"
        else:
            router_decision = "end"
            return {
                "messages": [AIMessage(content=fallback_response.content)],
                "router": router_decision,
                "code_generation": "",
                "code_debugger": "",
                "code_reviewer": "",
                "web": ""
            }
        
        return {
            "router": router_decision,
            "code_generation": "",
            "code_debugger": "",
            "code_reviewer": "",
            "web": ""
        }


def code_generation_node(state: AgentState) -> AgentState:
    messages = state.get("messages", [])
    
    # Get conversation context
    conversation_context = get_conversation_summary(messages, max_messages=8)
    current_query = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
    
    # Create comprehensive prompt with context
    prompt = f"""
    You are an expert code generator. 

    Conversation History:
    {conversation_context}

    Current Request: {current_query}

    Generate code based on the user's request, taking into account the conversation history and any previous context.
    """
    
    response = model.invoke([
        SystemMessage(content="You are an expert code generator."),
        HumanMessage(content=prompt)
    ])
    result = response.content

    # Simple sufficiency check without structured output issues
    try:
        evaluation = judger_model.invoke([
            SystemMessage(content="Judge if the code generation is sufficient for the request."),
            HumanMessage(content=f"Request: {current_query}\n\nGenerated: {result[:500]}...")
        ])
        is_sufficient = evaluation.sufficient
    except:
        # Fallback: assume it's sufficient unless it's very short
        is_sufficient = len(result) > 50

    return {
        "messages": [AIMessage(content=result)],
        "code_generation": result,
        "router": "answer" if is_sufficient else "web"
    }

def code_reviewer_node(state: AgentState) -> AgentState:
    messages = state.get("messages", [])
    
    # Get conversation context
    conversation_context = get_conversation_summary(messages, max_messages=8)
    current_query = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
    
    prompt = f"""
    You are an expert code reviewer and debugger.

    Conversation History:
    {conversation_context}

    Current Request: {current_query}

    Please review the code or help debug the issue based on the conversation context.
    """
    
    response = model.invoke([
        SystemMessage(content="You are an expert code reviewer and debugger."),
        HumanMessage(content=prompt)
    ])
    result = response.content

    # Simple sufficiency check
    try:
        evaluation = judger_model.invoke([
            SystemMessage(content="Judge if the code review is sufficient."),
            HumanMessage(content=f"Request: {current_query}\n\nReview: {result[:500]}...")
        ])
        is_sufficient = evaluation.sufficient
    except:
        is_sufficient = len(result) > 50

    return {
        "messages": [AIMessage(content=result)],
        "code_reviewer": result,
        "router": "answer" if is_sufficient else "web"
    }

def web_node(state: AgentState) -> AgentState:
    messages = state.get("messages", [])
    current_query = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
    
    try:
        search_tool = web_search()
        snippets = search_tool.invoke({"query": current_query})
        result = f"Found relevant information: {snippets}"
    except Exception as e:
        result = f"Web search unavailable: {str(e)}"

    return {
        "messages": [AIMessage(content=result)],
        "web": str(snippets) if 'snippets' in locals() else "",
        "router": "answer"
    }

def answer_node(state: AgentState) -> AgentState:
    messages = state.get("messages", [])
    current_query = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
    
    # Get conversation context
    conversation_context = get_conversation_summary(messages, max_messages=10)
    
    # Prepare additional context from other nodes
    additional_context = []
    if state.get("code_generation"):
        additional_context.append(f"Code Generated: {state['code_generation'][:500]}...")
    if state.get("code_reviewer"):
        additional_context.append(f"Code Review: {state['code_reviewer'][:500]}...")
    if state.get("web"):
        additional_context.append(f"Web Results: {str(state['web'])[:500]}...")

    # Create comprehensive final prompt
    prompt = f"""
    Conversation History:
    {conversation_context}

    Current Question: {current_query}
    """
    
    if additional_context:
        prompt += f"\n\nAdditional Context:\n" + "\n".join(additional_context)
    
    prompt += "\n\nProvide a helpful, accurate response based on all available information."

    response = model.invoke([
        SystemMessage(content="You are a helpful assistant providing final answers based on conversation history and context."),
        HumanMessage(content=prompt)
    ])

    return {
        "messages": [AIMessage(content=response.content)]
    }