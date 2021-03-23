const { MessageEmbed } = require("discord.js")
const { execQueue, getQueue, getYTLength } = require('../../global/music')

module.exports = { 
    help: {
        name: "nowplaying",
        aliases: ["np", "now"],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        try {
            const player = bot.player.players.get(
              bot.music.playingServers.get(message.guild.id)
            );
            if (!player)
              // This actually isn't how you do it. I don't know the proper way, don't judge me.
              return message.channel.send("Currently not playing anything.");
        
            const queue = getQueue(message.guild.id);
        
            const embed = new MessageEmbed()
              .setAuthor(`Music - Now Playing`, bot.user.avatarURL)
              .setColor([255, 69, 0]).setDescription(`• **Title**: ${
              queue[0].info.title
            }
        • **Author**: ${queue[0].info.author}
        • **URL**: [${queue[0].info.uri}](${queue[0].info.uri})
        • **Length**: ${getYTLength(queue[0].info.length)}
                        `);
            message.channel.send({ embed });
          } catch (err) {
            message.channel.send(
              `Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``
            );
          }
    }
}