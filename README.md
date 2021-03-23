# Mi Bot

One of my first discord bots, I know code is awful.

## Setup

1. Create redirects in [Discord Developers portal](https://discord.com/developers/applications) to following URLs:

   - `http://localhost:4000/auth`
   - `http://localhost:4000/dashboard`

2. Create `config.json` file in `global` folder and paste this:

   ```json
   {
     "database": {
       "connection": "<MongoDB url>"
     },
     "dashboard": {
       "port": 4000,
       "redirectURL": "http://localhost:4000"
     },
     "discord": {
       "id": "<Discord Client Id>",
       "token": "<Discord Client Token>",
       "secret": "<Discord Client Secret>"
     }
   }
   ```

3. Install modules - `npm i`

4. Run using `node index.js`

<!-- Why am I still writing this? -->
