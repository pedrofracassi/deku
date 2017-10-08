const EventListener = require('../structures/listener.js');

module.exports = class GuildCreateListener extends EventListener {

  constructor(client) {
    super(client);
  }

  onGuildCreate(guild) {
  	this.getGuildLanguage(guild).then(language => {
      let embed = new Discord.RichEmbed()
      .addField(
        language.server_join.hi_im_deku, language.server_join.description
        .replace('{0}', '<:izuku:358407294100439040>')
        .replace('{1}', 'https://discordapp.com/oauth2/authorize?client_id=358398001233920001&scope=bot')
        .replace('{2}', 'https://discord.gg/9W7yyBA')
      )
      .setColor(this.config.colors.embed)
      .setThumbnail('https://i.imgur.com/lUVxkAK.png');

      guild.channels.filter(c => c.type == 'text')[0].send({embed});
    });
  }

}