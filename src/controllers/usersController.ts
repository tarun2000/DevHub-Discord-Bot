import type { Request, Response } from "express";
import { userService } from "../services/userService.ts";
import type { LinkRequest, DBUser } from "../types/index.ts";

export async function linkGithub(req: Request, res: Response) {
  try {
    const body = req.body as LinkRequest;
    const { discordId, githubUsername } = body || {};

    if (!discordId || !githubUsername) {
      return res.status(400).json({ error: "discordId and githubUsername are required" });
    }

    const user: DBUser = await userService.link(discordId, githubUsername);
    return res.status(200).json({ ok: true, user });
  } catch (err) {
    console.error("linkGithub error", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}
