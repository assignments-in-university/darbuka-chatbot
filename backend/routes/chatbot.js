import express from "express";
import { handleAskedQuestions, handleWelcomeMessage } from "../controllers/chatbot.js";

const router = express.Router();

router.route("/ask").post(handleAskedQuestions);
router.route("/welcome").get(handleWelcomeMessage);

export default router;
