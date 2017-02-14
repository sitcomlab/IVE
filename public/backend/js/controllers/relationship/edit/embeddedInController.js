var app = angular.module("ive");

// Relationship embedded_in edit controller
app.controller("embeddedInEditController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
        console.log($location.url(path));
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
            $scope.changeTab(0);
            $relationshipService.edit('embedded_in', $scope.relationship.relationship_id, $scope.relationship)
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
    $scope.changeTab(0);

    $relationshipService.retrieve_by_id('embedded_in', $routeParams.relationship_id)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
