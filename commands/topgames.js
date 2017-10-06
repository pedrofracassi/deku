const Discord = require('discord.js');
const config = require('../config.js');
const utils = require('../utils.js');
const cmdName = 'topgames';

module.exports = {
  run: function(message, lang) {
    if (message.channel.type != 'text') return;
    var embed = utils.generateDekuDiv(message);
    var games = {};
    var text = '';

    message.guild.members.map(member => {
      if (member.user.presence.game && !member.user.bot) {
        if (games[member.user.presence.game.name]) {
          games[member.user.presence.game.name]++;
        } else {
          games[member.user.presence.game.name] = 1;
        }
      }
    });

    var sortable = [];

    for (var game in games) {
      sortable.push([game, games[game]]);
    }

    sortable.sort(function(a, b) {
      return b[1] - a[1];
    });

    var only10 = 0;
    sortable.map((s, i)=> {
      if (only10 == 10) return;
      only10++;
      var place = i + 1;
      var line = "";
      if (s[1] == 1) {
        line = lang.commands[cmdName].line_singular;
      } else {
        line = lang.commands[cmdName].line_plural;
      }
      line = line.replace('{0}', place).replace('{1}', s[1]).replace('{2}', s[0]);
      text = text + line + '\n';
    })

    embed.addField(lang.commands[cmdName].most_played + ':', text);
    message.channel.send(embed);
  }
};
