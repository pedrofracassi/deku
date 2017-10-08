const level     = require('level');
const databases = {
  roleme_config: level('./databases/roleme'),
  language_config: level('./databases/language'),
  autorole_config: level('./databases/autorole')
}

const config    = require('./config.json');
const Deku      = require('./deku.js');
const client    = new Deku({config, databases});
client.start();

// Express Server for /docs testing
//   const website = require('./website.js');
//   website.start();