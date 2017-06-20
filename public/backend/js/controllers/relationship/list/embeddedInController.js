var app = angular.module("ive");

// Relationship embedded_in list controller
app.controller("embeddedInListController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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

    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIPS') };
    $scope.searchText = "";
    $relationshipService.list_by_label('embedded_in')
    .then(function onSuccess(response) {
        $scope.relationships = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
