const { model } = require('mongoose');

class General {
    prefix = '?'
}
class Moderation {
    on = true
    cases = 0
}
class BotChannel {
    on = false
    channel = null
}
class Lobby {
    on = false
    channel = null
}
class Logs {
    on = false
    channel = null
}
class Levels {
    on = true
}
class Miscellanous {
    on = true
}
class Tickets {
    on = true
    perms = false
}
class Images {
    on = true
}
module.exports = model('guild', {
    guildId: String,
    general: { type: Object, default: new General() },
    moderation: { type: Object, default: new Moderation() },
    botchannel: { type: Object, default: new BotChannel() },
    tickets: { type: Object, default: new Tickets() },
    levels: { type: Object, default: new Levels() },
    miscellanous: { type: Object, default: new Miscellanous() },
    lobby: { type: Object, default: new Lobby() },
    logs: { type: Object, default: new Logs() },
    images: { type: Object, default: new Images() }
});