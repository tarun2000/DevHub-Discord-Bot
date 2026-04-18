# DevHub Discord System

Backend + Discord bot to link Discord users to GitHub usernames, process GitHub webhooks, and maintain a points leaderboard.

## Tech

- Node.js + Express + TypeScript
- discord.js
- Prisma ORM + PostgreSQL

## Quickstart

1. Install dependencies

```bash
cd /Users/tarun/webProject/DevHub-proj
npm install
```

2. Create environment file from sample:

```bash
cp .env.sample .env
# set DATABASE_URL, DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, BACKEND_URL etc.
```

3. Initialize database (run migrations)

```bash
npx prisma migrate dev --name init
```

4. Run backend (development)

```bash
npm run dev
```

5. Start the Discord bot (separate terminal)

```bash
DISCORD_TOKEN=... DISCORD_CLIENT_ID=... DISCORD_GUILD_ID=... BACKEND_URL=http://localhost:3000 npm run bot
```

6. Run backend + Bot in development mode

```bash
npm run dev:all
```

## Endpoints

- POST `/users/link-github` — body: `{ discordId, githubUsername }` — creates or updates a user link (uses Prisma upsert).
- POST `/webhooks/github` — GitHub webhook receiver; processes `push` and `pull_request` events to award points.
- GET `/leaderboard` — returns top 10 users ordered by score.

## Features

- Persistent users stored in PostgreSQL via Prisma (model: `User`).
- Events recorded in `Event` table when points are awarded.
- Webhook scoring rules:
  - `push` → +5 points
  - `pull_request` `opened` → +20 points
  - `pull_request` `closed` and `merged: true` → +50 points
- Leaderboard API (`/leaderboard`) returns top 10 ranked users.
- Discord bot provides `/link-github` and `/leaderboard` slash commands.

## Prisma / Database

- Ensure `DATABASE_URL` points to a Postgres database.
- The schema is in `prisma/schema.prisma` and migrations are handled with `prisma migrate`.

## Testing and Utilities

- Quick curl examples:

```bash
# link a user
curl -X POST -H "Content-Type: application/json" -d '{"discordId":"<id>","githubUsername":"tarun2000"}' http://localhost:3000/users/link-github

# send a push webhook
curl -X POST -H "Content-Type: application/json" -H "X-GitHub-Event: push" -d '{"pusher":{"name":"tarun2000"}}' http://localhost:3000/webhooks/github

# get leaderboard
curl http://localhost:3000/leaderboard | jq .
```

- Helper scripts are in `scripts/` for querying and quick processing (`scripts/queryUser.ts`, `scripts/processAndQuery.ts`).

## Notes

- `githubUsername` and `discordId` are unique in the database; attempting to create a duplicate `githubUsername` will fail unless handled by the client.
- Webhook endpoint always returns HTTP 200 and logs errors (so GitHub retries are not triggered by transient processing errors).
