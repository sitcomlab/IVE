var app = angular.module("ive");

// Relationship belongs_to delete controller
app.controller("belongsToDeleteController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
     * [delete description]
     * @return {[type]} [description]
     */
    $scope.delete = function(){
        $scope.changeTab(0);
        $relationshipService.remove($scope.relationship.relationship_id)
        .then(function onSuccess(response) {
            $scope.redirect("/relationship/belongs_to/");
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.label = $routeParams.label;
    $scope.input = "";
    $scope.relationship_type = "BELONGS_TO";

    $relationshipService.retrieve_by_id('belongs_to', $routeParams.relationship_id, $scope.label)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
