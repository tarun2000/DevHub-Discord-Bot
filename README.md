# DevHub Discord System (MVP)

Minimal backend + Discord bot to link Discord users to GitHub usernames and receive GitHub webhooks.

## Tech

- Node.js + Express + TypeScript
- discord.js
- In-memory store (no DB)

## Quickstart

1. Install dependencies

```bash
cd /Users/tarun/webProject/DevHub-proj
npm install
```

2. Create environment file from sample:

```bash
cp .env.sample .env
# then fill values in .env
```

3. Run backend (development)

```bash
npm run dev
```

4. Start the Discord bot (separate terminal)

```bash
DISCORD_TOKEN=... DISCORD_CLIENT_ID=... DISCORD_GUILD_ID=... BACKEND_URL=http://localhost:3000 npm run bot
```

## Endpoints

- POST `/users/link-github` — body: `{ discordId, githubUsername }` — links a Discord ID to a GitHub username.
- POST `/webhooks/github` — GitHub webhook receiver; logs payload and event type (inspect `x-github-event` header).

## Prisma / Database

- Ensure you have a PostgreSQL database and set `DATABASE_URL` in your `.env`.
- Install packages and Prisma CLI: `npm install` then `npx prisma --version`.
- Run initial migration:

```bash
npx prisma migrate dev --name init
```

This will create the database tables described in `prisma/schema.prisma`.

## Notes

- All data is stored in-memory (`src/services/userService.ts`). Restarting the process clears mappings.
- No authentication or DB is included (MVP).# devhub-proj

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.9. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
