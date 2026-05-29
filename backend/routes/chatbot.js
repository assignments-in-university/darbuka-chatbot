import express from "express";
import { supabase } from "../utils/db.js";
import { GoogleGenAI } from "@google/genai";

const OUTPUT_DIMENSIONALITY = 768;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const router = express.Router();

// response = supabase.rpc(
//     "match_documents",
//     {
//         "query_embedding": embedding_obj.values,
//         "match_threshold": 0.65,
//         "match_count": 3,
//     },

const createPrompt = (message, chunks) => {
  const chunkParts = [];
  for (const chunk of chunks) {
    const str = `Chunk title: ${chunk.section_title}\nChunk content: ${chunk.content}`;
    chunkParts.push(str);
  }

  return JSON.stringify(`You are an expert in the field of the Darbuka drum, not to be confused with being the drum itself.
    
    You have an energetic, funny, but also slightly cynical personality. Never insult the user, only yourself (if the situation calls for it). Make sure your answers remain concise, but long enough to include emotion. Feel free to add a splash of drauma (in a funny way). Include up to 1 emoji. If the answer ends up being too long, break it up using a "\\n".

  The user has just asked you the following question:

  "${message.trim()}"

  The following data has been recognized as relevant: ${chunkParts.join("\n\n")}
  
  Answer their question using relevant data only from the chunks. If their question is unrelated to the Darbuka drum, reply with "I'm sorry, that is outside of my knowledge base."



  Make sure to respond using the following JSON format:
  {"reply": "sample answer"}

  Respond ONLY with a valid JSON object and with absolutely no other text.`);
};

router.route("/ask").post(async (req, res) => {
  const { message } = req.body;

  if (!message || message?.trim().length <= 0) {
    return res.status(400).json({ message: "Missing message field." });
  }

  const { embeddings } = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: message.trim(),
    config: {
      outputDimensionality: OUTPUT_DIMENSIONALITY,
    },
  });

  const embedding = embeddings?.[0]?.values;
  if (!embedding || embedding?.length !== OUTPUT_DIMENSIONALITY) {
    return res.status(500).json({ message: "Could not embed content." });
  }

  const { data: chunks, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.65,
    match_count: 3,
  });

  if (error) {
    return res.status(500).json({ message: "Unable to generate response." });
  }
  console.log(chunks);

  const prompt = createPrompt(message, chunks);
  const aiResponse = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  const responseText = aiResponse?.text;
  if (!responseText || responseText.trim().length === 0) {
    return res.status(500).json({ message: "Unable to generate response." });
  }
  const clean = responseText.replace(/```json|```/g, "").trim();

  try {
    const reply = JSON.parse(clean).reply;
    return res.status(200).json({ message: reply });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Unable to generate response." });
  }
});

export default router;
