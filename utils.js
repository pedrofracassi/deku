const Discord = require('discord.js');
const config = require('./config.js');

module.exports = {
  commandExists: function(command) {
    try {
      let commandFile = require('./commands/' + command);
      return commandFile;
    } catch (e) {
      if (e != 'Error: Cannot find module \'./commands/' + command + '\'') console.log(e);
      return false;
    }
  },
  runCommand: function(command, message, betaMode) {
    try {
      require('./commands/' + command).run(message, betaMode);
    } catch (e) {
      console.log(e);
    }
  },
  generateDekuDiv: function(message) {
    var embed = new Discord.RichEmbed;
    embed.setColor(config.colors.embed);
    embed.setFooter('Requested by ' + message.author.tag, message.author.avatarURL);
    return embed;
  }
}
