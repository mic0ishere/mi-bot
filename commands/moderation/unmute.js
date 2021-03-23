const utils = require("../../global/utils.js");

module.exports = {
  help: {
    name: "unmute",
    description: "",
    usage: "<@member> [reason]",
    category: "moderation",
    aliases: ["unm", "speak"],
    accessableby: "KICK_MEMBERS",
  },
  run: async (bot, message, args) => {
    const mutee =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!mutee) return utils.provide(message, "user to be unmuted");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given";

    const muterole = message.guild.roles.cache.find((r) => r.name === "Muted");
    if (!muterole) return message.channel.send("That member isn't muted!");

    mutee.roles.remove(muterole.id).then(() => {
      mutee
        .send(
          `Hello, you have been unmuted in ${message.guild.name} for: ${reason}`
        )
        .catch((err) => console.log(err));
      message.channel.send(`${mutee.user.username} was unmuted!`);
    });

    const type = "unmute";
    const member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    utils.createCase(type, reason, message, member, bot);
  },
};
