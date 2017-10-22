const Command = require('../structures/command.js');

module.exports = class Eval extends Command {

  constructor(client) {
    super(client);

    this.name     = "eval";
    this.aliases  = ["e", "evaluate", "execute"];
    this.hideHelp = true;
  }

  run(message, args) {
    try {
      const code = args.join(" ");
      let evaled = this.clean(require("util").inspect(eval(code)));
      message.channel.send(evaled, {code: "xl" }).catch(err => {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(err)}\n\`\`\``);
      });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(err)}\n\`\`\``);
    }
  }

  canRun(message) {
    return message.author.id == this.client.config.ownerId;
  }

  clean(text) {
    return typeof text === "string" ? text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : text;
  }

}
