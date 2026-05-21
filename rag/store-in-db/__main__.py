import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_KEY)


def main():
    print("Inserting documents...")
    with open("./data/output/chunks.json") as chunks_file:
        chunks = json.load(fp=chunks_file)
        records = [
            {
                "id": chunk["id"],
                "section_title": chunk["sectionTitle"],
                "content": chunk["content"],
                "embedding": chunk["embedding"],
            }
            for chunk in chunks
        ]

    supabase.table("chunks").delete().gte("id", 0).execute()
    supabase.table("chunks").insert(records).execute()

    print("\nProcess completed.")


if __name__ == "__main__":
    main()
