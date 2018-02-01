const level = require('level');

module.exports = {
  
  arrayToStringWithCommas: (array, and) => {
    if(!array || !Array.isArray(array) || array.length < 1) return '';
    if(array.length < 2) return array[0];
    let lastIndex = array.length - 1;
    let firstPart = array.slice(0, lastIndex).join(', ');
    return firstPart + and + array[lastIndex];
  },
  
  initializeDatabase: (path) => {
    let db = level(path);
    
    db.getPromise = (key, throwError) => {
      return new Promise((resolve, reject) => {
        db.get(key, (err, res) => {
          if(err) {
            if(throwError) reject(err);
            else           resolve(undefined);
          } else {
            try      { res = JSON.parse(res); }
            catch(e) { res = res || {};       }
            finally  { resolve(res);          }
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
    
    db.delPromise = (key) => {
      return new Promise((resolve, reject) => {
        db.del(key, (err) => {
          if(err) reject(err);
          else    resolve();
        });
      });
    }
    
    return db;
  }
}
