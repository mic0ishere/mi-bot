const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const config = require("../../global/config.json");

module.exports = {
  help: {
    name: "links",
    description: "",
    category: "utils",
    aliases: [],
  },
  run: async (bot, message, args) => {
    const inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${config.discord.id}&permissions=8&scope=bot&redirect_uri=${config.dashboard.redirectURL}/dashboard`;
    const sEmbed = new MessageEmbed()
      .setColor(cyan)
      .setTitle("Bot Links")
      .setDescription(
        `[Support Server](https://mic0.me/dsc)\n[Add me!](${inviteURL})`
      )
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );
    message.channel.send(sEmbed);
  },
};
