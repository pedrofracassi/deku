const npmapi = require('api-npm');
const config = require('../config.js');
const utils = require('../utils.js');

var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

exports.run = function (message, lang) {
  var embed = utils.generateDekuDiv(message);
  var args = message.content.match(utils.expression)[2].split(' ');
  if (message.content.match(utils.expression)[2]) {
    message.channel.startTyping();
    npmapi.getdetails(args.join('-'), data => {
      if (data.name) {
        embed.setColor(config.colors.npm);
        embed.setAuthor(data.name, 'https://i.imgur.com/24yrZxG.png', 'https://www.npmjs.com/package/' + data.name);
        embed.setDescription(data.description + '\nhttps://www.npmjs.com/package/' + data.name + '\n\n`npm install --save ' + data.name + '`');
      } else {
        embed.setColor(config.colors.error);
        embed.setTitle(lang.commands.npm.package_not_found);
        embed.setDescription(`${lang.commands.npm.package_not_found_desc}\n\n${lang.usage} \`${lang.commands.npm. _usage}\`\n${lang.example} \`${lang.commands.npm._example}\``);
      }
      message.channel.stopTyping();
      message.channel.send({embed});
    });
  } else {
    embed.setColor(config.colors.error);
    embed.setTitle(lang.commands.npm.no_args);
    embed.setDescription(`\u200b\n${lang.usage} \`${lang.commands.npm. _usage}\`\n${lang.example} \`${lang.commands.npm._example}\``);
    message.channel.stopTyping();
    message.channel.send({embed});
  }
};
