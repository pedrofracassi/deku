const Discord = require('discord.js');
const config = require('../config.js');
const utils = require('../utils.js');
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

module.exports = {
  run: function(message) {
    if (message.channel.type != 'text') return;
    var embed = utils.generateDekuDiv(message);
    request('http://api.ipify.org/?format=json', function (error, response, body) {
      if (error) {
        embed.setColor(config.colors.error);
        embed.setTitle('There was an error while getting my own IP');
        embed.setDescription('Please contact my owner, pedrofracassi#4623');
      } else {
        var ip = JSON.parse(body).ip;
        var geo = geoip.lookup(ip);
        embed.addField('Server location', `:flag_${geo.country.toLowerCase()}: ${geo.city}`, true);
        embed.setThumbnail(message.client.user.displayAvatarURL);
        embed.addField('Guilds', message.client.guilds.size, true);
        var users = 0;
        message.client.guilds.map(guild => {
          users = users + guild.members.size;
          console.log(guild.name + " - " + guild.members.size);
        });
        embed.addField('Users', users, true);
        var time = process.uptime();
        var uptime = (time + "").toHHMMSS();
        embed.addField('Uptime', uptime, true);
      }
      message.channel.send({embed});
    });
  }
}
