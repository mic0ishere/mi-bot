const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const superagent = require("superagent");
module.exports = {
  help: {
    name: "changemymind",
    aliases: [""],
    category: "images",
    description: "",
    usage: "<text>",
  },
  run: async (bot, message, args) => {
    if (!args[0])
      return message.channel.send("Please provide valid arguments!");
    const { body } = await superagent.get(
      `https://nekobot.xyz/api/imagegen?type=changemymind&text=${args
        .slice(0)
        .join(" ")}`
    );
    const embed = new MessageEmbed()
      .setColor(cyan)
      .setTitle(`Change My Mind`)
      .setImage(body.message)
      .setTimestamp()
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );

    message.channel.send(embed);
  },
};
