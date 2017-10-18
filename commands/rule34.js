const Command = require('../structures/command.js');

module.exports = class Rule34 extends Command {

  constructor(client) {
    super(client);
    this.aliases = ['r34'];
    this.name = "rule34";
  }

  run(message, args) {
    var embed = this.client.getDekuEmbed(message);
    if (message.channel.nsfw) {
      let query = args.join(' ');
      message.channel.startTyping();
      this.client.reddit.getSubreddit('rule34').search({query: query, time: 'all', sort: 'top'}).then(listing => {
          var images = [];
          listing.forEach(submission => {
            if (submission.domain == 'i.imgur.com') {
              images.push(submission);
            }
          });

          var rand = images[Math.floor(Math.random() * images.length)];
          // var rand = images[0];
          if (rand) {
              embed.setColor(0x5f99cf);
              embed.setTitle(rand.title);
              embed.setImage(rand.url);
              embed.setURL('http://reddit.com' + rand.permalink)
          } else {
            embed.setDescription('**No images found.**');
            embed.setColor(this.client.config.colors.error);
          }
        message.channel.send({embed});
        message.channel.stopTyping();
      });
    } else {
      embed.setDescription('**This command can only be used in NSFW channels.**');
      embed.setColor(this.client.config.colors.error);
      message.channel.send({embed});
      message.channel.stopT
    }
  }

}
