var app = angular.module("ive");

// Relationship connected_to list controller
app.controller("connectedToListController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
     * [reset description]
     */
    $scope.resetSearch = function(){
        $scope.searchText = "";
    };


    /**
     * [toggle description]
     * @param  {[type]} relationship_id [description]
     * @return {[type]}                 [description]
     */
    $scope.toggle = function(relationship_id){
        $scope.relationshipStatus = !$scope.relationshipStatus;
        if($scope.relationshipStatus){
            $scope.relationship_id = relationship_id;
        } else {
            $scope.relationship_id = "";
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIPS') };
    $scope.searchText = "";
    $scope.relationship_id = "";
    $scope.relationshipStatus = false;

    $relationshipService.list_by_label('connected_to')
    .then(function onSuccess(response) {
        $scope.relationships = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
