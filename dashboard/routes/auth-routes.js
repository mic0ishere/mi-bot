const config = require('../../global/config.json');
const express = require('express');
const authClient = require('../auth-client');
const sessions = require('../sessions');

const router = express.Router();

router.get('/invite', (req, res) =>
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.discord.id}&permissions=8&scope=bot&redirect_uri=${config.dashboard.redirectURL}/dashboard`));

router.get('/gban', (req, res) => {
  res.send('You are globally banned!')
});

router.get('/support', (req, res) => {
  res.redirect("https://discord.gg/mt4DjDz")
});

router.get('/auth-guild', (req, res) => {
  const key = res.cookies.get('key');
  sessions.update(key);
  res.redirect('/dashboard');
});

router.get('/login', (req, res) =>
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.discord.id}&redirect_uri=${config.dashboard.redirectURL}/auth&response_type=code&scope=identify%20guilds&prompt=none`));

router.get('/auth', async (req, res) => {
  try {
    const code = req.query.code;
    const key = await authClient.getAccess(code);

    res.cookies.set('key', key);
    res.redirect('/dashboard');
  } catch {
    res.redirect('/');
  }
});

router.get('/logout', (req, res) => {
  res.cookies.set('key', '');
  res.redirect('/');
});

module.exports = router;