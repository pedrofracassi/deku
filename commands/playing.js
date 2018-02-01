const Command = require('../structures/command.js');

module.exports = class Playing extends Command {

  constructor(client) {
    super(client);

    this.name = "playing";
  }

  run(message, args, commandLang) {
    let embed = this.client.getDekuEmbed(message);
    if(args[0]) {
      let game = args.join(' ');
      let count = message.guild.members.filterArray(m => m.user.presence.game && m.user.presence.game.name.toLowerCase() == game.toLowerCase()).length;
      let text = count == 0 ? commandLang.zero : count == 1 ? commandLang.one : commandLang.more;
      text = text.replace('{0}', game).replace('{1}', count);
      embed.setDescription(text);
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.addField(commandLang.error_no_args, commandLang.usage);
    }
    message.channel.send({embed});
  }

  canRun(message) {
    return message.guild ? true : false;
  }

}
