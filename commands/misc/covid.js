const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/config.json");
const superagent = require("superagent");

module.exports = {
  help: {
    name: "covid",
    description: "",
    usage: "[country]",
    category: "miscellaneous",
    aliases: ["virus", "corona"],
  },
  run: async (bot, message, args) => {
    const { body } = await superagent.get(`https://corona.lmao.ninja/v2/all`);

    if (!args[0]) {
      const embedd = new MessageEmbed()
        .setColor(cyan)
        .setTitle("Covid-19 Informations")
        .addField("**Cases:**", body.cases, true)
        .addField("**Recovered:**", body.recovered, true)
        .addField("**Deaths:**", body.deaths, true)
        .setFooter(
          `© ${message.guild.me.displayName} | Check also: ?covid [country]`,
          bot.user.displayAvatarURL()
        )
        .setTimestamp();
      message.channel.send(embedd);
    } else {
      const { body } = await superagent.get(
        `https://corona.lmao.ninja/v2/countries/${args[0]}`
      );
      const embedcountry = new MessageEmbed()
        .setColor(cyan)
        .setThumbnail(`${body.countryInfo.flag}`)
        .setTitle("Covid-19 Informations")
        .addField("**Cases:**", `${body.cases}`, true)
        .addField("**Recovered:**", `${body.recovered}`, true)
        .addField("**Deaths:**", `${body.deaths}`, true)
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        )
        .setTimestamp();
      message.channel.send(embedcountry);
    }
  },
};
