import prisma from "../db/prisma.ts";

export interface LeaderboardRow {
  rank: number;
  githubUsername: string;
  score: number;
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const users = await prisma.user.findMany({ orderBy: { score: "desc" }, take: 10 });
  return users.map((u, i) => ({ rank: i + 1, githubUsername: u.githubUsername, score: u.score }));
}

export default { getLeaderboard };
