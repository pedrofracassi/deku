const Pokedex = require('pokedex-promise-v2');
const translate = require("google-translate-api");
const config = require('../config.js');
const utils = require('../utils.js');

const P = new Pokedex();
const cmdName = 'pokedex';

exports.run = function (message, lang) {
  let embed = utils.generateDekuDiv(message);
  let args = message.content.match(utils.expression)[2].split(' ');
  let currentLang = lang.commands[cmdName];
  if (message.content.match(utils.expression)[2]) {
    message.channel.startTyping();
    getFullPokemonInfo(args.join('%20'))
      .then(data => {
        let language = lang.code.substring(0, 2);
        let description = data.species.flavor_text_entries.filter(e => e.language.name == "en")[0].flavor_text;
        if(language != "en") {
          translate(description, {to: language}).then(res => {
            pokemonEmbed(embed, data, res.text, currentLang);
            message.channel.stopTyping();
            message.channel.send({embed});
          });
        } else {
          pokemonEmbed(embed, data, description, currentLang);
          message.channel.stopTyping();
          message.channel.send({embed});
        }
      })
      .catch(err => {
        embed.setColor(config.colors.error);
        if(err.statusCode == 404) {
          embed.setDescription(currentLang.not_found);
        } else {
          embed.setTitle(currentLang.error_ocurred);
          embed.setDescription(`\`${err}\``);
        }
        message.channel.stopTyping();
        message.channel.send({embed});
      });
  } else {
    embed.setColor(config.colors.error);
    embed.setTitle(currentLang.no_args);
    embed.setDescription(`\u200b\n${lang.usage} \`${currentLang. _usage}\`\n${lang.example} \`${currentLang._example}\``);
    message.channel.send({embed});
  }
};

function parseNumber(height, type) {
  let numbers = height.toString().split('');
  return numbers.length > 1 ? `${numbers.slice(0, numbers.length-1).join('')}.${numbers[numbers.length-1]}${type}` : `0.${height}${type}`;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getFullPokemonInfo(query) {
  return new Promise((resolve, reject) => {
    P.getPokemonByName(query)
      .then(pokemon => {
        P.getPokemonSpeciesByName(pokemon.id)
          .then(species => {
            resolve({pokemon, species});
          })
          .catch(err => { // isso não deveria acontecer
            reject(err)
          });
      })
      .catch(err => {
        reject(err)
      });
  });
}

function pokemonEmbed(embed, data, description, lang) {
  embed.setTitle(`${data.pokemon.id} - ${capitalize(data.pokemon.name)}`);
  embed.setDescription(description);
  embed.addField(lang.fields.height, parseNumber(data.pokemon.height, "m"), true);
  embed.addField(lang.fields.weight, parseNumber(data.pokemon.weight, "kg"), true);
  embed.setThumbnail(data.pokemon.sprites.front_default);
}