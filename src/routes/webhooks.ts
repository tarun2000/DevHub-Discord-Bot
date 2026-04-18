import express from "express";
import { handleGithubWebhook } from "../controllers/webhooksController.ts";

const router = express.Router();

router.post("/github", handleGithubWebhook);

export default router;
