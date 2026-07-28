import { GoogleGenAI, Type } from "@google/genai";

const OUTPUT_DIMENSIONALITY = 768;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const embed = async ({ message }) => {
  // EMBED MESSAGE
  const { embeddings } = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: message.trim(),
    config: {
      outputDimensionality: OUTPUT_DIMENSIONALITY,
    },
  });

  const embedding = embeddings?.[0]?.values;
  if (!embedding || embedding?.length !== OUTPUT_DIMENSIONALITY) {
    throw Error("Could not embed content.");
  }

  return embedding;
};
