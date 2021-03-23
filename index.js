const { Collection, Client } = require("discord.js");
const mongoose = require("mongoose");
const guild = require("./data/guilds");
const message = require("./global/message.js");
const config = require("./global/config.json");
const bot = new Client();
bot.commands = new Collection();
bot.aliases = new Collection();
require("./global/functions")(bot);
message.message(bot);
bot.on("ready", async () => {
  bot.user.setActivity(`@${bot.user.username}`, { type: "WATCHING" });
});
bot.once("ready", async () => {
  console.log(`These are guilds that I'm in. (${bot.guilds.cache.size})`);
  bot.guilds.cache.forEach(async (element) => {
    console.log(`${element.name}`);
    await guild.get({ id: element.id });
  });
  require("./global/lavalink")(bot);
  console.log("\n" + bot.user.username + " has logged in!");
  require("./dashboard/server");
  mongoose.connect(
    `${config.database.connection}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to db!");
      bot.db = {
        guilds: mongoose.connection.collection("guilds"),
        members: mongoose.connection.collection("members"),
        users: mongoose.connection.collection("users"),
      };
    }
  );
});
bot.login(config.discord.token);
module.exports = bot;
