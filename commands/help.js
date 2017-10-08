const Command = require('../structures/command.js');

module.exports = class Help extends Command {

  constructor(client) {
    super(client);

    this.name    = "help";
    this.aliases = ["h"];
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    embed.setDescription(`**${commandLang.check_dm}**`);
    message.channel.send({embed});

    let commandList = this.client.commands.filter(c => !c.hideHelp && lang.commands[c.name]).map(c => {
      return `**${c.name}**: \`${lang.commands[c.name]._usage}\`\n${lang.commands[c.name]._description}`
    });
    message.author.send(commandList.join("\n\n"));
  }

}
