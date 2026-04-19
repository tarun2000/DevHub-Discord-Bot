import prisma from "../db/prisma.ts";
import type { DBEvent } from "../types/index.ts";

class EventService {
  async getAll(): Promise<DBEvent[]> {
    const events = await prisma.event.findMany({
      include: {
        user: {
          select: {
            githubUsername: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return events as DBEvent[];
  }
}

export const eventService = new EventService();
