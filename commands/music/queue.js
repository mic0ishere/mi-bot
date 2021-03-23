const { 
    MessageEmbed
 } = require("discord.js")
const { execQueue, getQueue, getYTLength } = require('../../global/music')
module.exports = { 
    help: {
        name: "queue",
        aliases: [""],
        description: "",
        category: "music"
    },
    run: async (bot, message, args) => {
        const queue = getQueue(message.guild.id);
  if (!bot.player.players.get(bot.music.playingServers.get(message.guild.id)))
    return message.channel.send(`No music is being played in this guild.`);
      let index = 1;
      let string = "";

          if(queue[0]) string += `__**Currently Playing**__\n ${queue[0].info.title} - **${getYTLength(queue[0].info.length)}**.\n`;
          if(queue[1]) string += `__**Rest of queue:**__\n ${queue.slice(1, 10).map(x => `**${index++}:** ${x.info.title} - **${getYTLength(x.info.length)}**.`).join("\n")}`;

      const embed = new MessageEmbed()
          .setAuthor(`Current Queue for ${message.guild.name}`, message.guild.iconURL)
          .setDescription(string);

      return message.channel.send(embed);
    }
}