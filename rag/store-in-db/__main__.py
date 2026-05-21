import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_KEY)


def main():
    print("Inserting document's parents...")
    with open("./data/output/parents.json") as parents_file:
        parents = json.load(fp=parents_file)
        records = [
            {
                "id": parent["id"],
                "section_title": parent["sectionTitle"],
                "content": parent["content"],
            }
            for parent in parents
        ]

    supabase.table("document_parents").delete().gte("id", 0).execute()
    supabase.table("document_parents").insert(records).execute()

    print("Inserting documents...")
    with open("./data/output/children.json") as document_file:
        documents = json.load(fp=document_file)
        records = [
            {
                "id": document["id"],
                "parent_id": document["parentId"],
                "section_title": document["sectionTitle"],
                "content": document["content"],
                "embedding": document["embedding"],
            }
            for document in documents
        ]

    supabase.table("documents").delete().gte("id", 0).execute()
    supabase.table("documents").insert(records).execute()

    print("\nProcess completed.")


if __name__ == "__main__":
    main()
