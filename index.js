const Discord = require('discord.js');
const client = new Discord.Client();
const tokens = require('./tokens.js');
const config = require('./config.js');
const utils = require('./utils.js');

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
    if (utils.commandExists(command)) utils.runCommand(command, message, betaMode);
  }
})

client.on('guildCreate', guild => {
  var embed = new Discord.RichEmbed;
  embed.addField(`Hi, i'm Deku!`, `I was made by **pedrofracassi#4623** to help organize your beautiful Guild.\n\nIf you want to know more about me, type \`d!help\`.\n\n<:izuku:358407294100439040> [Add me to your server](https://discordapp.com/oauth2/authorize?client_id=358398001233920001&scope=bot) | [Join my server](https://discord.gg/9W7yyBA)`);
  embed.setColor(config.colors.embed);
  embed.setThumbnail('https://i.imgur.com/lUVxkAK.png');
  guild.channels.filter(c=>c.type=='text').first().send({ embed });
})

var token = tokens.discord_beta || tokens.discord;
client.login(token);
