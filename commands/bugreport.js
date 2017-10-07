const Trello = require("node-trello");

const config = require('../config.js');
const tokens = require('../tokens.js');
const utils = require('../utils.js');
const cmdName = 'bugreport';
var trll = new Trello(tokens.trello_key, tokens.trello_token);

exports.run = function (message, lang) {
  var embed = utils.generateDekuDiv(message);
  var args = message.content.match(utils.expression)[2].split(' ');
  if (args[0]) {
    var newCard = {
      name: args.join(' '),
      desc: 'Reported by **' + message.author.tag + '**',
      idList: '59c15e4f8fea8232a3089357',
      pos: 'top',
      idLabels: '59c15dc71314a33999b052e8'
    };
    trll.post("/1/cards/", newCard, function (err, response) {
      if (err) {
        embed.setColor(config.colors.error);
        embed.setTitle(lang.commands[cmdName].trello_error);
        embed.setDescription(`${lang.commands[cmdName].trello_error_desc}\n\n${lang.usage} \`${lang.commands[cmdName]._usage}\`\n${lang.example} \`${lang.commands[cmdName]._example}\``);
        message.channel.send({embed});
      } else {
        embed.setColor(config.colors.success);
        embed.setTitle(lang.commands[cmdName].card_add_success);
        embed.setDescription(response.shortUrl);
        message.channel.send({embed});
      }
    });
  } else {
    embed.setColor(config.colors.error);
    embed.setTitle(lang.commands[cmdName].no_text);
    embed.setDescription(`\u200b\n${lang.usage} \`${lang.commands[cmdName]. _usage}\`\n${lang.example} \`${lang.commands[cmdName]._example}\``);
    message.channel.send({embed});
  }
};
