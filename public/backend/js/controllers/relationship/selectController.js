var app = angular.module("ive");


// Relationship select controller
app.controller("relationshipSelectController", function($scope, $rootScope, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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

    /**
     * [description]
     * @return {[type]} [description]
     */
    $scope.load = function(){
        // Load relationships
        $scope.relationships = $relationshipService.get_labels()
        $scope.pages = [{
            offset: 0
        }];
        $scope.pagination = {
            offset: 0,
            limit: 50
        }
        $scope.$parent.loading = { status: false, message: "" };
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIPS') };
    $scope.filter = {
        orderby: "name",
        search_term: ""
    };
    $scope.load();

});
