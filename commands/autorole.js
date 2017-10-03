const levelup = require('levelup');
const utils = require('../utils.js');
const config = require('../config.js');
const cmdName = 'autorole';

// d!autorole <role> [--bots]

exports.run = function (message, lang, databases) {
  var db = databases.autorole_config;
  var embed = utils.generateDekuDiv(message);
  var args = message.content.match(utils.expression)[2].split(' ');
  if (args[0]) {
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args[0] == '--clear') {
        db.del(message.guild.id, function (err) {
          if (!err) {
            embed.setColor(config.colors.success);
            embed.setDescription(lang.commands[cmdName].clear_success);
            message.channel.send({embed});
          } else {
            embed.setColor(config.colors.error);
            embed.setDescription(lang.commands[cmdName].clear_error.replace('{0}', err));
            message.channel.send({embed});
          }
        });
      } else {
        if (message.guild.roles.get(args[0])) {
          var type = 'everyone';
          if (args[1] == '--bots') type = 'bots';
          db.get(message.guild.id, function (err, value) {
            if (!value) value = "{}";
            value = JSON.parse(value);
            value[type] = args[0];
            console.log(value);
            db.put(message.guild.id, JSON.stringify(value), function (err) {
              if (!err) {
                embed.setColor(config.colors.success);
                if (type == 'everyone') embed.setDescription(lang.commands[cmdName].db_put_success.replace('{0}', message.guild.roles.get(args[0])));
                if (type == 'bots') embed.setDescription(lang.commands[cmdName].db_put_success_bots.replace('{0}', message.guild.roles.get(args[0])));
                message.channel.send({embed});
              } else {
                embed.setColor(config.colors.error);
                embed.setDescription(lang.commands[cmdName].db_put_error);
                message.channel.send({embed});
              }
            });
          });
        } else {
          embed.setColor(config.colors.error);
          embed.setTitle(lang.commands[cmdName].inexistent_role.replace('{0}', args[0]));
          embed.setDescription(`\u200b\n${lang.usage} \`${lang.commands[cmdName]. _usage}\`\n${lang.example} \`${lang.commands[cmdName]._example}\``);
          embed.setFooter(lang.commands[cmdName].pro_tip);
          message.channel.send({embed});
        }
      }
    } else {
      embed.setColor(config.colors.error);
      embed.setDescription(lang.commands[cmdName].no_permission);
      message.channel.send({embed});
    }
  } else {
    embed.setColor(config.colors.error);
    embed.setTitle(lang.commands[cmdName].no_args);
    embed.setDescription(`\u200b\n${lang.usage} \`${lang.commands[cmdName]. _usage}\`\n${lang.example} \`${lang.commands[cmdName]._example}\``);
    embed.setFooter(lang.commands[cmdName].pro_tip);
    message.channel.send({embed});
  }
};
