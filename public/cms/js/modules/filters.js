var app = angular.module("filters", ['angular-momentjs']);

app.filter('join', function () {
    return function join(array, separator, prop) {
        if (!Array.isArray(array)) {
            return array; // if not array return original - can also throw error
        }

        return (!!prop ? array.map(function (item) {
            return item[prop];
        }) : array).join(separator);
    };
});

/**
 * timestamp filter
 */
app.filter('timestamp', function() {
    return function(timestamp) {
        if(timestamp){
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return "-";
        }
    };
});

// Preview video filter
app.filter('previewVideo', function(config) {
    return function(video, fileName) {
        return config.thumbnailFolder + "/" + video.video_uuid + "/poster.jpg";
    };
});

// Thumbnail filter
app.filter('thumbnail', function(config) {
    return function(video, fileName, relationship_label) {
        return config.thumbnailFolder + "/" + video.video_uuid + "/" + fileName + ".jpg";
    };
});
