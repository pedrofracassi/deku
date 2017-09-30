const Discord = require('discord.js');
const config = require('../config.js');
const utils = require('../utils.js');
const cmdName = 'serverinfo';

module.exports = {
  run: function(message, lang) {
    if (message.channel.type != 'text') return;
    var guild = message.guild;
    var embed = utils.generateDekuDiv(message);
    var region = lang.commands[cmdName].regions[guild.region] || guild.region;
    var offline = guild.members.filter(m=>m.presence.status=="offline").size;
    var online = guild.members.size - offline;
    embed.addField(lang.commands[cmdName].name, guild.name, true);
    embed.addField(lang.commands[cmdName].members, online + '/' + guild.members.size + ' online', true);
    embed.addField(lang.commands[cmdName].owner, guild.owner.user.tag, true);
    embed.addField(lang.commands[cmdName].region, region, true);
    embed.addField(lang.commands[cmdName].emojis, guild.emojis.size, true);
    embed.addField(lang.commands[cmdName].roles, guild.roles.size, true);
    embed.addField(lang.commands[cmdName].id, guild.id, true);
    embed.setThumbnail(guild.iconURL);

    message.channel.send({embed});
  }
}
