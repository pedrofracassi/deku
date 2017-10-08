const Discord = require('discord.js');
const fs      = require('fs');

const colors  = require('colors');
const prototypes = require('./helpers/prototypes.js')

// Apis
const Trello  = require("node-trello");
const Nodesu = require('nodesu');

module.exports = class Deku extends Discord.Client {


  constructor(options = {}) {
    super(options);

    this.config      = options.config;
    this.databases   = options.databases;
    this.devMode     = this.config.devMode;

    this.commands    = [];
    this.languages   = {};
    this.listeners   = [];

    this.trello      = new Trello(this.config.trello_key, this.config.trello_token);
    this.nodesu      = new Nodesu.Client(this.config.osu);

    this.initializeCommands();
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
    return new Promise((resolve, reject) => {
      self.databases.language_config.get(guild.id, (err, value) => {
        if (err) value = 'en_US';
        resolve(self.languages[value] || self.languages['en_US']);
      })
    });
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
          this.log(['BOT', 'Commands'], `${file} failed to load.`.red);
          failed++;
        }
      }
    });
    if (failed) this.log(['BOT', 'Commands'], `${this.commands.length} commands loaded succesfully, ${failed} failed.`.yellow);
    else this.log(['BOT', 'Commands'], `${this.commands.length} commands loaded succesfully`.green);
  }

  initializeLanguages() {
    fs.readdirSync("./translation").forEach(file => {
      if (file.endsWith(".json")) {
        try {
          this.languages[file.replace('.json', '')] = require("./translation/"+file);
        } catch (e) {
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
          console.error(e)
          this.log(['BOT', 'EventListeners'], `${file} failed to load.`.red);
          failed++;
        }
      }
    });
    if (failed) this.log(['BOT', 'EventListeners'], `${this.listeners.length} event listeners loaded succesfully, ${failed} failed.`.yellow);
    else this.log(['BOT', 'EventListeners'], `${this.listeners.length} event listeners loaded succesfully`.green);
  }

}
