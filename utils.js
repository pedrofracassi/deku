const level = require('level');

module.exports = {
  
  arrayToStringWithCommas: (array, last) => {
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
  },
  
  initializeDatabase: (path) => {
    let db = level(path);
    
    db.getPromise = (key) => {
      return new Promise((resolve, reject) => {
        db.get(key, (err, res) => {
          if(err) {
            reject(err);
          } else {
            try { res = JSON.parse(res) }
            resolve(res);
          }
        });
      });
    }
    
    db.putPromise = (key, value) => {
      if(typeof value !== 'string') value = JSON.stringify(value);
      return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
          if(err) reject(err);
          else    resolve();
        });
      });
    }
    
    return db;
  }
}
