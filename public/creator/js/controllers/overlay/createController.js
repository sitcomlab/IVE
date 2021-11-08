var app = angular.module("ive.upload", ['ngFileUpload']);

// Overlay create controller
app.controller("overlayCreateController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $overlayService, Upload, $timeout) {

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
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.createOverlayForm.$invalid) {
            // Update UI
            $scope.createOverlayForm.name.$pristine = false;
            $scope.createOverlayForm.description.$pristine = false;
            $scope.createOverlayForm.category.$pristine = false;
            $scope.createOverlayForm.url.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_OVERLAY') };

            $overlayService.create($scope.overlay)
            .then(function onSuccess(response) {
                var new_overlay = response.data;
                $scope.redirect("/overlays/" + new_overlay.overlay_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };

    $scope.uploadImage = function(file, errFiles) {
        $scope.overlay.url = "/images/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.getApiEndpoint() + '/overlays/uploadImage',
                method: 'POST',
                data: {file: file},
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });

            // TODO: this nesting of requests is kind of difficult to read and debug. could be made cleaner
            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, (response) => {
                if (response.status > 0) {
                    if (response.data == "Token expired!") {
                        $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                        .then(res => { 
                            $authenticationService.updateUser(res.data);
                            file.upload = Upload.upload({
                                url: config.getApiEndpoint() + '/overlays/uploadImage',
                                method: 'POST',
                                data: {file: file},
                                headers: {
                                    'Authorization': 'Bearer ' + res.data.token
                                }
                            });
                            file.upload.then(function (response) {
                                $timeout(function () {
                                    file.result = response.data;
                                });
                            }, function (response) {
                                if (response.status > 0) {
                                    $scope.errorMsg = response.status + ': ' + response.data;
                                }
                            }, function (evt) {
                                file.progress = Math.min(100, parseInt(100.0 *
                                    evt.loaded / evt.total));
                            });
                        })
                    } else {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    };

    $scope.uploadVideo = function(file, errFiles) {
        $scope.overlay.url = "/videos/overlays/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.getApiEndpoint() + '/overlays/uploadVideo',
                method: 'POST',
                data: {file: file},
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    };


                /*************************************************
        INIT
     *************************************************/
    $scope.overlay = $overlayService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
