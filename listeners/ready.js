const EventListener = require('../structures/listener.js');
const fs            = require('fs');

module.exports = class ReadyListener extends EventListener {

  constructor(client) {
    super(client);
  }

  onReady() {
  	if(this.devMode && fs.existsSync('./.git/')) {
      let file = fs.readFileSync("./.git/HEAD").toString();
      let branch = /ref: refs\/heads\/(.+)(?:\\n)?/g.exec(file)[1];
      this.user.setGame(`Branch: ${branch} - ${process.env.PREFIX}help`);
    } else {
      this.user.setGame(this.config.customGame || `${process.env.PREFIX}help`);
    }
    this.log(['BOT', 'Discord'], `Ready! Authenticated as ${this.user.tag}`.green.bold);
  }

}
