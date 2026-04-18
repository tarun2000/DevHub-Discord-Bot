import express from "express";
import { getLeaderboardController } from "../controllers/leaderboardController.ts";

const router = express.Router();

router.get("/", getLeaderboardController);

export default router;
