const Command = require('./command.js');

module.exports = class SubCommand extends Command {
  
  constructor(client, parentCommand) {
    super(client);
    this.parentCommand = parentCommand;
  }
  
}