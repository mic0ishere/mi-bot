const { model } = require('mongoose');

module.exports = model('case', {
    time: String,
    reason: String,
    type: String,
    moderatorID: String,
    serverCase: Number
});
