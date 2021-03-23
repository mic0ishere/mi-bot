const {
  execQueue,
  getQueue,
  getYTLength,
  getSong,
} = require("../../global/music");
module.exports = {
  help: {
    name: "shuffle",
    aliases: [""],
    description: "",
    category: "music",
  },
  run: async (bot, message, args) => {
    var queue = getQueue(message.guild.id);
    if (!queue || queue.length == 0)
      return message.channel.send(`No music is playing!`);
    if (
      !message.member.voice.channelID ||
      (bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
        message.member.voice.channelID !==
          bot.player.players.get(bot.music.playingServers.get(message.guild.id))
            .vc)
    )
      return message.channel.send(`You're not in the playing voice channel!`);
    const song = queue[0];
    queue.shift();
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = queue[i];
      queue[i] = queue[j];
      queue[j] = temp;
    }
    queue.unshift(song);
    return message.channel.send("Shuffled the queue");
  },
};
