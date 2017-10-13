const Command = require('../structures/command.js');
const xkcd = require("xkcd-node");

module.exports = class Xkcd extends Command {

  constructor(client) {
    super(client);
    this.name = "xkcd";
  }

  run(message, args, commandLang) {
    let embed = this.client.getDekuEmbed(message);
    let color = this.client.config.colors.xkcd;
    if (args[0]) {
      if (args[0] == 'latest') {
        xkcd.latest(function(error, response) {
          if (error) {
            embed.setDescription(commandLang.error_latest);
            embed.setColor(this.client.config.colors.error);
            message.channel.send({embed});
          } else {
            generateXkcdEmbed(response, embed, color);
            message.channel.send({embed});
          }
        });
      } else {
        if (args[0] % 1 === 0) {
          xkcd.get(args[0], function(error, response) {
            if (error) {
              embed.setDescription(commandLang.error_specific.replace('{0}', args[0]));
              embed.setColor(this.client.config.colors.error);
              message.channel.send({embed});
            } else {
              generateXkcdEmbed(response, embed, color);
              message.channel.send({embed});
            }
          });
        } else {
          embed.setDescription(commandLang.not_integer);
          embed.setColor(this.client.config.colors.error);
          message.channel.send({embed});
        }
      }
    } else {
      xkcd.random(function(error, response) {
        if (error) {
          embed.setDescription(commandLang.error_random);
          embed.setColor(this.client.config.colors.error);
          message.channel.send({embed});
        } else {
          generateXkcdEmbed(response, embed, color);
          message.channel.send({embed});
        }
      });
    }
  }

}

function generateXkcdEmbed(response, embed, color) {
  embed.setAuthor(response.num + ' - ' + response.title, '', 'https://xkcd.com/' + response.num);
  embed.setDescription(response.alt);
  embed.setImage(response.img);
  embed.setColor(color)
}
