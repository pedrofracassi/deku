const Command = require('./structures/command.js');
const utils = require('../utils.js');

module.exports = class Smart extends Command {

  constructor(client) {
    super(client);

    this.name = "timezone";
    this.aliases = ["time"];
  }

  run(message, args, commandLang) {
    message.channel.send('WIP');
  }

}
