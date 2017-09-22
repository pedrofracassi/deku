const levelup = require('levelup');
const utils = require('../utils.js');
const config = require('../config.js');
const fs = require('fs');

var db = levelup('./databases/language');

module.exports = {
  run: function(message, lang) {
    var expression = /^\w+\!(\w+) *(.*)/;
    var args = message.content.match(expression)[2].split(' ');
    var embed = utils.generateDekuDiv(message);
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args[0]) {
        fs.readdir('./translation/', (err, files) => {
          if (files.includes(args[0] + '.json')) {
            db.put(message.guild.id, args[0], function (err) {
              fs.readFile('./translation/' + args[0] + '.json', 'utf8', function (error, data) {
                if (err) throw err;
                var newLang = JSON.parse(data);
                embed.setColor(config.colors.success);
                embed.setDescription(newLang.commands.setlang.success.replace('{0}', args[0]));
                message.channel.send({embed});
              });
            });
          } else {
            embed.setColor(config.colors.error);
            embed.setTitle(lang.commands.setlang.not_supported.replace('{0}', args[0]));
            var languageCodes = [];
            files.map(file => languageCodes.push(file.replace('.json', '')));
            embed.setDescription(lang.commands.setlang.usage.replace('{0}', utils.arrayToStringWithCommas(languageCodes, lang.and)));
            message.channel.send({embed});
          }
        })
      } else {
        fs.readdir('./translation/', (err, files) => {
          embed.setColor(config.colors.error);
          embed.setTitle(lang.commands.setlang.no_args);
          var languageCodes = [];
          files.map(file => languageCodes.push(file.replace('.json', '')));
          embed.setDescription(lang.commands.setlang.usage.replace('{0}', utils.arrayToStringWithCommas(languageCodes, lang.and)));
          message.channel.send({embed});
        })
      }
    } else {
      embed.setColor(config.colors.error);
      embed.setDescription(lang.commands.setlang.no_permission);
      message.channel.send({embed});
    }
  }
}
