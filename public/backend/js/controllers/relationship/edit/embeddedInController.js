var app = angular.module("ive");

// Relationship embedded_in edit controller
app.controller("embeddedInEditController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
            $scope.editRelationshipForm.w.$pristine = false;
            $scope.editRelationshipForm.h.$pristine = false;
            $scope.editRelationshipForm.d.$pristine = false;
            $scope.editRelationshipForm.x.$pristine = false;
            $scope.editRelationshipForm.y.$pristine = false;
            $scope.editRelationshipForm.z.$pristine = false;
            $scope.editRelationshipForm.rx.$pristine = false;
            $scope.editRelationshipForm.ry.$pristine = false;
            $scope.editRelationshipForm.rz.$pristine = false;
            $scope.editRelationshipForm.display.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('') };
            $relationshipService.edit($scope.relationship_label, $scope.relationship.relationship_id, $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationship/embedded_in/" + $scope.relationship.relationship_id);
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
    $scope.relationship_label = 'embedded_in';

    $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
