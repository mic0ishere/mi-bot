const SavedUser = require('./models/user');
module.exports = new class {
    async get({ id }) {
        SavedUser.db.collection("users")
        if(!await SavedUser.findOne({ userId: id })) await new SavedUser({ userId: id }).save()
        // return await SavedUser.findOne({ userId: id })
    }
}