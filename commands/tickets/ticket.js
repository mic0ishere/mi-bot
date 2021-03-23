const { cyan } = require("../../global/colours.json")
const { MessageEmbed } = require("discord.js")
const memberModel = require('../../data/models/member')
module.exports = {
    help: {
        name: "ticket",
        description: "",
        usage: "",
        category: "tickets",
        aliases: ["tc"]
    },
    run: async (bot, message, args) => {
        const memberDB = await bot.db.members.findOne({ userId: message.author.id, guildId: message.guild.id })
        const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id })
        const guild = message.guild;
        if(memberDB.tickets.text != null && guild.channels.cache.find(ch => ch.id == memberDB.tickets.text)) return message.channel.send(`${message.author}, you already own a ticket!`)

        guild.channels.create(`${message.author.username}`, {
            type: "text",
            parent: message.channel.parent,
            permissionOverwrites: [
              {
                allow: guildDB.tickets.perms == true ? ["MANAGE_CHANNELS", "VIEW_CHANNEL"] : ["VIEW_CHANNEL"],
                id: message.author.id,
              },
              {
                deny: "VIEW_CHANNEL",
                id: guild.id,
              },
            ],
          })
          .then(async (ch) => {
            message.channel.send(
              `${message.author}, your ticket, ${ch} has been created. You can manage your channel in the way you want!`
            );
            const sEmbed = new MessageEmbed()
              .setColor(cyan)
              .setTitle(`Ticket channel`)
              .setDescription(
                `${message.author}, it is your ticket channel! You can manage that channel in the ways you want by using commands from Tickets category`
              )
              .setFooter(
                `Owner ID: ${message.author.id}`,
                message.author.displayAvatarURL
              );
            ch.send(sEmbed);
            await memberModel.updateOne({ userId: message.author.id, guildId: message.guild.id}, { tickets: { text: ch.id, voice: memberDB.tickets.voice} })
          }).catch(err => console.log(err));
    }
}