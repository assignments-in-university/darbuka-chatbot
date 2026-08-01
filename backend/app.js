import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { supabase } from "./utils/db.js";
import chatbotRouter from "./routes/chatbot.js";

const app = express();
app.use(
  cors({
    origin: [
      "https://sout-chatbot-frontend.vercel.app",
      "http://localhost:5173",
    ],
  }),
);
app.use(json());

// ROUTES
app.use("/chatbot", chatbotRouter);

// API RATE LIMITER
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
app.use(limiter);

// LISTEN TO PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
