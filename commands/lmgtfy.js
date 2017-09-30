const utils = require('../utils.js');
const cmdName = "lmgtfy";

module.exports = {
  run: function(message, lang) {
    var expression = /^\w+\!(\w+) *(.*)/;
    var args = message.cleanContent.match(expression)[2].split(' ');
    var embed = utils.generateDekuDiv(message);
    var text = args.join(" ");
    if (args[0]) {
      if(text.includes('--explain')) {
        embed.setDescription('http://lmgtfy.com/?iie=1&q=' + encodeURI(text.replace('--explain', '')));
      } else {
        embed.setDescription('http://lmgtfy.com/?q=' + encodeURI(text));
      }
    } else {
      embed.setTitle(lang.commands[cmdName].no_question);
      embed.setDescription(`\u200b\n${lang.usage} \`${lang.commands[cmdName]. _usage}\`\n${lang.example} \`${lang.commands[cmdName]._example}\``);
    }
    message.channel.send({embed});
  }
}
