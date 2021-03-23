const utils = require("../../global/utils.js")

module.exports = {
    help: {
        name: "removerole",
        description: "",
        usage: "<@member> <role> [reason]",
        category: "server miscellaneous",
        aliases: ["rr", "roleremove"],
        accessableby: "MANAGE_ROLES",
    },
    run: async (bot, message, args) => {
    const rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!rMember) return utils.provide(message, "user to remove a role")
    const role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first()
    if(!role) return utils.provide(message, "role") 
    let reason = args.slice(2).join(" ")
    if(!reason) reason = "No reason given!"
    if(!rMember.roles.cache.has(role.id)) {
        return message.channel.send(`${rMember.displayName}, doesn't have that role!`)
    } else {
        await rMember.roles.remove(role.id).catch(e => console.log(e.message))
        message.channel.send(`The role, ${role.name}, has been removed from ${rMember.displayName}.`)
    }
    }   
}