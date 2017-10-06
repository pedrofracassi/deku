const fs = require('fs');
const utils = require('../utils.js');
const cmdName = "help";

exports.run = function (message, lang) {
  var embed = utils.generateDekuDiv(message);
  embed.setDescription('**' + lang.commands[cmdName].check_dm + '**');
  message.channel.send({embed});

  var commandList = Object.keys(lang.commands);
  var text = "";
  fs.readdir('./commands/', (err, files) => {
    commandList.forEach(command => {
      if (files.includes(command + '.js')) {
        text = text + `**${command}**: \`${lang.commands[command]._usage}\`\n${lang.commands[command]._description}\n\n`;
      }
    });
    message.author.send(text);
  });
}
