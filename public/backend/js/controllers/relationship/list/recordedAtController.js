var app = angular.module("ive");

// Relationship recorded_at list controller
app.controller("recordedAtListController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService) {

    /*************************************************
        FUNCTIONS
     *************************************************/

    /**
     * [changeTab description]
     * @param  {[type]} tab [description]
     * @return {[type]}     [description]
     */
    $scope.changeTab = function(tab){
        $scope.tab = tab;
    };

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function(path){
        $location.url(path);
    };

    /**
     * [reset description]
     */
    $scope.resetSearch = function(){
        $scope.searchText = "";
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.searchText = "";
    $relationshipService.list_by_type('recorded_at')
    .then(function onSuccess(response) {
        $scope.relationships = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
