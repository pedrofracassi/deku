const Command = require('../structures/command.js');

const Discord = require('discord.js');
const request = require('request');
const geoip = require('geoip-lite');

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes+':'+seconds;
  return time;
}

module.exports = class BotInfo extends Command {

  constructor(client) {
    super(client);

    this.name     = "botinfo";
    this.aliases  = ["bi"];
  }

  run(message, args, commandLang) {
    let embed = this.client.getDekuEmbed(message);
    request('http://api.ipify.org/?format=json', (err, res, body) => {
      if (err) {
        embed.setColor(this.client.config.colors.error);
        embed.setTitle(commandLang.error_ip);
        embed.setDescription(commandLang.error_ip_desc);
      } else {
        let ip = JSON.parse(body).ip;
        let geo = geoip.lookup(ip);
        embed.addField(commandLang.server_location, `:flag_${geo.country.toLowerCase()}: ${geo.city}`, true);
        embed.setThumbnail(message.client.user.displayAvatarURL);
        embed.addField(commandLang.servers, message.client.guilds.size, true);

        let members = this.client.guilds
          .map(g => g.members)
          .reduce((a, b) => a.concat(b))
          .array().length;
        embed.addField(commandLang.users, members, true);

        const uptime = process.uptime().toString().toHHMMSS();
        embed.addField(commandLang.uptime, uptime, true);

        const channels = this.client.guilds
          .map(g => g.channels)
          .reduce((a, b) => a.concat(b))
          .array().length;
        embed.addField(commandLang.channels, channels, true);
        embed.addField(commandLang.djs_v, Discord.version, true);
        
        const memUsage = process.memoryUsage();
        embed.addField(commandLang.ram, this.bytesToSize(memUsage.heapUsed), true);
      }
      message.channel.send({embed});
    });
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
  }

}
