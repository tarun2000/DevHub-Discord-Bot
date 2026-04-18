import { handleGithubEvent } from "../src/services/webhookService.ts";
import prisma from "../src/db/prisma.ts";

async function main() {
  const githubUsername = "octocat";

  // Sample payloads
  const pushPayload = { pusher: { name: githubUsername } };
  const prOpened = { action: "opened", pull_request: { user: { login: githubUsername }, merged: false } };
  const prMerged = { action: "closed", pull_request: { user: { login: githubUsername }, merged: true } };

  await handleGithubEvent("push", pushPayload);
  await handleGithubEvent("pull_request", prOpened);
  await handleGithubEvent("pull_request", prMerged);

  const user = await prisma.user.findUnique({ where: { githubUsername } });
  console.log("After processing, user:", JSON.stringify(user, null, 2));

  const events = await prisma.event.findMany({ where: { userId: user?.id }, orderBy: { createdAt: "asc" } });
  console.log("Events:", JSON.stringify(events, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
