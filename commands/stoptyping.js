module.exports = {
  run: function(message) {
    message.reply('tentando parar de digitar.');
    while (message.channel.typing) {
      message.channel.stopTyping();
    }
  }
}
