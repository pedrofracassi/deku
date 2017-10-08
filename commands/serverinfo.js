const Command = require('../structures/command.js');

module.exports = class ServerInfo extends Command {

  constructor(client) {
    super(client);

    this.name    = "serverinfo";
    this.aliases = ["si"];
  }

  run(message, args, commandLang) {
    let guild = message.guild;
    let embed = this.client.getDekuEmbed(message);
    let region = commandLang.regions[guild.region] || guild.region;
    let online = guild.members.filter(m => m.presence.status != "offline").size;

    embed.addField(commandLang.name, guild.name, true);
    embed.addField(commandLang.members, online + '/' + guild.members.size + ' online', true);
    embed.addField(commandLang.owner, guild.owner.user.tag, true);
    embed.addField(commandLang.region, region, true);
    embed.addField(commandLang.emojis, guild.emojis.size, true);
    embed.addField(commandLang.roles, guild.roles.size, true);
    embed.addField(commandLang.id, guild.id, true);
    embed.setThumbnail(guild.iconURL);

    message.channel.send({embed});
  }

  canRun(message) {
    return message.guild ? true : false;
  }
}
