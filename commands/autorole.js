const Command = require('../structures/command.js');
const utils   = require('../utils.js');

module.exports = class Autorole extends Command {

  constructor(client) {
    super(client);

    this.name    = "autorole";
    this.aliases = ["ar"];
  }

  run(message, args, commandLang, databases, lang) {
    let embed = utils.generateDekuDiv(message);
    let db = databases.autorole_config;
    if (args[0]) {
      if (message.member.hasPermission('MANAGE_GUILD')) {
        if (args[0] == '--clear') {
          db.del(message.guild.id, (err) => {
            if (!err) {
              embed.setColor(this.client.config.colors.success);
              embed.setDescription(commandLang.clear_success);
              message.channel.send({embed});
            } else {
              embed.setColor(this.client.config.colors.error);
              embed.setDescription(commandLang.clear_error.replace('{0}', err));
              message.channel.send({embed});
            }
          });
        } else {
          if (message.guild.roles.get(args[0])) {
            var type = 'everyone';
            if (args[1] == '--bots') type = 'bots';
            db.get(message.guild.id, (err, value) => {
              if (!value) value = "{}";
              value = JSON.parse(value);
              value[type] = args[0];
              db.put(message.guild.id, JSON.stringify(value), (err) => {
                if (!err) {
                  embed.setColor(this.client.config.colors.success);
                  if (type == 'everyone') embed.setDescription(commandLang.db_put_success.replace('{0}', message.guild.roles.get(args[0])));
                  if (type == 'bots') embed.setDescription(commandLang.db_put_success_bots.replace('{0}', message.guild.roles.get(args[0])));
                  message.channel.send({embed});
                } else {
                  embed.setColor(this.client.config.colors.error);
                  embed.setDescription(commandLang.db_put_error);
                  message.channel.send({embed});
                }
              });
            });
          } else {
            embed.setColor(this.client.config.colors.error);
            embed.setTitle(commandLang.inexistent_role.replace('{0}', args[0]));
            embed.setDescription(`\u200b\n${lang.usage} \`${commandLang._usage}\`\n${lang.example} \`${commandLang._example}\``);
            embed.setFooter(commandLang.pro_tip);
            message.channel.send({embed});
          }
        }
      } else {
        embed.setColor(this.client.config.colors.error);
        embed.setDescription(commandLang.no_permission);
        message.channel.send({embed});
      }
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setTitle(commandLang.no_args);
      embed.setDescription(`\u200b\n${lang.usage} \`${commandLang._usage}\`\n${lang.example} \`${commandLang._example}\``);
      embed.setFooter(commandLang.pro_tip);
      message.channel.send({embed});
    }
  }

  canRun(message, args) {
    return message.guild ? true : false;
  }

}
