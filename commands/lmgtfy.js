const utils = require('../utils.js');

module.exports = {
  run: function(message, lang) {
    var expression = /^\w+\!(\w+) *(.*)/;
    var args = message.cleanContent.match(expression)[2].split(' ');
    var embed = utils.generateDekuDiv(message);
    var text = args.join(" ");
    if(text.includes('--explain')) {
      embed.setDescription('http://lmgtfy.com/?iie=1&q=' + encodeURI(text.replace('--explain', '')));
    } else {
      embed.setDescription('http://lmgtfy.com/?q=' + encodeURI(text));
    }
    message.channel.send({embed});
  }
}
