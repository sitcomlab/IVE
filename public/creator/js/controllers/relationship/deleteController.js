var app = angular.module("ive");

// Relationship delete controller
app.controller("relationshipDeleteController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $relationshipService, $locationService) {

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
            $scope.redirect("/relationships/" + $scope.relationship_label);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };

    /**
     * [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.load = function(data){
        switch (data) {
            case 'relationship': {
                $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id, $routeParams.relationship_type)
                .then(function onSuccess(response) {
                    $scope.relationship = response.data;
                    $scope.load("locations");
                })
                .catch(function onError(response) {
                    $window.alert(response.data);

                });
                break;
            }
            case 'locations': {
                $locationService.list()
                .then(function onSuccess(response) {
                    $scope.locations = response.data;
                    $scope.load();
                })
                .catch(function onError(response) {
                    $window.alert(response.data);
                    $scope.load();
                });
            }
            default: {
                $scope.$parent.loading = { status: false, message: "" };
            }
        }
    }

    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    $scope.relationship_label = $routeParams.relationship_label;
    $scope.relationship_type = $routeParams.relationship_type;
    $scope.input = "";

    $scope.load("relationship");

});
