const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const superagent = require("superagent");
module.exports = {
  help: {
    name: "whowouldwin",
    aliases: [""],
    category: "images",
    description: "",
    usage: "<@member>",
  },
  run: async (bot, message, args) => {
    if (!message.mentions.members.first())
      return message.channel.send("Please provide valid arguments!");
    const { body } = await superagent.get(
      `https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${message.author.displayAvatarURL()}&user2=${message.mentions.members
        .first()
        .user.displayAvatarURL()}`
    );
    const embed = new MessageEmbed()
      .setColor(cyan)
      .setTitle(`Who Would Win?`)
      .setImage(body.message)
      .setTimestamp()
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );

    message.channel.send(embed);
  },
};
