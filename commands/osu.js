const config = require('../config.js');
const tokens = require('../tokens.js');
const utils = require('../utils.js');
const Nodesu = require('nodesu');

module.exports = {
  run: function(message) {
    var logo = 'https://vignette2.wikia.nocookie.net/fantendo/images/1/12/Osu%21_logo.png';
    var expression = /^\w+\!(\w+) *(.*)/;
    var embed = utils.generateDekuDiv(message);
    var args = message.content.match(expression)[2].split(' ');
    var nf = new Intl.NumberFormat();
    const api = new Nodesu.Client(tokens.osu);
    message.channel.startTyping();
    if (args[0]) {
      embed.setColor(config.colors.osu);
      api.user.get(args[0]).then(user => {
        if (user) {
          embed.setAuthor('Osu! profile for ' + user.username, logo);
          embed.setThumbnail('https://a.ppy.sh/' + user.user_id);
          embed.addField('Global Ranking', '#' + nf.format(user.pp_rank.toLocaleString()), true);
          embed.addField('Country Ranking', `:flag_${user.country.toLowerCase()}: #` + nf.format(user.pp_country_rank.toLocaleString()), true);
          embed.addField('Performance', Math.floor(user.pp_raw) + 'pp', true);
          embed.addField('Ranks', `<:osu_ss:359141983123537921> ${user.count_rank_ss} <:osu_s:359141982754308116> ${user.count_rank_s} <:osu_a:359141980908814336> ${user.count_rank_a}`, true);
          embed.addField('Level', Math.floor(user.level), true);embed.addField('Play Count', user.playcount, true);
          embed.addField('Total Score', nf.format(user.total_score.toLocaleString()), true);
          embed.addField('Ranked Score', nf.format(user.ranked_score.toLocaleString()), true);
          embed.addField('Accuracy', parseFloat(user.accuracy).toFixed(2) + '%', true);
        } else {
          embed.setColor(config.colors.error);
          embed.addField('That player doesen\'t exist.', 'Please check if you spelled the player\'s username correctly');
        }
        message.channel.send({embed});
        message.channel.stopTyping();
      })
    } else {
      embed.setColor(config.colors.error);
      embed.addField('Please specify a player', '**Usage:** `d!osu <id or username>`\n**Example:** `d!osu pedrofracassi`');
      message.channel.send({embed});
      message.channel.stopTyping();
    }
  }
}
