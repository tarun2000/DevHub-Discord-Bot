import type { Request, Response } from "express";
import { eventService } from "../services/eventService.ts";
import type { DBEvent } from "../types/index.ts";

export async function getEvents(req: Request, res: Response) {
  try {
    const events: DBEvent[] = await eventService.getAll();

    // Transform to match frontend EventRecord interface
    const transformedEvents = events.map((event) => ({
      id: event.id,
      userId: event.userId,
      type: event.type,
      points: event.points,
      createdAt: event.createdAt.toISOString(),
      githubUsername: event.user?.githubUsername,
    }));

    return res.status(200).json({ events: transformedEvents });
  } catch (err) {
    console.error("getEvents error", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}
