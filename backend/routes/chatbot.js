import express from "express";
import {
  ask,
  welcome,
  learnModeAsk,
  learnModeWelcome,
  generateCourse,
} from "../controllers/chatbot.js";

const router = express.Router();

router.route("/ask").post(ask);
router.route("/welcome").post(welcome);
router.route("/learn/ask").post(learnModeAsk);
router.route("/learn/welcome").post(learnModeWelcome);
router.route("/generateCourse").post(generateCourse);

export default router;
