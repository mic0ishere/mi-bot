const sessions = require('./sessions');
const bot = require('../index')

module.exports.updateGuilds = async (req, res, next) => {
  try {
    const key = res.cookies.get('key');
    if (key) {
      const { guilds } = await sessions.get(key);
      res.locals.guilds = guilds;
    }
  } finally {
    next();
  }
};

module.exports.updateUser = async (req, res, next) => {
  let globalBanned
  try {
    const key = res.cookies.get('key');
    if (key) {
      const { authUser } = await sessions.get(key);
      res.locals.user = authUser;
      // const userDB = await bot.db.users.findOne({ userId: res.locals.user.id })
      // if(userDB.globalBanned == true ) {
      //   if(req.originalUrl != '/' && req.originalUrl != '/commands') globalBanned = true
      // }
    } 
  } finally {
    globalBanned ? res.redirect('/gban') : next()
  }
};

module.exports.validateGuild = async (req, res, next) => {
  const exists = res.locals.guilds.some(g => g.id === req.params.id);
  (exists)
    ? next()
    : res.render('errors/404');
};

module.exports.validateUser = async (req, res, next) => {
      if(res.locals.user) {
        const userDB = await bot.db.users.findOne({ userId: res.locals.user.id })
        if(userDB.globalBanned == true ) {
          if(req.originalUrl != '/' && req.originalUrl != '/commands') res.render('errors/401');
        } else next()
      } else res.render('errors/401');
};