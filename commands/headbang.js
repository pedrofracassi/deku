const Command = require('../structures/command.js');
const utils = require('../utils.js');

module.exports = class Headbang extends Command {

  constructor(client) {
    super(client);

    this.name = "headbang";
  }

  run(message, args, commandLang) {
    let embed = utils.generateDekuDiv(message);
    embed.setImage('https://media.tenor.com/images/2a0d391675b0bc03400d79b5a6a21137/tenor.gif');
    message.channel.send({embed});
  }

}
