module.exports = class Command {
	
	constructor(client) {
		this.client  = client;
		this.aliases = [];
	}

	run(message, args, commandLang, databases, lang) {}
	canRun(message, args) { return true }
}