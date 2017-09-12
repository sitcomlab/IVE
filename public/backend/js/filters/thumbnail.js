var app = angular.module("ive");


// Thumbnail filter
app.filter('thumbnail', function(config) {
    return function(video, fileName, relationship_label) {
        return config.thumbnailFolder + "/" + video.video_uuid + "/" + fileName + ".jpg";
    };
});
