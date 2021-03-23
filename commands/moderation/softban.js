const utils = require("../../global/utils.js");

module.exports = {
  help: {
    name: "softban",
    description: "",
    usage: "<@member> [reason]",
    category: "moderation",
    aliases: ["sb", "sbanish", "sremove"],
    accessableby: "BAN_MEMBERS",
  },
  run: async (bot, message, args) => {
    let banMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!banMember) return utils.provide(message, "user to ban");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given!";
    await banMember.send(
      `Hello, you have been banned from ${message.guild.name} for: ${reason}`
    );
    let unban = banMember.id;
    message.guild.members
      .ban(banMember, {
        days: 1,
        reason: reason,
      })
      .then(() =>
        message.guild.members
          .unban(unban, reason)
          .catch((err) => console.log(err))
      );

    message.channel
      .send(`**${banMember.user.tag}** has been banned`)
      .then((m) => m.delete(5000));

    let type = "softban";
    let member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    utils.createCase(type, reason, message, member, bot);
  },
};
