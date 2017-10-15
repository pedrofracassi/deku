module.exports = class Command {

  constructor(client) {
    this.client      = client;
    this.aliases     = [];
    this.subcommands = [];
  }

  _run(message, args, commandLang, databases, lang) {
    if(args.length > 0) {
      let subcommand = this.subcommands.find(c => c.name.toLowerCase() == args[0] || c.aliases.includes(args[0]));
      if (subcommand && subcommand.canRun(message, args.slice(1))) {
        return subcommand.run(message, args.slice(1), commandLang, databases, lang);
      }
    }
    return this.run(message, args, commandLang, databases, lang)
  }

  run(message, args, commandLang, databases, lang) {}
  
  canRun(message, args) {
    return true
  }
  
}