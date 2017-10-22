const Command = require('../structures/command.js');

const logo = 'https://vignette2.wikia.nocookie.net/fantendo/images/1/12/Osu%21_logo.png';

module.exports = class Osu extends Command {

  constructor(client) {
    super(client);

    this.name    = "osu";
    this.aliases = ["osu!"];
  }

  run(message, args, commandLang, databases, lang) {
    let embed = this.client.getDekuEmbed(message);
    let nf = new Intl.NumberFormat(lang.code.replace('_', '-'));
    if(args.length > 0) {
      let username = args.join(" ");
      embed.setColor(this.client.config.colors.osu);
      if (username.endsWith('--osusig') || username.startsWith('--osusig')) {
        username = username.replace('--osusig', '').trim();

        let url = 'https://lemmmy.pw/osusig/sig.php?uname=' + encodeURI(username);
        embed.setDescription(url);
        embed.setImage(url);
        message.channel.send({embed});
      } else {
        message.channel.startTyping();
        this.client.nodesu.user.get(username).then(user => {
          console.log(user);
          if (user) {
            if (user.level == null) {
              embed.setColor(this.client.config.colors.error);
              embed.addField(commandLang.weird_error, commandLang.not_our_fault.replace('{0}', 'osu.ppy.sh/u/' + encodeURI(username)));
              message.channel.send({embed});
              return;
            } else {
              embed.setAuthor(commandLang.title.replace('{0}', user.username), logo);
              embed.setThumbnail('https://a.ppy.sh/' + user.user_id);
              embed.addField(commandLang.global_ranking, '#' + nf.format(user.pp_rank), true);
              embed.addField(commandLang.country_ranking, `:flag_${user.country.toLowerCase()}: #` + nf.format(user.pp_country_rank.toLocaleString()), true);
              embed.addField(commandLang.performance, Math.floor(user.pp_raw) + 'pp', true);
              embed.addField(commandLang.ranks, `<:osu_ss:359141983123537921> ${user.count_rank_ss} <:osu_s:359141982754308116> ${user.count_rank_s} <:osu_a:359141980908814336> ${user.count_rank_a}`, true);
              embed.addField(commandLang.level, Math.floor(user.level), true);
              embed.addField(commandLang.play_count, user.playcount, true);
              embed.addField(commandLang.total_score, nf.format(user.total_score), true);
              embed.addField(commandLang.ranked_score, nf.format(user.ranked_score), true);
              embed.addField(commandLang.accuracy, parseFloat(user.accuracy).toFixed(2) + '%', true);
            }
          } else {
            embed.setColor(this.client.config.colors.error);
            embed.addField(commandLang.player_doesnt_exist, commandLang.is_spelled_correctly);
          }
          message.channel.send({embed});
          message.channel.stopTyping();
        }).catch(err => {
          embed.setColor(this.client.config.colors.error);
          embed.addField(commandLang.error_ocurred, err);
          message.channel.send({embed});
          message.channel.stopTyping();
        })
      }
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.addField(commandLang.specify_player, commandLang.usage);
      message.channel.send({embed});
      message.channel.stopTyping();
    }
  }

}
