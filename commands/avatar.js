module.exports = {
  run: function(message) {
    if(message.mentions.members.size >= 1) {
      message.reply('here\'s **'+message.mentions.members.first().displayName+'\'s** profile picture:\n' + message.mentions.members.first().user.avatarURL);
    } else {
      message.reply('here\'s your profile picture:\n' + message.author.avatarURL);
    }
  }
};
