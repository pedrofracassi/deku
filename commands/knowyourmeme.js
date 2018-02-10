const Command = require('../structures/command.js');
const nodeyourmeme = require('nodeyourmeme');

module.exports = class KnowYourMeme extends Command {

    constructor(client) {
        super(client);

        this.name    = "knowyourmeme";
        this.aliases = ["kym"];
    }

    // TODO - Add the meme image and URL when nodeyourmeme adds support for that.

    async run(message, args, commandLang) {
        let embed = this.client.getDekuEmbed(message);
        message.channel.startTyping();
        var meme;
        try {
            if (args[0]) {
                meme = await nodeyourmeme.search(args.join((' ')));
            } else {
                meme = await nodeyourmeme.random();
            }
            embed.setTitle(meme.name);
            embed.setDescription(meme.about);
            embed.setThumbnail("https://i.imgur.com/gDXQRB1.png");
        } catch (e) {
            embed.setColor(this.client.config.colors.error);
            if (e.message.startsWith(("No results found"))) {
                embed.setTitle(commandLang.not_found.replace('{0}', args.join(" ")));
            } else {
                embed.setTitle(commandLang.meme_error);
            }
        }

        message.channel.send({embed});
        message.channel.stopTyping();
    }

};
