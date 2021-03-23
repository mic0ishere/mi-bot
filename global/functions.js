const fs = require("fs");
module.exports = async (bot) => {
  const directories = [
    "server misc",
    "misc",
    "moderation",
    "utils",
    "owner",
    "music",
    "image",
    "tickets",
  ];
  directories.forEach((dir) => {
    fs.readdir(`./commands/${dir}`, (err, files) => {
      if (err) console.error(err);
      let jsfiles = files.filter((f) => f.split(".").pop() === "js");

      if (jsfiles.length <= 0)
        return console.log("There are no commands to load...");

      console.log(`Loading commands from ${dir} module. (${jsfiles.length})`);
      jsfiles.forEach((f, i) => {
        let props = require(`../commands/${dir}/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
        if (props.help.aliases[0])
          props.help.aliases.forEach((alias) => {
            bot.aliases.set(alias, props.help.name);
          });
      });
      console.log("\n");
    });
  });

  bot.loadCommand = (commandName) => {
    try {
      let props = require(`../commands/${commandName}`);
      if (props.init) props.init(bot);
      bot.commands.set(commandName, props);
      props.help.aliases.forEach((alias) => {
        bot.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (err) {
      console.log(err);
    }
  };

  bot.unloadCommand = async (commandName) => {
    try {
      if (!commandName)
        return `The command \`${commandName}\` doesn"t seem to exist. Try again!`;

      if (commandName.shutdown) await commandName.shutdown(bot);
      delete require.cache[require.resolve(`../commands/${commandName}.js`)];
      return false;
    } catch (err) {
      console.log(err);
    }
  };
};
