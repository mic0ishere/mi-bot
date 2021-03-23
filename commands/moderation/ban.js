const utils = require("../../global/utils.js");

module.exports = {
  help: {
    name: "ban",
    description: "",
    usage: "<@member> [reason]",
    category: "moderation",
    aliases: ["banish", "remove"],
    accessableby: "BAN_MEMBERS",
  },
  run: async (bot, message, args) => {
    const banMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!banMember) return utils.provide(message, "user to ban");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given!";

    banMember
      .send(
        `Hello, you have been banned from ${message.guild.name} for: ${reason}`
      )
      .then(() =>
        message.guild.members.ban(banMember, {
          days: 1,
          reason: reason,
        })
      )
      .catch((err) => undefined);

    message.channel.send(`**${banMember.user.tag}** has been banned`);

    const type = "ban";
    const member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    utils.createCase(type, reason, message, member, bot);
  },
};
