const Command = require('../structures/command.js');

module.exports = class LMGTFY extends Command {

  constructor(client) {
    super(client);

    this.name = "lmgtfy";
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    if (args[0]) {
      let text = args.join(" ");
      if(text.includes('--explain')) {
        embed.setDescription('http://lmgtfy.com/?iie=1&q=' + encodeURI(text.replace('--explain', '')));
      } else {
        embed.setDescription('http://lmgtfy.com/?q=' + encodeURI(text));
      }
    } else {
      embed.setTitle(commandLang.no_question);
      embed.setDescription(`\u200b\n${lang.usage} \`${commandLang. _usage}\`\n${lang.example} \`${commandLang._example}\``);
    }
    message.channel.send({embed});
  }

}
