import "dotenv/config";
import express, { json } from "express";
import { rateLimit } from "express-rate-limit";
import { supabase } from "./utils/db.js";

import chatbotRouter from "./routes/chatbot.js";

const app = express();
app.use(json());

// API RATE LIMITER
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
app.use(limiter);

app.use("/", chatbotRouter);

// LISTEN TO PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
