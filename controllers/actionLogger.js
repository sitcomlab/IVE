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

function videoChange (prev, curr) {
  var currTime = date.getTime();
  var prevId = (typeof prev == 'undefined') ? undefined : prev.video_id;
  writeToLog("" + currTime + ", Video, " + prevId + ", " + curr.video_id)
}

function locationChange (prev, curr) {
  var currTime = date.getTime();
  var prevId = (typeof prev == 'undefined') ? undefined : prev.location_id;
  writeToLog("" + currTime + ", Location, " + prevId + ", " + curr.location_id)
}

function scenarioChange (prev, curr) {
  var currTime = date.getTime();
  var prevId = (typeof prev == 'undefined') ? undefined : prev.scenario_id;
  writeToLog("" + currTime + ", Scenario, " + prevId + ", " + curr.scenario_id)
}

function exportLogs (objectType, finalize) {

}

function clearLogs (objectType, finalize) {

}

module.exports = {
  videoChange,
  locationChange,
  scenarioChange
  }