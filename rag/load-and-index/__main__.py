from .chunker import main as chunk_input_file
from .embedding import add_embeddings_to_chunks
import json
import time


def write_dict(dict, path):
    with open(path, "w") as fp:
        json.dump(dict, indent=2, fp=fp)


def main():
    # Chunk the input file
    print("Process Started. Chunking data... \n")
    start_time = time.perf_counter()
    chunks = chunk_input_file()
    end_time = time.perf_counter()

    # Add content embeddings to the chunks
    print(
        f"Chunking completed in {end_time - start_time:.2f} seconds. Embedding chunks... \n"
    )
    start_time = time.perf_counter()
    add_embeddings_to_chunks(chunks)
    end_time = time.perf_counter()

    # Write to file
    print(
        f"Embeddings completed in {end_time - start_time:.2f} seconds. Writing to file... \n"
    )
    write_dict(chunks, "./data/output/chunks.json")
    print("Pipeline completed.")


if __name__ == "__main__":
    main()
