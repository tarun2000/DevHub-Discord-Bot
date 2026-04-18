import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import usersRoutes from "./routes/users.ts";
import webhooksRoutes from "./routes/webhooks.ts";
import leaderboardRoutes from "./routes/leaderboard.ts";

const app = express();

app.use(express.json());

app.use("/users", usersRoutes);
app.use("/webhooks", webhooksRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => res.json({ ok: true, service: "DevHub-proj API" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
