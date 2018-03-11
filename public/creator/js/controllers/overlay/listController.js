var app = angular.module("ive");


// Overlay list controller
app.controller("overlayListController", function($scope, $rootScope, $filter, $translate, $location, config, $window, $authenticationService, $overlayService) {

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
            // Search overlays
            $overlayService.search($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.overlays = response.data;
                $scope.pages = [];

                // Prepare pagination
                if($scope.overlays.length > 0){
                    // Set count
                    $overlayService.setCount($scope.overlays[0].full_count);
                } else {
                    // Reset count
                    $overlayService.setCount(0);

                    // Reset pagination
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                for(var i=0; i<Math.ceil($overlayService.getCount() / $scope.pagination.limit); i++){
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
            // Load overlays
            $overlayService.list($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.overlays = response.data;
                $scope.pages = [];

                // Prepare pagination
                if($scope.overlays.length > 0){
                    // Set count
                    $overlayService.setCount($scope.overlays[0].full_count);
                } else {
                    // Reset count
                    $overlayService.setCount(0);

                    // Reset pagination
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                for(var i=0; i<Math.ceil($overlayService.getCount() / $scope.pagination.limit); i++){
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
        $overlayService.setFilter($scope.filter);
        $scope.load();
    };

    /**
     * [description]
     * @param  {[type]} offset [description]
     * @return {[type]}        [description]
     */
    $scope.changeOffset = function(offset, page_index){
        $scope.pagination.offset = offset;
        $overlayService.setPagination($scope.pagination);
        $scope.load();
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_OVERLAYS') };

    // Load overlays
    $scope.pagination = $overlayService.getPagination();
    $scope.filter = $overlayService.getFilter();
    $scope.applyFilter();

});
