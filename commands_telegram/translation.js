const request = require('request');
const tokens = require('../tokens.js');

module.exports = {
  run: function(bot, msg, databases) {
    bot.sendChatAction(msg.chat.id, 'typing');
    var options = {
      api_token: tokens.poeditor,
      id: '132933'
    }
    request.post({url: 'https://api.poeditor.com/v2/languages/list', formData: options}, (err,httpResponse,body) => {
      var text = ''
      JSON.parse(body).result.languages.forEach(language => {
        text = text + `*${language.name}:* ${language.percentage.toFixed(0)}%\n`
      });
      bot.sendMessage(msg.chat.id, text, {parse_mode: 'markdown'});
    });
  }
}
