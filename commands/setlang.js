const Command = require('../structures/command.js');
const utils   = require('../utils.js');

module.exports = class SetLang extends Command {

  constructor(client) {
    super(client);

    this.name    = "setlang"
    this.aliases = ["sl"];
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args[0]) {
        if (this.client.languages[args[0]]) {
          databases.language_config.put(message.guild.id, args[0], () => {
            embed.setColor(this.client.config.colors.success);
            embed.setDescription(commandLang.success.replace('{0}', args[0]));
            message.channel.send({embed});
          });
        } else {
          embed.setColor(this.client.config.colors.error);
          embed.setTitle(commandLang.not_supported.replace('{0}', args[0]));
          embed.setDescription(commandLang.usage.replace('{0}', utils.arrayToStringWithCommas(Object.keys(this.client.languages), lang.and)));
          message.channel.send({embed});
        }
      } else {
        embed.setColor(this.client.config.colors.error);
        embed.setTitle(commandLang.no_args);
        embed.setDescription(commandLang.usage.replace('{0}', utils.arrayToStringWithCommas(Object.keys(this.client.languages), lang.and)));
        message.channel.send({embed});
      }
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setDescription(commandLang.no_permission);
      message.channel.send({embed});
    }
  }

  canRun(message) {
    return message.guild ? true : false;
  }

}
