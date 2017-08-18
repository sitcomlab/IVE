var app = angular.module("ive");

// Relationship list controller
app.controller("relationshipListController", function($scope, $rootScope, $routeParams, $interval, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
     * [startPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.startPreview = function(video) {
        // store the interval promise
        $scope.currentPreview = 1;
        $scope.maxPreview = video.thumbnails;

        // stops any running interval to avoid two intervals running at the same time
        $interval.cancel(promise);

        // store the interval promise
        promise = $interval(function() {
            var index = $scope.relationships.indexOf(video);
            if($scope.relationships[index].thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.relationships[index].thumbnail = $filter('thumbnail')($scope.relationships[index], $scope.currentPreview);
            }
            $scope.currentPreview++;
        }, config.thumbnailSpeed);
    };

    /**
     * [stopPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.stopPreview = function(video) {
        $interval.cancel(promise);
    };


    /**
     * [description]
     * @return {[type]} [description]
     */
    $scope.load = function(){
        // Check for a search-text
        if($scope.filter.search_term !== ""){
            // Search relationships
            $relationshipService.search_by_label($routeParams.relationship_label, $scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.relationships = response.data;
                $scope.pages = [];

                // Prepare pagination
                if($scope.relationships.length > 0){
                    // Set count
                    $relationshipService.setCount($scope.relationships[0].full_count);
                } else {
                    // Reset count
                    $relationshipService.setCount(0);

                    // Reset pagination
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                for(var i=0; i<Math.ceil($relationshipService.getCount() / $scope.pagination.limit); i++){
                    $scope.pages.push({
                        offset: i * $scope.pagination.limit
                    });
                }

                $scope.$parent.loading = { status: false, message: "" };
            })
            .catch(function onError(response) {
                $window.alert("Hallo");
                $window.alert(response);
            });
        } else {
            // Load relationships
            $relationshipService.list_by_label($routeParams.relationship_label, $scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.relationships = response.data;
                $scope.pages = [];

                // Prepare pagination
                if($scope.relationships.length > 0){
                    // Set count
                    $relationshipService.setCount($scope.relationships[0].full_count);
                } else {
                    // Reset count
                    $relationshipService.setCount(0);

                    // Reset pagination
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                for(var i=0; i<Math.ceil($relationshipService.getCount() / $scope.pagination.limit); i++){
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
    $scope.applyFilter = function(reset){
        if(reset){
            $scope.pagination.offset = 0;
            $relationshipService.setPagination($scope.pagination);
        }
        if($routeParams.relationship_label === 'belongs_to'){
            switch ($scope.filter.relationship_type) {
                case 'location': {
                    $scope.filter.orderby = "location_name.asc";
                    break;
                }
                case 'video': {
                    $scope.filter.orderby = "video_name.asc";
                    break;
                }
                case 'overlay': {
                    $scope.filter.orderby = "overlay_name.asc";
                    break;
                }
                default: {
                    $scope.filter.orderby = null;
                }
            };
        }
        $relationshipService.setFilter($scope.filter);
        $scope.load();
    };

    /**
     * [description]
     * @param  {[type]} offset [description]
     * @return {[type]}        [description]
     */
    $scope.changeOffset = function(offset, page_index){
        $scope.pagination.offset = offset;
        $relationshipService.setPagination($scope.pagination);
        $scope.load();
    };


    /**
     * [description]
     * @param  {[type]} relationship_label [description]
     * @param  {[type]} relationship       [description]
     * @return {[type]}                    [description]
     */
    $scope.itemTracker = function(relationship_label, relationship){
        switch (relationship_label) {
            case 'belongs_to': {
                return relationship.location_id + "-" + relationship.scenario_id;
            }
            case 'connected_to': {
                return relationship.start_location_id + "-" + relationship.end_location_id;
            }
            case 'has_parent_location': {
                return relationship.child_location_id + "-" + relationship.parent_location_id;
            }
            case 'recorded_at': {
                return relationship.video_id + "-" + relationship.location_id;
            }
            case 'embedded_in': {
                return relationship.overlay_id + "-" + relationship.video_id;
            }
        }
    };


    /*************************************************
        LISTENERS
     *************************************************/
    $scope.$on('$destroy', function() {
        $interval.cancel(promise);
    });


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIPS') };
    var promise;

    $scope.relationship_label = $routeParams.relationship_label;
    $scope.pagination = $relationshipService.getPagination();
    $scope.filter = $relationshipService.getFilter();

    // Prepare relationship_type only for 'belongs_to' relationship
    switch ($routeParams.relationship_label) {
        case 'belongs_to': {
            $scope.filter.orderby = "location_name.asc";
            $scope.filter.relationship_type = "location";
            break;
        }
        case 'connected_to': {
            $scope.filter.orderby = "start_location_name.asc";
            $scope.filter.relationship_type = null;
            break;
        }
        case 'has_parent_location': {
            $scope.filter.orderby = "child_location_name.asc";
            $scope.filter.relationship_type = null;
            break;
        }
        case 'recorded_at': {
            $scope.filter.orderby = "video_name.asc";
            $scope.filter.relationship_type = null;
            break;
        }
        case 'embedded_in': {
            $scope.filter.orderby = "overlay_name.asc";
            $scope.filter.relationship_type = null;
            break;
        }
    }

    // Load relationships
    $scope.applyFilter();
});
