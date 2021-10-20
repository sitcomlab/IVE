const fs = require('fs-extra')
const { join, dirname } = require('path')
var date = new Date();

/**
 * Write content to the log file (while keeping previous entries)
 * @param content content to be added to the file
 */
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

/** 
 * log a change
 * @param type the type of change (e.g. 'video')
 * @param prev the old value
 * @param curr the new value
 * */ 
function logChange (type, prev, curr) {
  var currTime = date.getTime();
  writeToLog("" + currTime + ", " + type + ", " + prev + ", " + curr);
}

/**
 * read and return the content of the log file
 * @returns content of the log file
 */
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

/**
 * clear the log file and write the first row
 */
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