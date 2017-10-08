const Command = require('../structures/command.js');

module.exports = class StopTyping extends Command {

  constructor(client) {
    super(client);

    this.name    = "stoptyping"
    this.aliases = ["st"];
  }

  run(message, args, commandLang) {
    message.reply(commandLang.trying_to_stop);
    message.channel.stopTyping(true);
  }

}
