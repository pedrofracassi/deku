const Command = require('../structures/command.js');
const PokedexAPI   = require('pokedex-promise-v2');
const translate = require("google-translate-api");
const utils     = require('../utils.js');

module.exports = class Pokedex extends Command {

  constructor(client) {
    super(client);

    this.name    = "pokedex"
    this.aliases = ["pokemon", "pokédex", "pokémon"];

    this.pokedex = new PokedexAPI();
  }

  run(message, args, commandLang, databases, lang) {
    let embed = utils.generateDekuDiv(message);
    if (message.content.match(utils.expression)[2]) {
      message.channel.startTyping();
      this.getFullPokemonInfo(args.join('%20'))
        .then(data => {
          let language = lang.code.substring(0, 2);
          let description = data.species.flavor_text_entries.filter(e => e.language.name == "en")[0].flavor_text;
          if(language != "en") {
            translate(description, {to: language}).then(res => {
              this.pokemonEmbed(embed, data, res.text, commandLang);
              message.channel.stopTyping();
              message.channel.send({embed});
            });
          } else {
            this.pokemonEmbed(embed, data, description, commandLang);
            message.channel.stopTyping();
            message.channel.send({embed});
          }
        })
        .catch(err => {
          embed.setColor(this.client.config.colors.error);
          if(err.statusCode == 404) {
            embed.setDescription(commandLang.not_found);
          } else {
            embed.setTitle(commandLang.error_ocurred);
            embed.setDescription(`\`${err}\``);
          }
          message.channel.stopTyping();
          message.channel.send({embed});
        });
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setTitle(currentLang.no_args);
      embed.setDescription(`\u200b\n${lang.usage} \`${currentLang. _usage}\`\n${lang.example} \`${currentLang._example}\``);
      message.channel.send({embed});
    }
  }

  pokemonEmbed(embed, data, description, lang) {
    embed.setTitle(`${data.pokemon.id} - ${data.pokemon.name.capitalize()}`);
    embed.setDescription(description);
    embed.addField(lang.fields.height, this.parseNumber(data.pokemon.height, "m"), true);
    embed.addField(lang.fields.weight, this.parseNumber(data.pokemon.weight, "kg"), true);
    embed.setThumbnail(data.pokemon.sprites.front_default);
  }

  parseNumber(height, type) {
    let numbers = height.toString().split('');
    return numbers.length > 1 ? `${numbers.slice(0, numbers.length-1).join('')}.${numbers[numbers.length-1]}${type}` : `0.${height}${type}`;
  }

  getFullPokemonInfo(query) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.pokedex.getPokemonByName(query)
        .then(pokemon => {
          self.pokedex.getPokemonSpeciesByName(pokemon.id)
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

}
