const utils = require('../utils.js');
const cmdName = 'stoptyping'

module.exports = {
  run: function(message, lang) {
    message.reply(lang.commands[cmdName].trying_to_stop);
    while (message.channel.typing) {
      message.channel.stopTyping();
    }
  }
}
