module.exports = { 
    help: {
        name: "volume",
        aliases: ["vol"],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id })
        const msg = message.content.trim();
  const command = msg
    .substring(guildDB.general.prefix.length)
    .split(/[ \n]/)[0]
    .toLowerCase()
    .trim();
  const suffix = msg
    .substring(guildDB.general.prefix.length + command.length)
    .trim()
    .split(" ");
        try {
            const player = bot.player.players.get(
              bot.music.playingServers.get(message.guild.id)
            );
            if (!player) return message.channel.send("No music playing!");
            if (!message.member.voice.channelID ||
              bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
              message.member.voice.channelID !==
                bot.player.players.get(bot.music.playingServers.get(message.guild.id)).vc
            )
              return message.channel.send(`You're not in the playing voice channel!`);
        
            const volume = parseInt(suffix[0]) || 50;
            if (volume < 0 || volume > 100)
              // Limit the volume cuz fucking hell volume can be high
              return message.channel.send(`Volume can't be below 0 or above 100!`);
        
            player.volume(volume);
        
            message.channel.send(`Set the volume to ${volume}!`);
          } catch (err) {
            message.channel.send(
              `Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``
            );
          }
    }
}