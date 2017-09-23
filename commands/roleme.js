const utils   = require('../utils.js');
const config   = require('../config.js');
const levelup = require('levelup');

var db = levelup('./databases/roleme');

// d!roleme [--add|--remove] <role name> [role id]
exports.run = function (message, lang) {
  var embed = utils.generateDekuDiv(message);
  var args = message.content.match(utils.expression)[2].split(' ');
  if (args[0] == '--add') { // --add was passed, check if user has permission and add the role
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args[1] && args[2]) {
        if (message.guild.roles.has(args[1])) {
          var role_id = args[1];
          args.splice(0, 2);
          var role_key = args.join(" ").toLowerCase();
          db.get(message.guild.id, (err, result) => {
            if (result) {
              if (err) console.log(err);
              var json = JSON.parse(result);
              json[role_key] = role_id;
              db.put(message.guild.id, JSON.stringify(json), err => {
                if (err) console.log(err);
                embed.setColor(config.colors.success);
                embed.setDescription(lang.commands.roleme.add_success
                  .replace('{0}', message.guild.roles.get(role_id))
                  .replace('{1}', role_key));
                message.channel.send({embed});
              });
            } else {
              var object = {};
              object[role_key] = role_id;
              db.put(message.guild.id, JSON.stringify(object), err => {
                if (err) console.log(err);
                embed.setColor(config.colors.success);
                embed.setDescription(lang.commands.roleme.add_success
                  .replace('{0}', message.guild.roles.get(role_id))
                  .replace('{1}', role_key));
                message.channel.send({embed});
              })
            }
          });
        } else {
          embed.setColor(config.colors.error);
          embed.setDescription(lang.commands.roleme.id_not_role
            .replace('{0}', args[1]));
          message.channel.send({embed});
        }
      } else {
        embed.setColor(config.colors.error);
        embed.setTitle(lang.commands.roleme.insuficcient_args_add);
        embed.setDescription(lang.commands.roleme.add_usage);
        message.channel.send({embed});
      }
    } else {
      embed.setColor(config.colors.error);
      embed.setDescription(lang.commands.roleme.no_permission);
      message.channel.send({embed});
    }
  } else if (args[0] == '--remove') {
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args[1]) {
        db.get(message.guild.id, (err, result) => {
          if (result) {
            args.splice(0, 1);
            var role_key = args.join(" ").toLowerCase();
            var json = JSON.parse(result);
            if (json[role_key]) {
              delete json[role_key];
              db.put(message.guild.id, JSON.stringify(json), err => {
                if (err) console.log(err);
                embed.setColor(config.colors.success)
                embed.setDescription(lang.commands.roleme.remove_success.replace('{0}', role_key));
                message.channel.send({embed});
              });
            } else {
              embed.setColor(config.colors.error)
              embed.setDescription(lang.commands.roleme.not_roleme.replace('{0}', role_key));
              message.channel.send({embed});
            }
          } else {
            embed.setColor(config.colors.error);
            embed.setDescription(lang.commands.roleme.no_roleme_roles);
            message.channel.send({embed});
          }
        });
      } else {
        embed.setColor(config.colors.error);
        embed.setTitle(lang.commands.roleme.insuficcient_args_remove);
        embed.setDescription(lang.commands.roleme.remove_usage);
        message.channel.send({embed});
      }
    } else {
      embed.setColor(config.colors.error);
      embed.setDescription(lang.commands.roleme.no_permission);
      message.channel.send({embed});
    }
  } else {
    // No flags were passed, proceed to check if role is avaliable and give it
    db.get(message.guild.id, (err, result) => {
      if (result) {
        if (err) console.log(err);
        console.log(json);
        var json = JSON.parse(result);
        if (args[0]) {
          if (json[args.join(" ").toLowerCase()]) {
            var roleid = json[args.join(" ").toLowerCase()];
            if (!message.member.roles.has(roleid)) {
              message.member.addRole(roleid).then(() => success(embed, lang, message, roleid, true)).catch((err) => fail(embed, lang, message, roleid, true, err));
            } else {
              message.member.removeRole(roleid).then(() => success(embed, lang, message, roleid, false)).catch((err) => fail(embed, lang, message, roleid, false, err));
            }
          } else {
            embed.setColor(config.colors.error);
            embed.setDescription(lang.command.roleme.not_roleme.replace('{0}', args.join(" ")));
            message.channel.send({embed});
          }
        } else {
          var commands = "";
          var roles = "";
          Object.keys(json).forEach(key => {
            commands = commands + "`d!roleme " + key + "`\n";
            roles = roles + message.guild.roles.get(json[key]) + '\n';
          });
          embed.addField(lang.commands.roleme.command, commands, true);
          embed.addField(lang.commands.roleme.role, roles, true);
          message.channel.send(`<:izuku:358407294100439040> **${lang.commands.roleme.heres_a_list}**`, {embed: embed});
        }
      } else {
        embed.setColor(config.colors.error);
        embed.setDescription(lang.commands.roleme.no_roles);
        message.channel.send({embed});
      }
    });
  }
}

function success(embed, lang, message, roleid, add) {
  embed.setColor(config.colors.success)
  if (add) {
    embed.setDescription(lang.commands.roleme.role_give_success.replace('{0}', message.guild.roles.get(roleid)));
  } else {
    embed.setDescription(lang.commands.roleme.role_remove_success.replace('{0}', message.guild.roles.get(roleid)));
  }
  message.channel.send({embed});
}

function fail(embed, lang, message, roleid, add, err) {
  embed.setColor(config.colors.error)
  if (add) {
    embed.setTitle(lang.commands.roleme.role_give_fail.replace('{0}', message.guild.roles.get(roleid)));
  } else {
    embed.setTitle(lang.commands.roleme.role_remove_fail.replace('{0}', message.guild.roles.get(roleid)));
  }
  console.log(err);
  embed.setDescription(`${lang.commands.roleme.please_ask_owner}\n\n\`${err}\``);

  message.channel.send({embed});
}
