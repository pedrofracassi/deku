const levelup   = require('levelup');
const databases = {
  roleme_config: levelup('./databases/roleme'),
  language_config: levelup('./databases/language'),
  autorole_config: levelup('./databases/autorole')
}

const config    = require('./config.json');
const Deku      = require('./deku.js');
const client    = new Deku({config, databases});
client.start();

// Express Server for /docs testing
//   const website = require('./website.js');
//   website.start();