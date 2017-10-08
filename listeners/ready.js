const EventListener = require('../structures/listener.js');
const fs            = require('fs');

module.exports = class ReadyListener extends EventListener {

  constructor(client) {
    super(client);
  }

  onReady() {
  	if(this.devMode) {
      let file = fs.readFileSync("./.git/HEAD").toString();
      let branch = /ref: refs\/heads\/(.+)(?:\\n)?/g.exec(file)[1];
      this.user.setGame(`Branch: ${branch} - ${this.config.prefix}help`);
    } else {
      this.user.setGame(this.config.customGame || `${this.config.prefix}help`);
    }
    this.log(['BOT', 'Discord'], `Ready! Authenticated as ${this.user.tag}`.green.bold);
  }

}