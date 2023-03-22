var app = angular.module("ive");

// Relationship embedded_in edit controller
app.controller("embeddedInEditController", function($http, $scope, $rootScope, $routeParams, $interval, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService) {

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
        $scope.relationship.relationship_rx = $scope.rotation_x_grad * (Math.PI/180);
        $scope.relationship.relationship_ry = $scope.rotation_y_grad * (Math.PI/180);
        $scope.relationship.relationship_rz = $scope.rotation_z_grad * (Math.PI/180);
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

            $relationshipService.edit($scope.relationship_label, $scope.relationship.relationship_id, $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationships/" + $scope.relationship_label + "/" + $scope.relationship.relationship_id);
            })
            .catch(function onError(response) {
                if (response.data == "Token expired!") {
                    $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                    .then(res => { 
                        $authenticationService.updateUser(res.data);
                        $relationshipService.edit($scope.relationship_label, $scope.relationship.relationship_id, $scope.relationship)
                        .then(function onSuccess(response) {
                            $scope.relationship = response.data;
                            $scope.redirect("/relationships/" + $scope.relationship_label + "/" + $scope.relationship.relationship_id);
                        })
                        .catch(function onError(response) {
                            if (response.status > 0) {
                                $window.alert(response.data);
                            }
                        });
                    })
                } else {
                    $window.alert(response.data);
                }
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
        var x_grad = $scope.relationship.relationship_rx * (180/Math.PI);
        $scope.rotation_x_grad = Math.round(x_grad * Math.pow(10, 4)) / Math.pow(10, 4);

        var y_grad = $scope.relationship.relationship_ry * (180/Math.PI);
        $scope.rotation_y_grad = Math.round(y_grad * Math.pow(10, 4)) / Math.pow(10, 4);

        var z_grad = $scope.relationship.relationship_rz * (180/Math.PI);
        $scope.rotation_z_grad = Math.round(z_grad * Math.pow(10, 4)) / Math.pow(10, 4);
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
