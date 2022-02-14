const fs = require('fs-extra')
const { join, dirname } = require('path')
var log = []

/** 
 * log a change
 * @param type the type of change (e.g. 'video')
 * @param prev the old value
 * @param curr the new value
 * */ 
function logChange (type, prev, curr) {
  let currTime = new Date().getTime();
  writeToLog("" + currTime + ", " + type + ", " + prev + ", " + curr);
}

function logState (state) {
  let logEntry = {
    "timestamp": new Date().getTime(),
  }
  if (typeof state.scenario != "undefined") {
    logEntry["scenario"] = {
      "id": state.scenario.scenario_id,
      "name": state.scenario.scenario_name
    };
  }
  if(typeof state.location != "undefined") {
    logEntry["location"] = {
      "id": state.location.location_id,
      "name": state.location.location_name,
      "type": state.location.location_type
    };
    if (typeof state.location.location_length != "undefined") {
      logEntry.location["length"] = state.location.location_length
    }
  } 
  if(typeof state.video != "undefined"){
    logEntry["video"] = {
      "id": state.video.video_id,
      "name": state.video.video_name
    };
  }
  logEntry["overlays"] = [];
  for (const [key, value] of Object.entries(state.overlay)) {
    if (value.display) {
      logEntry["overlays"].push({
        "id": key,
        "category":value.category,
        "name":value.name,
        "title":value.title,
        "distance_meters":value.distance_meters,
        "distance_seconds":value.distance_seconds,
      })
    }
  }
  log.push(logEntry)
}

/**
 * read and return the content of the log file
 * @returns content of the log file
 */
function exportLogs () {
  return new Promise(function(resolve,reject){
    fs.writeFile(join(__dirname, '../public/logs/remote.json'), JSON.stringify(log), 'utf8', function(err) {
      if(err) {
          console.log(err);
          reject();
      }
      log = []
      fs.readFile(join(__dirname, '../public/logs/remote.json'), 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          reject();
        }
        resolve(data);
      });
    }); 
  });
}

/**
 * clear the log file and write the first row
 */
function clearLogs () {
  log = [];
}

module.exports = {
  logState,
  clearLogs,
  exportLogs
  }