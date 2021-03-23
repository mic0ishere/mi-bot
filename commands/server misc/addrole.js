const utils = require("../../global/utils.js")

module.exports= {
    help: {
        name: "addrole",
        description: "",
        usage: "<@member> <role> [reason]",
        category: "server miscellaneous",
        accessableby: "MANAGE_ROLES",
        aliases: ["ar", "roleadd"]
    },
    run: async (bot, message, args) => {

    const rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!rMember) return utils.provide(message, "user to add role to.")
    const role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first()
    if(!role) return utils.provide(message, "role")
    let reason = args.slice(2).join(" ")
    if(!reason) reason = "No reason given!"
    if(rMember.roles.cache.has(role.id)) {
        return message.channel.send(`${rMember.displayName}, already has the role!`)
    } else {
        await rMember.roles.add(role.id).catch(e => console.log(e.message))
        message.channel.send(`The role, ${role.name}, has been added to ${rMember.displayName}.`)
    }
    }
}