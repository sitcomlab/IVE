var app = angular.module("ive");

// Relationship has_parent_location details controller
app.controller("hasParentLocationDetailsController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    // TODO: $scope.relationship_label = $routeParams.relationship_label;
    $scope.relationship_label = 'has_parent_location';

    $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
