const levelup = require('levelup');
const leveldown = require('leveldown');
const utils = require('../utils.js');
const config = require('../config.js');
const fs = require('fs');

module.exports = {
  run: function(message, lang, db) {
    var expression = /^\w+\!(\w+) *(.*)/;
    var args = message.content.match(expression)[2].split(' ');
    var embed = utils.generateDekuDiv(message);
    if (message.member.hasPermission('MANAGE_GUILD')) {
      console.log(args);
      if (args[0]) {
        fs.readdir('./translation/', (err, files) => {
          if (files.includes(args[0] + '.json')) {
            db.put(message.guild.id, args[0], function (err) {
              fs.readFile('./translation/' + args[0] + '.json', 'utf8', function (error, data) {
                if (err) throw err;
                var newLang = JSON.parse(data);
                embed.setColor(config.colors.success);
                embed.setDescription(newLang.setlang.success.replace('{0}', args[0]));
                message.channel.send({embed});
              });
            });
          } else {
            embed.setColor(config.colors.error);
            embed.setTitle(lang.setlang.not_supported.replace('{0}', args[0]));
            var languageCodes = [];
            files.map(file => languageCodes.push(file.replace('.json', '')));
            embed.setDescription(lang.setlang.usage.replace('{0}', utils.arrayToStringWithCommas(languageCodes, lang.and)));
            message.channel.send({embed});
          }
        })
      } else {
        fs.readdir('./translation/', (err, files) => {
          embed.setColor(config.colors.error);
          embed.setTitle(lang.setlang.no_args);
          var languageCodes = [];
          files.map(file => languageCodes.push(file.replace('.json', '')));
          embed.setDescription(lang.setlang.usage.replace('{0}', utils.arrayToStringWithCommas(languageCodes, lang.and)));
          message.channel.send({embed});
        })
      }
    } else {
      embed.setColor(config.colors.error);
      embed.setDescription(lang.setlang.no_permission);
      message.channel.send({embed});
    }
  }
}
