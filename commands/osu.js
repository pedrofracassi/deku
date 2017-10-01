const config = require('../config.js');
const tokens = require('../tokens.js');
const utils = require('../utils.js');
const Nodesu = require('nodesu');

module.exports = {
  run: function(message, lang) {
    var logo = 'https://vignette2.wikia.nocookie.net/fantendo/images/1/12/Osu%21_logo.png';
    var expression = /^\w+\!(\w+) *(.*)/;
    var embed = utils.generateDekuDiv(message);
    var args = message.content.match(expression)[2].split(' ');
    var username = args.join(" ");
    var nf = new Intl.NumberFormat(lang.code.replace('_', '-'));
    const api = new Nodesu.Client(tokens.osu);

    if (username) {
      embed.setColor(config.colors.osu);
      message.channel.startTyping();
      api.user.get(username).then(user => {
        console.log(user);
        if (user) {
          if (user.level == null) {
            embed.setColor(config.colors.error);
            embed.addField(lang.commands.osu.weird_error, lang.commands.osu.not_our_fault.replace('{0}', 'osu.ppy.sh/u/' + encodeURI(username)));
            message.channel.send({embed});
            return;
          } else {
            embed.setAuthor(lang.commands.osu.title.replace('{0}', user.username), logo);
            embed.setThumbnail('https://a.ppy.sh/' + user.user_id);
            embed.addField(lang.commands.osu.global_ranking, '#' + nf.format(user.pp_rank), true);
            embed.addField(lang.commands.osu.country_ranking, `:flag_${user.country.toLowerCase()}: #` + nf.format(user.pp_country_rank.toLocaleString()), true);
            embed.addField(lang.commands.osu.performance, Math.floor(user.pp_raw) + 'pp', true);
            embed.addField(lang.commands.osu.ranks, `<:osu_ss:359141983123537921> ${user.count_rank_ss} <:osu_s:359141982754308116> ${user.count_rank_s} <:osu_a:359141980908814336> ${user.count_rank_a}`, true);
            embed.addField(lang.commands.osu.level, Math.floor(user.level), true);
            embed.addField(lang.commands.osu.play_count, user.playcount, true);
            embed.addField(lang.commands.osu.total_score, nf.format(user.total_score), true);
            embed.addField(lang.commands.osu.ranked_score, nf.format(user.ranked_score), true);
            embed.addField(lang.commands.osu.accuracy, parseFloat(user.accuracy).toFixed(2) + '%', true);
          }
        } else {
          embed.setColor(config.colors.error);
          embed.addField(lang.commands.osu.player_doesnt_exist, lang.commands.osu.is_spelled_correctly);
        }
        message.channel.send({embed});
        message.channel.stopTyping();
      })
    } else {
      embed.setColor(config.colors.error);
      embed.addField(lang.commands.osu.specify_player, lang.commands.osu.usage);
      message.channel.send({embed});
      message.channel.stopTyping();
    }
  }
}
