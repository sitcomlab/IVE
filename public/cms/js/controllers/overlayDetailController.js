var app = angular.module("ive_cms");


app.controller("overlayDetailController", function ($scope, $rootScope, $routeParams, $window, config, $overlayService, $location, $authenticationService, $relationshipService) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    $scope.appearsInVideos = [];

    $rootScope.currentCategory = "Overlays";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/overlays');
    }
    $rootScope.currentSite = null;

    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var url_input = angular.element('#url-input');
    var type_input = angular.element('#overlay_type-button');

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    $overlayService.retrieve($routeParams.overlay_id).then(function onSuccess(response) {
        $scope.overlay = response.data;
        $rootScope.currentSite = "Overlay: '" + $scope.overlay.name + "'";
        $scope.overlay.tags = [];

        $relationshipService.list_by_type('embedded_in').then(function onSuccess(videos) {
            videos.data.forEach(function (relation) {
                if ($scope.overlay.overlay_id == relation.overlay_id) {
                    var attachedVideo = {
                        id: relation.video_id,
                        name: relation.video_name,
                        url: relation.video_url
                    }
                    $scope.appearsInVideos.push(attachedVideo);
                }
            }, this);
        })
    })

    // Function that is triggered, when the edit button has been pressed
    $scope.editOverlay = function () {
        if ($scope.editMode) {
            $scope.editMode = false;
            name_input.prop('disabled', true);
            desc_input.prop('disabled', true);
            tags_input.prop('disabled', true);
            url_input.prop('disabled', true);
            type_input.prop('disabled', true);
        } else {
            $scope.editMode = true;
            // Enable input Fields
            var inputFields = angular.element('.col-10 > .form-control').removeAttr('disabled');
            type_input.removeAttr('disabled');
        }
    }
    // Submit the overlay
    $scope.saveOverlay = function () {
        if (validate()) {
            $overlayService.edit($scope.overlay.overlay_id, $scope.overlay).then(function onSuccess(response) {
                $scope.redirect('/overlays');
            })
        }
    }

    var validate = function () {
        isValid = true;

        if ($scope.overlay.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.overlay.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Put tags in array
        if ($scope.overlay.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.overlay.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.overlay.tags_parsed = tagArray;
        }

        if ($scope.overlay.category == 'website') {
            var urlRegExp = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

            if (!urlRegExp.test($scope.overlay.url)) {
                url_input.parent().parent().addClass('has-danger')
                url_input.addClass('form-control-danger');
                isValid = false;
            }
        }


        return isValid;

    }
    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };
});