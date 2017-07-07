var app = angular.module("ive");

// Relationship belongs_to edit controller
app.controller("belongsToEditController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.editRelationshipForm.$invalid) {
            // Update UI
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('') };
            $relationshipService.edit($scope.relationship_label, $scope.relationship.relationship_id, $scope.relationship_type, $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationship/belongs_to/" + $scope.label + "/" + $scope.relationship.relationship_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    // TODO: $scope.relationship_label = $routeParams.relationship_label;
    $scope.relationship_label = 'belongs_to';

    $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id, $scope.relationship_type)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
