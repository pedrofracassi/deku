const Command = require('../structures/command.js');

module.exports = class Ping extends Command {

  constructor(client) {
    super(client);

    this.name = "ping";
  }

  run(message) {
    var embed = this.client.getDekuEmbed(message).setDescription(':ping_pong: `...`');
    message.channel.send({embed}).then((newMessage) => {
        embed.setDescription(`:ping_pong: \`${(newMessage.createdAt - message.createdAt)}ms\``)
        newMessage.edit({embed});
    });
  }

}
