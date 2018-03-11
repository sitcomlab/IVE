var app = angular.module("ive");

// Relationship create controller
app.controller("relationshipCreateController", function($scope, $rootScope, $filter, $translate, $location, config, $window) {

    /*************************************************
        FUNCTIONS
     *************************************************/

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function(path){
        $location.url(path);
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: false, message: "" };


});
