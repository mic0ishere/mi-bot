const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  help: {
    name: "meme",
    description: "",
    category: "miscellaneous",
    aliases: ["joke"],
  },
  run: async (bot, message, args) => {
    const { body } = await superagent.get(
      `https://meme-api.herokuapp.com/gimme`
    );

    const embed = new MessageEmbed()
      .setTitle(body.title)
      .setColor("RANDOM")
      .setImage(body.url)
      .setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );
    message.channel.send({ embed });
  },
};
