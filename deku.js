const Discord    = require('discord.js');
const fs         = require('fs');

const utils      = require('./utils.js');

// Apis
const Trello     = require("node-trello");
const Nodesu     = require('nodesu');

// Self initializers
require('./helpers/prototypes.js');
require('colors');

module.exports = class Deku extends Discord.Client {

  constructor(options = {}) {
    super(options);

    this.config      = options.config;
    this.devMode     = this.config.devMode;

    this.commands    = [];
    this.databases   = {};
    this.languages   = {};
    this.listeners   = [];

    // APIs
    this.trello      = new Trello(this.config.trello_key, this.config.trello_token);
    this.nodesu      = new Nodesu.Client(this.config.osu);
    this.initializeCommands();
    this.initializeDatabases();
    this.initializeLanguages();
    this.initializeListeners();
  }

  start(token) {
    this.log(['BOT', 'Discord'], "Authenticating...".yellow);
    if (!token && this.config) token = this.config.discord;
    this.login(token);
  }


  /*
   *    GETTERS
   */
  getGuildLanguage(guild) {
    let self = this;
    return new Promise((resolve) => {
      self.databases.language_config.get(guild.id, (err, value) => {
        if (err || !value) { console.log(err); value = 'en_US'; }
        let language = self.languages[value];
        if(language !== 'en_US' && language) language = Object.assign(self.languages['en_US'], language);
        resolve(language || self.languages['en_US']);
      })
    });
  }

  getDekuEmbed(message) {
    return new Discord.RichEmbed()
              .setColor(this.config.colors.embed)
              .setFooter(message.author.tag, message.author.avatarURL);
  }


  /*
   *    HELPERS
   */
  log(tags, message) {
    tags = tags.map(t => `[${t}]`);
    tags.push(message);
    console.log(tags.join(' '));
  }


  /*
   *    INITIALIZERS
   */
  initializeCommands() {
    let failed = 0;
    fs.readdirSync("./commands").forEach(file => {
      if (file.endsWith(".js")) {
        try {
          let Command = require("./commands/"+file);
          this.commands.push(new Command(this));
        } catch (e) {
          if (this.devMode) console.error(e);
          this.log(['BOT', 'Commands'], `${file} failed to load.`.red);
          failed++;
        }
      }
    });
    if (failed) this.log(['BOT', 'Commands'], `${this.commands.length} commands loaded succesfully, ${failed} failed.`.yellow);
    else this.log(['BOT', 'Commands'], `${this.commands.length} commands loaded succesfully`.green);
  }

  initializeDatabases() {
    this.databases['autorole_config'] = utils.initializeDatabase('./databases/autorole');
    this.databases['language_config'] = utils.initializeDatabase('./databases/language');
    this.databases['roleme_config']   = utils.initializeDatabase('./databases/roleme');
  }

  initializeLanguages() {
    fs.readdirSync("./translation").forEach(file => {
      if (file.endsWith(".json")) {
        try {
          this.languages[file.replace('.json', '')] = require("./translation/"+file);
        } catch (e) {
          if (this.devMode) console.error(e);
          this.log(['BOT', 'Languages'], `${file} failed to load. Exiting...`.red);
          process.exit(0);
        }
      }
    });
    this.log(['BOT', 'Languages'], `${Object.keys(this.languages).length} languages loaded succesfully`.green);
  }

  initializeListeners() {
    let failed = 0;
    fs.readdirSync("./listeners").forEach(file => {
      if (file.endsWith(".js")) {
        try {
          let EventListener = require("./listeners/"+file);
          this.listeners.push(new EventListener(this));
        } catch (e) {
          if (this.devMode) console.error(e);
          this.log(['BOT', 'EventListeners'], `${file} failed to load.`.red);
          failed++;
        }
      }
    });
    if (failed) this.log(['BOT', 'EventListeners'], `${this.listeners.length} event listeners loaded succesfully, ${failed} failed.`.yellow);
    else this.log(['BOT', 'EventListeners'], `${this.listeners.length} event listeners loaded succesfully`.green);
  }

}
