const Command    = require('../structures/command.js');
const SubCommand = require('../structures/subcommand.js');

module.exports = class RoleMe extends Command {

  constructor(client) {
    super(client);

    this.name           = "roleme";
    this.aliases        = ["role", "rolaemmim"];
    this.subcommands    = [new RoleMeAdd(client, this), new RoleMeRemove(client, this)];

    this.blacklistNames = this.subcommands
      .map(c => [c.name].concat(c.aliases))
      .reduce((a, b) => a.concat(b));
  }

  async run(message, args, commandLang, databases, lang) {
    let embed    = this.client.getDekuEmbed(message);
    let rolemeDB = databases.roleme_config;
    let roles    = await rolemeDB.getPromise(message.guild.id) || {};
    if(roles && Object.keys(roles).length > 0) {
      if (args.length > 0) {
        let roleName = args.join(' ').toLowerCase();
        let roleId   = roles[roleName];
        if (roleId) {
          let add  = !message.member.roles.has(roleId);
          let cb   = this.feedbackRun(message, commandLang, roleId, add);
          if (add) message.member.addRole(roleId).then(() => cb()).catch(e => cb(true, e));
          else     message.member.removeRole(roleId).then(() => cb()).catch(e => cb(true, e));
        } else {
          embed.setColor(this.client.config.colors.error);
          embed.setDescription(commandLang.not_roleme.replace('{0}', roleName));
          message.channel.send({embed});
        }
      } else {
        let commands = Object.keys(roles).map(k => {
          return `d!roleme ${k}`;
        }).join('\n');
        
        let roleList = Object.keys(roles).map(k => {
          return message.guild.roles.get(roles[k]).toString();
        }).join('\n');
          
        embed.addField(commandLang.command, commands, true);
        embed.addField(commandLang.role, roleList, true);
        
        message.channel.send(`<:izuku:358407294100439040> **${commandLang.heres_a_list}**`, {embed});
      }
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setDescription(commandLang.no_roles);
      message.channel.send({embed});
    }
  }

  canRun(message, args) {
    return message.guild ? true : false;
  }

  feedbackRun(message, lang, roleId, add) {
    return (hasError, err) => {
      let embed = this.client.getDekuEmbed(message);
      let role  = message.guild.roles.get(roleId);

      if(hasError) {
        embed.setColor(this.client.config.colors.error);
        let title = add ? lang.role_give_fail : lang.role_remove_fail;
        embed.setTitle(title.replace('{0}', role));
        embed.setDescription(`${lang.please_ask_owner}\n\n\`${err}\``);
      } else {
        embed.setColor(this.client.config.colors.success);
        let description = add ? lang.role_give_success : lang.role_remove_success;
        embed.setDescription(description.replace('{0}', role));
      }

      message.channel.send({embed});
    };
  }

}

// d!roleme --add ID NAME
class RoleMeAdd extends SubCommand {

  constructor(client, parentCommand) {
    super(client, parentCommand);

    this.name    = "add";
    this.aliases = ["--add"];
  }

  async run(message, args, commandLang, databases, lang) {
    let embed    = this.client.getDekuEmbed(message).setColor(this.client.config.colors.error);
    let rolemeDB = databases.roleme_config;
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args.length > 1) {
        let roleId   = args[0];
        let roleName = args.slice(1).join(' ').toLowerCase();
        if (message.guild.roles.has(roleId)) {
          //if(!this.parentCommand.blacklistNames.includes(roleName)) {
          if(true) {
            let roles = await rolemeDB.getPromise(message.guild.id);
            if(!roles || Object.keys(roles).length < 1) roles = {};

            roles[roleName] = roleId;
            await rolemeDB.putPromise(message.guild.id, roles);
            embed.setColor(this.client.config.colors.success);
            embed.setDescription(commandLang.add_success
              .replace('{0}', message.guild.roles.get(roleId))
              .replace('{1}', roleName));
          } else {
            embed.setDescription(commandLang.invalid_rolename);
          }
        } else {
          embed.setDescription(commandLang.id_not_role
            .replace('{0}', roleId));
        }
      } else {
        embed.setTitle(commandLang.insuficcient_args_add);
        embed.setDescription(commandLang.add_usage);
      }
    } else {
      embed.setDescription(commandLang.no_permission);
    }
    
    message.channel.send({embed});
  }

}

// d!roleme --remove NAME
class RoleMeRemove extends SubCommand {

  constructor(client, parentCommand) {
    super(client, parentCommand);

    this.name    = "remove";
    this.aliases = ["rem", "--remove", "--rem"];
  }

  async run(message, args, commandLang, databases, lang) {
    let embed    = this.client.getDekuEmbed(message).setColor(this.client.config.colors.error);
    let rolemeDB = databases.roleme_config;
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args.length > 0) {
        let roles = await rolemeDB.getPromise(message.guild.id);
        if(roles && Object.keys(roles).length > 0) {
          let roleName = args.join(" ").toLowerCase();
          if(roles[roleName]) {
            delete roles[roleName];
            await rolemeDB.putPromise(message.guild.id, roles);
            embed.setColor(this.client.config.colors.success)
            embed.setDescription(commandLang.remove_success.replace('{0}', roleName));
            
          } else {
            embed.setDescription(commandLang.not_roleme.replace('{0}', roleName));
          }
        } else {
          embed.setDescription(commandLang.no_roles);
        }
      } else {
        embed.setTitle(commandLang.insuficcient_args_remove);
        embed.setDescription(commandLang.remove_usage);
      }
    } else {
      embed.setDescription(commandLang.no_permission);
    }
    
    message.channel.send({embed});
  }

}
