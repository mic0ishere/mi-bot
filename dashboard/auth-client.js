const config = require('../global/config.json'),
      OAuthClient = require('disco-oauth');

const AuthClient = new OAuthClient(config.discord.id, config.discord.secret);

AuthClient.setRedirect(`${config.dashboard.redirectURL}/auth`);
AuthClient.setScopes('identify', 'guilds');

module.exports = AuthClient;