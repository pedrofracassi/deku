# Deku, the Discord bot.

For Izuku to work, you have to add a file to it's root folder, called `tokens.js`. It should look like this:
```javascript
module.exports = {
  tokens: {
    discord: 'BOT_TOKEN_GOES_HERE',
    discord_beta: 'BETA_TOKEN_GOES_HERE' 
  }
}
```

| Propriety             | Required? | Description                                    |
|-----------------------|-----------|------------------------------------------------|
|    `tokens.discord`   |   `yes`   | The bot's token                                |
| `tokens.discord_beta` |    `no`   | The bot's beta token. Will be used if existent |
|      `embedColor`     |   `yes`   | Color used on all embeds                       |
