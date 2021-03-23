const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { cyan } = require("../../global/colours.json");

module.exports = {
  help: {
    name: "help",
    aliases: ["h", "commands"],
    usage: "[command]",
    category: "utils",
    description: "Displays all commands that the bot has.",
  },
  run: async (bot, message, args) => {
    const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id });
    const prefix = guildDB.general.prefix;
    const embed = new MessageEmbed()
      .setColor(cyan)
      .setAuthor(
        `${message.guild.me.displayName} Help`,
        message.guild.iconURL()
      )
      .setThumbnail(bot.user.displayAvatarURL);

    if (!args[0]) {
      const categories = [
        "miscellaneous",
        "moderation",
        "server miscellaneous",
        "utils",
        "music",
        "images",
        "tickets",
      ];
      embed.setDescription(`The bot prefix is: **${prefix}**`);
      embed.setFooter(
        `© ${message.guild.me.displayName}`,
        bot.user.displayAvatarURL()
      );
      categories.forEach((category) => {
        const dir = bot.commands.filter((c) => c.help.category === category);
        const capitalise =
          category.slice(0, 1).toUpperCase() + category.slice(1);
        try {
          embed.addField(
            `❯ ${capitalise} [${dir.size}]:`,
            `${dir.map((c) => `\`${c.help.name}\``).join(" ")}`
          );
        } catch (e) {
          console.log(e);
        }
      });

      return message.channel.send(embed);
    } else {
      const command = bot.commands.get(
        bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase()
      );
      if (!command)
        return message.channel.send(
          embed
            .setTitle("Invalid Command.")
            .setDescription(
              `Do \`${prefix}help\` for the list of the commands.`
            )
        );
      command = command.help;
      const aliases = command.aliases;
      if (aliases.length <= 0) aliases = "";
      else aliases = `**Aliases:** ${command.aliases.join(", ")}`;
      const perms = command.accessableby;
      if (!perms) perms = "";
      else perms = `**Permissions needed:** \`${command.accessableby}\`\n`;
      embed.setDescription(stripIndents`The bot's prefix is: \`${prefix}\`\n
            **Command:** ${
              command.name.slice(0, 1).toUpperCase() + command.name.slice(1)
            }
            **Description:** ${
              command.description || "No Description provided."
            }
            **Usage:** ${
              command.usage
                ? `\`${prefix}${command.name} ${command.usage}\``
                : `${prefix}${command.name}`
            }
            ${perms}${aliases}`);

      return message.channel.send(embed);
    }
  },
};
