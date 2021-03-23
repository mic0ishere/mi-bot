const utils = require('../../global/utils.js');

module.exports = { 
    help: {
        name: "report",
        description: "",
        usage: "<@member> <reason>",
        category: "moderation",
        aliases: []
    },
    run: async (bot, message, args) => {
        message.deconste()
        const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id })
        if(guildDB.logs.on == false) return message.channel.send("That command is avaliable only when logs module is on! Message server administrator to enable that module.")
        // mentioned or grabbed user
        const target = message.mentions.members.first() || message.guild.members.get(args[0])
        if(!target) return utils.provide("valid user")

        // reasoning definition
        const reason = args.slice(1).join(" ")
        if(!reason) return utils.provide(`reason for reporting **${target.user.tag}**`)

        // grab reports channel
        const sChannel = message.guild.channels.find(x => x.id == guildDB.logs.channel)

        // send to reports channel and add tick or cross

        message.channel.send("Your report has been filed to the staff team. Thank you!").then(m => m.deconste(15000))
        sChannel.send(`**${message.author.tag}** has reported **${target.user.tag}** for **${reason}**.`).then(async msg => {
            await msg.react("✅")
            await msg.react("❌")
        })

  }
}
