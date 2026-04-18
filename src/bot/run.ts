import * as dotenv from "dotenv";
dotenv.config();
import { startBot } from "./discordBot.ts";

startBot().catch((err) => {
  console.error(err);
  process.exit(1);
});
