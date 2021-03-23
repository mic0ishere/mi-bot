const utils = require("../../global/utils.js");

module.exports = {
    help: {
        name: "unban",
        description: "",
        usage: "<id> [reason]",
        category: "moderation",
        aliases: ["ub", "unbanish"],
        accessableby: "BAN_MEMBERS",
    },
    run: async (bot, message, args) => {
        if(!args[0]) return utils.provide(message, "user id to unban someone!")
        let bannedMember = await bot.users.fetch(args[0])
        if(!bannedMember) return utils.provide(message, "user id to unban someone!")

    let reason = args.slice(1).join(" ")
        if(!reason) reason = "No reason given!"

    try {
        message.guild.members.unban(bannedMember, reason)
        message.channel.send(`${bannedMember.tag} has been unbanned from the guild!`)
    } catch(e) {
        console.log(e.message)
    }

    let type = "unban"
    let member = bannedMember
    utils.createCase(type, reason, message, member, bot);
    }
}
