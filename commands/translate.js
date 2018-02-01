const Command   = require('../structures/command.js');
const translate = require("google-translate-api");
const clist     = require("countries-list");

module.exports = class Translate extends Command {

  constructor(client) {
    super(client);

    this.name = "translate";
    this.flag_overrides = {
      "en": "gb",
      "pt": "br",
      "it": "it"
    }

    this.easter_eggs = {
      "fon": "<:yoda:365646826185162772>   trab"
    }
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    if (args.length > 0) {
      message.channel.startTyping();
      let input = args.join(" ");
      let language = lang.code.substring(0, 2);

      let expression = /--([a-zA-Z]{2}) (.*)/;
      let match = input.match(expression);
      if (match) {
        language = match[1];
        input = match[2];
      }

      if (this.easter_eggs[input.toLowerCase()]) {
        embed.addField(this.getFlagByLanguage("pt") + '\u200b \u200b \u200b \u200b' + input, this.easter_eggs[input.toLowerCase()]);
        message.channel.stopTyping();
        message.channel.send({embed});
      } else {
        translate(input, {to: language}).then(res => {
          embed.addField(this.getFlagByLanguage(res.from.language.iso) + '\u200b \u200b \u200b \u200b' + input, this.getFlagByLanguage(language)+ '   ' + res.text);
          message.channel.stopTyping();
          message.channel.send({embed});
        }).catch(err => {
          embed.setColor(this.client.config.colors.error);
          if (err.message == 'The language \'' + language + '\' is not supported') {
            embed.setDescription(commandLang.lang_not_supported.replace('{0}', language));
          } else {
            embed.setTitle(commandLang.error_ocurred);
            embed.setDescription(`\`${err.message}\``)
          }
          message.channel.stopTyping();
          message.channel.send({embed});
        });
      }
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setTitle(commandLang.no_text);
      embed.setDescription(`\u200b\n${lang.usage} \`${commandLang. _usage}\`\n${lang.example} \`${commandLang._example}\``);
      message.channel.send({embed});
    }
  }

  getFlagByLanguage(language) {
    if (this.flag_overrides[language]) return `:flag_${this.flag_overrides[language].toLowerCase()}:`;

    let countries_that_speak_it = Object.keys(clist.countries).filter(c => clist.countries[c].languages.includes(language));
    if (countries_that_speak_it[0]) {
      return `:flag_${countries_that_speak_it[0].toLowerCase()}:`;
    } else {
      return `[${language.toUpperCase()}]  `;
    }
  }

}
