var app = angular.module("ive");

// Relationship embedded_in edit controller
app.controller("embeddedInEditController", function($scope, $rootScope, $routeParams, $interval, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
     * [save description]
     * @return {[type]} [description]
     */
    $scope.save = function(){
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
            $scope.$parent.loading = { status: true, message: $filter('translate')('SAVING_RELATIONSHIP') };
            console.log($scope.relationship);

            $relationshipService.edit($scope.relationship_label, $scope.relationship.relationship_id, $scope.relationship)
            .then(function onSuccess(response) {
                console.log("in then");
                console.log(response.data);
                $scope.relationship = response.data;
                $scope.redirect("/relationships/" + $scope.relationship_label + "/" + $scope.relationship.relationship_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
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
            if($scope.relationship.thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.relationship.thumbnail = $filter('thumbnail')($scope.relationship, $scope.currentPreview);
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


    /*************************************************
        LISTENERS
     *************************************************/
    $scope.$on('$destroy', function() {
        $interval.cancel(promise);
    });


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    $scope.relationship_label = 'embedded_in';
    var promise;

    $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
