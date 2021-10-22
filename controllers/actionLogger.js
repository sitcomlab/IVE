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

function logState (state) {
  var currTime = date.getTime();
  let scenario_id = (typeof state.scenario != "undefined") ? state.scenario.scenario_id : "";
  let location_id = (typeof state.location != "undefined") ? state.location.location_id : "";
  let video_id = (typeof state.video != "undefined") ? state.video.video_id : "";
  let overlay_ids = "";
  for (const [key, value] of Object.entries(state.overlay)) {
    if (value) {
      overlay_ids += key+";";
    }
  }
  if (overlay_ids != null && overlay_ids.length > 0) {
    overlay_ids = overlay_ids.substring(0, overlay_ids.length - 1);
  }
  writeToLog("" + 
  currTime + ", " + 
  scenario_id + ", " + 
  location_id + ", " + 
  video_id + ", " + 
  overlay_ids);
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
  return new Promise(function(resolve,reject){
    fs.writeFile(join(__dirname, '../public/logs/remote.csv'), "Timestamp, Scenario, Location, Video, Overlay\r\n", function(err) {
      if(err) {
          console.log(err);
          reject();
      }
      resolve();
    }); 
  });
}

module.exports = {
  logState,
  clearLogs,
  exportLogs
  }