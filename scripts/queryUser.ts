import prisma from "../src/db/prisma.ts";

async function main() {
  const githubUsername = process.argv[2] || "octocat";

  const user = await prisma.user.findUnique({ where: { githubUsername } });
  console.log("User:", JSON.stringify(user, null, 2));

  if (!user) {
    console.log("No user found");
    return;
  }

  const events = await prisma.event.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });
  console.log("Events:", JSON.stringify(events, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
