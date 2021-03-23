const { execQueue, getQueue, getYTLength, getSong } = require('../../global/music')
module.exports = { 
    help: {
        name: "leave",
        aliases: ["stop"],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        try {
            const queue = getQueue(message.guild.id);
            const player = bot.player.players.get(
              bot.music.playingServers.get(message.guild.id)
            );
            if (!player)
              return message.channel.send(`No music is playing in this guild!`);
              if (!message.member.voice.channelID ||
                bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
                message.member.voice.channelID !==
                  bot.player.players.get(bot.music.playingServers.get(message.guild.id)).vc
              )
                return message.channel.send(`You're not in the playing voice channel!`);
            queue.splice(0, queue.length);
            bot.player.leave(message.guild.id);
        
            message.channel.send(`Left the voice channel.`);
          } catch (err) {
            message.channel.send(
              `Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``
            );
          }
    }
}