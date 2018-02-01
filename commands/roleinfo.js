const Command = require('../structures/command.js');

module.exports = class RoleInfo extends Command {

    constructor(client) {
        super(client);

        this.name    = "roleinfo"
        this.aliases = ["rinfo"];
    }

    run (message, args, commandLang, db, lang) {
        let embed = this.client.getDekuEmbed(message);
        if (!args[0]) {
            embed.setColor(this.client.config.colors.error);
            embed.addField(commandLang.no_role_specified, `\n${lang.usage} ${commandLang._usage}\n${lang.example} ${commandLang._example}`);
        } else {
            let role = message.mentions.roles.first() || message.guild.roles.get(args[0]) || message.guild.roles.find(r => r.name.toLowerCase() == args.join(' ').toLocaleLowerCase());
            if (role) {
                embed.addField(commandLang.roleName, role, true);
                embed.addField(commandLang.id, role.id, true);
                embed.addField(commandLang.memberCount, role.members.size, true);
                if (role.color) {
                    embed.setColor(role.color);
                    embed.addField(commandLang.color, `[#${role.color.toString(16)}](http://www.color-hex.com/color/${role.color.toString(16)})`, true);
                }
                embed.addField(commandLang.hoist, role.hoist ? ":white_check_mark: " + lang.yes : ":cross~1: " + lang.no, true);
                embed.addField(commandLang.position, role.position, true);
                embed.addField(commandLang.creationTimestamp, role.createdAt, false);
            } else {
                embed.setColor(this.client.config.colors.error);
                embed.setTitle(commandLang.role_not_found);
            }
        }
        message.channel.send({embed})
    }

    static canRun(message) {
        return !!message.guild;
    }

};
