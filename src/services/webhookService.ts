import prisma from "../db/prisma.ts";

export type GitHubEventType = "push" | "pull_request" | string;

export async function handleGithubEvent(eventType: GitHubEventType | undefined, payload: unknown): Promise<void> {
  try {
    if (!eventType) return;

    // Helper to safely access nested properties
    const get = <T = any>(fn: () => T): T | undefined => {
      try {
        return fn();
      } catch {
        return undefined;
      }
    };

    let githubUsername: string | undefined;
    let points: number | undefined;
    let recordedType: string | undefined;

    if (eventType === "push") {
      githubUsername = get(() => (payload as any)?.pusher?.name);
      if (!githubUsername) return;
      points = 5;
      recordedType = "push";
    } else if (eventType === "pull_request") {
      const action = get(() => (payload as any)?.action) as string | undefined;
      const merged = get(() => (payload as any)?.pull_request?.merged) as boolean | undefined;
      githubUsername = get(() => (payload as any)?.pull_request?.user?.login);
      if (!githubUsername) return;

      if (action === "opened") {
        points = 20;
        recordedType = "pr_open";
      } else if (action === "closed" && merged === true) {
        points = 50;
        recordedType = "pr_merge";
      } else {
        return;
      }
    } else {
      // ignore other event types
      return;
    }

    if (!points || !recordedType || !githubUsername) return;

    const user = await prisma.user.findUnique({ where: { githubUsername } });
    if (!user) {
      console.log(`No user found for githubUsername=${githubUsername}`);
      return;
    }

    // Create event and increment score in a transaction
    await prisma.$transaction([
      prisma.event.create({ data: { userId: user.id, type: recordedType, points } }),
      prisma.user.update({ where: { id: user.id }, data: { score: { increment: points } } }),
    ]);

    console.log(`User ${user.discordId} (${githubUsername}) gained +${points} points from ${recordedType}`);
  } catch (err) {
    console.error("handleGithubEvent error", err);
    // Do not throw — webhook endpoint must always return 200
  }
}

export default { handleGithubEvent };
