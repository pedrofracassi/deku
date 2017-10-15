const Command = require('../structures/command.js');
const request = require('request');

module.exports = class TogetherTube extends Command {

  constructor(client) {
    super(client);
    this.name    = "togethertube";
    this.aliases = ["ttube", "ttb"];
  }

  run(message, args, commandLang) {
    let embed = this.client.getDekuEmbed(message);
    message.channel.startTyping();
    request('https://togethertube.com/room/create', (error, response) => {
      if (error) {
        embed.setColor(this.client.config.colors.error);
        embed.setTitle(commandLang.error_title);
        embed.setDescription(commandLang.error_description);
      } else {
        embed.setDescription(response.request.uri.href);
        embed.setAuthor('TogetherTube', 'https://togethertube.com/assets/img/favicons/favicon-32x32.png', 'https://togethertube.com/');
      }
      message.channel.stopTyping();
      message.channel.send({embed});
    });
  }

}
