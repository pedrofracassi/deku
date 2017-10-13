const Command = require('../structures/command.js');

module.exports = class Avatar extends Command {

  constructor(client) {
    super(client);

    this.name = "avatar";
  }

  run(message, args, commandLang) {
    let embed = this.client.getDekuEmbed(message);
    let query = args.join(" ").toLowerCase();
    let mbr = this.findMember(query, message);
    let msg = mbr.user == message.author ?
              commandLang.own_picture :
              commandLang.someones_picture.replace('{0}', mbr ? mbr.displayName : mbr.user.name);

    embed.setDescription(`${message.author}, ${msg}\n${mbr.user.displayAvatarURL}`);
    embed.setImage(mbr.user.displayAvatarURL);
    message.channel.send({embed});
  }

  canRun(message) {
    return message.guild ? true : false;
  }

  findMember(query, message) {
    let member = null;
    if(query) {
      member = message.guild.members.find(m => {
        return m.displayName.toLowerCase().startsWith(query) ||
        m.user.username.toLowerCase().startsWith(query) ||
        m.id == query
      });
    }

    if(!member) {
      member = message.mentions.members.first() || message.member;
    }

    return member;
  }

}
