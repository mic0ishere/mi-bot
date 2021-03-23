module.exports = { 
    help: {
        name: "pause",
        aliases: [""],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        try {
            const player = bot.player.players.get(
              bot.music.playingServers.get(message.guild.id)
            );
            if (!bot.player.players.get(bot.music.playingServers.get(message.guild.id)))
              return message.channel.send(`No music is being played in this guild.`);
              if (!message.member.voice.channelID ||
                bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
                message.member.voice.channelID !==
                  bot.player.players.get(bot.music.playingServers.get(message.guild.id)).vc
              )
                return message.channel.send(`You're not in the playing voice channel!`);
            player.pause(true);
            message.channel.send(`Paused the player!`);
          } catch (err) {
            message.channel.send(
              `Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``
            );
          }
    }
}