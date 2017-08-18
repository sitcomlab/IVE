var app = angular.module("ive");


// Thumbnail filter
app.filter('thumbnail', function(config) {
    return function(video, fileName, relationship_label) {
        return config.thumbnailFolder + "/" + video.v_id + "/" + fileName + ".jpg";
    };
});
