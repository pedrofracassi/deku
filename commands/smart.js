const Command = require('../structures/command.js');

module.exports = class Smart extends Command {

  constructor(client) {
    super(client);

    this.name = "smart";
  }

  run(message) {
    let embed = this.client.getDekuEmbed(message);
    embed.setImage('https://i.imgur.com/MzwiZg8.png');
    message.channel.send({embed});
  }

}
