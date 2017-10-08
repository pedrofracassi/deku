const EventListener = require('../structures/listener.js');

const aaaaa = [
  'https://68.media.tumblr.com/fd6fe86504873748f4c144165150e92b/tumblr_inline_ot9khjqUeW1qmvdcs_540.jpg',
  'https://i.redd.it/03uix203ymqy.png',
  'https://i.imgur.com/rBoud0V.png',
  'https://i.imgur.com/ZTGX4FW.jpg',
  'https://i.imgur.com/h7O77r8.jpg'
];

module.exports = class MessageListener extends EventListener {

  constructor(client) {
    super(client);
  }

  onMessage(message) {
  	if (message.author.bot) return;
    if (message.content.startsWith(this.config.prefix)) {
      let fullCmd = message.content.split(" ");
      let args = fullCmd.splice(1);
      let cmd = fullCmd[0].substring(this.config.prefix.length).toLowerCase();
      let command = this.commands.find(c => c.name.toLowerCase() == cmd || c.aliases.includes(cmd));

      if (command && command.canRun(message, args)) {
        this.getGuildLanguage(message.guild).then(language => {
          command.run(message, args, language.commands[command.name], this.databases, language);
        });
      }
    }

    if (message.content.toLowerCase().startsWith('aaaaaaaaaaaaaaa')) {
      message.channel.send(aaaaa[Math.floor(Math.random() * aaaaa.length)]);
    }
  }

}