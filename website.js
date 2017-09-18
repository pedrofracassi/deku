const path = require('path');
const express = require('express');

const staticPath = path.join(__dirname, '/docs');
const port = process.env.PORT || 8080;

const server = express().use(express.static(staticPath));

module.exports = {
  start: function() {
    server.listen(port, function() {
      console.log('Listening on port ' + port);
    });
  },
  stop: function() {
    server.close();
  }
}
