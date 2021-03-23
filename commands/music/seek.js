const { execQueue, getQueue, getYTLength } = require('../../global/music')
module.exports = { 
    help: {
        name: "seek",
        aliases: [""],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        var queue = getQueue(message.guild.id);
  if (!queue || queue.length == 0)
    return message.channel.send(`No music is playing!`);
  if (
    bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
    message.member.voice.channelID !==
      bot.player.players.get(bot.music.playingServers.get(message.guild.id)).vc
  )
    return message.channel.send(`You're not in the playing voice channel!`);

  var pos = args[0] * 1000;
  if (!pos || pos.length < 1)
    return message.channel.send(`You must define a position in seconds.`);

  message.channel.send(`Position set to ${getYTLength(pos)}`);
  bot.player.players
    .get(bot.music.playingServers.get(message.guild.id))
    .seek(pos);
    }
}