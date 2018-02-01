const fs = require('fs');
const Discord = require('discord.js');

describe('Commands', function() {
  it('should load succesfully', function() {
    fs.readdirSync("./commands").forEach(file => {
      if (file.endsWith(".js")) {
        let Command = require("../commands/"+file);
        let client = new Discord.Client();
        new Command(client); // Should work
      }
    });
  });
});

describe('Language Files', function() {
  it('should load succesfully', function() {
    fs.readdirSync("./translation").forEach(file => {
      if (file.endsWith(".json")) {
        require("../translation/"+file);
      }
    });
  });
});

describe('Event Listener Files', function() {
  it('should load succesfully', function() {
    fs.readdirSync("./listeners").forEach(file => {
      if (file.endsWith(".json")) {
        require("../listeners/"+file);
      }
    });
  });
});
