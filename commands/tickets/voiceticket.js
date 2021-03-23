const memberModel = require('../../data/models/member')
module.exports = {
    help: {
        name: "voiceticket",
        description: "",
        usage: "",
        category: "tickets",
        aliases: ["vc"]
    },
    run: async (bot, message, args) => {
        const memberDB = await bot.db.members.findOne({ userId: message.author.id, guildId: message.guild.id })
        const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id })
        const guild = message.guild;
        if(memberDB.tickets.voice != null && guild.channels.cache.find(ch => ch.id == memberDB.tickets.voice)) return message.channel.send(`${message.author}, you already own a ticket!`)
    
        guild.channels.create(`${message.author.username}`, {
            type: "voice",
            parent: message.channel.parent,
            permissionOverwrites: [
              {
                allow: guildDB.tickets.perms == true ? ["CONNECT", "MANAGE_CHANNELS", "VIEW_CHANNEL"] : ["CONNECT", "VIEW_CHANNEL"],
                id: message.author.id,
              },
              {
                deny: "VIEW_CHANNEL",
                id: guild.id,
              },
            ],
          })
          .then(async (ch) => {
            message.channel.send(`${message.author}, your ticket, \`${ch.name}\` has been created.`)
            await memberModel.updateOne({ userId: message.author.id, guildId: message.guild.id}, { tickets: { voice: ch.id, text: memberDB.tickets.text}  })
          }).catch(err => console.log(err));
    }
}