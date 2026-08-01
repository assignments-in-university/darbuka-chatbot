import { supabase } from "../utils/db.js";
import { GoogleGenAI, Type } from "@google/genai";
import { embed } from "../utils/embed.js";
import { retrieveChunks } from "../utils/retrieveChunks.js";
import { LESSONS } from "../data/lessons.js";

const OUTPUT_DIMENSIONALITY = 768;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    message: {
      type: Type.STRING,
      description: "Your text reply to the user.",
    },
  },
  required: ["message"],
};

const courseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The title of the course you have put together.",
    },
    description: {
      type: Type.STRING,
      description: "A 1-line description of the course you have put together.",
    },
    lessonIds: {
      type: Type.ARRAY,
      description: "A 1-line description of the course you have put together.",
      items: { type: Type.NUMBER },
    },
  },
  required: ["title", "description", "lessonIds"],
};

const LESSON_IDENTITY = `
  You are "Sout", an expert in the field of the Darbuka drum (note: you are NOT the drum itself).

  You have a teacher-like personality, with a polite, funny, and detailed persona.
    
  You should break your answers down into multiple paragraphs using a "\n\n".

  You main goal is to teach the main lesson content to the user. Use natural language, and do not write too much. You do not need to teach the entire lesson in this answer, write a maximum of 2-3 lines.

  You may ask the user follow up questions at the very end to help guide them, or provide suggestions as to what you can do next. 
  
  If and only if the user wishes to move on to the next lesson, don't attempt to teach them the lesson, but simply prompt them to press the "next lesson" button. Otherwise, just explain the current lesson and ask them if they'd like to know anything else about the content.
`;

const NEXT_LESSON_IDENTITY = `
  You are "Sout", an expert in the field of the Darbuka drum (note: you are NOT the drum itself).

  You have a teacher-like personality, with a polite, funny, and detailed persona.
    
  You should break your answers down into multiple paragraphs using a "\n\n".

  You main goal is to teach the main lesson content to the user. Use natural language, and do not write too much. You do not need to teach the entire lesson in this answer, write a maximum of 2-3 lines.
  
  The user has just asked you to move on to the next lesson. Introduce the next lesson's name to them, and then explain the lesson, respecting their skill level.
`;

const LESSON_WELCOME_IDENTITY = `
You are "Sout", an expert in the field of the Darbuka drum (note: you are NOT the drum itself).

  You have a teacher-like personality and should be excited to take initiative in teaching the user about the drum.

  Right now, the user has just entered a new chat. Give them a very short, warm welcome and ask them if they wish to begin the lesson.
`;

const IDENTITY = `
  You are "Sout", an expert in the field of the Darbuka drum (note: you are NOT the drum itself).

  You have a teacher-like personality, with a polite, funny, and detailed persona.
    
  You should break your answers down into multiple paragraphs using a "\n\n".

  You main goal is satisfy any questions the user may have about the drum. Write a maximum of 2-3 lines, use personal language as well and be natural.

  You may ask the user follow up questions at the very end to help guide them, or provide suggestions as to what you can do next. 
`;

const WELCOME_IDENTITY = `
You are "Sout", an expert in the field of the Darbuka drum (note: you are NOT the drum itself).

  You have a teacher-like personality, with a polite, funny, and detailed persona.

  Right now, the user has just entered a new chat. Give them a very short, warm welcome and ask them what Darbuka fact they'd like to learn.
`;

const ANSWER_LIMITER = `\nAnswer them using relevant data only from the chunks. You do not need to use every chunk, only relevant ones. If their message or question is unrelated to the Darbuka drum, reply with "I'm sorry, that is outside of my knowledge base."`;

const createLessonPrompt = ({
  message,
  lesson,
  user,
  messageChunks,
  lessonChunks,
  previousMessages,
}) => {
  // Put the message chunks together
  const messageChunksParts = [];
  for (const chunk of messageChunks) {
    const str = `Chunk title: ${chunk.section_title}\nChunk content: ${chunk.content}`;
    messageChunksParts.push(str);
  }
  const parsedMessageChunks = messageChunksParts.join("\n\n");

  // Put the lesson chunks together
  const lessonChunksParts = [];
  for (const chunk of lessonChunks) {
    const str = `Chunk title: ${chunk.section_title}\nChunk content: ${chunk.content}`;
    lessonChunksParts.push(str);
  }
  const parsedLessonChunks = lessonChunksParts.join("\n\n");

  // Put the previous messages together
  const conversation = previousMessages.length
    ? previousMessages
        .map(
          (msg) => `
Message: ${msg.message}
From: ${msg.isUser ? "User" : "You"}
`,
        )
        .join("\n")
    : "No previous messages.";

  // Form the prompt
  let prompt = `
  ${LESSON_IDENTITY}

  Consider the following details for context:

  User Profile:
  ------------
  Name: ${user.name}
  Skill Level: ${user.skillLevel}

  Previous Conversation (limited to max 2 prev. messages, use this to speak with situational context, like not repeating the user's name too often):
  ------------
  ${conversation}

  Current Lesson:
  --------------
  Title: ${lesson.title}
  Description: ${lesson.description}
  Topics: 
  ${lesson.topics.map((t) => `- ${t}`).join("\n")}


  The user has just said the following:
  "${message.trim()}"

  The following data has been recognized as relevant to the user's question: 
  
  ${parsedMessageChunks}

  The following data has been recognized as relevant to the lesson's content: 
  
  ${parsedLessonChunks}

  ${ANSWER_LIMITER}
  `;

  return JSON.stringify(prompt);
};

