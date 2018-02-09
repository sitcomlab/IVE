var app = angular.module("ive_cms");

app.controller("overlayOverviewController", function ($scope, $rootScope, $window, config, $overlayService, $location, $authenticationService, $relationshipService) {

    // $scope.active = "scenarios";
    $scope.subsite = "overview";
    $scope.portraitView = true;

    $rootScope.currentCategory = "Overlays";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/overlays');
    }
    $rootScope.currentSite = null;

    // Authenticate with the backend to get permissions to delete content
    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });


    $overlayService.list()
        .then(function onSuccess(response) {
            $scope.overlays = response.data;
            $scope.overlays.forEach(function (element) {
                element.tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
            }, this);
        })

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    $scope.deleteOverlay = function (overlay_id) {

        if ($window.confirm(`You are going to delete the Overlay. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {

                $overlayService.remove(overlay_id).then(function (response) {
                    console.log('Overlay removed');
                });
                // Delete the video from the videos array
                $scope.overlays.forEach(function (overlay, index) {

                    if (overlay.overlay_id == overlay_id) {
                        $scope.overlays.splice(index, 1);
                    }

                }, this);

                // Delete relation to the videos
                $relationshipService.list_by_type('embedded_in').then(function (relations) {
                    relations.data.forEach(function (relation) {
                        if (relation.overlay_id == overlay_id) {
                            $relationshipService.remove(relation.relationship_id);
                        }
                    }, this);
                })

            }
        }
    }


    $scope.search = function () {
        $overlayService.list()
            .then(function onSuccess(response) {
                var allOverlays = response.data;
                var searchResults = [];
                if ($scope.searchTerm != null && $scope.searchTerm != "") {
                    var normalized = $scope.searchTerm.toLowerCase();
                    for (var i = 0; i < $scope.overlays.length; i++) {
                        var match = false;
                        var current_overlay = $scope.overlays[i];
                        if (current_overlay.name.toLowerCase().search('(' + normalized + ')') != -1) match = true;
                        if (current_overlay.description.toLowerCase().search('(' + normalized + ')') != -1) match = true;
                        if (match) searchResults.push(current_overlay);
                    }
                    $scope.overlays = searchResults;
                } else {
                    $scope.overlays = allOverlays;
                }
            })
    }
});