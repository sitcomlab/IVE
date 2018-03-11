var express = require('express');
var router = express.Router();

// To have access to all multipart/
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({
    uploadDir: '/media/ive_data/videos/tmp'
});

var path = require('path');
var fs = require('fs');
var mv = require('mv');

var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;



router.post('/cms/videos/upload', multipartyMiddleware, function (req, res) {
    //
    // Move file to correct location
    //


    var fileExtension = req.files.file.path.split('.')[1];

    var oldPath = req.files.file.path;
    var newPath = __dirname + '/../public/videos/'; // Needs to be further specified when it's clear if it's an existing or a new location

    // When it's an exisiting location
    if (req.body.location.existing_name != null) {
        newPath += req.body.location.existing_name + '/' + req.body.location.newVideo.name + '.' + fileExtension;
        mv(oldPath, newPath, {
            mkdirp: true
        }, function (err) {
            if (err) {
                console.log(err);

            } else {
                console.log('Copy process to IVE Video folder finished');

                generate_thumbnail(newPath);
            }

        })
        // Now the case that a new location has been created  
    } else {
        newPath += req.body.location.newLocation.name + '/' + req.body.location.newVideo.name + '.' + fileExtension;
        mv(oldPath, newPath, {
            mkdirp: true
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Copy process to IVE Video folder finished');
                generate_thumbnail(newPath);
            }

        })

    }


    //
    // Generate Thumbnail:
    //

    function generate_thumbnail(videoLocation) {
        console.log('Starting thumbnail generation');
        var args = ['-i', videoLocation, '-ss', '00:00:10', '-t', '1', '-s', '300x169', '-f', 'mjpeg', videoLocation + '_thumbnail.png'];
        var ffmpeg = spawn('ffmpeg', args);

        // ffmpeg.stdout.on('data', function (data) {
        //     console.log(data);
        // })

        ffmpeg.on('exit', function () {
            console.log('Thumbnail generated');
            finishVideoUpload();
        })

        ffmpeg.stderr.on('data', function (data) {
            console.log('grep stderr: ' + data);
        });

    }

    function finishVideoUpload() {
        res.json({
            url: newPath
        });
    }

})

router.get('/cms', function (req, res) {
    path.resolve('public/cms/index.html')
})


function move(oldPath, newPath, callback) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                console.log('COPYING STARTED');
                copy(callback);
            } else {
                console.log(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', function () {
            console.log('error while reading')
        });
        writeStream.on('error', function () {
            console.log('error while writing')
        });

        readStream.on('close', function () {
            fs.unlink(oldPath, console.log('Copying finished'));
        });

        writeStream.on('close', function () {
            console.log('Test');
            console.log(callback);
        })

        readStream.pipe(writeStream);
    }
}

module.exports = router;