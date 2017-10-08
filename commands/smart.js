const Command = require('../structures/command.js');
const utils = require('../utils.js');

module.exports = class Smart extends Command {

  constructor(client) {
    super(client);

    this.name = "smart";
  }

  run(message, args, commandLang) {
    let embed = utils.generateDekuDiv(message);
    embed.setImage('https://i.imgur.com/MzwiZg8.png');
    message.channel.send({embed});
  }

}
