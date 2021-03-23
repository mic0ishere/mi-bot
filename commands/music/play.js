const {
    execQueue,
    getQueue,
    getYTLength,
    getSong,
} = require("../../global/music");
const {
    MessageEmbed
} = require("discord.js");
module.exports = {
    help: {
        name: "play",
        description: "",
        category: "music",
        aliases: [],
    },
    run: async (bot, message, args) => {
        const guildDB = await bot.db.guilds.findOne({
            guildId: message.guild.id
        });
        const msg = message.content.trim();
        const command = msg
            .substring(guildDB.general.prefix.length)
            .split(/[ \n]/)[0]
            .toLowerCase()
            .trim();
        const suffix = msg
            .substring(guildDB.general.prefix.length + command.length)
            .trim()
            .split(" ");
        const betterArgs = suffix.join(" ").trim();
        let canPlay = false;
        await message.channel.send(`Hold on...`);
        if (!message.member.voice.channelID ||
            bot.player.players.get(bot.music.playingServers.get(message.guild.id)) &&
            message.member.voice.channelID !==
            bot.player.players.get(bot.music.playingServers.get(message.guild.id))
            .vc
        )
            return message.channel.send(`You're not in the playing voice channel!`);

        if (
            !args[0] &&
            !bot.player.players.get(bot.music.playingServers.get(message.guild.id))
        )
            return message.channel.send(`You didn't give anything to play!`);

        var queue = getQueue(message.guild.id);
        var track = await getSong(
            betterArgs.startsWith(`http`) ? betterArgs : `ytsearch:${betterArgs}`
        );
        let isPlaylist;
        if (!track[0]) return message.channel.send(`No results found.`);
        if (!queue[0]) canPlay = true;
        if (!betterArgs.startsWith("http")) {
            let index = 1;

            const tracks = track.slice(0, 5);
            const embed = new MessageEmbed()
                .setAuthor("Song Selection.", message.author.displayAvatarURL)
                .setDescription(
                    tracks.map((video) => `**${index++} -** ${video.info.title}`)
                )
                .setFooter(
                    "Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection"
                );

            await message.channel.send(embed);

            const collector = await message.channel.createMessageCollector(
                (m) => {
                    return m.author.id === message.author.id;
                }, {
                    time: 30000,
                    max: 1
                }
            );

            collector.on("collect", async (m) => {
                if (
                    ["cancel", "1", "2", "3", "4", "5"].includes(
                        message.content.toLowerCase()
                    )
                )
                    return collector.stop("cancelled");
                const song = await tracks[Number(m.content) - 1];
                queue.push(song);
                isPlaylist = false;
                const description = isPlaylist ?
                    `• **URL**: [${betterArgs}](${betterArgs})` :
                    `• **Author**: ${song.info.author}\n• **URL**: [${song.info.uri}](${song.info.uri})`;
                message.channel.send(
                    `:musical_note: Added ${isPlaylist ? "playlist" : "song"} to queue!`,
                    new MessageEmbed()
                    .setColor("RED")
                    .setTitle(isPlaylist ? "Playlist loaded" : song.info.title)
                    .setThumbnail(
                        `https://i.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg`
                    ).setDescription(`${description}\n• **Length**: ${isPlaylist ? track.length : getYTLength(song.info.length)}
		`)
                );
                if (canPlay) {
                    var theHost = bot.player.idealNodes[0].id;
                    const voice = bot.guilds.cache.find(x => x.id == message.guild.id).me.voice
                    if(voice && voice.channelID == message.member.voice.channelID) await voice.kick()
                    const player = await bot.player.join({
                        guild: message.guild.id,
                        channel: message.member.voice.channelID,
                        node: theHost,
                    });
                    bot.music.playingServers.set(message.guild.id, player.id);
                    player.vc = message.member.voice.channelID;
                    execQueue(message, queue, player);
                }
            });

            collector.on("end", (_, reason) => {
                if (["time", "cancelled"].includes(reason))
                    return message.channel.send("Cancelled selection.");
            });
        } else {
            const urlParams = new URLSearchParams(suffix.join(" "));
            const myParam = parseInt(urlParams.get("index"));
            if (urlParams.get("list") && myParam) {
                track = track.splice(myParam - 1, track.length);
                track.forEach((cr) => {
                    queue.push(cr);
                });
                isPlaylist = true;
            } else if (urlParams.get("list")) {
                track.forEach((cr) => {
                    queue.push(cr);
                });
                isPlaylist = true;
            } else if (track[1]) {
                track.forEach((cr) => {
                    queue.push(cr);
                });
                isPlaylist = true;
            }
            const description = isPlaylist ?
                `• **URL**: [${betterArgs}](${betterArgs})` :
                `• **Author**: ${track[0].info.author}\n• **URL**: [${track[0].info.uri}](${track[0].info.uri})`;
            message.channel.send(
                `:musical_note: Added ${isPlaylist ? "playlist" : "song"} to queue!`,
                new MessageEmbed()
                .setColor("RED")
                .setTitle(isPlaylist ? "Playlist loaded" : track[0].info.title)
                .setThumbnail(
                    `https://i.ytimg.com/vi/${track[0].info.identifier}/hqdefault.jpg`
                ).setDescription(`${description}\n• **Length**: ${isPlaylist ? track.length : getYTLength(track[0].info.length)}
		`)
            );
            if (canPlay) {
                var theHost = bot.player.idealNodes[0].id;
                const voice = bot.guilds.cache.find(x => x.id == message.guild.id).me.voice
                if(voice && voice.channelID == message.member.voice.channelID) await voice.kick()
                const player = await bot.player.join({
                    guild: message.guild.id,
                    channel: message.member.voice.channelID,
                    node: theHost,
                });
                bot.music.playingServers.set(message.guild.id, player.id);
                player.vc = message.member.voice.channelID;
                execQueue(message, queue, player);
            }
        }
    },
};