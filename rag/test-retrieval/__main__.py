import json
import os
from dotenv import load_dotenv

from supabase import create_client
from google import genai
from google.genai import types

# Load env variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# Create google client
client = genai.Client(api_key=GEMINI_API_KEY)

# Create supabase client
supabase = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_KEY)


def main():
    message = (
        '\nHi! Ask anything you\'d like about the darbuka drum (or "exit" to quit): \n'
    )
    user_input = input(message)
    while user_input != "exit":
        result = client.models.embed_content(
            model="gemini-embedding-2",
            contents=user_input,
            config=types.EmbedContentConfig(output_dimensionality=768),
        )

        [embedding_obj] = result.embeddings

        response = supabase.rpc(
            "match_documents",
            {
                "query_embedding": embedding_obj.values,
                "match_threshold": 0.70,
                "match_count": 3,
            },
        ).execute()

        print(json.dumps(response.data, indent=2))
        print()

        user_input = input(message)


if __name__ == "__main__":
    main()
