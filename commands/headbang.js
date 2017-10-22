const Command = require('../structures/command.js');

module.exports = class Headbang extends Command {

  constructor(client) {
    super(client);

    this.name = "headbang";
  }

  run(message) {
    let embed = this.client.getDekuEmbed(message);
    embed.setImage('https://media.tenor.com/images/2a0d391675b0bc03400d79b5a6a21137/tenor.gif');
    message.channel.send({embed});
  }

}
