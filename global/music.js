const superagent = require("superagent");
const bot = require("../index");
module.exports = {
  getQueue: (server) => {
    if (!bot.music.queues[server]) bot.music.queues[server] = [];
    return bot.music.queues[server];
  },

  getSong: async (string) => {
    return new Promise(async (resolve, rej) => {
      try {
        const res = await superagent
          .get(
            `${
              bot.music.lavalink.restnode.address
                ? bot.music.lavalink.restnode.address
                : `http://${bot.music.lavalink.restnode.host}:${bot.music.lavalink.restnode.port}`
            }/loadtracks?identifier=${encodeURIComponent(string)}`
          )
          .set({
            Authorization: bot.music.lavalink.restnode.password,
          });
        // I know this thing doesn't work.
        resolve(res.body.tracks);
      } catch (e) {
        resolve(e);
      }
    });
  },

  execQueue: async (message, queue, player) => {
    await player.play(queue[0].track);
    message.channel.send(`Now playing **${queue[0].info.title}**`);
    player.once("end", async () => {
      if (
        !bot.music.loops[message.guild.id] ||
        bot.music.loops[message.guild.id] == 0
      )
        queue.shift();
      else if (bot.music.loops[message.guild.id] == 2) {
        queue.push(queue[0]);
        queue.shift();
      }
      if (queue.length > 0) {
        setTimeout(() => {
          require("./music").execQueue(message, queue, player);
        }, 1000);
      } else {
        message.channel.send(`Queue is now empty! Leaving the voice channel.`);
        await bot.player.leave(message.guild.id);
        delete bot.music.queues[message.guild.id];
        if (bot.music.loops[message.guild.id])
          delete bot.music.loops[message.guild.id];
      }
    });
  },
  getYTLength: (millisec) => {
    // Credit: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hours = hours >= 10 ? hours : "0" + hours;
      minutes = minutes - hours * 60;
      minutes = minutes >= 10 ? minutes : "0" + minutes;
    }
    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    if (hours != "") {
      return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
  },
};
