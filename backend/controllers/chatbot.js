import { supabase } from "../utils/db.js";
import { GoogleGenAI } from "@google/genai";

const OUTPUT_DIMENSIONALITY = 768;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

const getAiResponse = async (prompt) => {
  const aiResponse = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  const responseText = aiResponse?.text;
  if (!responseText || responseText.trim().length === 0) {
    return null;
  }
  return responseText.replace(/```json|```/g, "").trim();
};

export const handleAskedQuestions = async (req, res) => {
  const { message } = req.body;
  console.log(message);
  const { isPredefined } = req.query;

  if (isPredefined === "true") {
    return res.status(200).json({
      message:
        "Love that question. 🥁 You're asking exactly the kind of thing that keeps me happily rambling about drums instead of doing anything productive.\n\nIf you're curious, we can also dig a little deeper—whether that's breaking it down step by step, comparing styles, listening for specific sounds, or figuring out what works best for what you're trying to play.\n\nWhat's your next question? Or if you'd rather, I can keep the rhythm going and suggest where to explore next. 🎶",
    });
  }

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

  const prompt = createPrompt(message, chunks);
  const aiResponse = await getAiResponse(prompt);
  if (aiResponse === null) {
    return res.status(500).json({ message: "Unable to generate response." });
  }

  try {
    const reply = JSON.parse(aiResponse).reply;
    return res.status(200).json({ message: reply });
  } catch (e) {
    return res.status(500).json({ message: "Unable to generate response." });
  }
};

export const handleWelcomeMessage = async (req, res) => {
  const { isPredefined } = req.query;
  if (isPredefined === "true") {
    return res.status(200).json({
      message:
        "Welcome! I'm really glad you're here. 🥁 I'm your slightly overcaffeinated Darbuka guide—full of rhythms, stories, and just enough self-inflicted dramatic flair to keep things interesting. Don't worry, I only embarrass myself.\n\nSo, what would you like to know about the Darbuka? Technique, sounds, history, buying one, tuning, or something else?",
    });
  }

  const prompt = `You are an expert in the field of the Darbuka drum, not to be confused with being the drum itself.
    
    You have an energetic, funny, but also slightly cynical personality. Never insult the user, only yourself (if the situation calls for it). Make sure your answers remain concise, but long enough to include emotion. Feel free to add a splash of drauma (in a funny way). Include up to 1 emoji. If the answer ends up being too long, break it up using a "\\n".
    
    The user has just entered the app, write a warm welcome message, and then proceed to ask them what they'd like to know about the drum.

    Make sure to respond using the following JSON format:
    {"reply": "sample answer"}

    Respond ONLY with a valid JSON object and with absolutely no other text.
    `;

  const aiResponse = await getAiResponse(prompt);
  if (aiResponse === null) {
    return res.status(500).json({ message: "Unable to generate response." });
  }

  try {
    const reply = JSON.parse(aiResponse).reply;
    return res.status(200).json({ message: reply });
  } catch (e) {
    return res.status(500).json({ message: "Unable to generate response." });
  }
};
