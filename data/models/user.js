const { model } = require('mongoose');

module.exports = model('user', {
    userId: String,
    globalBanned: { type: Boolean, default: false }
});