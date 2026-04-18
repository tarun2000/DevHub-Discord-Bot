import prisma from "../db/prisma.ts";
import type { UserMapping, DBUser } from "../types/index.ts";

class UserService {
  async link(discordId: string, githubUsername: string): Promise<DBUser> {
    const user = await prisma.user.upsert({
      where: { discordId },
      update: { githubUsername },
      create: { discordId, githubUsername },
    });
    return user as DBUser;
  }

  async get(discordId: string): Promise<DBUser | null> {
    return prisma.user.findUnique({ where: { discordId } }) as Promise<DBUser | null>;
  }

  async getAll(): Promise<DBUser[]> {
    return prisma.user.findMany() as Promise<DBUser[]>;
  }
}

export const userService = new UserService();
