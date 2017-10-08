const Discord = require('discord.js');
const fs      = require('fs');
const colors  = require('colors');

// Apis
const Trello  = require("node-trello");
const Nodesu = require('nodesu');

const aaaaa = [
  'https://68.media.tumblr.com/fd6fe86504873748f4c144165150e92b/tumblr_inline_ot9khjqUeW1qmvdcs_540.jpg',
  'https://i.redd.it/03uix203ymqy.png',
  'https://i.imgur.com/rBoud0V.png',
  'https://i.imgur.com/ZTGX4FW.jpg',
  'https://i.imgur.com/h7O77r8.jpg'
];

module.exports = class Deku extends Discord.Client {

  constructor(options = {}) {
    super(options);

    this.config      = options.config;
    this.databases   = options.databases;
    this.commands    = [];
    this.languages   = {};
    this.devMode     = this.config.devMode;

    this.trello      = new Trello(this.config.trello_key, this.config.trello_token);
    this.nodesu      = new Nodesu.Client(this.config.osu);

    const self = this;
    var failed = 0;
    fs.readdirSync("./commands").forEach(file => {
      if (file.endsWith(".js")) {
        try {
          let Command = require("./commands/"+file);
          this.commands.push(new Command(self));
        } catch (e) {
          console.log('[BOT] [Commands] ' + (file + ' failed to load.').red);
          failed++;
        }
      }
    });
    if (failed == 0) {
      console.log('[BOT] [Commands] ' + ('All ' + this.commands.length + ' commands loaded succesfully').green);
    } else if (this.commands.length == 0){
      console.log('[BOT] [Commands] ' + ('No commands were loaded succesfully.').yellow);
    } else {
      console.log('[BOT] [Commands] ' + (this.commands.length + ' commands loaded succesfully, ' + failed + ' failed.').yellow);
    }

    fs.readdirSync("./translation").forEach(file => {
      if (file.endsWith(".json")) {
        this.languages[file.replace('.json', '')] = require("./translation/"+file);
      }
    });

    this.on('ready', this.onReady);
    this.on('message', this.onMessage);
    this.on('guildMemberAdd', this.onGuildMemberAdd);
    this.on('guildCreate', this.onGuildCreate)
  }

  getGuildLanguage(guild) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.databases.language_config.get(guild.id, (err, value) => {
        if (err) value = 'en_US';
        resolve(self.languages[value] || self.languages['en_US']);
      })
    });
  }

  start(token) {
    console.log("[BOT] [Discord] Authenticating...");
    if (!token && this.config) token = this.config.discord;
    this.login(token);
  }

  /*
  *  EVENTS
  */

  onReady() {
    if(this.devMode) {
      let file = fs.readFileSync("./.git/HEAD").toString();
      let branch = /ref: refs\/heads\/(.+)(?:\\n)?/g.exec(file)[1];
      this.user.setGame(`Branch: ${branch} - ${this.config.prefix}help`);
    } else {
      this.user.setGame(this.config.customGame || `${this.config.prefix}help`);
    }
    console.log("[BOT] [Discord] " + ("Ready, authenticated as " + this.user.tag).green);
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

  onGuildMemberAdd(member) {
    this.databases.autorole_config.get(member.guild.id, (err, value) => {
      value = value ? JSON.parse(value) : null
      if (value) {
        if (member.user.bot && (value.bots || value.everyone)) member.addRole(value.bots || value.everyone);
        else if(!member.user.bot && value.everyone)            member.addRole(value.everyone);
      }
    });
  }

  onGuildCreate(guild) {
    this.getGuildLanguage(guild).then(language => {
      let embed = new Discord.RichEmbed()
      .addField(
        language.server_join.hi_im_deku, language.server_join.description
        .replace('{0}', '<:izuku:358407294100439040>')
        .replace('{1}', 'https://discordapp.com/oauth2/authorize?client_id=358398001233920001&scope=bot')
        .replace('{2}', 'https://discord.gg/9W7yyBA')
      )
      .setColor(config.colors.embed)
      .setThumbnail('https://i.imgur.com/lUVxkAK.png');

      guild.channels.filter(c => c.type == 'text')[0].send({embed});
    });
  }

}
