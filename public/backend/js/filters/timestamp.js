var app = angular.module("ive");


// Timestamp filter
app.filter('timestamp', function() {
    return function(timestamp) {
        if(timestamp){
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return "-";
        }
    };
});
