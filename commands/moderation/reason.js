const memberModel = require("../../data/models/member");

module.exports = {
  help: {
    name: "reason",
    description: "",
    usage: "<number> <@mention> <reason>",
    category: "moderation",
    aliases: [""],
    accessableby: "",
  },
  run: async (bot, message, args) => {
    const member = message.mentions.members.first()
      ? message.mentions.members.first().user
      : message.guild.members.cache.get(args[0]);
    if (!args[0] || isNaN(args[0]) || !member || !args[2])
      return message.channel.send("You need to provide vaild arguments.");
    const memberDB = await bot.db.members.findOne({
      userId: member.id,
      guildId: message.guild.id,
    });
    if (
      memberDB.moderation.cases == null ||
      !memberDB.moderation.cases[
        memberDB.moderation.cases.length - Number(args[0])
      ]
    )
      return message.channel.send("That member doesn't have that case!");
    else {
      const perms =
        memberDB.moderation.cases[
          memberDB.moderation.cases.length - Number(args[0])
        ].type == "ban" ||
        memberDB.moderation.cases[
          memberDB.moderation.cases.length - Number(args[0])
        ].type == "unban"
          ? "BAN_MEMBERS"
          : "KICK_MEMBERS";
      if (!message.member.hasPermission([perms]))
        return message.channel.send("You don't have correct permissions!");
      memberDB.moderation.cases[
        memberDB.moderation.cases.length - Number(args[0])
      ].reason = args.slice(2).join(" ");
      await memberModel.updateOne(
        { userId: member.id, guildId: message.guild.id },
        { moderation: { cases: memberDB.moderation.cases } }
      );
      return message.channel.send(`${member} case has been edited!`);
    }
  },
};
