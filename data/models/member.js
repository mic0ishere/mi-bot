const { model } = require('mongoose');

class Levels {
    xp = 0
    level = 1
}
class Moderation {
    cases
}
class Tickets {
    voice = null
    text = null
}
module.exports = model('member', {
    guildId: String,
    userId: String,
    levels: { type: Object, default: new Levels() },
    moderation: { type: Object, default: new Moderation() },
    tickets: { type: Object, default: new Tickets() }
});