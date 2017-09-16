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
  runCommand: function(command, message, lolaccounts, bans) {
    try {
      require('./commands/' + command).run(message, lolaccounts, bans);
    } catch (e) {
      console.log(e);
    }
  },
  addRequestedText: function(embed, message) {
    embed.setFooter('Requested by ' + message.author.tag, message.author.avatarURL);
  }
}
