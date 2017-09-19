const fs = require('fs');

module.exports = {
  run: function(message) {
    message.reply("I've sent you my commands through DM.").then((alertMessage) => {
      setTimeout(() => {
        alertMessage.delete();
      }, 30 * 1000);
    });
    fs.readFile('help.txt', 'utf8', function(err, data) {
      if (err) throw err;
      message.author.send(data);
    });
  }
}
