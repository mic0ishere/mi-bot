const {
    MessageEmbed
} = require("discord.js")
const config = require('./config.json')
const guild = require('../data/guilds')
const user = require('../data/users')
const member = require('../data/members')
const memberModel = require('../data/models/member')
const guildModel = require('../data/models/guild')
const userModel = require('../data/models/user')
module.exports = {

    message: (bot) => {
        bot.on('message', async message => {
            if (message.author.bot) return;
            if (message.channel.type === "dm") return;
            // Check guild/members settings
            await member.get({ id: message.author.id, guild: message.guild.id })
            await guild.get({ id: message.guild.id })
            await user.get({ id: message.author.id })
            const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id })
            const memberDB = await bot.db.members.findOne({ userId: message.author.id, guildId: message.guild.id })
            const userDB = await bot.db.users.findOne({ userId: message.author.id })
            let prefix = guildDB.general.prefix
            console.log(guildDB)
            console.log(memberDB)
            console.log(userDB)
            if (message.channel.id == "698260302076051586" && message.content != `${prefix}verify`) return message.delete()
            let args = message.content.slice(prefix.length).trim().split(' ');
            if (args[0] == `@!${bot.user.id}>` &&message.mentions.has(bot.user, {ignoreRoles: true, ignoreEveryone: true})) return message.channel.send(`My prefix is **${prefix}**. Check my commands by running **${prefix}help**`)
            let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (mentionMember && !await member.get({ id: mentionMember.id, guild: message.guild.id })) {
                await member.get({ id: mentionMember.id, guild: message.guild.id })
            }
            let cmd = args.shift().toLowerCase();
            let command;
            
            async function xpSystem() {
                if (guildDB.levels.on == false) return
                let xpAdd = Math.floor(Math.random() * 7) + 8;
                let curxp = memberDB.levels.xp;
                let curlvl = memberDB.levels.level;
                let nxtLvl = memberDB.levels.level * 300;
                let newxp = curxp + xpAdd
                if (nxtLvl < newxp) {
                    curlvl++
                    let lvlup = new MessageEmbed()
                    .setTitle("Level Up!")
                    .addField("New Level", curlvl);
                    message.channel.send(lvlup)
                }
                await memberModel.updateOne({ userId: message.author.id, guildId: message.guild.id}, { levels: {xp: newxp, level: curlvl}})
            }
            async function channelErr(value) {
                if (guildDB[value].on == false) return
                if (!message.guild.channels.cache.find(x => x.id == guildDB[value].channel)) {
                    await guildModel.updateOne({ guildId: message.guild.id }, { [value]: { on: false } })
                    message.channel.send(`Module \`${value}\` has been set to off due to a problems with finding a channel.\nCommand that you requested will be sent soon.`)
                }
            }
            if (!message.content.startsWith(prefix)) {
                return xpSystem()
            } else {
                if (bot.commands.has(cmd)) {
                    command = bot.commands.get(cmd);
                } else if (bot.aliases.has(cmd)) {
                    command = bot.commands.get(bot.aliases.get(cmd));
                }
                if (!command) return message.channel.send(`That command doesn't exist! Try typing ${prefix}help`)
                try {
                    channelErr("botchannel")
                    channelErr("logs")
                    if(userDB.globalBanned == true) return message.channel.send("You has been global-banned! That means you can no longer use Mi Bot!")
                    if (guildDB.botchannel.on == true) {
                        if (guildDB.botchannel.channel != message.channel.id && !command.help.overwrite) return xpSystem()
                    }
                    if(guildDB[command.help.category]) {
                        if (guildDB[command.help.category].on == false) return xpSystem()
                    }
                    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send("I don't have correct permissions to perform that command.")
                    if (!command.help.accessableby) return command.run(bot, message, args, config)
                    if (message.guild.owner.id == message.author.id) return command.run(bot, message, args, config)
                    if (message.author.id == "391636394625466378") return command.run(bot, message, args, config)
                    if (message.member.hasPermission([command.help.accessableby])) return command.run(bot, message, args, config)
                    else return message.channel.send("You don't have correct permissions to perform that command.")
                } catch (err) {
                    if (err) return console.log(err);
                }
            }

        });
    }

}