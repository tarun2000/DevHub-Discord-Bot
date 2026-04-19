import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import usersRoutes from "./routes/users.ts";
import webhooksRoutes from "./routes/webhooks.ts";
import leaderboardRoutes from "./routes/leaderboard.ts";
import eventsRoutes from "./routes/events.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/webhooks", webhooksRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/events", eventsRoutes);

app.get("/", (req, res) => res.json({ ok: true, service: "DevHub-proj API" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
