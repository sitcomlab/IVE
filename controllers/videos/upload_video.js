var fs = require('file-system');

exports.request = function(req, res, next) {
    fs.readFile(req.files.file.path, function (err, data) {
        // set the correct path for the file not the temporary one from the API:
        var filePath = 'public/videos/' + req.params.folderUrl + "/" + req.files.file.name;

        // copy the data from the req.files.file.path and paste it to file.path
        fs.writeFile(filePath, data, function (err) {
            if (err) {
                return console.warn(err);
            }
            console.log("The file: " + req.files.file.name + " was saved to " + filePath);
        });
    });
}