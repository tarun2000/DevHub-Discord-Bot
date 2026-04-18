import axios from "axios";
import { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const linkCommand = new SlashCommandBuilder()
  .setName("link-github")
  .setDescription("Link your GitHub username to your Discord account")
  .addStringOption((opt) => opt.setName("username").setDescription("GitHub username").setRequired(true));

const leaderboardCommand = new SlashCommandBuilder().setName("leaderboard").setDescription("Show top developers");

async function registerCommands() {
  const TOKEN = process.env.DISCORD_TOKEN;
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const GUILD_ID = process.env.DISCORD_GUILD_ID;

  if (!TOKEN || !CLIENT_ID) {
    throw new Error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be provided in env");
  }

  const rest = new REST({ version: "10" }).setToken(TOKEN);
  try {
    const commands = [linkCommand.toJSON(), leaderboardCommand.toJSON()];
    if (GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log("Registered guild commands");
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log("Registered global commands");
    }
  } catch (err) {
    console.error("Failed to register commands", err);
  }
}

client.once("ready", () => {
  console.log("Discord client ready", client.user?.tag);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

  if (interaction.commandName === "link-github") {
    const githubUsername = interaction.options.getString("username", true);
    const discordId = interaction.user.id;
    try {
      await axios.post(`${backendUrl}/users/link-github`, { discordId, githubUsername });
      await interaction.reply({ content: `Linked GitHub user ${githubUsername}.`, ephemeral: true });
    } catch (err) {
      console.error("Error linking github", err);
      await interaction.reply({ content: "Failed to link GitHub username.", ephemeral: true });
    }
    return;
  }

  if (interaction.commandName === "leaderboard") {
    try {
      const resp = await axios.get(`${backendUrl}/leaderboard`);
      const rows = resp.data?.leaderboard as Array<{ rank: number; githubUsername: string; score: number }> | undefined;
      if (!rows || rows.length === 0) {
        await interaction.reply({ content: "No leaderboard data yet.", ephemeral: false });
        return;
      }

      const lines = rows.map((r) => `${r.rank}. ${r.githubUsername} — ${r.score} pts`);
      const message = ["🏆 Leaderboard", "", ...lines].join("\n");
      await interaction.reply({ content: message, ephemeral: false });
    } catch (err) {
      console.error("Error fetching leaderboard", err);
      await interaction.reply({ content: "Failed to fetch leaderboard.", ephemeral: true });
    }
    return;
  }
});

export async function startBot() {
  await registerCommands();
  const TOKEN = process.env.DISCORD_TOKEN;
  if (!TOKEN) throw new Error("DISCORD_TOKEN missing");
  await client.login(TOKEN);
}
