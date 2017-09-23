const utils   = require('../utils.js');

exports.run = function (message, lang) {
  var embed = utils.generateDekuDiv(message);
  var roles = "";
  var ids   = "";
  var members = "";
  message.guild.roles.map(role => {
    roles = roles + role + "\n";
    ids = ids + role.id + "\n";
  });
  embed.addField('Role', roles, true);
  embed.addField('ID', ids, true);
  message.channel.send({embed});
};
