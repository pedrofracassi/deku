const Command = require('../structures/command.js');
const weather = require('weather-js');

const Logo = "http://www.noaa.gov/sites/default/files/styles/crop_394x394/public/thumbnails/image/FocusArea__Weather-02.jpg?itok=fO6wu2A8";

module.exports = class Weather extends Command {

  constructor(client) {
    super(client);

    this.name    = "weather";
    this.aliases = ["forecast", "temperature", "temperatura"];
  }

  run(message, args, commandLang) {
    const embed = this.client.getDekuEmbed(message);
    if(args.length > 0) {
      const zone = args.join(" ");
      embed.setColor(this.client.config.colors.embed);
      message.channel.startTyping();
      weather.find({search: zone, degreeType: 'c'}, (err, result) => {
        if(err) {
          embed.setColor(this.client.config.colors.error);
          embed.addField(commandLang.error_title, commandLang.error_description);
        } else {
          let rst = result[0];
          if(rst) {
            embed.setAuthor(commandLang.forecast_on.replace('{0}', rst.location.name), Logo);
            embed.addField(commandLang.current, commandLang.temperature_before.replace('{0}', rst.current.temperature).replace('{1}', rst.current.humidity).replace('{2}', rst.current.winddisplay));
            embed.addField(commandLang.forecast_day.replace('{0}', rst.forecast[2].date), commandLang.temperature_after.replace('{0}', rst.forecast[2].high).replace('{1}', rst.forecast[2].low));
          } else {
            embed.setColor(this.client.config.colors.error);
            embed.addField(commandLang.error_title, commandLang.invalid_zone);
          }
        }
        message.channel.stopTyping();
        message.channel.send({embed});                      
      });
    } else {
      embed.setColor(this.client.config.colors.error);
      embed.addField(commandLang.specify_zone, commandLang.usage);
      message.channel.send({embed});
    }
  }
}