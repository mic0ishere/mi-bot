const { execQueue, getQueue, getYTLength } = require('../../global/music')
module.exports = { 
    help: {
        name: "loop",
        aliases: [""],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        if (!bot.player.players.get(bot.music.playingServers.get(message.guild.id)))
    return message.channel.send(`No music playing`);
    if (
      bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
      message.member.voice.channelID !==
        bot.player.players.get(bot.music.playingServers.get(message.guild.id)).vc
    )
      return message.channel.send(`You're not in the playing voice channel!`);
  if (!bot.music.loops[message.guild.id]) bot.music.loops[message.guild.id] = 0;

  if (!args[0]) {
    if (bot.music.loops[message.guild.id] == 0) {
      message.channel.send(
        `Arguments not found. Looping one song only :repeat_one:\n\n**Note**: \`off\` is to turn off loop, \`one\` is to loop one song, \`multi/all\` is to loop the whole queue.`
      );
      bot.music.loops[message.guild.id] = 1;
    } else {
      message.channel.send(
        `Arguments not found. Loop disabled.\n\n**Note**: \`off\` is to turn off loop, \`one\` is to loop one song, \`multi/all\` is to loop the whole queue.`
      );
      bot.music.loops[message.guild.id] = 0;
    }
  } else {
    var ar = args[0].toLowerCase();
    if (ar == "off") {
      bot.music.loops[message.guild.id] = 0;
      message.channel.send(`Loop disabled.`);
    } else if ( ar == "one") {
      bot.music.loops[message.guild.id] = 1;
      message.channel.send(`Loop set to one song. :repeat_one:`);
    } else if (ar == "multi" || ar == "all") {
      bot.music.loops[message.guild.id] = 2;
      message.channel.send(`Loop set to multiple songs. :repeat:`);
    } else {
      message.channel.send(
        `Invalid loop type. \n\`off\` is to turn off loop, \`one\` is to loop one song, \`multi/all\` is to loop the whole queue.`
      );
    }
  }
    }
}