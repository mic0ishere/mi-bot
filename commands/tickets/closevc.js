const memberModel = require('../../data/models/member');
const { ReactionCollector } = require('discord.js');
module.exports = {
  help: {
    name: "closevc",
    description: "",
    usage: "",
    category: "tickets",
    aliases: ['closevoiceticket'],
  },
  run: async (bot, message, args) => {
    const channelMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(channelMember && message.member.hasPermission("MANAGE_CHANNELS")) {
        const memberDB = await bot.db.members.findOne({ userId: channelMember.id, guildId: message.guild.id })
        const channel = message.guild.channels.cache.find(ch => ch.id == memberDB.tickets.voice)
        if(memberDB.tickets.voice != null && channel) {
            return message.channel.send(`Close ${channelMember}'s voice ticket, ${channel.name}?`).then(async msg => {
                await msg.react("✅")
                await msg.react("❌")
                const reaction = new ReactionCollector(msg, (reaction, user) => user.id == message.author.id)
                reaction.on('collect', async r => {
                    if(r.emoji.name == "✅") {
                        await msg.reactions.removeAll()
                        await channel.delete()
                        await memberModel.updateOne({ userId: channelMember.id, guildId: message.guild.id}, { tickets: { voice: null, text: memberDB.tickets.text}  })
                        reaction.stop()    
                        return message.channel.send(`${channelMember}'s voice ticket has been closed!`)
                    } else if(r.emoji.name == "❌") {
                        await msg.reactions.removeAll()
                        reaction.stop()
                        return message.channel.send(`Voice ticket closing was cancelled`)
                    } else return
            });
                reaction.on('end', () => {})
            })
            
        }
    }
    const memberDB = await bot.db.members.findOne({ userId: message.author.id, guildId: message.guild.id })
    const channel = message.guild.channels.cache.find(ch => ch.id == memberDB.tickets.voice)
    if(!channel) return message.channel.send("You don't have any tickets!")
    message.channel.send(`Close your voice ticket, ${channel.name}?`).then(async msg => {
        await msg.react("✅")
        await msg.react("❌")
        const reaction = new ReactionCollector(msg, (reaction, user) => user.id == message.author.id)
        reaction.on('collect', async r => {
            if(r.emoji.name == "✅") {
                await msg.reactions.removeAll()
                await channel.delete()
                await memberModel.updateOne({ userId: message.author.id, guildId: message.guild.id}, { tickets: { voice: null, text: memberDB.tickets.text}  })
                reaction.stop()    
                return message.channel.send(`Your voice ticket has been closed!`)
            } else if(r.emoji.name == "❌") {
                await msg.reactions.removeAll()
                reaction.stop()
                return message.channel.send(`Voice ticket closing was cancelled`)
            } else return
    });
        reaction.on('end', () => {})
    })
  },
};