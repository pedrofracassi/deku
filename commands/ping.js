const Command = require('../structures/command.js');

module.exports = class Ping extends Command {

  constructor(client) {
    super(client);

    this.name = "ping";
  }

  run(message) {
    var embed = this.client.getDekuEmbed(message).setDescription(':ping_pong: `...`');
    var startTime = Date.now();
    message.channel.send({embed}).then((newMessage) => {
        var endTime = Date.now();
        embed.setDescription(`:ping_pong: \`${(newMsg.createdAt - message.createdAt)}ms\``)
        message.edit({embed});
    });
  }

}
