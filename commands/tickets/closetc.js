const memberModel = require('../../data/models/member');
const { ReactionCollector } = require('discord.js');
module.exports = {
  help: {
    name: "closetc",
    description: "",
    usage: "",
    category: "tickets",
    aliases: ["closeticket"],
  },
  run: async (bot, message, args) => {
    const channelMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(channelMember && message.member.hasPermission("MANAGE_CHANNELS")) {
        const memberDB = await bot.db.members.findOne({ userId: channelMember.id, guildId: message.guild.id })
        const channel = message.guild.channels.cache.find(ch => ch.id == memberDB.tickets.text)
        if(memberDB.tickets.text != null && channel) {
            return message.channel.send(`Close ${channelMember}'s ticket, ${channel}?`).then(async msg => {
                await msg.react("✅")
                await msg.react("❌")
                const reaction = new ReactionCollector(msg, (reaction, user) => user.id == message.author.id)
                reaction.on('collect', async r => {
                    if(r.emoji.name == "✅") {
                        await msg.reactions.removeAll()
                        await channel.delete()
                        await memberModel.updateOne({ userId: channelMember.id, guildId: message.guild.id}, { tickets: { voice: memberDB.tickets.voice, text: null}  })
                        reaction.stop()    
                        return message.channel.send(`${channelMember}'s ticket has been closed!`)
                    } else if(r.emoji.name == "❌") {
                        await msg.reactions.removeAll()
                        reaction.stop()
                        return message.channel.send(`Ticket closing was cancelled`)
                    } else return
            });
                reaction.on('end', () => {})
            })
            
        }
    }
    const memberDB = await bot.db.members.findOne({ userId: message.author.id, guildId: message.guild.id })
    const channel = message.guild.channels.cache.find(ch => ch.id == memberDB.tickets.text)
    if(!channel) return message.channel.send("You don't have any tickets!")
    message.channel.send(`Close your ticket, ${channel}?`).then(async msg => {
        await msg.react("✅")
        await msg.react("❌")
        const reaction = new ReactionCollector(msg, (reaction, user) => user.id == message.author.id)
        reaction.on('collect', async r => {
            if(r.emoji.name == "✅") {
                await msg.reactions.removeAll()
                await channel.delete()
                await memberModel.updateOne({ userId: message.author.id, guildId: message.guild.id}, { tickets: { voice: memberDB.tickets.voice, text: null}  })
                reaction.stop()    
                return message.channel.send(`Your ticket has been closed!`)
            } else if(r.emoji.name == "❌") {
                await msg.reactions.removeAll()
                reaction.stop()
                return message.channel.send(`Ticket closing was cancelled`)
            } else return
    });
        reaction.on('end', () => {})
    })
  },
};
