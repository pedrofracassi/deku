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
  runCommand: function(command, message, lang, langdb) {
    try {
      require('./commands/' + command).run(message, lang, langdb);
    } catch (e) {
      console.log(e);
    }
  },
  generateDekuDiv: function(message) {
    var embed = new Discord.RichEmbed;
    embed.setColor(config.colors.embed);
    embed.setFooter(message.author.tag, message.author.avatarURL);
    return embed;
  },
  arrayToStringWithCommas: function(array, last) {
    var string = "";
    for (i = 0; i < array.length; i++) {
      if (i == (array.length - 1)) {
        string = string + array[i];
      } else if (i == (array.length - 2)) {
        string = string + array[i] + last;
      } else {
        string = string + array[i] + ", ";
      }
    }
    return string;
  }
}
