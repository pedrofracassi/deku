const Command = require('../structures/command.js');
const npmapi = require('api-npm');

module.exports = class NPM extends Command {

  constructor(client) {
    super(client);

    this.name = "npm"
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    if (args[0]) {
      message.channel.startTyping();
      npmapi.getdetails(args.join('-'), data => {
        if (data.name) {
          embed.setColor(this.client.config.colors.npm);
          embed.setAuthor(data.name, 'https://i.imgur.com/24yrZxG.png', 'https://www.npmjs.com/package/' + data.name);
          embed.setDescription(`${data.description}\nhttps://www.npmjs.com/package/${data.name}\n\n\`npm install --save ${data.name}\``);
        } else {
          embed.setColor(this.client.config.colors.error);
          embed.setTitle(commandLang.package_not_found);
          embed.setDescription(`${commandLang.package_not_found_desc}\n\n${lang.usage} \`${commandLang. _usage}\`\n${lang.example} \`${commandLang._example}\``);
        }
        message.channel.stopTyping();
        message.channel.send({embed});
      });
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setTitle(commandLang.no_args);
      embed.setDescription(`\u200b\n${lang.usage} \`${commandLang. _usage}\`\n${lang.example} \`${commandLang._example}\``);
      message.channel.stopTyping();
      message.channel.send({embed});
    }
  }

}
