const SavedGuild = require('./models/guild');
module.exports = new class {
    async get({ id }) {
        SavedGuild.db.collection("guilds")
        if(!await SavedGuild.findOne({ guildId: id })) await new SavedGuild({ guildId: id }).save()
        // return await SavedGuild.findOne({ guildId: id })
    }
}