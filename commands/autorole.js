const levelup = require('levelup');
const utils = require('../utils.js');
const config = require('../config.js');
const cmdName = 'autorole';

// d!autorole <role> [--bots]

exports.run = function (message, lang, databases) {
  var db = databases.autorole_config;
  var embed = utils.generateDekuDiv(message);
  var args = message.content.match(utils.expression)[2].split(' ');
  if (args[0]) {
    if (message.guild.roles.get(args[0])) {
      if (message.member.hasPermission('MANAGE_GUILD')) {
        var type = 'everyone';
        if (args[1] == '--bots') type = 'bots';
        db.get(message.guild.id, function (err, value) {
          if (!value) value = "{}";
          value = JSON.parse(value);
          value[type] = args[0];
          console.log(value);
          db.put(message.guild.id, JSON.stringify(value), function (err) {
            if (!err) {
              message.reply('done, bro. ' + JSON.stringify(value));
            } else {
              message.reply('nope. ' + err);
            }
          });
        });
      }
    } else {
      embed.setColor(config.colors.error);
      embed.setDescription(lang.commands[cmdName].no_permission);
    }
  } else {
    message.reply('role doesn\'t exist.');
  }
};
