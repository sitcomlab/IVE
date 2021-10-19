const fs = require('fs-extra')
const { join, dirname } = require('path')
var date = new Date();

function writeToLog(content) {
  fs.open(join(__dirname, '../public/logs/remote.csv'), 'a', 666, function( err, id ) {
    if (err) {
      console.error(err)
      return
    }
    fs.write( id, content + "\n", null, 'utf8', function(err){
      if (err) {
        console.error(err)
        return
      }
      fs.close(id, err => {
          if (err) {
            console.error(err)
            return
          }
        });
    });
  });
}

function logChange (type, prev, curr) {
  var currTime = date.getTime();
  writeToLog("" + currTime + ", " + type + ", " + prev + ", " + curr);
}

function exportLogs () {
  return new Promise(function(resolve,reject){
    fs.readFile(join(__dirname, '../public/logs/remote.csv'), 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        reject();
      }
      resolve(data);
    });
  });
}

function clearLogs () {
  fs.writeFile(join(__dirname, '../public/logs/remote.csv'), "Timestamp, Type, previous, current\r\n", function(err) {
    if(err) {
        return console.log(err);
    }
}); 
}

module.exports = {
  logChange,
  clearLogs,
  exportLogs
  }