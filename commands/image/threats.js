const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const superagent = require("superagent");
module.exports = {
  help: {
    name: "threats",
    aliases: [""],
    category: "images",
    description: "",
    usage: "[@member]",
  },
  run: async (bot, message, args) => {
    const member = message.mentions.members.first()
      ? message.mentions.members.first().user
      : message.author;
    const { body } = await superagent.get(
      `https://nekobot.xyz/api/imagegen?type=threats&url=${member.displayAvatarURL()}`
    );
    const embed = new MessageEmbed()
      .setColor(cyan)
      .setTitle(`Biggest Threats`)
      .setImage(body.message)
      .setTimestamp()
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );

    message.channel.send(embed);
  },
};
