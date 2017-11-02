const Command    = require('../structures/command.js');
const SubCommand = require('../structures/subcommand.js');

module.exports = class Autorole extends Command {

  constructor(client) {
    super(client);

    this.name        = "autorole";
    this.aliases     = ["ar", "autoroles"];
    this.subcommands = [new AutoroleClear(client, this)];
  }

  async run(message, args, commandLang, databases, lang) {
    let embed      = this.client.getDekuEmbed(message).setColor(this.client.config.colors.error);
    let autoroleDB = databases.autorole_config;
    let autorole = await autoroleDB.getPromise(message.guild.id) || {};
    if (args.length > 0) {
      if (message.member.hasPermission('MANAGE_GUILD')) {
        let role = message.guild.roles.get(args[0]);
        if (role) {
          let type = args[1] == '--bots' ? 'bots' : 'everyone';
          autorole[type] = role.id;
          
          try {
            await autoroleDB.putPromise(message.guild.id, autorole);
            
            let text = type == 'bots' ? commandLang.db_put_success_bots : commandLang.db_put_success;
            embed.setColor(this.client.config.colors.success);
            embed.setDescription(text.replace('{0}', role));
          } catch(err) {
            embed.setDescription(commandLang.db_put_error);
          }
        } else {
          embed.setTitle(commandLang.inexistent_role.replace('{0}', args[0]));
          embed.setDescription(`\u200b\n${lang.usage} \`${commandLang._usage}\`\n${lang.example} \`${commandLang._example}\``);
          embed.setFooter(commandLang.pro_tip);
        }
      } else {
        embed.setColor(this.client.config.colors.error);
        embed.setDescription(commandLang.no_permission);
      }
    } else {
      if(!autorole || Object.keys(autorole).length < 1) {
        embed.setDescription(commandLang.no_roles);
      } else {
        if(autorole['bots'])     embed.addField(commandLang.bots_role, message.guild.roles.get(autorole['bots']), true);
        if(autorole['everyone']) embed.addField(commandLang.everyone_role, message.guild.roles.get(autorole['everyone']), true);
      }
    }
    
    message.channel.send({embed});
  }

  canRun(message, args) {
    return message.guild ? true : false;
  }

}


// d!autorole --clear
class AutoroleClear extends SubCommand {

  constructor(client, parentCommand) {
    super(client, parentCommand);

    this.name    = "clear";
    this.aliases = ["--clear"];
  }

  async run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message).setColor(this.client.config.colors.error);
    if (message.member.hasPermission('MANAGE_GUILD')) {
      let autoroleDB = databases.autorole_config;
      try {
        await autoroleDB.delPromise(message.guild.id);
        embed.setColor(this.client.config.colors.success);
        embed.setDescription(commandLang.clear_success);
      } catch(err) {
        embed.setDescription(commandLang.clear_error.replace('{0}', err));
      }
    } else {
      embed.setDescription(commandLang.no_permission);
    }
    
    message.channel.send({embed});
  }

}
