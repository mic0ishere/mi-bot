const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");

module.exports = {
  help: {
    name: "stats",
    description: "",
    category: "utils",
    aliases: ["ping"],
  },
  run: async (bot, message, args) => {
    let memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    let totalSeconds = bot.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor((totalSeconds % 86400) / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    let embedEdit = await message.channel.send("Pinging...");
    let ping = embedEdit.createdTimestamp - message.createdTimestamp;
    embedEdit.delete();
    let sEmbed = new MessageEmbed()
      .setColor(cyan)
      .setTitle("Bot Info")
      .setThumbnail(message.guild.iconURL())
      .addField("**Ping:**", `${ping}ms.`, true)
      .addField("**Memory:**", `${memory}mb.`, true)
      .addField("**Uptime:**", `${uptime}`, true)
      .addField("**Bot guilds:**", `${bot.guilds.cache.size}`, true)
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );
    message.channel.send(sEmbed);
  },
};
