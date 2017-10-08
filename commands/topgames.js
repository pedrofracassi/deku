const Command = require('../structures/command.js');

module.exports = class TopGames extends Command {

  constructor(client) {
    super(client);

    this.name     = "topgames";
    this.aliases  = ["tg"];
  }

  run(message, args, commandLang) {
    let embed = this.client.getDekuEmbed(message);
    let games = {};
    message.guild.members.filter(m => !m.user.bot && m.user.presence.game).forEach(member => {
      games[member.user.presence.game.name] = games[member.user.presence.game.name] ? games[member.user.presence.game.name]++ : 1;
    });

    var sortable = [];
    Object.keys(games).forEach(name => {
      sortable.push({name: name, value: games[name]});
    });

    sortable.sort((a, b) => b.value - a.value);

    let text = sortable.map(function(g, i) {
      let line = g.value > 1 ? lang.commands[cmdName].line_plural : commandLang.line_singular;
      return line.replace('{0}', i+1).replace('{1}', g.value).replace('{2}', g.name);
    });

    if(text.length > 10) text = text.slice(0, 10);

    embed.addField(commandLang.most_played + ':', text.join("\n"));
    message.channel.send(embed);
  }

  canRun(message) {
    return message.guild ? true : false;
  }

}
