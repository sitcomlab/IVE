var app = angular.module("ive");


// Location list controller
app.controller("locationListController", function($scope, $rootScope, $filter, $translate, $location, config, $window, $authenticationService, $locationService) {

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
     * [description]
     * @return {[type]} [description]
     */
    $scope.load = function(){
        // Check for a search-text
        if($scope.filter.search_term !== ""){
            // Search locations
            $locationService.search($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.locations = response.data;

                // Prepare pagination
                if($scope.locations.length > 0){
                    // Set count
                    $locationService.setCount($scope.locations[0].full_count);
                } else {
                    // Reset count
                    $locationService.setCount(0);

                    // Reset pagination
                    $scope.pages = [];
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                $scope.pages = [];
                for(var i=0; i<Math.ceil($locationService.getCount() / $scope.pagination.limit); i++){
                    $scope.pages.push({
                        offset: i * $scope.pagination.limit
                    });
                }

                $scope.$parent.loading = { status: false, message: "" };
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        } else {
            // Load locations
            $locationService.list($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.locations = response.data;

                // Prepare pagination
                if($scope.locations.length > 0){
                    // Set count
                    $locationService.setCount($scope.locations[0].full_count);
                } else {
                    // Reset count
                    $locationService.setCount(0);

                    // Reset pagination
                    $scope.pages = [];
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                $scope.pages = [];
                for(var i=0; i<Math.ceil($locationService.getCount() / $scope.pagination.limit); i++){
                    $scope.pages.push({
                        offset: i * $scope.pagination.limit
                    });
                }

                $scope.$parent.loading = { status: false, message: "" };
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };

    /**
     * [resetSearch description]
     */
    $scope.resetSearch = function(){
        $scope.filter.search_term = "";
        $scope.applyFilter();
    };

    /**
     * [applyFilter description]
     * @return {[type]} [description]
     */
    $scope.applyFilter = function(){
        $locationService.setFilter($scope.filter);
        $scope.load();
    };

    /**
     * [description]
     * @param  {[type]} offset [description]
     * @return {[type]}        [description]
     */
    $scope.changeOffset = function(offset, page_index){
        $scope.pagination.offset = offset;
        $locationService.setPagination($scope.pagination);
        $scope.load();
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_LOCATIONS') };

    // Load locations
    $scope.pagination = $locationService.getPagination();
    $scope.filter = $locationService.getFilter();
    $scope.applyFilter();

});
