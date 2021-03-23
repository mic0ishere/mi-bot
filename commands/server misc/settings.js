const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../global/colours.json");
const guildModel = require("../../data/models/guild");

module.exports = {
  help: {
    name: "settings",
    description: "",
    category: "utils",
    aliases: [],
    accessableby: "MANAGE_SERVER",
  },
  run: async (bot, message, args, config) => {
    //   This code is awful
    const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id });
    const prefix = guildDB.general.prefix;
    function embed(value) {
      const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle(`Module ${value}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          `Module **${args[0]}** has been ${value} by ${message.author}`
        )
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      message.channel.send(sEmbed);
    }
    function embedChannel(value, channel) {
      const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle(`Module ${value}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          `Module **${args[0]}** has been ${value} and configured to ${channel} by ${message.author}`
        )
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      message.channel.send(sEmbed);
    }
    async function changer() {
      if (args[0].toLowerCase() == "ticketsperms") {
        if (guildDB.tickets.perms == true) {
          await guildModel.updateOne(
            { guildId: message.guild.id },
            { tickets: { on: guildDB.tickets.on, perms: false } }
          );
          return embed("disabled");
        }
        if (guildDB.tickets.perms == false) {
          await guildModel.updateOne(
            { guildId: message.guild.id },
            { tickets: { on: guildDB.tickets.on, perms: true } }
          );
          return embed("enabled");
        }
        return embed("enabled");
      } else if (args[0].toLowerCase() == "moderation") {
        if (guildDB[args[0]].on == true) {
          await guildModel.updateOne(
            { guildId: message.guild.id },
            { [args[0]]: { on: false, cases: guildDB.moderation.cases } }
          );
          return embed("disabled");
        }
        if (guildDB[args[0]].on == false) {
          await guildModel.updateOne(
            { guildId: message.guild.id },
            { [args[0]]: { on: true, cases: guildDB.moderation.cases } }
          );
          return embed("enabled");
        }
      } else {
        if (guildDB[args[0]].on == true) {
          await guildModel.updateOne(
            { guildId: message.guild.id },
            { [args[0]]: { on: false } }
          );
          return embed("disabled");
        }
        if (guildDB[args[0]].on == false) {
          await guildModel.updateOne(
            { guildId: message.guild.id },
            { [args[0]]: { on: true } }
          );
          return embed("enabled");
        }
      }
    }
    async function changerChannel() {
      if (guildDB[args[0]].on == false) {
        const channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("You must mention channel!");
        await guildModel.updateOne(
          { guildId: message.guild.id },
          { [args[0]]: { on: true, channel: channel.id } }
        );
        return embedChannel("enabled", channel);
      }
      if (guildDB[args[0]].on == true) {
        await guildModel.updateOne(
          { guildId: message.guild.id },
          { [args[0]]: { on: false, channel: null } }
        );
        return embed("disabled");
      }
    }
    function checkData(module) {
      if (module == "ticketsPerms") {
        if (guildDB.tickets.perms == true) return "on";
        else return "off";
      } else {
        if (guildDB[module].on == true) return "on";
        else return "off";
      }
    }
    if (!args[0]) {
      const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle("Settings help")
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          `To see status of every modules type ${prefix}settings status`
        )
        .addField(
          `Lobby`,
          `You can set the channel when members join/leave your server.\n\`${prefix}settings botchannel [#channel]\``
        )
        .addField(
          `Prefix`,
          `You can set new prefix or see old one\n\`${prefix}settings prefix [newPrefix]\``
        )
        .addField(
          `Logs`,
          `You can turn on/off messages when someone event is triggered. List of events:\n\`${prefix}settings events\`Channel set: \n\`${prefix}settings logs [#channel]\``
        )
        .addField(
          `Modules help`,
          `You can turn on/off modules like moderation.\n\`${prefix}settings modules\``
        )
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      return message.channel.send(sEmbed);
    } else if (args[0].toLowerCase() == "prefix") {
      if (!args[1])
        return message.channel.send(
          `Current prefix: **${guildDB.general.prefix}**`
        );
      else {
        await guildModel.updateOne(
          { guildId: message.guild.id },
          { general: { prefix: args[1] } }
        );
        const sEmbed = new MessageEmbed()
          .setColor(cyan)
          .setTitle(`Prefix`)
          .setThumbnail(message.guild.iconURL())
          .setDescription(
            `Prefix has been changed and configured to **${args[1]}** by ${message.author}`
          )
          .setFooter(
            `© ${message.guild.me.displayName}`,
            bot.user.displayAvatarURL()
          );
        message.channel.send(sEmbed);
      }
    } else if (args[0].toLowerCase() == "logs") {
      changerChannel();
    } else if (args[0].toLowerCase() == "lobby") {
      changerChannel();
    } else if (args[0].toLowerCase() == "botchannel") {
      changerChannel();
    } else if (args[0].toLowerCase() == "levels") {
      changer();
    } else if (args[0].toLowerCase() == "miscellanous") {
      changer();
    } else if (args[0].toLowerCase() == "moderation") {
      changer();
    } else if (args[0].toLowerCase() == "images") {
      changer();
    } else if (args[0].toLowerCase() == "tickets") {
      changer();
    } else if (args[0].toLowerCase() == "ticketsperms") {
      changer();
    } else if (args[0].toLowerCase() == "status") {
      const lobbyRespond = "off",
        botchannelRespond = "off",
        logsRespond = "off";
      if (guildDB.lobby.on == true) {
        lobbyRespond = `on, points to ${message.guild.channels.cache.find(
          (m) => m.id === guildDB.lobby.channel
        )}`;
      }
      if (guildDB.botchannel.on == true) {
        botchannelRespond = `on, points to ${message.guild.channels.cache.find(
          (m) => m.id === guildDB.botchannel.channel
        )}`;
      }
      if (guildDB.logs.on == true) {
        logsRespond = `on, points to ${message.guild.channels.cache.find(
          (m) => m.id === guildDB.logs.channel
        )}`;
      }
      const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle("Status of settings")
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          `
        Lobby: ${lobbyRespond}
        Bot channel: ${botchannelRespond}
        Logs: ${logsRespond}
        Levels: ${checkData("levels")}
        Miscellanous: ${checkData("miscellanous")}
        Moderation: ${checkData("moderation")}
        Images: ${checkData("images")}
        Tickets: ${checkData("tickets")}
        TicketsPerms: ${checkData("ticketsPerms")}`
        )
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      return message.channel.send(sEmbed);
    } else if (args[0].toLowerCase() == "modules") {
      const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle("**Informations about modules:**")
        .setDescription(
          `If you want to turn off or on modules that are listed below type \`${prefix}settings <module-name>\`. At some cases to turn it on you must mention a channel - \`${prefix}settings <module-name> <#channel>\``
        )
        .setThumbnail(message.guild.iconURL())
        .addField(
          `Levels`,
          `Gaining XP and commands to check its level in members\nUsage: \`${prefix}settings levels\``
        )
        .addField(
          `Miscellanous`,
          `Commands from miscellanous category in \`${prefix}help\`\nUsage: \`${prefix}settings miscellanous\``
        )
        .addField(
          `Moderation`,
          `Commands from moderation category in \`${prefix}help\`, like kick and ban\nUsage: \`${prefix}settings moderation\``
        )
        .addField(
          `Images`,
          `Commands from images category in \`${prefix}help\`\nUsage: \`${prefix}settings images\``
        )
        .addField(
          `Tickets`,
          `Temporary voice & texts channels\nUsage: \`${prefix}settings tickets\``
        )
        .addField(
          `TicketsPerms`,
          `Changes settings of possibility for the user, after creating a ticket, to edit it (rename and change permissions).\nOn - grants permissions\nUsage: \`${prefix}settings ticketsPerms\``
        )
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      return message.channel.send(sEmbed);
    } else if (args[0].toLowerCase() == "events") {
      const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle("Logs events list")
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          `
        When member joins/leaves - Always works
        When report is filled - Works when moderation module is on
        When member is being muted, kicked, banned or role is added to member - Works when moderation module is on`
        )
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      return message.channel.send(sEmbed);
    }
  },
};
