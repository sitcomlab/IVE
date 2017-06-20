var app = angular.module("ive");

// Relationship has_parent_location delete controller
app.controller("hasParentLocationDeleteController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
            $scope.redirect("/relationship/has_parent_location");
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    $scope.input = "";
    $scope.relationship_type = "HAS_PARENT_LOCATION";

    $relationshipService.retrieve_by_id('has_parent_location', $routeParams.relationship_id)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
