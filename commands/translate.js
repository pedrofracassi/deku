const translate = require("google-translate-api");
const clist = require("countries-list");

const config = require('../config.js');
const utils = require('../utils.js');

const flag_overrides = {
  "en": "gb",
  "pt": "br"
}

exports.run = function (message, lang) {
  var expression = /\-\-([a-zA-Z]{2})\ (.*)/;
  var input = message.content.match(utils.expression)[2];
  var language = lang.code.substring(0, 2);
  if (input.match(expression)) {
    language = input.match(expression)[1];
    input = input.match(expression)[2];
  }
  var embed = utils.generateDekuDiv(message);
  translate(input, {to: language}).then(res => {
    embed.addField(getFlagByLanguage(res.from.language.iso) + '\u200b \u200b \u200b \u200b' + input, getFlagByLanguage(language)+ '   ' + res.text);
    message.channel.send({embed});
  });

};

function getFlagByLanguage(language) {
  if (flag_overrides[language]) return `:flag_${flag_overrides[language].toLowerCase()}:`;
  var countries_that_speak_it = [];
  Object.keys(clist.countries).forEach(country => {
    if (clist.countries[country].languages.includes(language)) countries_that_speak_it.push(country);
  });
  return `:flag_${countries_that_speak_it[0].toLowerCase()}:`;
}
