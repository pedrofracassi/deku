const Command = require('../structures/command.js');
const utils   = require('../utils.js');

module.exports = class RoleMe extends Command {

  constructor(client) {
    super(client);

    this.name    = "roleme";
    this.aliases = ["role"];
  }

  run(message, args, commandLang, databases, lang) {
    let embed = utils.generateDekuDiv(message);
    if (args[0] == '--add') { // --add was passed, check if user has permission and add the role
      if (message.member.hasPermission('MANAGE_GUILD')) {
        if (args[1] && args[2]) {
          if (message.guild.roles.has(args[1])) {
            let role_id = args[1];
            args.splice(0, 2);
            let role_key = args.join(" ").toLowerCase();
            databases.roleme_config.get(message.guild.id, (err, result) => {
              if (result) {
                if (err) console.log(err);
                let json = JSON.parse(result);
                json[role_key] = role_id;
                databases.roleme_config.put(message.guild.id, JSON.stringify(json), err => {
                  if (err) console.log(err);
                  embed.setColor(this.client.config.colors.success);
                  embed.setDescription(commandLang.add_success
                    .replace('{0}', message.guild.roles.get(role_id))
                    .replace('{1}', role_key));
                  message.channel.send({embed});
                });
              } else {
                let object = {};
                object[role_key] = role_id;
                databases.roleme_config.put(message.guild.id, JSON.stringify(object), err => {
                  if (err) console.log(err);
                  embed.setColor(this.client.config.colors.success);
                  embed.setDescription(commandLang.add_success
                    .replace('{0}', message.guild.roles.get(role_id))
                    .replace('{1}', role_key));
                  message.channel.send({embed});
                })
              }
            });
          } else {
            embed.setColor(this.client.config.colors.error);
            embed.setDescription(commandLang.id_not_role
              .replace('{0}', args[1]));
            message.channel.send({embed});
          }
        } else {
          embed.setColor(this.client.config.colors.error);
          embed.setTitle(commandLang.insuficcient_args_add);
          embed.setDescription(commandLang.add_usage);
          message.channel.send({embed});
        }
      } else {
        embed.setColor(this.client.config.colors.error);
        embed.setDescription(commandLang.no_permission);
        message.channel.send({embed});
      }
    } else if (args[0] == '--remove') {
      if (message.member.hasPermission('MANAGE_GUILD')) {
        if (args[1]) {
          databases.roleme_config.get(message.guild.id, (err, result) => {
            if (result) {
              args.splice(0, 1);
              let role_key = args.join(" ").toLowerCase();
              let json = JSON.parse(result);
              if (json[role_key]) {
                delete json[role_key];
                databases.roleme_config.put(message.guild.id, JSON.stringify(json), err => {
                  if (err) console.log(err);
                  embed.setColor(this.client.config.colors.success)
                  embed.setDescription(commandLang.remove_success.replace('{0}', role_key));
                  message.channel.send({embed});
                });
              } else {
                embed.setColor(this.client.config.colors.error)
                embed.setDescription(commandLang.not_roleme.replace('{0}', role_key));
                message.channel.send({embed});
              }
            } else {
              embed.setColor(this.client.config.colors.error);
              embed.setDescription(commandLang.no_roleme_roles);
              message.channel.send({embed});
            }
          });
        } else {
          embed.setColor(this.client.config.colors.error);
          embed.setTitle(commandLang.insuficcient_args_remove);
          embed.setDescription(commandLang.remove_usage);
          message.channel.send({embed});
        }
      } else {
        embed.setColor(this.client.config.colors.error);
        embed.setDescription(commandLang.no_permission);
        message.channel.send({embed});
      }
    } else {
      // No flags were passed, proceed to check if role is avaliable and give it
      databases.roleme_config.get(message.guild.id, (err, result) => {
        if (result) {
          if (err) console.log(err);
          let json = JSON.parse(result);
          if (args[0]) {
            if (json[args.join(" ").toLowerCase()]) {
              let roleid = json[args.join(" ").toLowerCase()];
              if (!message.member.roles.has(roleid)) {
                message.member.addRole(roleid).then(() => this.success(embed, commandLang, message, roleid, true)).catch((err) => this.fail(embed, lang, message, roleid, true, err));
              } else {
                message.member.removeRole(roleid).then(() => this.success(embed, commandLang, message, roleid, false)).catch((err) => this.fail(embed, lang, message, roleid, false, err));
              }
            } else {
              embed.setColor(this.client.config.colors.error);
              embed.setDescription(commandLang.not_roleme.replace('{0}', args.join(" ")));
              message.channel.send({embed});
            }
          } else {
            let commands = "";
            let roles = "";
            Object.keys(json).forEach(key => {
              commands = commands + "`d!roleme " + key + "`\n";
              roles = roles + message.guild.roles.get(json[key]) + '\n';
            });
            embed.addField(commandLang.command, commands, true);
            embed.addField(commandLang.role, roles, true);
            message.channel.send(`<:izuku:358407294100439040> **${commandLang.heres_a_list}**`, {embed: embed});
          }
        } else {
          embed.setColor(this.client.config.colors.error);
          embed.setDescription(commandLang.no_roles);
          message.channel.send({embed});
        }
      });
    }
  }

  canRun(message, args) {
    return message.guild ? true : false;
  }

  success(embed, lang, message, roleid, add) {
    embed.setColor(config.colors.success)
    if (add) {
      embed.setDescription(lang.role_give_success.replace('{0}', message.guild.roles.get(roleid)));
    } else {
      embed.setDescription(lang.role_remove_success.replace('{0}', message.guild.roles.get(roleid)));
    }
    message.channel.send({embed});
  }

  fail(embed, lang, message, roleid, add, err) {
    embed.setColor(config.colors.error)
    if (add) {
      embed.setTitle(lang.role_give_fail.replace('{0}', message.guild.roles.get(roleid)));
    } else {
      embed.setTitle(lang.role_remove_fail.replace('{0}', message.guild.roles.get(roleid)));
    }

    embed.setDescription(`${lang.please_ask_owner}\n\n\`${err}\``);
    message.channel.send({embed});
  }

}
