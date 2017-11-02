require('dotenv').config();
const config = require('./config.json');
const Deku   = require('./deku.js');
const client = new Deku({config});
client.start();

// Express Server for /docs testing
//   const website = require('./website.js');
//   website.start();