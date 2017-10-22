module.exports = class Command {

  constructor(client) {
    this.client      = client;
    this.aliases     = [];
    this.subcommands = [];
  }
  
  /**
   * Check for subcommands, if finds execute it else executes the command itself
   * @param {Message} message Message that triggered this command
   * @param {Array<string>} args Command arguments
   * @param {Object} commandLang Language object with strings for this command
   * @param {Object} databases Bot's databases object
   * @param {Object} lang Current guild's language object
   */
  _run(message, args, commandLang, databases, lang) {
    if(args.length > 0) {
      let subcommand = this.subcommands.find(c => c.name.toLowerCase() == args[0] || c.aliases.includes(args[0]));
      if (subcommand && subcommand.canRun(message, args.slice(1))) {
        return subcommand.run(message, args.slice(1), commandLang, databases, lang);
      }
    }
    return this.run(message, args, commandLang, databases, lang)
  }
  
  /**
   * Execute this command
   * @param {Message} message Message that triggered this command
   * @param {Array<string>} args Command arguments
   * @param {Object} commandLang Language object with strings for this command
   * @param {Object} databases Bot's databases object
   * @param {Object} lang Current guild's language object
   */
  run() {}
  
  /**
   * Returns true if this command can be ran
   * @param {Message} message Message that triggered this command
   * @param {Array<string>} args Command arguments
   * @returns {boolean} If this command can be ran
   */
  canRun() {
    return true
  }
  
}