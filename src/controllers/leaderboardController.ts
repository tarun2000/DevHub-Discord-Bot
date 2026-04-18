import type { Request, Response } from "express";
import { getLeaderboard } from "../services/leaderboardService.ts";

export async function getLeaderboardController(_req: Request, res: Response) {
  try {
    const leaderboard = await getLeaderboard();
    return res.status(200).json({ leaderboard });
  } catch (err) {
    console.error("getLeaderboard error", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}
