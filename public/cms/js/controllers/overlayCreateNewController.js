var app = angular.module("ive_cms");


app.controller("overlayCreateNewController", function ($scope, $rootScope, $window, config, $overlayService, $location, $authenticationService, Upload, $timeout) {

    $scope.subsite = "create-new";

    $rootScope.currentCategory = "Overlays";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/overlays');
    }
    $rootScope.currentSite = "Create new overlay";

    $scope.newOverlay = {
        name: "",
        description: "",
        tags: [],
        category: "",
        url: ""
    }

    $authenticationService.authenticate(config.creatorLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    // Boolean indicating if the forms are valid
    var isValid = null;

    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var url_input = angular.element('#url-input');

    // Submit the overlay
    $scope.submit = function () {
        if (validate()) {
            $overlayService.create($scope.newOverlay).then(function onSuccess(response) {
                $scope.redirect('/overlays/' + response.data.overlay_id);
            })
        }
    }

    $scope.distanceValueChanged= function(value) {
        if(value != undefined) {
            $scope.newOverlay.distance_seconds = Math.round(value / config.walkingSpeed); // Assign after calculation
        }
        else{
            $scope.newOverlay.distance_seconds = undefined;
        }
    }

    var validate = function () {
        isValid = true;

        if ($scope.newOverlay.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newOverlay.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Put tags in array
        if ($scope.newOverlay.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.newOverlay.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.newOverlay.tags_parsed = tagArray;
        }

        if ($scope.newOverlay.category == 'website') {
            var urlRegExp = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

            if (!urlRegExp.test($scope.newOverlay.url)) {
                url_input.parent().parent().addClass('has-danger')
                url_input.addClass('form-control-danger');
                isValid = false;
            }
        }
        return isValid;

    };

    // Upload an Image as an Overlay
    $scope.uploadImage = function(file, errFiles) {
        $scope.newOverlay.url = "/images/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.apiURL + '/overlays/uploadImage',
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

    // Upload an Image as an Overlay
    $scope.uploadVideo = function(file, errFiles) {
        $scope.newOverlay.url = "/videos/overlays/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.apiURL + '/overlays/uploadVideo',
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

    // Upload an 3D-object as an Overlay
    $scope.uploadObject = function(file, errFiles) {
        $scope.newOverlay.url = "/objects/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.apiURL + '/overlays/uploadObject',
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

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };
});
