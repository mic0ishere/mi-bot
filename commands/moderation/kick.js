const utils = require("../../global/utils.js");

module.exports = {
  help: {
    name: "kick",
    description: "",
    usage: "<@member> [reason]",
    category: "moderation",
    aliases: [],
    accessableby: "KICK_MEMBERS",
  },
  run: async (bot, message, args) => {
    const kickMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!kickMember) return utils.provide(message, "user to kick");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given!";

    kickMember
      .send(
        `Hello, you have been kicked from ${message.guild.name} for: ${reason}`
      )
      .then(() => kickMember.kick())
      .catch((err) => console.log(err));

    message.channel.send(`**${kickMember.user.tag}** has been kicked`);

    const type = "kick";
    const member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    utils.createCase(type, reason, message, member, bot);
  },
};
