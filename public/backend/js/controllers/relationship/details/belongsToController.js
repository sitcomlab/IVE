var app = angular.module("ive");

// Relationship belongs_to details controller
app.controller("belongsToDetailsController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.label = $routeParams.label;

    $relationshipService.retrieve_by_id('belongs_to', $routeParams.relationship_id, $scope.label)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
