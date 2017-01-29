var app = angular.module("ive");

// Relationship connected_to list controller
app.controller("connectedToListController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
    $scope.changeTab(0);
    $scope.searchText = "";
    $scope.relationship_id = "";
    $scope.relationshipStatus = false;

    $relationshipService.list_by_type('connected_to')
    .then(function onSuccess(response) {
        $scope.relationships = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
