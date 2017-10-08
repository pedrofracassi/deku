const Command = require('../structures/command.js');

module.exports = class Avatar extends Command {

  constructor(client) {
    super(client);

    this.name = "avatar";
  }

  run(message, args, commandLang) {
    let member = message.mentions.members.first() || message.member;
    let user   = member ? member.user : message.author;
    let msg = user == message.author ? commandLang.own_picture : commandLang.someones_picture.replace('{0}', member ? member.displayName : user.name);
    message.reply(`${msg}\n${user.avatarURL}`);
  }

}
