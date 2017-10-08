const Discord = require('discord.js');

module.exports = {
  arrayToStringWithCommas: function(array, last) {
    var string = "";
    for (i = 0; i < array.length; i++) {
      if (i == (array.length - 1)) {
        string = string + array[i];
      } else if (i == (array.length - 2)) {
        string = string + array[i] + last;
      } else {
        string = string + array[i] + ", ";
      }
    }
    return string;
  }
}
