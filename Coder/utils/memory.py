from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Get MONGO_URI from environment
mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)
checkpointer = MongoDBSaver(client)

db = client["AICoder"]
user_collection = db["users"]


user_collection.insert_one({"email":"user@email.com"})
