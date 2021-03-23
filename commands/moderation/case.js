const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
module.exports = {
  help: {
    name: "case",
    description: "",
    usage: "[number] [@mention]",
    category: "moderation",
    aliases: [""],
    accessableby: "",
  },
  run: async (bot, message, args) => {
    const member = message.mentions.members.first()
      ? message.mentions.members.first().user.id
      : message.author.id;
    const memberDB = await bot.db.members.findOne({
      userId: member,
      guildId: message.guild.id,
    });
    if (
      args[0] &&
      !isNaN(args[0]) &&
      memberDB.moderation.cases != null &&
      memberDB.moderation.cases[
        memberDB.moderation.cases.length - (Number(args[0]) + 1)
      ]
    ) {
      const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle(
          `${
            message.mentions.members.first()
              ? message.mentions.members.first().user.username
              : message.author.username
          } case #${args[0]}`
        )
        .setDescription(
          `
            Type: ${
              memberDB.moderation.cases[
                memberDB.moderation.cases.length - (Number(args[0]) + 1)
              ].type
            }
            Reason: ${
              memberDB.moderation.cases[
                memberDB.moderation.cases.length - (Number(args[0]) + 1)
              ].reason
            }
            Time: ${
              memberDB.moderation.cases[
                memberDB.moderation.cases.length - (Number(args[0]) + 1)
              ].time
            }
            Moderator: ${message.guild.members.cache.find(
              (x) =>
                x.id ==
                memberDB.moderation.cases[
                  memberDB.moderation.cases.length - (Number(args[0]) + 1)
                ].moderatorID
            )}
            Server case: ${
              memberDB.moderation.cases[
                memberDB.moderation.cases.length - (Number(args[0]) + 1)
              ].serverCase
            }
            `
        )
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        )
        .setThumbnail(
          message.mentions.members.first()
            ? message.mentions.members.first().user.displayAvatarURL()
            : message.author.displayAvatarURL()
        );
      message.channel.send(sEmbed);
    } else {
      if (memberDB.moderation.cases != null) {
        let embedsDesc = [];
        let sEmbed = new MessageEmbed()
          .setColor(cyan)
          .setTitle(
            `${
              message.mentions.members.first()
                ? message.mentions.members.first().user.username
                : message.author.username
            } cases`
          )
          .setFooter(
            `© ${message.guild.me.displayName}`,
            bot.user.displayAvatarURL()
          )
          .setThumbnail(
            message.mentions.members.first()
              ? message.mentions.members.first().user.displayAvatarURL()
              : message.author.displayAvatarURL()
          );
        let index = 0;
        memberDB.moderation.cases.forEach((x) => {
          index++;
          if (!embedsDesc[Math.floor(index / 10)])
            embedsDesc[Math.floor(index / 10)] = `Cases (${
              Math.floor(index / 10) * 10
            } to ${Math.floor(index / 10) * 10 + 10})\n`;
          embedsDesc[Math.floor(index / 10)] = `${
            embedsDesc[Math.floor(index / 10)]
          }${index}. ${x.type}\n`;
        });
        sEmbed.setDescription(embedsDesc[0]);
        let page = 0;
        await message.channel.send(sEmbed).then((msg) => {
          msg
            .react("⬅️")
            .then(() => msg.react("⏹️").then(() => msg.react("➡️")));

          const filter = (reaction, user) => {
            return (
              ["⬅️", "⏹️", "➡️"].includes(reaction.emoji.name) &&
              user.id === message.author.id
            );
          };

          const collector = msg.createReactionCollector(filter, {
            time: 30000,
          });
          collector.on("collect", (reaction, user) => {
            reaction.users.remove(message.author.id);
            if (reaction.emoji.name == "⬅️" && page > 0) {
              page--;
              sEmbed.setDescription(embedsDesc[page]);
              msg.edit(sEmbed);
            }
            if (reaction.emoji.name == "➡️" && page < embedsDesc.length - 1) {
              page++;
              sEmbed.setDescription(embedsDesc[page]);
              msg.edit(sEmbed);
            }
            if (reaction.emoji.name == "⏹️") {
              collector.stop();
            }
          });

          collector.on("end", (collected) => {
            msg.reactions
              .removeAll()
              .catch((error) =>
                console.error("Failed to clear reactions: ", error)
              );
          });
        });
      } else {
        const sEmbed = new MessageEmbed()
          .setColor(cyan)
          .setTitle(
            `${
              message.mentions.members.first()
                ? message.mentions.members.first().user.username
                : message.author.username
            } cases`
          )
          .setDescription("That member don't have any cases!")
          .setFooter(
            `© ${message.guild.me.displayName}`,
            bot.user.displayAvatarURL()
          )
          .setThumbnail(
            message.mentions.members.first()
              ? message.mentions.members.first().user.displayAvatarURL()
              : message.author.displayAvatarURL()
          );
        message.channel.send(sEmbed);
      }
    }
  },
};
