const Command = require('../structures/command.js');
const fetch = require('isomorphic-fetch');
function getStatus(website, API_BASE_URL = 'https://isitup.org') {
  const address = `${API_BASE_URL}/${website}.json`;
  return new Promise((res, rej) => {
    fetch(address).then(response => {
      if (response.status >= 400) {
        return rej('Bad response from server');
      }
      return res(response.json());
    });
  });
}
function checkHttp(link) {
    return link.replace(/^http(?:s)?:\/\//, '');
}

module.exports = class IsItUp extends Command {
    constructor(client) {
        super(client);

        this.name = 'isitup';
        this.aliases = ['isup', 'online', 'website'];
    }

    run(message, args, commandLang) {
        const embed = this.client.getDekuEmbed(message);
        if(!args[0]) {
            embed.addField(commandLang.invalid, commandLang.usage);
            embed.setColor(this.client.config.colors.error);
            message.channel.send({embed});
        } else if(args[1]) {
            embed.addField(commandLang.invalid, commandLang.usage);
            embed.setColor(this.client.config.colors.error);
            message.channel.send({embed});
        } else {
            message.channel.startTyping();
            getStatus(checkHttp(args[0])).then(data => {
                embed.setAuthor(commandLang.title.replace('${0}', data.domain), 'https://isitup.org/static/img/icon.png');
                if(data.status_code == 1) {
                    embed.setDescription(commandLang.isup.replace('${0}', data.domain));
                    embed.setColor(this.client.config.colors.success);
                    embed.addField(commandLang.timeTook.replace('${0}', (data.reponse_time * 100)).replace('${1}', data.response_code).replace('${2}', data.response_ip))
                }
                else if(data.status_code == 2) {
                    embed.setDescription(commandLang.isdown.replace('${0}', data.domain));
                    embed.setColor(this.client.config.colors.error);
                }
                message.channel.stopTyping();
                message.channel.send({embed});
            }).catch(err => {
                embed.addField(commandLang.error, err);
                embed.setColor(this.client.config.colors.error);
                message.channel.send({embed});
            })
        }
    }
}