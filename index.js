const Discord = require('discord.js');
const client  = new Discord.Client();
const tokens  = require('./tokens.js');
const config  = require('./config.js');
const utils   = require('./utils.js');
const fs      = require('fs');
const levelup = require('levelup');

var databases = {
  roleme_config: levelup('./databases/roleme'),
  language_config: levelup('./databases/language')
}

// Express Server for /docs testing
//   const website = require('./website.js');
//   website.start();

var betaMode = false;
if (tokens.discord_beta) betaMode = true;

client.on('ready', () => {
  client.user.setGame('d!help');
  if (betaMode) client.user.setGame('AAAAAAAAAA');
  console.log('Ready! Authenticated as ' + client.user.tag);
});

client.on('message', message => {
  var expression = /^[d]\!(\w+) *(.*)/;
  if (betaMode) expression = /^[d][b]\!(\w+) *(.*)/; // Use db!command instead of d!command if in beta mode

  if (message.content.match(expression)) {
    var command = message.content.match(expression)[1];
    var strings;
    if (utils.commandExists(command)) {
      databases.language_config.get(message.guild.id, function (err, value) {
        if (err) value = 'en_US';
        fs.readFile('./translation/' + value + '.json', 'utf8', function (err, data) {
          if (err) throw err;
          strings = JSON.parse(data);
          if (strings.commands[command]) {
            utils.runCommand(command, message, strings, databases);
          } else {
            fs.readFile('./translation/en_US.json', 'utf8', function (err, data) {
              strings = JSON.parse(data);
              utils.runCommand(command, message, strings, databases);
            });
          }
        });
      })
    }
  }
})

client.on('guildCreate', guild => {
  var embed = new Discord.RichEmbed;
  var locale = 'en_US';
  databases.language_config.get(message.guild.id, function (err, value) {
    if (err) value = 'en_US';
    fs.readFile('./translation/' + value + '.json', 'utf8', function (err, data) {
      if (err) throw err;
      lang = JSON.parse(data);
      embed.addField(lang.server_join.hi_im_deku, lang.server_join.description
        .replace('{0}', '<:izuku:358407294100439040>')
        .replace('{1}', 'https://discordapp.com/oauth2/authorize?client_id=358398001233920001&scope=bot')
        .replace('{2}', 'https://discord.gg/9W7yyBA'));
        embed.setColor(config.colors.embed);
        embed.setThumbnail('https://i.imgur.com/lUVxkAK.png');
        guild.channels.filter(c=>c.type=='text').first().send({ embed });
      });
    });
  });

  var token = tokens.discord_beta || tokens.discord;
  client.login(token);
