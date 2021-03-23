const userModel = require("../../data/models/user");
const utils = require("../../global/utils.js");

module.exports = {
  help: {
    name: "gban",
    aliases: [],
    usage: "",
    category: "owner",
    description: "Globally bans member",
  },
  run: async (bot, message, args) => {
    if (message.author.id !== "391636394625466378") return;
    const banMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!banMember) return utils.provide(message, "user to gban");
    const userDB = await bot.db.users.findOne({ userId: banMember.id });
    if (userDB.globalBanned == true) return message.channel.send("That user is already gbanned!");
    await userModel.updateOne({ userId: banMember.id }, { globalBanned: true })
    return message.channel.send("Member has been gbanned!")
  },
};
