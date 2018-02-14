var app = angular.module("ive.upload.video", ['ngFileUpload']);

// Video create controller
app.controller("videoCreateController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $videoService, Upload, $timeout) {

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
        if($scope.createVideoForm.$invalid) {
            // Update UI
            $scope.createVideoForm.name.$pristine = false;
            $scope.createVideoForm.description.$pristine = false;
            $scope.createVideoForm.url.$pristine = false;
            $scope.createVideoForm.recorded.$pristine = false;
            $scope.createVideoForm.thumbnails.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_VIDEO') };

            $videoService.create($scope.video)
            .then(function onSuccess(response) {
                $scope.video = response.data;
                $window.prompt($filter('translate')('NEW_VIDEO_CREATED'), $scope.video.video_uuid);
                $scope.redirect("/videos/" + $scope.video.video_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };

    $scope.uploadVideo = function(file, errFiles) {
        var folderUrl = $('#folderUrl').val();
        $scope.video.url = "/videos/" + $scope.folderUrl + "/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.getApiEndpoint() + '/videos/uploadVideo/' + folderUrl,
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
    $scope.video = $videoService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
