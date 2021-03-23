const config = require("./config.json");
const MessageEmbed = require("discord.js");
module.exports = {
  ready: async (bot) => {
    await bot.login(config.discord.token);
    bot.on("ready", async () => {
      bot.user.setActivity(`@${bot.user.username}`, { type: "WATCHING" });
      // this shit which was adding roles in mi bot server
      // const messages = await bot.channels.cache.find(x => x.id == '740913981769908244' && x.type == 'text').messages.fetch()
      // const collector = await messages.get('740914806579527710').createReactionCollector((reaction, user) => reaction.emoji.name === '🇵🇱' || reaction.emoji.name === '🇬🇧')
      // collector.on('collect', async (r, user) => {
      //     let member = r.message.guild.members.cache.get(user.id)
      //     if(r.emoji.name == '🇵🇱') {
      //       !member.roles.cache.has('697944050367594616')
      //       ? await member.roles.add(r.message.guild.roles.cache.get('697944050367594616'))
      //       : await member.roles.remove(r.message.guild.roles.cache.get('697944050367594616'))
      //     }
      //     if(r.emoji.name == '🇬🇧') {
      //       !member.roles.cache.has('740911724734971947')
      //       ? await member.roles.add(r.message.guild.roles.cache.get('740911724734971947'))
      //       : await member.roles.remove(r.message.guild.roles.cache.get('740911724734971947'))
      //     }
      // })
    });
  },
  guildAdd: async (bot) => {
    bot.on("guildCreate", async (guild) => {
      const invite = await guild.channels.cache
        .find((x) => x.type != "category")
        .createInvite({ maxAge: 0 });
      let welcomeEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`I joined the server`)
        .setThumbnail(guild.iconURL)
        .addField("**Name:**", `${guild.name}`, true)
        .addField("**ID:**", `${guild.id}`, true)
        .addField("**Time joined:**", `${guild.joinedAt}`, true)
        .addField("**Guilds count:**", `${bot.guilds.cache.size}`)
        .setURL(`https://discord.gg/${invite.code}`);
      bot.channels.cache.get("696041115471839328").send(welcomeEmbed);
    });
  },
};
