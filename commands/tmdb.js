const utils    = require('../utils.js');
const config   = require('../config.js');
const tokens   = require('../tokens.js');
const request  = require('request');
const cmdName = 'tmdb';

/*
{0} - API Key
{1} - Language
{2} - Query or ID
{3} - NSFW
{4} - Type
*/

const search_urlbase = 'https://api.themoviedb.org/3/search/multi?api_key={0}&language={1}&query={2}&page=1&include_adult={3}';
const more_urlbase  = 'https://www.themoviedb.org/{4}/{2}';
const more_api  = 'https://api.themoviedb.org/3/{4}/{2}?api_key={0}&language={1}';
const imagebase = 'https://image.tmdb.org/t/p/w640';

exports.run = function (message, lang, databases) {
  var args = message.content.match(utils.expression)[2].split(' ');
  var embed = utils.generateDekuDiv(message)
  if (args[0]) {
    var language = 'en-US';
    databases.language_config.get(message.guild.id, (err, result) => {
      if (result) language = result.replace('_', '-');
      var url = search_urlbase
      .replace('{0}', tokens.tmdb)
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
              var moreApiUrl = more_api.replace('{2}', result.id).replace('{4}', result.media_type).replace('{0}', tokens.tmdb).replace('{1}', language);
              request(moreApiUrl, (err, resp, body) => {
                if (!err) {
                  var json = JSON.parse(body);
                  console.log(json);
                  if (result.media_type == 'tv') {
                    embed.setTitle(flag(json.origin_country[0]) + " " + result.name);
                    if (json.name != json.original_name) embed.setTitle(flag(json.origin_country[0]) + " " + json.name + " (" + json.original_name + ")");
                  } else {
                    embed.setTitle(result.title);
                    if (result.title != result.original_title) embed.setTitle(result.title + " (" + result.original_title + ")");
                  }
                  embed.setDescription(json.overview + '\n\n' + moreUrl);
                  embed.setThumbnail(imagebase + json.poster_path);
                  message.channel.send({embed});
                } else {
                  embed.setColor(config.colors.error);
                  embed.setDescription(lang.commands[cmdName].tmdb_api_error.replace('{0}', err));
                  message.channel.send({embed});
                }
              });
            } else {
              embed.setColor(config.colors.error);
              embed.setDescription(lang.commands[cmdName].nothing_found.replace('{0}', args.join(' ')));
              message.channel.send({embed});
            }
          } else {
            embed.setColor(config.colors.error);
            embed.setDescription(lang.commands[cmdName].nothing_found.replace('{0}', args.join(' ')));
            message.channel.send({embed});
          }
        } else {
          embed.setColor(config.colors.error);
          embed.setDescription(lang.commands[cmdName].tmdb_api_error.replace('{0}', err));
          message.channel.send({embed});
        }
      });
    });
  } else {
    embed.setColor(config.colors.error);
    embed.setTitle(lang.commands[cmdName].no_name_specified);
    embed.setDescription(`\u200b\n${lang.usage} \`${lang.commands[cmdName]. _usage}\`\n${lang.example} \`${lang.commands[cmdName]._example}\``);
    message.channel.send({embed});
  }
};

function flag(country) {
  if (country) {
    return ":flag_" + country.toLowerCase() + ":";
  } else {
    return "";
  }
}
