const Discord = require('discord.js');
const config = require('./config.js');

module.exports = {
  expression: /^\w+\!(\w+) *(.*)/,
  telegram_expression: /^\/(\w+) *(.*)/,
  commandExists: function(command) {
    try {
      let commandFile = require('./commands/' + command);
      return commandFile;
    } catch (e) {
      if (e != 'Error: Cannot find module \'./commands/' + command + '\'') console.log(e);
      return false;
    }
  },
  telegramCommandExists: function(command) {
    try {
      let commandFile = require('./commands_telegram/' + command);
      return commandFile;
    } catch (e) {
      if (e != 'Error: Cannot find module \'./commands_telegram/' + command + '\'') console.log(e);
      return false;
    }
  },
  runTelegramCommand: function(command, bot, message, databases) {
    try {
      require('./commands_telegram/' + command).run(bot, message, databases);
    } catch (e) {
      console.log(e);
    }
  },
  runCommand: function(command, message, lang, databases) {
    if (message.channel.type != 'text') return;
    try {
      require('./commands/' + command).run(message, lang, databases);
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
