var app = angular.module("ive_cms");

app.controller("videoDetailController", function ($scope, $rootScope, $window, config, $authenticationService, $videoService, $locationService, $relationshipService, $location, $routeParams, $sce, $filter, leafletData) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var recorded_input = angular.element('#recorded-input');


    $rootScope.currentCategory = "Videos";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/videos');
    }
    $rootScope.currentSite = null;

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    $videoService.retrieve($routeParams.video_id)
        .then(function onSuccess(response) {

            $scope.video = response.data;
            $rootScope.currentSite = "Video: '" + $scope.video.name + "'";

            // Style date to 
            $scope.video.recorded = $filter('timestamp')($scope.video.recorded);
            $scope.video.tags = ['tag1,tag2,tag3'];

            var videoExtension = $scope.video.url.split('.')[1];

            // Wenn keine extension in der URL war..
            if (videoExtension == null) {
                videoExtension = 'mp4';
                $scope.video.url += '.mp4';
            }
            // Init video
            $scope.videoConfig = {
                sources: [{
                    src: $sce.trustAsResourceUrl($scope.video.url),
                    type: "video/" + videoExtension
                }],
                tracks: [],
                theme: "../bower_components/videogular-themes-default/videogular.css"
            }


            // Get relationship to get the fitting location
            $relationshipService.list_by_type('recorded_at').then(function (results) {
                results.data.forEach(function (relation) {
                    if (relation.video_id == $scope.video.video_id) {

                        leafletData.getMap('videoDetailMap').then(function (map) {
                            var popupContent = `Location: ${relation.location_name}`;
                            var videoPositionMarker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), {
                                clickable: true
                            }).bindPopup(popupContent);
                            videoPositionMarker.addTo(map);
                            map.setView(videoPositionMarker._latlng, 14);
                        });
                    }

                }, this);
            })
        });

    angular.extend($scope, {
        defaults: {
            tileLayer: "http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true
            },
            scrollWheelZoom: false
        }
    });


    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };


    // Function that is triggered, when the edit button has been pressed
    $scope.editVideo = function () {


        if ($scope.editMode) {
            $scope.editMode = false;
            name_input.prop('disabled', true);
            desc_input.prop('disabled', true);
            tags_input.prop('disabled', true);
            recorded_input.prop('disabled', true);
        } else {
            $scope.editMode = true;
            // Enable input Fields
            var inputFields = angular.element('.col-10 > .form-control').removeAttr('disabled');
        }
    }

    // Function that is triggered when the in editMode accessible button "delete" is clicked
    $scope.saveVideo = function () {

        // Validate input

        // Save using $videoService

        var isValid = true;

        if ($scope.video.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.video.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Needs to be enabled when the tags are ready
        /*
        if ($scope.video.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.video.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.video.tags = tagArray;
        }
        */

        if ($scope.video.recorded != "") {

            // Trying to create a new date
            var recorded_date = new Date(parseInt($scope.video.recorded.split('-')[0]), parseInt($scope.video.recorded.split('-')[1]), parseInt($scope.video.recorded.split('-')[2]));
            // Check if it has been parsed correctly
            if (isNaN(recorded_date)) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (recorded_date > new Date()) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            recorded_input.parent().parent().addClass('has-danger')
            recorded_input.addClass('form-control-danger');
            isValid = false;
        }

        if (isValid) {
            $videoService.edit($scope.video.video_id, $scope.video).then(function (response) {
                if (response.status == 200) {
                    $scope.redirect('/videos');
                }
            });
        }


    }

    $scope.deleteVideo = function () {

        if ($window.confirm(`You are going to delete the Video. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {

                $videoService.remove($scope.video.video_id).then(function (response) {
                    console.log('Video removed');
                });

                // Delete relation to the location
                $relationshipService.list_by_type('recorded_at').then(function (relations) {

                    relations.data.forEach(function (relation) {
                        if (relation.video_id == $scope.video_id) {
                            $relationshipService.remove(relation.relationship_id).then(function (response) {

                                if (response.status == 200) {
                                    $scope.redirect('/videos');
                                } else {
                                    console.log(response);
                                    $scope.redirect('/videos');
                                }
                            })
                        }
                    }, this);
                    // Fallback if there is no relation to be deleted - shouldn't be the case in production though..
                    $scope.redirect('/videos');
                })

            }
        }
    }



});