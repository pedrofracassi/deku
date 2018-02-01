const Command = require('../structures/command.js');

module.exports = class BugReport extends Command {

  constructor(client) {
    super(client);
    this.name    = "generateinvite";
    this.aliases = ["geninvite", "geninv", "gi", "invitegen"];
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    let options = {
      unique: true
    }
    if (message.member.hasPermission('CREATE_INSTANT_INVITE')) {
      message.channel.startTyping();
      let channel = message.member.voiceChannel ? message.member.voiceChannel : message.channel;
      channel.createInvite({options: options}, lang.reason).then(invite => {
          embed.setTitle(commandLang.heres_your_invite.replace('{0}', channel.name)).setDescription(invite.url);
          message.channel.send(embed);
          message.channel.stopTyping();
      });
    } else {
      embed.setTitle(lang.missing_invite_permission);
      embed.setColor(this.client.config.colors.error);
      message.channel.send(embed);
    }

  }

}

// Config flags
// disable-command:generateinvite
// generateinvite-cmd:allow-anyone
