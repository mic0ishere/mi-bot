const {
    Manager
} = require("@lavacord/discord.js");
module.exports = async (bot) => {
    bot.music = {}
    bot.music.queues = {};
    bot.music.loops = {};
    bot.music.playingServers = new Map();
    bot.music.lavalink = {
        restnode: {
            host: "localhost",
            port: 2333,
            password: "youshallnotpass",
        },
        nodes: [{
            host: "localhost",
            port: 2333,
            region: "asia",
            password: "youshallnotpass",
        }, ],
    };
    if (!!bot.music.lavalink.restnode.address) {
        bot.music.lavalink.restnode.host = bot.music.lavalink.restnode.address.includes(
                ":"
            ) ?
            bot.music.lavalink.restnode.address.split(":")[1].replace(/\/\//g, "") :
            bot.music.lavalink.restnode.address;
        bot.music.lavalink.restnode.port = bot.music.lavalink.restnode.address.includes(
                ":"
            ) ?
            bot.music.lavalink.restnode.address.split(":")[2] :
            80;
    }
    bot.music.lavalink.nodes.map((a, i) => {
        if (!a.id) a.id = `${i}`;
        if (!!a.address) {
            a.host = a.address.includes(":") ?
                a.address.split(":")[1].replace(/\/\//g, "") :
                a.address;
            a.port = a.address.includes(":") ? a.address.split(":")[2] : 80;
        }
    });
    bot.player = new Manager(bot, bot.music.lavalink.nodes, {
        user: bot.user.id,
        shards: (bot.shard && bot.shard.count) || 1,
    });
    const connectLavalink = async () => {
        try {
            await bot.player.connect()
        } catch (error) {
            connectLavalink()
        }
    }
    connectLavalink()
    bot.player.on("ready", () => {
        console.log("Lavalink succesfully connected!")
    })
}