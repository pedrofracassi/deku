const Discord = require('discord.js');
const config = require('../config.js');
const utils = require('../utils.js');
const request = require('request');
const geoip = require('geoip-lite');
const os = require('os');

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

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

module.exports = {
  run: function(message, lang) {
    if (message.channel.type != 'text') return;
    var embed = utils.generateDekuDiv(message);
    request('http://api.ipify.org/?format=json', function (error, response, body) {
      if (error) {
        embed.setColor(config.colors.error);
        embed.setTitle(lang.botinfo.error_ip);
        embed.setDescription(lang.botinfo.error_ip_desc);
      } else {
        var ip = JSON.parse(body).ip;
        var geo = geoip.lookup(ip);
        embed.addField(lang.botinfo.server_location, `:flag_${geo.country.toLowerCase()}: ${geo.city}`, true);
        embed.setThumbnail(message.client.user.displayAvatarURL);
        embed.addField(lang.botinfo.servers, message.client.guilds.size, true);
        var users = 0;
        message.client.guilds.map(guild => {
          users = users + guild.members.size;
        });
        embed.addField(lang.botinfo.users, users, true);
        var time = process.uptime();
        var uptime = (time + "").toHHMMSS();
        embed.addField(lang.botinfo.uptime, uptime, true);
        var channels = 0;
        message.client.guilds.map(guild => {
          channels = channels + guild.channels.size;
        });
        embed.addField(lang.botinfo.channels, channels, true);
        embed.addField(lang.botinfo.djs_v, Discord.version, true);
        var usedram = os.totalmem() - os.freemem();
        embed.addField(lang.botinfo.ram, bytesToSize(usedram) + '/' + bytesToSize(os.totalmem()), true);
      }
      message.channel.send({embed});
    });
  }
}
