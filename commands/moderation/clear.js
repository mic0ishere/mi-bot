module.exports= {
    help: {
        name: "clear",
        usage: "<number>",
        category: "moderation",
        aliases: ["purge"],
        accessableby: "MANAGE_MESSAGES",
        overwrite: "YES"
    },
    run: async (bot, message, args) => {
    const amountArg = parseInt(args[0])
    if (!Number.isInteger(amountArg)) {
      return message.channel.send("You must specify the amount of messages to clear!")
    }

    if (amountArg < 2 || amountArg > 100) {
      return message.channel.send(
        "Amount of messages to clear must be greater than 1 and lower than 100.",
      )
    }
    await message.delete()
    await message.channel.bulkDelete(amountArg, true)
  }
}