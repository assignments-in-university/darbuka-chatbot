import re
import json


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def parse_sections(lines):
    blocks = []

    current_title = None
    current_body = []

    for line in lines:
        trimmed = line.strip()

        # Skip comments/empty lines
        if not trimmed or trimmed.startswith("//"):
            continue

        # New section
        if trimmed.startswith("##"):
            # Save previous section
            if current_title:
                blocks.append({"title": current_title, "body": current_body})

            current_title = trimmed.removeprefix("## ").strip()
            current_body = []

            continue

        current_body.append(trimmed)

    # Append final section
    if current_title:
        blocks.append({"title": current_title, "body": current_body})

    return blocks


def chunk_content(parsed_section, file):
    chunks = []

    count = 0
    for block in parsed_section:

        title = block["title"]
        id = slugify(block["title"])
        section: list[str] = block["body"]

        for paragraph in section:
            chunks.append(
                {
                    "id": count,
                    "sectionTitle": title,
                    "content": paragraph,
                    "sourceFile": file,
                    "estimateTokens": len(paragraph) // 4,
                }
            )

            count += 1

    return chunks


def main(file="./data/input/data.txt"):
    with open(file) as data_file:
        lines = data_file.readlines()
        parsed_section = parse_sections(lines)
        chunks = chunk_content(parsed_section, file)
        return chunks


main()
