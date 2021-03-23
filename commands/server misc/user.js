const { MessageEmbed } = require("discord.js");
const { red_light } = require("../../global/colours.json");

module.exports = {
  help: {
    name: "userinfo",
    description: "",
    usage: "[@mention]",
    category: "server miscellaneous",
    aliases: ["userdesc", "rank", "level"],
  },
  run: async (bot, message, args) => {
    const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id });
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) {
      const uEmbed = new MessageEmbed()
        .setColor(red_light)
        .setTitle("User Info")
        .setThumbnail(message.author.displayAvatarURL())
        .setAuthor(
          `${message.author.username} Info`,
          message.author.displayAvatarURL()
        )
        .addField("**Username:**", `${message.author.username}`, true)
        .addField("**Discriminator:**", `${message.author.discriminator}`, true)
        .addField("**ID:**", `${message.author.id}`, true)
        .addField("**Created At:**", `${message.author.createdAt}`)
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      if (guildDB.levels.on == true) {
        const memberDB = await bot.db.members.findOne({
          userId: message.author.id,
          guildId: message.guild.id,
        });
        const curxp = memberDB.levels.xp;
        const curlvl = memberDB.levels.level;
        const nxtLvlXp = curlvl * 300;
        const difference = nxtLvlXp - curxp;
        uEmbed.addField("**Level**", curlvl, true);
        uEmbed.addField("**XP**", curxp, true);
        uEmbed.addField(`**XP till level up**`, difference, true);
      }
      message.channel.send(uEmbed);
    } else {
      const uEmbed = new MessageEmbed()
        .setColor(red_light)
        .setTitle("User Info")
        .setThumbnail(member.user.displayAvatarURL())
        .setAuthor(
          `${member.user.username} Info`,
          member.user.displayAvatarURL()
        )
        .addField("**Username:**", `${member.user.username}`, true)
        .addField("**Discriminator:**", `${member.user.discriminator}`, true)
        .addField("**ID:**", `${member.id}`, true)
        .addField("**Created At:**", `${member.user.createdAt}`)
        .setFooter(
          `© ${message.guild.me.displayName}`,
          bot.user.displayAvatarURL()
        );
      if (guildDB.levels.on == true) {
        const memberDB = await bot.db.members.findOne({
          userId: member.id,
          guildId: message.guild.id,
        });
        const curxp = memberDB.levels.xp;
        const curlvl = memberDB.levels.level;
        const nxtLvlXp = curlvl * 300;
        const difference = nxtLvlXp - curxp;
        uEmbed.addField("**Level**", curlvl, true);
        uEmbed.addField("**XP**", curxp, true);
        uEmbed.addField(`**XP till level up**`, difference, true);
      }
      message.channel.send(uEmbed);
    }
  },
};
