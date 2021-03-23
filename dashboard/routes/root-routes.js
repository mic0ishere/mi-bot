const express = require('express');
const bot = require('../../index')
const router = express.Router();

router.get('/', (req, res) => res.render('index'));

router.get('/commands', (req, res) => {
  res.render('commands', {
    subtitle: 'Commands',
    categories: [
      { name: 'images', icon: 'fas fa-images' },
      { name: 'moderation', icon: 'fas fa-hammer' }, 
      { name: 'miscellaneous', icon: 'fas fa-mail-bulk' }, 
      { name: 'server miscellaneous', icon: 'fas fa-sliders-h' },
      { name: 'tickets', icon: 'fas fa-ticket-alt' },
      { name: 'music', icon: 'fas fa-music' }
    ],
    commands: Array.from(bot.commands.values()),
    commandsString: JSON.stringify(Array.from(bot.commands.values()))
  })
});

module.exports = router;