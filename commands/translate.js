const translate = require("google-translate-api");
const clist = require("countries-list");

const config = require('../config.js');
const utils = require('../utils.js');

const cmdName = 'translate';

const flag_overrides = {
  "en": "gb",
  "pt": "br",
  "it": "it"
}

const easter_eggs = {
  "fon": "<:yoda:365646826185162772>   trab"
}

exports.run = function (message, lang) {
  var expression = /\-\-([a-zA-Z]{2})\ (.*)/;
  var input = message.content.match(utils.expression)[2];
  var embed = utils.generateDekuDiv(message);
  if (message.content.match(utils.expression)[2]) {
    message.channel.startTyping();
    var language = lang.code.substring(0, 2);
    if (input.match(expression)) {
      language = input.match(expression)[1];
      input = input.match(expression)[2];
    }
    translate(input, {to: language}).then(res => {
      if (easter_eggs[input.toLowerCase()]) {
        embed.addField(getFlagByLanguage(res.from.language.iso) + '\u200b \u200b \u200b \u200b' + input, easter_eggs[input.toLowerCase()]);
      } else {
        embed.addField(getFlagByLanguage(res.from.language.iso) + '\u200b \u200b \u200b \u200b' + input, getFlagByLanguage(language)+ '   ' + res.text);
      }
      message.channel.stopTyping();
      message.channel.send({embed});
    }).catch(err => {
      embed.setColor(config.colors.error);
      if (err.message == 'The language \'' + language + '\' is not supported') {
        embed.setDescription(lang.commands[cmdName].lang_not_supported.replace('{0}', language));
      } else {
        embed.setTitle(lang.commands[cmdName].error_ocurred);
        embed.setDescription(`\`${err.message}\``)
      }
      message.channel.stopTyping();
      message.channel.send({embed});
    });
  } else {
    embed.setColor(config.colors.error);
    embed.setTitle(lang.commands[cmdName].no_text);
    embed.setDescription(`\u200b\n${lang.usage} \`${lang.commands[cmdName]. _usage}\`\n${lang.example} \`${lang.commands[cmdName]._example}\``);
    message.channel.send({embed});
  }
};

function getFlagByLanguage(language) {
  if (flag_overrides[language]) return `:flag_${flag_overrides[language].toLowerCase()}:`;
  var countries_that_speak_it = [];
  Object.keys(clist.countries).forEach(country => {
    if (clist.countries[country].languages.includes(language)) countries_that_speak_it.push(country);
  });
  if (countries_that_speak_it[0]) {
    return `:flag_${countries_that_speak_it[0].toLowerCase()}:`;
  } else {
    return `[${language.toUpperCase()}]  `;
  }
}
