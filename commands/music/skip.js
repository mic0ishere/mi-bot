const { execQueue, getQueue, getYTLength } = require('../../global/music')
module.exports = { 
    help: {
        name: "skip",
        aliases: [""],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        try {
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
            var queue = getQueue(message.guild.id);
            if (!queue || queue.length == 0)
              return message.channel.send(`No music is playing!`);
              if (!message.member.voice.channelID ||
                bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
                message.member.voice.channelID !==
                  bot.player.players.get(bot.music.playingServers.get(message.guild.id)).vc
              )
                return message.channel.send(`You're not in the playing voice channel!`);
                if(isNaN(suffix[0])) return message.channel.send("You must specify number!")
            let howMany = 1;
            if (suffix[0]) howMany = Math.min(parseInt(suffix[0]), queue.length);
        
            queue.splice(0, howMany - 1);
            message.channel.send(`Skipped ${howMany} songs.`);
            bot.player.players
              .get(bot.music.playingServers.get(message.guild.id))
              .stop();
          } catch (err) {
            message.channel.send(
              `Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``
            );
          }
    }
}