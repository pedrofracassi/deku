const config = require('../config.js');
const utils = require('../utils.js');

module.exports = {
  run: function(message, betaMode) {
    if (message.channel.type != 'text') return;
    var expression = /^[d]\!(\w+) *(.*)/;
    if (betaMode) expression = /^[d][b]\!(\w+) *(.*)/; // Use db!command instead of d!command if in beta mode
    var embed = utils.generateDekuDiv(message);
    if (message.content.match(expression)[2]) {
      var game = message.content.match(expression)[2];
      var count = message.guild.members.filter(m => {if(m.user.presence.game){ if(m.user.presence.game.name.toLowerCase() == game.toLowerCase()){return true;}}}).size;
      var text = '';
      if (count == 0) {
        text = "There is **no one** in this guild playing `" + game + "` at the moment";
      } else if (count == 1) {
        text = "There is **one person** in this guild playing `" + game + "` at the moment";
      } else {
        text = "There are **" + count + "** people playing `" + game + "` at the moment";
      }
      embed.addField("Currently playing", text);
    } else {
      embed.setColor(config.colors.error);
      embed.addField('You have to specify the game!', '**Usage:** `d!playing <game>`\n**Example:** `d!playing Overwatch`');
    }
    message.channel.send({embed});
  }
}
