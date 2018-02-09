var app = angular.module("ive_cms");


app.controller("overlayCreateNewController", function ($scope, $rootScope, $window, config, $overlayService, $location, $authenticationService) {

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

    $authenticationService.authenticate(config.backendLogin)
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

        if ($scope.overlay.category == 'website') {
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