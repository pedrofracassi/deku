const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const utils = require('./utils.js');

client.on('ready', () => {
  console.log('Ready! Authenticated as ' + client.user.tag);
});

client.on('message', message => {
  if (config.tokens.discord_beta) {
    var expression = /^[d][b]\!(\w+) *(.*)/;
  } else {
    var expression = /^[d]\!(\w+) *(.*)/;
  }
  if (message.content.match(expression)) {
    var command = message.content.match(expression)[1];
    if (utils.commandExists(command)) utils.runCommand(command, message);
  }
})

client.on('guildCreate', guild => {
  var embed = new Discord.RichEmbed;
  embed.addField(`Hi, i'm Deku!`, `I was made by **pedrofracassi#4623** to help organize your beautiful Guild.\n\nIf you want to know more about me, type \`+help\`.\n\n<:izuku:358407294100439040> [Add me to your server](https://discordapp.com/oauth2/authorize?client_id=358398001233920001&scope=bot)`);
  embed.setColor(config.embedColor);
  embed.setThumbnail('https://i.imgur.com/lUVxkAK.png');
  guild.defaultChannel.send({ embed });
})

var token = config.tokens.discord_beta || config.tokens.discord;

client.login(token);
