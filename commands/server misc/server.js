const { MessageEmbed } = require("discord.js")
const { cyan } = require("../../global/colours.json");

module.exports = {
    help: {
        name: "serverinfo",
        description: "",
        category: "server miscellaneous",
        aliases: ["serverdesc"]
    },
    run: async (bot, message, args) => {
    const sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle("Server Info")
        .setThumbnail(message.guild.iconURL())
        .setAuthor(`${message.guild.name} Info`, message.guild.iconURL())
        .addField("**Guild Name:**", `${message.guild.name}`, true)
        .addField("**Guild Owner:**", `${message.guild.owner}`, true)
        .addField("**Member Count:**", `${message.guild.memberCount}`, true)
        .addField("**Role Count:**", `${message.guild.roles.cache.size}`, true)
        .setFooter(`© ${message.guild.me.displayName}`, bot.user.displayAvatarURL());
    message.channel.send(sEmbed);
    }
}