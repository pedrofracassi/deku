const Command = require('../structures/command.js');

module.exports = class RoleIds extends Command {

  constructor(client) {
    super(client);

    this.name    = "roleids"
    this.aliases = ["rids"];
  }

  run(message, args, commandLang) {
    let embed = this.client.getDekuEmbed(message);
 	  let roles = message.guild.roles.map(r => r.toString());
  	let ids   = message.guild.roles.map(r => r.id);
  	embed.addField(commandLang.role, roles.join("\n"), true);
  	embed.addField(commandLang.id, ids.join("\n"), true);
  	message.channel.send({embed});
  }

  canRun(message) {
  	return message.guild ? true : false;
  }

}
