const utils = require("../../global/utils.js");

module.exports = {
  help: {
    name: "mute",
    description: "Mutes a member in the discord!",
    usage: "<@member> [reason]",
    category: "moderation",
    accessableby: "KICK_MEMBERS",
    aliases: ["m", "nospeak"],
  },
  run: async (bot, message, args) => {
    const mutee =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!mutee) return utils.provide(message, "user to be muted");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given";

    //define mute role and if the mute role doesnt exist then create one
    let muterole = message.guild.roles.cache.find((r) => r.name === "Muted");
    if (!muterole) {
      try {
        muterole = await message.guild.roles.create({
          data: {
            name: "Muted",
            color: "#514f48",
            mentionable: false,
          },
        });
      } catch (e) {
        console.log(e.stack);
      }
    }
    message.guild.channels.cache.forEach(async (channel) => {
      await channel.createOverwrite(muterole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
        SEND_TTS_MESSAGES: false,
        ATTACH_FILES: false,
        SPEAK: false,
      });
    });
    //add role to the mentioned user and also send the user a dm explaing where and why they were muted
    mutee.roles.add(muterole.id).then(() => {
      mutee
        .send(
          `Hello, you have been muted in ${message.guild.name} for: ${reason}`
        )
        .catch((err) => console.log(err));
      message.channel.send(`${mutee.user.username} was successfully muted.`);
    });

    const type = "mute";
    const member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    utils.createCase(type, reason, message, member, bot);
  },
};