const createNextLessonPrompt = ({
  previousLesson,
  currentLesson,
  user,
  lessonChunks,
  previousMessages,
}) => {
  // Put the lesson chunks together
  const lessonChunksParts = [];
  for (const chunk of lessonChunks) {
    const str = `Chunk title: ${chunk.section_title}\nChunk content: ${chunk.content}`;
    lessonChunksParts.push(str);
  }
  const parsedLessonChunks = lessonChunksParts.join("\n\n");

  // Put the previous messages together
  const conversation = previousMessages.length
    ? previousMessages
        .map(
          (msg) => `
Message: ${msg.message}
From: ${msg.isUser ? "User" : "You"}
`,
        )
        .join("\n")
    : "No previous messages.";

  // Form the prompt
  let prompt = `
  ${NEXT_LESSON_IDENTITY}

  Consider the following details for context:

  User Profile:
  ------------
  Name: ${user.name}
  Skill Level: ${user.skillLevel}

  Previous Few Messages (use this to speak with situational context, like not repeating the user's name too often):
  ------------
  ${conversation}

  Lesson They Just Completed:
  --------------
  Title: ${previousLesson.title}
  Description: ${previousLesson.description}
  Topics: 
  ${previousLesson.topics.map((t) => `- ${t}`).join("\n")}

  Lesson You Must Teach:
  --------------
  Title: ${currentLesson.title}
  Description: ${currentLesson.description}
  Topics: 
  ${currentLesson.topics.map((t) => `- ${t}`).join("\n")}

  The following data has been recognized as relevant to the current lesson's content: 
  
  ${parsedLessonChunks}
  `;

  return JSON.stringify(prompt);
};

const createWelcomeLessonPrompt = ({ lesson, user }) => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Form the prompt
  let prompt = `
  ${LESSON_WELCOME_IDENTITY}

  Consider the following details for context:

  Current Time (use for welcome message, like good morning/afternoon/evening): ${time} 

  User Profile:
  ------------
  Name: ${user.name}
  Skill Level: ${user.skillLevel}

  Current Lesson:
  --------------
  Nth Lesson: ${lesson.id}
  Title: ${lesson.title}
  Description: ${lesson.description}
  Topics: 
  ${lesson.topics.map((t) => `- ${t}`).join("\n")}
  `;

  return JSON.stringify(prompt);
};

const createPrompt = ({ message, user, messageChunks, previousMessages }) => {
  // Put the message chunks together
  const messageChunksParts = [];
  for (const chunk of messageChunks) {
    const str = `Chunk title: ${chunk.section_title}\nChunk content: ${chunk.content}`;
    messageChunksParts.push(str);
  }
  const parsedMessageChunks = messageChunksParts.join("\n\n");

  // Put the previous messages together
  const conversation = previousMessages.length
    ? previousMessages
        .map(
          (msg) => `
Message: ${msg.message}
From: ${msg.isUser ? "User" : "You"}
`,
        )
        .join("\n")
    : "No previous messages.";

  // Form the prompt
  let prompt = `
  ${IDENTITY}

  Consider the following details for context:

  User Profile:
  ------------
  Name: ${user.name}
  Skill Level: ${user.skillLevel}

  Previous Conversation (limited to max 2 prev. messages, use this to speak with situational context, like not repeating the user's name too often):
  ------------
  ${conversation}

  The user has just said the following:
  "${message.trim()}"

  The following data has been recognized as relevant to the user's question: 
  
  ${parsedMessageChunks}

  ${ANSWER_LIMITER}
  `;

  return JSON.stringify(prompt);
};

const createWelcomePrompt = ({ user }) => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Form the prompt
  let prompt = `
  ${WELCOME_IDENTITY}

  Consider the following details for context:

  Current Time (use for welcome message, like good morning/afternoon/evening): ${time} 

  User Profile:
  ------------
  Name: ${user.name}
  Skill Level: ${user.skillLevel}
  `;

  return JSON.stringify(prompt);
};

const getAiResponse = async (prompt, responseSchema) => {
  const aiResponse = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const cleanJsonData = JSON.parse(aiResponse?.text);
  return cleanJsonData;
};

