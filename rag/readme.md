# RAG Pipeline

This directory contains the code for the RAG pipeline's initial steps, including:

1. Data Loading & Preparation (Ingestion + chunking)
2. Indexing (Embedding)
3. Storing (Supabase Vector Database)

**WARNING:** The second pipeline, used for storing should be ran with caution, as it will delete all the existing data in the database before inserting the new one.

## Data Loading & Preparation Pipeline

The data loading and preparation pipeline is responsible for ingesting the data, chunking it, and preparing it for indexing.

### How to run:

Ensure you have `python3.13` and `pip` installed on your system. `Python3.9+` works too.

Install dependencies:

```bash
pip install -r requirements.txt
```

Prepare your `.env` file with the necessary environment variables:

1. GEMINI_API_KEY: Your API key for the Gemini embedding model. Can be created inside the Google AI Studio.
2. SUPABASE_URL: The Supabase project URL.
3. SUPABASE_ANON_KEY: The secret Supabase key.

Run the load and index pipeline (from _./rag-pipeline_ directory):

```bash
python3.13 -m load-and-index
```

Run the store-in-db pipeline (from _./rag-pipeline_ directory):

```bash
python3.13 -m store-in-db
```
