const utils = require('../utils.js');

module.exports = {
  run: function(message) {
    message.reply('trying to stop typing...');
    while (message.channel.typing) {
      message.channel.stopTyping();
    }
  }
}