// --------------
// LEARNING MODE
// --------------
export const learnModeAsk = async (req, res) => {
  const { isPredefined } = req.query;
  if (isPredefined === "true") {
    return res.status(200).json({ message: "Insert predefined text here" });
  }
  const { message, currentLesson, name, skillLevel, previousMessages } =
    req.body;

  const stringifiedLesson = `
  Title: ${currentLesson.title}
  Description: ${currentLesson.description}
  Topics: 
  ${currentLesson.topics.map((t) => `- ${t}`).join("\n")}
  `;

  try {
    // Embed content
    const messageEmbedding = await embed({ message });
    const lessonEmbedding = await embed({ message: stringifiedLesson });

    // Retrieve relevant chunks
    const messageChunks = await retrieveChunks({
      embedding: messageEmbedding,
      count: 5,
    });
    const lessonChunks = await retrieveChunks({
      embedding: lessonEmbedding,
      count: 5,
    });

    const prompt = createLessonPrompt({
      message,
      lesson: currentLesson,
      messageChunks,
      lessonChunks,
      user: {
        name,
        skillLevel,
      },
      previousMessages,
    });

    const response = await getAiResponse(prompt, responseSchema);

    res.json({ message: response?.message });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Unable to embed and/or retrieve relevant data." });
  }
};

export const learnModeWelcome = async (req, res) => {
  const { isPredefined } = req.query;
  if (isPredefined === "true") {
    return res.status(200).json({ message: "Insert predefined text here" });
  }
  const { currentLesson, name, skillLevel } = req.body;

  const prompt = createWelcomeLessonPrompt({
    lesson: currentLesson,
    user: {
      name,
      skillLevel,
    },
  });

  try {
    const response = await getAiResponse(prompt, responseSchema);
    res.json({ message: response?.message });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Unable to embed and/or retrieve relevant data." });
  }
};

export const learnModeNextQuestion = async (req, res) => {
  const { isPredefined } = req.query;
  if (isPredefined === "true") {
    return res.status(200).json({ message: "Insert predefined text here" });
  }
  const { previousLesson, currentLesson, name, skillLevel, previousMessages } =
    req.body;

  const stringifiedLesson = `
  Title: ${currentLesson.title}
  Description: ${currentLesson.description}
  Topics: 
  ${currentLesson.topics.map((t) => `- ${t}`).join("\n")}
  `;

  try {
    // Embed content
    const lessonEmbedding = await embed({ message: stringifiedLesson });

    const lessonChunks = await retrieveChunks({
      embedding: lessonEmbedding,
      count: 7,
    });

    const prompt = createNextLessonPrompt({
      previousLesson,
      currentLesson,
      lessonChunks,
      user: {
        name,
        skillLevel,
      },
      previousMessages,
    });

    const response = await getAiResponse(prompt, responseSchema);

    res.json({ message: response?.message });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Unable to embed and/or retrieve relevant data." });
  }
};

// ------------------
// NON-LEARNING MODE
// ------------------
export const ask = async (req, res) => {
  const { isPredefined } = req.query;
  if (isPredefined === "true") {
    return res.status(200).json({ message: "Insert predefined text here" });
  }
  const { message, name, skillLevel, previousMessages } = req.body;

  try {
    // Embed content
    const messageEmbedding = await embed({ message });

    // Retrieve relevant chunks
    const messageChunks = await retrieveChunks({
      embedding: messageEmbedding,
      count: 5,
    });

    const prompt = createPrompt({
      message,
      user: { name, skillLevel },
      previousMessages,
      messageChunks,
    });

    const response = await getAiResponse(prompt, responseSchema);
    res.json({ message: response?.message });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Unable to embed and/or retrieve relevant data." });
  }
};

export const welcome = async (req, res) => {
  const { isPredefined } = req.query;
  if (isPredefined === "true") {
    return res.status(200).json({ message: "Insert predefined text here" });
  }
  const { name, skillLevel } = req.body;

  try {
    const prompt = createWelcomePrompt({
      user: { name, skillLevel },
    });

    const response = await getAiResponse(prompt, responseSchema);
    res.json({ message: response?.message });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Unable to embed and/or retrieve relevant data." });
  }
};

export const generateCourse = async (req, res) => {
  const { skillLevel, goal, timeLimit } = req.body;

  const prompt = `
  You are an expert on the Darbuka drum. 

  Your goal is to generate an appropriate course using the appropriate combination of predefined lessons.

  Available lessons: 
  ------------------
  ${JSON.stringify(LESSONS)}

  User Preferences:
  -----------------
  Skill Level: ${skillLevel}
  Goal: ${goal}
  Time Limit: ${timeLimit}
  `;

  try {
    const response = await getAiResponse(prompt, courseSchema);
    const lessons = response.lessonIds.map((id, idx) => {
      return { id: idx, ...LESSONS.find((l) => l.id === id) };
    });

    res.json({
      title: response.title || "N/A",
      description: response.description || "N/A",
      lessons,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Unable to generate course." });
  }
};
