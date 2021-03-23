const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const superagent = require("superagent");
module.exports = {
  help: {
    name: "tweet",
    aliases: [""],
    category: "images",
    description: "",
    usage: "[@member] <message>",
  },
  run: async (bot, message, args) => {
    if (!args[0])
      return message.channel.send("Please provide valid arguments!");
    let body;
    if (
      message.mentions.members.first() &&
      args[0].endsWith(`${message.mentions.members.first().user.id}>`)
    ) {
      body = (
        await superagent.get(
          `https://nekobot.xyz/api/imagegen?type=tweet&username=${
            message.mentions.members.first().user.username
          }&text=${args.slice(1).join(" ")}`
        )
      ).body;
    } else {
      body = (
        await superagent.get(
          `https://nekobot.xyz/api/imagegen?type=tweet&username=${
            message.author.username
          }&text=${args.slice(0).join(" ")}`
        )
      ).body;
    }

    const embed = new MessageEmbed()
      .setColor(cyan)
      .setTitle(`Tweet`)
      .setImage(body.message)
      .setTimestamp()
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );

    message.channel.send(embed);
  },
};
