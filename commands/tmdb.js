const Command = require('../structures/command.js');
const request = require('request');

const search_urlbase = 'https://api.themoviedb.org/3/search/multi?api_key={0}&language={1}&query={2}&page=1&include_adult={3}';
const more_urlbase  = 'https://www.themoviedb.org/{4}/{2}';
const more_api  = 'https://api.themoviedb.org/3/{4}/{2}?api_key={0}&language={1}';
const imagebase = 'https://image.tmdb.org/t/p/w640';

module.exports = class TheMovieDatabase extends Command {

  constructor(client) {
    super(client);

    this.name    = "tmdb";
    this.aliases = ["themoviedatabase", "themoviedb"];
  }

  run(message, args, commandLang, databases, lang) {
    var embed = this.client.getDekuEmbed(message)
    if (args[0]) {
      var language = lang.code.replace('_', '-');
      var url = search_urlbase
      .replace('{0}', this.client.config.tmdb)
      .replace('{1}', language)
      .replace('{2}', args.join(' '))
      .replace('{3}', message.channel.nsfw);
      request(url, (err, resp, body) => {
        if (!err) {
          var json = JSON.parse(body);
          if (json.total_results > 0) {
            var result = json.results[0];
            var valid_types = ['tv', 'movie'];
            if (valid_types.includes(result.media_type)) {
              var moreUrl = more_urlbase.replace('{2}', result.id).replace('{4}', result.media_type);
              var moreApiUrl = more_api.replace('{2}', result.id).replace('{4}', result.media_type).replace('{0}', this.client.config.tmdb).replace('{1}', language);
              request(moreApiUrl, (err, resp, body) => {
                if (!err) {
                  var json = JSON.parse(body);
                  if (result.media_type == 'tv') {
                    embed.setTitle(flag(json.origin_country[0]) + " " + result.name);
                    if (json.name != json.original_name) embed.setTitle(flag(json.origin_country[0]) + " " + json.name + " (" + json.original_name + ")");
                  } else {
                    embed.setTitle(result.title);
                    if (result.title != result.original_title) embed.setTitle(result.title + " (" + result.original_title + ")");
                  }
                  if (json.overview != null) {
                    embed.setDescription(json.overview + '\n\n' + moreUrl);
                  } else {
                    if (result.media_type == 'tv') {
                      embed.setDescription(commandLang.no_overview_tv + '\n\n' + moreUrl);
                    } else {
                      embed.setDescription(commandLang.no_overview_movie + '\n\n' + moreUrl);
                    }
                  }
                  embed.setThumbnail(imagebase + json.poster_path);
                  message.channel.send({embed});
                } else {
                  embed.setColor(this.client.config.colors.error);
                  embed.setDescription(commandLang.tmdb_api_error.replace('{0}', err));
                  message.channel.send({embed});
                }
              });
            } else {
              embed.setColor(this.client.config.colors.error);
              embed.setDescription(commandLang.nothing_found.replace('{0}', args.join(' ')));
              message.channel.send({embed});
            }
          } else {
            embed.setColor(this.client.config.colors.error);
            embed.setDescription(commandLang.nothing_found.replace('{0}', args.join(' ')));
            message.channel.send({embed});
          }
        } else {
          embed.setColor(this.client.config.colors.error);
          embed.setDescription(commandLang.tmdb_api_error.replace('{0}', err));
          message.channel.send({embed});
        }
      });
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.setTitle(commandLang.no_name_specified);
      embed.setDescription(`\u200b\n${lang.usage} \`${commandLang._usage}\`\n${lang.example} \`${commandLang._example}\``);
      message.channel.send({embed});
    }
  }
}

function flag(country) {
  return country ? `:flag_${country.toLowerCase()}:` : '';
}
