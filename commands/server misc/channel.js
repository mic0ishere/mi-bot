const { MessageEmbed } = require("discord.js")
const { red_light } = require("../../global/colours.json");

module.exports = {
    help: {
        name: "channelinfo",
        description: "",
        usage: "[#mention]",
        category: "server miscellaneous",
        aliases: ["channeldesc"]
    },
    run: async (bot, message, args) => { 
        if(!message.mentions.channels.first()) {
        const uEmbed = new MessageEmbed()
        .setColor(red_light)
        .setTitle("Channel Info")
        .setThumbnail(message.guild.iconURL)
        .setAuthor(`${message.channel.name} Info`, message.author.displayAvatarURL())
        .addField("**Name:**", `${message.channel.name}`, true)
        .addField("**Topic:**", `${message.channel.topic || "No topic set"}`, true)
        .addField("**ID:**", `${message.channel.id}`, true)
        .addField("**Created At:**", `${message.channel.createdAt}`, true)
        .setFooter(`© ${message.guild.me.displayName}`, bot.user.displayAvatarURL());

        message.channel.send(uEmbed);
        } else {
            const channel = message.mentions.channels.first()
            const uEmbed = new MessageEmbed()
            .setColor(red_light)
            .setTitle("Channel Info")
            .setAuthor(`${channel.name} Info`, message.author.displayAvatarURL())
            .addField("**Name:**", `${channel.name}`, true)
            .addField("**Topic:**", `${channel.topic || "No topic set"}`, true)
            .addField("**ID:**", `${channel.id}`, true)
            .addField("**Created At:**", `${channel.createdAt}`, true)
            .setFooter(`© ${message.guild.me.displayName}`, bot.user.displayAvatarURL());
    
            message.channel.send(uEmbed);
    }
}
}
