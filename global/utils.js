const { MessageEmbed } = require("discord.js");
const { redlight } = require("./colours.json");
const memberModel = require("../data/models/member");
const guildModel = require("../data/models/guild");
const caseModel = require("../data/models/case.js");
const utils = require("./utils");

module.exports = {
  provide: (message, value) => {
    return message.channel.send(`Please provide a ${value}!`);
  },
  createCase: async (type, reason, message, member, bot) => {
    const guildDB = await bot.db.guilds.findOne({ guildId: message.guild.id });
    const memberDB = await bot.db.members.findOne({
      userId: member.id,
      guildId: message.guild.id,
    });
    let newCase = [
      new caseModel({
        time: message.createdTimestamp,
        reason: reason,
        type: type,
        moderatorID: message.author.id,
        serverCase: guildDB.moderation.cases,
      }),
    ];
    if (memberDB.moderation.cases) {
      memberDB.moderation.cases.forEach((x) => newCase.push(x));
    }
    let serverCases = Number(guildDB.moderation.cases) + 1;
    await memberModel.updateOne(
      { userId: member.id, guildId: message.guild.id },
      { moderation: { cases: newCase } }
    );
    await guildModel.updateOne(
      { guildId: message.guild.id },
      { moderation: { on: guildDB.moderation.on, cases: serverCases } }
    );

    if (guildDB.logs.on == true) {
      utils.case(member, type, message);
    }
  },
  case: async (member, type, message) => {
    const guildDB = await guildModel.findOne({
      guildId: message.guild.id,
    });
    const memberDB = await memberModel.findOne({
      userId: member.id,
      guildId: message.guild.id,
    });
    let caseData = memberDB.moderation.cases[0];

    const months_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    date = new Date(parseInt(caseData.time));
    year = date.getFullYear();
    month = months_arr[date.getMonth()];
    day = date.getDate();
    hours = date.getHours();
    minutes = "0" + date.getMinutes();
    seconds = "0" + date.getSeconds();
    time =
      month +
      " " +
      day +
      " " +
      year +
      "\t" +
      hours +
      ":" +
      minutes.substr(-2) +
      ":" +
      seconds.substr(-2);

    let embed = new MessageEmbed()
      .setColor(redlight)
      .setAuthor(
        `${message.guild.name} case #${memberDB.moderation.cases[0].serverCase}`,
        message.guild.iconURL
      )
      .addField("Moderation:", type)
      .addField("Member:", member)
      .addField("Moderator:", message.author.username)
      .addField("Reason:", caseData.reason)
      .addField("Date:", time);

    let sChannel = message.guild.channels.cache.find(
      (x) => x.id == guildDB.logs.channel
    );
    return sChannel.send(embed);
  },
};
