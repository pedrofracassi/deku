const cmdName = 'avatar';

module.exports = {
  run: function(message, lang) {
    if(message.mentions.members.size >= 1) {
      message.reply(lang.commands[cmdName].someones_picture.replace('{0}', message.mentions.members.first().displayName) + '\n' + message.mentions.members.first().user.avatarURL);
    } else {
      message.reply(lang.commands[cmdName].own_picture + '\n' + message.author.avatarURL);
    }
  }
};
