const Command = require('../structures/command.js');
const utils   = require('../utils.js');
const nf = new Intl.NumberFormat();

const masteryEmoji = {
  1: '<:lol_m1:359488405798780930>',
  2: '<:lol_m2:359488408592318465>',
  3: '<:lol_m3:359488409363808267>',
  4: '<:lol_m4:359488411813543937>',
  5: '<:lol_m5:359488414514413569>',
  6: '<:lol_m6:359488417089978380>',
  7: '<:lol_m7:359488417932771330>',
}

const eloEmoji = {
  UNRANKED: '<:lol_unranked:359518620226682880>',
  BRONZE: '<:lol_bronze:359518611313917952>',
  SILVER: '<:lol_silver:359518620415557632>',
  GOLD: '<:lol_gold:359519461965037568>',
  PLATINUM: '<:lol_platinum:359518620952559618>',
  DIAMOND: '<:lol_diamond:359518615898292229>',
  MASTER: '<:lol_master:359518620818079746>',
  CHALLENGER: '<:lol_challenger:359518614711304202>',
}

const regions = {
  BR: "br1",
  EUNE: "eun1",
  EUW: "euw1",
  JP: "jp1",
  KR: "kr",
  LAN: "la1",
  LAS: "la2",
  NA: "na1",
  OCE: "oc1",
  TR: "tr1",
  RU: "ru",
  PBE: "pbe1"
}

function failed(lang, embed, message, err, client) {
  console.log(err);
  embed.setColor(client.config.colors.error);
  embed.setTitle(lang.commands.lol.summoner_error);
  embed.setDescription(lang.commands.lol.summoner_error_desc + '\n\n`' + err.toString() + '`');
  message.channel.send({embed});
  message.channel.stopTyping();
}

const summonerIconUrl = 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon%s.jpg';

module.exports = class SetLang extends Command {
  constructor(client) {
    super(client);
    this.name    = "lol"
    this.aliases = ["leagueoflegends", "league"];
  }

  // Args: [0] = region, [1] = summoner
  run(message, args, commandLang, databases, lang) {
    var embed = this.client.getDekuEmbed(message);
    var summoner_name = args.slice(1).join(" ");
    if (args[0]) {
      if (Object.keys(regions).includes(args[0].toUpperCase())) {
        var region = regions[args[0].toUpperCase()];
        if (args[1]) {
          message.channel.startTyping();
          this.client.riotapi.get(region, 'summoner.getBySummonerName', summoner_name).then(summoner => { // SUMMONER BY NAME
            console.log('SUMMONER BY NAME ok');
            if (summoner) {
              this.client.riotapi.get(region, 'league.getAllLeaguePositionsForSummoner', summoner.id).then(leagues => { // POSITIONS
                console.log('POSITIONS ok');
                this.client.riotapi.get(region, 'championMastery.getAllChampionMasteries', summoner.id).then(masteries => { // MASTERIES
                  console.log('MASTERIES ok');
                  this.client.riotapi.get(region, 'lolStaticData.getChampionById', masteries[0].championId).then(bestChampionInfo => { // CHAMPION INFO
                    console.log('CHAMPION INFO ok');
                    embed.setThumbnail(summonerIconUrl.replace('%s', summoner.profileIconId));
                    embed.addField(commandLang.nickname, summoner.name);
                    embed.addField(commandLang.summoner_level, summoner.summonerLevel, true);
                    embed.addField(commandLang.best_champion, `${masteryEmoji[masteries[0].championLevel]} **${bestChampionInfo.name}** ` + masteries[0].championPoints.toLocaleString(), true);
                    var masteryPoints = 0;
                    masteries.map(mastery => masteryPoints = masteryPoints + mastery.championLevel);
                    embed.addField(commandLang.mastery_points, masteryPoints, true);
                    embed.addField(commandLang.Region, args[0].toUpperCase(), true);
                    var soloq;
                    leagues.map(league => {
                      if (league.queueType == 'RANKED_SOLO_5x5') soloq = league;
                    });
                    if (soloq != null) {
                      embed.addField(commandLang.rankeds, eloEmoji[soloq.tier] + `**${commandLang.elos[soloq.tier]} ${soloq.rank}**\n**${soloq.leaguePoints}LP** / ${soloq.wins}W ${soloq.losses}L\n${soloq.leagueName}`, true);
                    } else {
                      embed.addField(commandLang.rankeds, eloEmoji.UNRANKED + '**' + commandLang.elos.UNRANKED + '**', true);
                    }
                    message.channel.send({embed});
                    message.channel.stopTyping();
                  }).catch(error => { failed(lang, embed, message, error, this.client) });
                }).catch(error => { failed(lang, embed, message, error, this.client) });
              }).catch(error => { failed(lang, embed, message, error, this.client) });
            } else {
              embed.setColor(this.client.config.colors.error);
              embed.addField(commandLang.summoner_not_found, commandLang.summoner_not_found_desc);
              message.channel.send({embed});
              message.channel.stopTyping();
            }
          }).catch(error => { failed(lang, embed, message, error, this.client) });
        } else {
          // No summoner was passed, only a region
          embed.setColor(this.client.config.colors.error);
          embed.addField(commandLang.no_summoner_error, commandLang.error_desc);
          message.channel.send({embed});
        }
      } else {
        // The region passed is not valid
        embed.setColor(this.client.config.colors.error);
        embed.addField(commandLang.invalid_region_error.replace('{0}', args[0]), commandLang.error_desc_with_regions.replace('{0}', utils.arrayToStringWithCommas(Object.keys(regions), lang.and)));
        message.channel.send({embed});
      }
    } else {
      // No arguments were passed
      embed.setColor(this.client.config.colors.error);
      embed.addField(commandLang.summoner_region_error, commandLang.error_desc_with_regions.replace('{0}', utils.arrayToStringWithCommas(valid_regions, lang.and)));
      message.channel.send({embed});
    }
  }

  canRun(message, args) {
    return this.client.config.riot_token ? true : false;
  }

}
