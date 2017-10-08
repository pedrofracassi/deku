const EventListener = require('../structures/listener.js');

module.exports = class GuildMemberAddListener extends EventListener {

  constructor(client) {
    super(client);
  }

  onGuildMemberAdd(member) {
  	this.databases.autorole_config.get(member.guild.id, (err, value) => {
      value = value ? JSON.parse(value) : null
      if (value) {
        if (member.user.bot && (value.bots || value.everyone)) member.addRole(value.bots || value.everyone);
        else if(!member.user.bot && value.everyone)            member.addRole(value.everyone);
      }
    });
  }

}