const Command = require('../structures/command.js');

module.exports = class RoleIds extends Command {

    constructor(client) {
        super(client);

        this.name    = "roleinfo"
        this.aliases = ["rinfo"];
    }

    run (message, args, commandLang) {
        let embed = this.client.getDekuEmbed(message);
        if (message.mentions.roles.first()) {
            let role = message.mentions.roles.first();
            embed.setTitle(role.name);
            embed.addField(commandLang.memberCount, role.members.size, true);
            embed.addField(commandLang.id, role.id, true);
            if (role.color) {
                embed.addField(commandLang.colorHEX, `[#${role.color.toString(16)}](http://www.color-hex.com/color/${role.color.toString(16)})`, true);
            }
        } else {
            embed.setColor(this.client.config.colors.error);
            embed.setTitle(commandLang.mention_plz);
        }
        message.channel.send({embed})
    }

    static canRun(message) {
        return !!message.guild;
    }

};
