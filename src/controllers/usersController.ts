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

    // Transform dates to ISO strings for frontend
    const transformedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return res.status(200).json({ ok: true, user: transformedUser });
  } catch (err) {
    console.error("linkGithub error", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users: DBUser[] = await userService.getAll();

    // Transform dates to ISO strings for frontend
    const transformedUsers = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return res.status(200).json({ users: transformedUsers });
  } catch (err) {
    console.error("getUsers error", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}
