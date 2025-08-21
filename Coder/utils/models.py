from langchain_groq import ChatGroq
from dotenv import load_dotenv

from langchain_tavily import TavilySearch

load_dotenv()

def web_search():
    return TavilySearch(max_results=3, topic="general")

def get_groq_model():
    return ChatGroq(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        temperature=0.2,
        max_tokens=1000
    )


