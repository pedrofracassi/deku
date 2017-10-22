const Command = require('../structures/command.js');
const SubCommand = require('../structures/subcommand.js');

module.exports = class Say extends Command {

  constructor(client) {
    super(client);
    this.name = "say";
    this.subcommands = [new EmbedSay(client, this)];
  }

  run(message, args, commandLang, databases, lang) {
    if (message.member.hasPermission('MANAGE_GUILD')) {
      message.channel.send(args.join(' '));
      message.delete();
    } else {
      var embed = this.client.getDekuEmbed(message);
      embed.setDescription(lang.missing_manageguild_permission);
      embed.setColor(this.client.config.colors.error);
      message.channel.send(embed);
    }
  }

}

class EmbedSay extends SubCommand {
  constructor(client, parentCommand) {
    super(client, parentCommand);

    this.name    = "embed";
    this.aliases = ["--embed"];
  }

  run(message, args, commandLang, databases, lang) {
    if (message.member.hasPermission('MANAGE_GUILD')) {
      try {
        var json = JSON.parse(args.join(' '));
      } catch (e) {
        var embed = this.client.getDekuEmbed(message);
        embed.setColor(this.client.config.colors.error);
        embed.setTitle(commandLang.json_error_title);
        embed.setDescription(commandLang.json_error_desc);
        message.channel.send(embed);
        return;
      }
      message.delete();
      if (json.content) {
        message.channel.send(json.content, json);
      } else {
        message.channel.send(json);
      }
    } else {
      var embed = this.client.getDekuEmbed(message);
      embed.setDescription(lang.missing_manageguild_permission);
      embed.setColor(this.client.config.colors.error);
      message.channel.send(embed);
    }
  }
}
