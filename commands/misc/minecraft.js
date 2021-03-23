const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const superagent = require("superagent");

module.exports = {
  help: {
    name: "minecraft",
    description: "",
    usage: "<server ip>",
    category: "miscellaneous",
    aliases: ["mc"],
  },
  run: async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`Please provide server ip!`);
    const ip = args[0].toLowerCase();
    const { body } = await superagent.get(
      `http://mcapi.us/server/status?ip=${ip}&port=25565`
    );
    let status = `**${ip}** server is **offline**`;
    if (body.online) {
      status = `**${ip}** server is **online**`;
      if (body.players.now) {
        status = `${status} - there are playing ${body.players.now} players with maximum number ${body.players.max}.`;
      } else {
        status = `status - nobody is currently playing!`;
      }
    }
    const embed = new MessageEmbed()
      .setColor(cyan)
      .setAuthor(`Here is your ${ip} server status!`, message.guild.iconURL)
      .setDescription(status)
      .setTimestamp()
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );

    message.channel.send(embed);
  },
};
