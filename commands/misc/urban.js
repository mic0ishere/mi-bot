const urban = require("urban");
const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const { stripIndents } = require("common-tags");

module.exports = {
  help: {
    name: "urban",
    aliases: ["urb", "urbandictionary"],
    category: "miscellaneous",
    description: "",
    usage: "<search|random> [query]",
  },
  run: async (bot, message, args) => {
    if (!args[0] || !["search", "random"].includes(args[0]))
      return message.channel.send("Please provide valid arguments!");
    const search = args[1] ? urban(args.slice(1).join(" ")) : urban.random();
    try {
      search.first((res) => {
        if (!res)
          return message.channel.send(
            "No results found for this topic, sorry!"
          );
        const {
          word,
          definition,
          example,
          thumbs_up,
          thumbs_down,
          permalink,
          author,
        } = res;

        const embed = new MessageEmbed()
          .setColor(cyan)
          .setAuthor(`Urban Dictionary | ${word}`)
          .setDescription(
            stripIndents`**Defintion:** ${definition || "No definition"}
                            **Example:** ${example || "No Example"}
                            **Upvote:** ${thumbs_up || 0}
                            **Downvote:** ${thumbs_down || 0}
                            **Link:** [link to ${word}](${
              permalink || "https://www.urbandictionary.com/"
            })`
          )
          .setTimestamp()
          .setFooter(
            `© ${message.guild.me.displayName} | Written by ${
              author || "unknown"
            }`,
            bot.user.displayAvatarURL()
          );

        message.channel.send(embed);
      });
    } catch (e) {
      console.log(e);
      return message.channel.send("looks like i've broken! Try again");
    }
  },
};
