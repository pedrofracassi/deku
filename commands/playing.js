const config = require('../config.js');
const utils = require('../utils.js');

module.exports = {
  run: function(message, lang) {
    if (message.channel.type != 'text') return;
    var expression = /^\w+\!(\w+) *(.*)/;
    var embed = utils.generateDekuDiv(message);
    if (message.content.match(expression)[2]) {
      var game = message.content.match(expression)[2];
      var count = message.guild.members.filter(m => {if(m.user.presence.game){ if(m.user.presence.game.name.toLowerCase() == game.toLowerCase()){return true;}}}).size;
      var text = '';
      if (count == 0) {
        text = lang.commands.playing.zero.replace('{0}', game);
      } else if (count == 1) {
        text = lang.commands.playing.one.replace('{0}', game);
      } else {
        text = lang.commands.playing.more.replace('{0}', game).replace('{1}', count);
      }
      embed.setDescription(text);
    } else {
      embed.setColor(config.colors.error);
      embed.addField(lang.commands.playing.error_no_args, lang.commands.playing.usage);
    }
    message.channel.send({embed});
  }
}
