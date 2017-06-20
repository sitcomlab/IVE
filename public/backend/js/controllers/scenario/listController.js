var app = angular.module("ive");


// Scenario list controller
app.controller("scenarioListController", function($scope, $rootScope, $filter, $filter, $translate, $location, config, $window, $authenticationService, $scenarioService) {

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
            // Search scenarios
            $scenarioService.search($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.scenarios = response.data;

                // Prepare pagination
                if($scope.scenarios.length > 0){
                    // Set count
                    $scenarioService.setCount($scope.scenarios[0].full_count);
                } else {
                    // Reset count
                    $scenarioService.setCount(0);

                    // Reset pagination
                    $scope.pages = [];
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                $scope.pages = [];
                for(var i=0; i<Math.ceil($scenarioService.getCount() / $scope.pagination.limit); i++){
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
            // Load scenarios
            $scenarioService.list($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.scenarios = response.data;

                // Prepare pagination
                if($scope.scenarios.length > 0){
                    // Set count
                    $scenarioService.setCount($scope.scenarios[0].full_count);
                } else {
                    // Reset count
                    $scenarioService.setCount(0);

                    // Reset pagination
                    $scope.pages = [];
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                $scope.pages = [];
                for(var i=0; i<Math.ceil($scenarioService.getCount() / $scope.pagination.limit); i++){
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
        $scenarioService.setFilter($scope.filter);
        $scope.load();
    };

    /**
     * [description]
     * @param  {[type]} offset [description]
     * @return {[type]}        [description]
     */
    $scope.changeOffset = function(offset){
        $scope.pagination.offset = offset;
        $scenarioService.setPagination($scope.pagination);
        $scope.load();
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_SCENARIOS') };

    // Load scenarios
    $scope.pagination = $scenarioService.getPagination();
    $scope.filter = $scenarioService.getFilter();
    $scope.applyFilter();

});
