const Discord = require('discord.js');
const config = require('../config.js');
const utils = require('../utils.js');

module.exports = {
  run: function(message) {
    if (message.channel.type != 'text') return;
    var embed = utils.generateDekuDiv(message);
    var games = {};
    var text = '';

    message.guild.members.map(member => {
      if (member.user.presence.game) {
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
      text = text + '`#' + place +  '` with `' + s[1] + '` players: **' + s[0] + '**\n';
    })

    embed.addField('Most played games:', text);
    embed.setColor(config.embedColor);
    message.channel.send(embed);
  }
};
