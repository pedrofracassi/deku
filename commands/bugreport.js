const Command = require('../structures/command.js');

module.exports = class BugReport extends Command {

  constructor(client) {
    super(client);

    this.name    = "bugreport";
    this.aliases = ["br"];
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    if (args[0]) {
      this.client.trello.post("/1/cards/", {
        name: args.join(' '),
        desc: `Reported by **${message.author.tag}**`,
        idList: '59c15e4f8fea8232a3089357',
        pos: 'top',
        idLabels: '59c15dc71314a33999b052e8'
      }, (err, res) => {
        if (err) {
          embed.setColor(this.client.config.colors.error);
          embed.setTitle(commandLang.trello_error);
          embed.setDescription(`${commandLang.trello_error_desc}\n\n\`${err}\``);
          message.channel.send({embed});
        } else {
          embed.setColor(this.client.config.colors.success);
          embed.setTitle(commandLang.card_add_success);
          embed.setDescription(res.shortUrl);
          message.channel.send({embed});
        }
      });
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setTitle(commandLang.no_suggestion);
      embed.setDescription(`\u200b\n${lang.usage} \`${commandLang._usage}\`\n${lang.example} \`${commandLang._example}\``);
      message.channel.send({embed});
    }
  }

}
