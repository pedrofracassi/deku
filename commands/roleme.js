const utils   = require('../utils.js');
const config   = require('../config.js');
const levelup = require('levelup');

var db = levelup('./databases/roleme');

var roles = {
  friends: "358454098380587008",
  translators: "359749807092400139"
}

// d!roleme [--add|--remove] <role name> [role id]
exports.run = function (message, lang) {
  var embed = utils.generateDekuDiv(message);
  var args = message.content.match(utils.expression)[2].split(' ');
  if (args[0] == '--add') { // --add was passed, check if user has permission and add the role
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args[1] && args[2]) {
        if (message.guild.roles.has(args[1])) {
          var role_id = args[1];
          args.splice(0, 2);
          var role_key = args.join(" ").toLowerCase();
          db.get(message.guild.id, (err, result) => {
            if (result) {
              if (err) console.log(err);
              var json = JSON.parse(result);
              json[role_key] = role_id;
              db.put(message.guild.id, JSON.stringify(json), err => {
                if (err) console.log(err);
                embed.setColor(config.colors.success);
                embed.setDescription(`Added ${message.guild.roles.get(role_id)} to \`d!roleme\` as \`${role_key}\``);
                message.channel.send({embed});
              });
            } else {
              var object = {};
              object[role_key] = role_id;
              db.put(message.guild.id, JSON.stringify(object), err => {
                if (err) console.log(err);
                embed.setColor(config.colors.success);
                embed.setDescription(`Added ${message.guild.roles.get(role_id)} to \`d!roleme\` as \`${role_key}\``);
                message.channel.send({embed});
              })
            }
          });
        } else {
          embed.setColor(config.colors.error);
          embed.setDescription('`{0}` isn\'t a valid role ID for this server.');
          message.channel.send({embed});
        }
      } else {
        embed.setColor(config.colors.error);
        embed.setTitle('You need to specify a role name and role ID!');
        embed.setDescription('**Usage:** `d!roleme --add <role name> <role id>`\n**Example:** `d!roleme --add lol 358446520334286851`\n\nPro tip: You can get the role IDs from d!roleids');
        message.channel.send({embed});
      }
    } else {
      console.log('a')
    }
  } else if (args[0] == '--remove') {
    if (message.member.hasPermission('MANAGE_GUILD')) {
      if (args[1]) {
        db.get(message.guild.id, (err, result) => {
          if (result) {
            args.splice(0, 1);
            var role_key = args.join(" ").toLowerCase();
            var json = JSON.parse(result);
            if (json[role_key]) {
              delete json[role_key];
              db.put(message.guild.id, JSON.stringify(json), err => {
                if (err) console.log(err);
                embed.setColor(config.colors.success)
                embed.setDescription('I removed `{0}` from the `d!roleme` roles.'.replace('{0}', role_key));
                message.channel.send({embed});
              });
            } else {
              embed.setColor(config.colors.error)
              embed.setDescription('`{0}` isn\'t a `d!roleme` role.'.replace('{0}', role_key));
              message.channel.send({embed});
            }
          } else {
            embed.setColor(config.colors.error);
            embed.setDescription('This server doesen\'t have `d!roleme` roles.');
            message.channel.send({embed});
          }
        });
      } else {
        message.reply('Not enough args');
      }
    } else {
      message.reply('No perms');
    }
  } else {
    // No flags were passed, proceed to check if role is avaliable and give it
    db.get(message.guild.id, (err, result) => {
      if (result) {
        if (err) console.log(err);
        console.log(json);
        var json = JSON.parse(result);
        if (args[0]) {
          if (json[args.join(" ").toLowerCase()]) {
            var roleid = json[args.join(" ").toLowerCase()];
            if (!message.member.roles.has(roleid)) {
              message.member.addRole(roleid).then(() => success(embed, lang, message, roleid, true)).catch((err) => fail(embed, lang, message, roleid, true, err));
            } else {
              message.member.removeRole(roleid).then(() => success(embed, lang, message, roleid, false)).catch((err) => fail(embed, lang, message, roleid, false, err));
            }
          } else {
            embed.setColor(config.colors.error);
            embed.setDescription('**"{0}"** isn\'t a `d!roleme` role.'.replace('{0}', args.join(" ")));
            message.channel.send({embed});
          }
        } else {
          var commands = "";
          var roles = "";
          Object.keys(json).forEach(key => {
            commands = commands + "`d!roleme " + key + "`\n";
            roles = roles + message.guild.roles.get(json[key]) + '\n';
          });
          embed.addField('Command', commands, true);
          embed.addField('Role', roles, true);
          message.channel.send('<:izuku:358407294100439040> **Here\'s a list of avaliable roles:**', {embed: embed});
        }
      } else {
        embed.setColor(config.colors.error);
        embed.setDescription('This server doesen\'t have `d!roleme` roles.');
        message.channel.send({embed});
      }
    });
  }
}

function success(embed, lang, message, roleid, add) {
  embed.setColor(config.colors.success)
  if (add) {
    embed.setDescription('I gave you the role {0}.'.replace('{0}', message.guild.roles.get(roleid)));
  } else {
    embed.setDescription('I removed the role {0} from you.'.replace('{0}', message.guild.roles.get(roleid)));
  }
  message.channel.send({embed});
}

function fail(embed, lang, message, roleid, add, err) {
  embed.setColor(config.colors.error)
  if (add) {
    embed.setTitle('I wasn\'t able to give you the role {0}.'.replace('{0}', message.guild.roles.get(roleid)));
  } else {
    embed.setTitle('I wasn\'t able to remove the role {0} from you.'.replace('{0}', message.guild.roles.get(roleid)));
  }
  console.log(err);
  embed.setDescription(`Please ask the server owner to check my permissions.\n\n\`${err}\``);

  message.channel.send({embed});
}
