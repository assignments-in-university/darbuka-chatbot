import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load env variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# Create google client
client = genai.Client(api_key=GEMINI_API_KEY)


def add_embeddings_to_chunks(chunks):
    for chunk in chunks:
        print(f"Embedding chunk {chunk["id"]}...")
        result = client.models.embed_content(
            model="gemini-embedding-2",
            contents=chunk["content"],
            config=types.EmbedContentConfig(output_dimensionality=768),
        )

        [embedding_obj] = result.embeddings

        chunk["embedding"] = embedding_obj.values
        print(f"Embedding completed. Sleeping for 3s... \n")
        time.sleep(3)
