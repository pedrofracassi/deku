var assert = require('assert');
const fs = require('fs');
const Discord = require('discord.js');

describe('Commands', function() {
  it('should load succesfully', function() {
    fs.readdirSync("./commands").forEach(file => {
      if (file.endsWith(".js")) {
        let Command = require("../commands/"+file);
        let client = new Discord.Client();
        new Command(client);
      }
    });
  });
});
