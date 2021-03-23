const SavedMember = require('./models/member');
module.exports = new class {
    async get({ id, guild }) {
        SavedMember.db.collection("members")
        if(!await SavedMember.findOne({ userId: id, guildId: guild })) await new SavedMember({ userId: id, guildId: guild }).save();
        // return await SavedMember.findOne({ userId: id, guildId: guild })
    }
}