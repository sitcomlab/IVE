var app = angular.module("ive");


// Preview video filter
app.filter('previewVideo', function(config) {
    return function(video, fileName) {
        return config.thumbnailFolder + "/" + video.v_id + "/poster.jpg";
    };
});
