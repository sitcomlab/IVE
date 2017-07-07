var app = angular.module("ive");

// Relationship delete controller
app.controller("relationshipDeleteController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
     * [delete description]
     * @return {[type]} [description]
     */
    $scope.delete = function(){
        $scope.$parent.loading = { status: true, message: $filter('translate')('DELETING_RELATIONSHIP') };

        $relationshipService.remove($scope.relationship.relationship_id)
        .then(function onSuccess(response) {
            $scope.redirect("/relationship/" + $scope.relationship_label);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    $scope.relationship_label = $routeParams.relationship_label;
    $scope.relationship_type = $routeParams.relationship_type;
    $scope.input = "";

    $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id, $routeParams.relationship_type)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
