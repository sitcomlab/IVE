var app = angular.module("ive");

// Relationship belongs_to list controller
app.controller("belongsToListController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.toggle = function(item){
        switch (item) {
            case 'relatedLocations': {
                $scope.relatedLocations = !$scope.relatedLocations;
                break;
            }
            case 'relatedVideos': {
                $scope.relatedVideos = !$scope.relatedVideos;
                break;
            }
            case 'relatedOverlays': {
                $scope.relatedOverlays = !$scope.relatedOverlays;
                break;
            }
        }
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.searchText = "";
    $scope.relatedLocations = false;
    $scope.relatedVideos = false;
    $scope.relatedOverlays = false;

    $relationshipService.list_by_label('belongs_to', 'location')
    .then(function onSuccess(response) {
        $scope.location_relationships = response.data;

        $relationshipService.list_by_label('belongs_to', 'video')
        .then(function onSuccess(response) {
            $scope.video_relationships = response.data;

            $relationshipService.list_by_label('belongs_to', 'overlay')
            .then(function onSuccess(response) {
                $scope.overlay_relationships = response.data;
                $scope.changeTab(1);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });


});
