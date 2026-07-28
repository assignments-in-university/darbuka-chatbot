import { supabase } from "./db.js";

export const retrieveChunks = async ({
  embedding,
  count = 3,
  threshold = 0.65,
}) => {
  // GET RELEVANT CHUNKS
  const { data: chunks, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: count,
  });

  if (error) {
    console.log(error);
    throw Error("Could not retrieve relevant chunks.");
  }

  return chunks;
};
