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
