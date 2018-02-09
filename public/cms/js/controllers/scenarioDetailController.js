var app = angular.module("ive_cms");

app.controller("scenarioDetailController", function ($scope, $rootScope, $route, $window, $document, config, $authenticationService, $videoService, $scenarioService, $locationService, $relationshipService, $overlayService, $location, $routeParams, $sce, $filter, leafletData) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var created_input = angular.element('#created-input');

    $rootScope.currentCategory = "Scenarios";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/scenarios');
    }
    $rootScope.currentSite = null;

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    /**
     * 
     *      INIT
     * 
     */

    $scenarioService.retrieve($routeParams.scenario_id)
        .then(function onSuccess(response) {
            $scope.scenario = response.data;
            $scope.scenario.videos = [];

            $rootScope.currentSite = "Scenario: '" + $scope.scenario.name + "'";

            // Style date 
            $scope.scenario.created = $filter('timestamp')($scope.scenario.created);
            $scope.scenario.tags = ['tag1,tag2,tag3'];

            // Get relationship to get the belonging videos
            $relationshipService.list_by_type('belongs_to', 'video').then(function onSuccess(response) {
                var video_relations = response.data;
                video_relations.forEach(function (relation) {
                    if (relation.scenario_id == $scope.scenario.scenario_id) {
                        $scope.scenario.videos.push(relation);
                    }
                }, this);

                // Get the Location for each video and attach it
                $relationshipService.list_by_type('recorded_at').then(function onSuccess(response_rec) {
                    var video_locations = response_rec.data;

                    var videoMarkers = [];
                    video_locations.forEach(function (relation) {
                        $scope.scenario.videos.forEach(function (video, index) {
                            if (relation.video_id == video.video_id) {
                                $scope.scenario.videos[index].location = relation;
                                $scope.scenario.videos[index].overlays = [];

                                // Create Marker for every video's location
                                if ($scope.scenario.videos[index].location.location_type == 'outdoor') {
                                    var location = new L.latLng($scope.scenario.videos[index].location.location_lat, $scope.scenario.videos[index].location.location_lng);
                                    var popupContent = `Video: ${$scope.scenario.videos[index].video_name} <br> Location: ${$scope.scenario.videos[index].location.location_name}`;
                                    var videoMarker = new L.Marker(location, {
                                        clickable: true
                                    }).bindPopup(popupContent);
                                    videoMarkers.push(videoMarker);
                                }
                            }
                        })
                    })

                    leafletData.getMap('scenarioDetailMap').then(function (map) {
                        var featureGroup = new L.featureGroup(videoMarkers).addTo(map);
                        map.fitBounds(featureGroup.getBounds(), {
                            animate: false,
                            padding: L.point(50, 50)
                        })
                    });

                    var filterOverlays = function (overlays) {
                        $relationshipService.list_by_type('belongs_to', 'overlay').then(function onSuccess(response) {
                            var filtered = [];
                            overlays.forEach(function (overlay) {
                                response.data.forEach(function (relation) {
                                    if (overlay.overlay_id == relation.overlay_id && relation.scenario_id == $scope.scenario.scenario_id) {
                                        filtered.push(overlay);
                                    }
                                }, this);
                            }, this);
                            // Now display the filtered overlays
                            displayOverlays(filtered);
                        })
                    }

                    var displayOverlays = function (overlay_relations) {

                        $scope.scenario.videos.forEach(function (video, video_index) {
                            $scope.scenario.videos[video_index].overlays = [];
                            var i = 0;
                            overlay_relations.forEach(function (overlay, overlay_index) {
                                if (overlay.video_id == video.video_id) {
                                    $scope.scenario.videos[video_index].overlays[i] = overlay;
                                    i++;
                                }

                                if (i > 1) {
                                    $scope.scenario.videos[video_index].multipleOverlays = true
                                }

                            }, this);
                        })
                    }

                    // Get the Overlays for each video and attach them
                    $relationshipService.list_by_type('embedded_in').then(function onSuccess(response) {
                        var overlay_relations = response.data;
                        overlay_relations = filterOverlays(overlay_relations);
                    })
                })
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

    // Function that is triggered, when the delete button has been pressed
    $scope.deleteScenario = function () {
        var scenario_id = $scope.scenario.scenario_id;
        if ($window.confirm(`You are going to delete the Scenario. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {

                // First delete any relationships the scenario has
                // Since the API doesn't give a way to display all belongs_to relations we need to
                // do it individually for every 'label' (overlay, loc, vid) of belongs_to relation
                $relationshipService.list_by_type('belongs_to', 'video').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })

                $relationshipService.list_by_type('belongs_to', 'location').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })

                $relationshipService.list_by_type('belongs_to', 'overlay').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })

                // Then remove the scenario
                $scenarioService.remove(scenario_id).then(function (response) {
                    // .. and return to the overview
                    $scope.redirect('/scenarios');
                })


            }
        }
    }

    // Function that is triggered, when the edit button has been pressed
    $scope.editScenario = function () {

        if ($scope.editMode) {
            $scope.editMode = false;
            name_input.prop('disabled', true);
            desc_input.prop('disabled', true);
            tags_input.prop('disabled', true);
            created_input.prop('disabled', true);
        } else {
            $scope.editMode = true;
            // Enable input Fields
            angular.element('.col-10 > .form-control').removeAttr('disabled');
        }
    }

    // Function that is triggered when the in editMode accessible button "delete" is clicked
    $scope.saveScenario = function () {
        // Validate input
        var isValid = true;

        if ($scope.scenario.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.scenario.description == "") {
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

        if ($scope.scenario.created != "") {
            // Trying to create a new date
            var created_date = new Date(parseInt($scope.scenario.created.split('-')[0]), parseInt($scope.scenario.created.split('-')[1] - 1), parseInt($scope.scenario.created.split('-')[2]));
            // Check if it has been parsed correctly
            if (isNaN(created_date)) {
                created_input.parent().parent().addClass('has-danger')
                created_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (created_date > new Date()) {
                created_input.parent().parent().addClass('has-danger')
                created_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            created_input.parent().parent().addClass('has-danger')
            created_input.addClass('form-control-danger');
            isValid = false;
        }

        if (isValid) {
            $scenarioService.edit($scope.scenario.scenario_id, $scope.scenario).then(function (response) {
                if (response.status == 200) {
                    $scope.redirect('/scenarios');
                }
            });
        }
    }

    $scope.deleteVideo = function (video_id) {
        if ($window.confirm(`You are going to remove this Video from the Scenario. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                var video_to_delete;

                // Remove Video from the (over)view
                $scope.scenario.videos.forEach(function (video, index) {

                    if (video.video_id == video_id) {
                        video_to_delete = video;
                        $scope.scenario.videos.splice(index, 1);
                    }
                })

                // Remove belongs_to relation
                $relationshipService.remove(video_to_delete.relationship_id).then(function onSuccess(response) {

                })
            }
        }

    }

    $scope.deleteOverlay = function (video_id, overlay_id) {

        if ($window.confirm(`You are going to remove this Overlay from the Video. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                $scope.scenario.videos.forEach(function (video, index) {
                    if (video.video_id == video_id) {
                        $scope.scenario.videos[index].overlays.forEach(function (overlay, overlayIndex) {
                            if (overlay.overlay_id == overlay_id) {
                                $scope.scenario.videos[index].overlays.splice(overlayIndex, 1);

                                $relationshipService.remove(overlay.relationship_id).then(function onSuccess() {
                                    $relationshipService.list_by_type('belongs_to', 'overlay').then(function onSuccess(response) {
                                        response.data.forEach(function (relation) {
                                            if (relation.overlay_id == overlay_id) {
                                                $relationshipService.remove(relation.relationship_id);
                                            }
                                        }, this);
                                    })
                                })
                            }
                        })
                    }
                })

            }
        }

    }

    $scope.repositionOverlay = function (overlay) {
        $scope.repositionOverlayState = true;
        $scope.positioningOverlay = overlay;

        var videoExtension = $scope.positioningOverlay.video_url.split('.')[1];

        // Wenn keine extension in der URL war..
        if (videoExtension == null) {
            videoExtension = 'mp4';
            $scope.positioningOverlay.video_url += '.mp4';
        }

        $scope.videoConfig = {
            sources: [{
                src: $sce.trustAsResourceUrl($scope.positioningOverlay.video_url),
                type: "video/" + videoExtension
            }],
            tracks: [],
            theme: "../bower_components/videogular-themes-default/videogular.css",
        }
    }

    $scope.cancelReposition = function () {
        $scope.repositionOverlayState = false;
        $route.reload();
    }

    $scope.saveOverlayPosition = function () {
        // This will be implemented when the positioning is done correctly..

        console.log('Overlay Saving Simulation...');
        // This is just faked data with zeroes filled
        $relationshipService.create('embedded_in', {
            overlay_id: $scope.positioningOverlay.overlay_id,
            video_id: $scope.positioningOverlay.video_id,
            w: 0,
            h: 0,
            d: 0,
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0,
            display: true
        }).then(function onSuccess(response) {
            $scope.redirect('/scenarios/' + $scope.scenario.scenario_id);
            $route.reload();
            $scope.repositionOverlayState = false;
        })
    }

    /**
     * 
     *  Add overlay to existing scenario
     * 
     */
    $scope.addOverlay = function (video) {
        $scope.addOverlayState = true;
        $scope.baseVideo = video;
    }

    $scope.initOverlayAddition = function (isNew) {
        if (isNew) {
            // New overlay will be created
            $scope.newOverlayState = true;
            $scope.existingOverlayState = false;
            $scope.newOverlay = {
                name: "",
                description: "",
                url: "",
                category: "",
                tags: []
            }
        } else {
            // Load Picker for exisiting overlay
            $scope.existingOverlayState = true;
            $scope.newOverlayState = false;
            $overlayService.list().then(function onSuccess(response) {
                $scope.existingOverlays = response.data;
            })

        }

    }

    $scope.cancelOverlayAddition = function () {
        $scope.newOverlayState = false;
        $scope.existingOverlayState = false;
        $scope.newOverlay = {};
        $scope.existingOverlays = {};
        $route.reload();
    }

    $scope.submitNewOverlay = function (overlay) {
        $overlayService.create(overlay).then(function onSuccess(response) {
            overlay = response.data;
            $relationshipService.create('belongs_to', {
                scenario_id: $scope.scenario.scenario_id,
                overlay_id: response.data.overlay_id
            }, 'overlay').then(function onSuccess(response) {
                $scope.newOverlayState = false;
                $scope.addOverlayState = false;

                overlay.video_url = $scope.baseVideo.video_url;
                overlay.video_id = $scope.baseVideo.video_id;
                $scope.baseVideo = {};
                $scope.repositionOverlay(overlay);
            })

        })

    }

    $scope.submitExistingOverlay = function (overlay) {
        $relationshipService.create('belongs_to', {
            scenario_id: $scope.scenario.scenario_id,
            overlay_id: overlay.overlay_id
        }, 'overlay').then(function onSuccess(response) {
            $scope.existingOverlayState = false;
            $scope.addOverlayState = false;

            overlay.video_url = $scope.baseVideo.video_url;
            overlay.video_id = $scope.baseVideo.video_id;
            $scope.baseVideo = {};
            $scope.repositionOverlay(overlay);
        })
    }

    /**
     * 
     *  Add video to existing scenario
     * 
     */
    $scope.addVideo = function () {
        $scope.editMode = false;
        $scope.addVideoState = true;
    }

    $scope.initVideoAddition = function (isNew) {
        if (isNew) {
            if ($window.confirm(`To add a new Video please create it seperately first. Do you want to be redirected to the 'Add a new Video'-Screen?`)) {
                $scope.redirect('/videos/create-new');
            } else {
                $route.reload()
            }
        } else {
            $scope.setupAddExistingVideoMap();
            $scope.existingVideoState = true;
            $scope.newVideoState = false;
        }

    }

    $scope.cancelVideoAddition = function () {

        $scope.newVideoState = false;
        $scope.existingVideoState = false;
        $route.reload();
    }


    $scope.submitVideo = function () {
        // Create relation

        console.log($scope.newVideo);
        $relationshipService.create('belongs_to', {
            scenario_id: $scope.scenario.scenario_id,
            video_id: $scope.newVideo.video_id
        }, 'video').then(function onSuccess(response) {
            console.log(response);
            $route.reload();
        })

    }
    /**
     * 
     *  Map Settings & setUp functions
     *  Search functions also included!
     * 
     */

    $scope.setupAddExistingVideoMap = function () {

        var videoMarkers = [];

        $videoService.list().then(function (videos) {
            // Get recorded_At relations
            $relationshipService.list_by_type('recorded_at').then(function (relations) {

                // create markers from recorded at relation when video.video_id relation.video_id matches
                videos.data.forEach(function (video, video_index) {

                    relations.data.forEach(function (relation) {
                        if (video.video_id == relation.video_id) {

                            // We dont want to display indoor locations
                            if (relation.location_type != "indoor" && relation.location_lat != 0 && relation.location_lng != 0) {

                                var myIcon = new L.Icon({
                                    iconUrl: 'images/videomarker.png',
                                    iconRetinaUrl: 'images/videomarker@2x.png',
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41]
                                })

                                var popupContent = `Selected Video: <br> Video Name: ${relation.video_name} <br> Description: ${relation.video_description} `;
                                var marker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), {
                                    clickable: true,
                                    icon: myIcon
                                }).bindPopup(popupContent);

                                marker.on('click', function (e) {
                                    $scope.newVideo = video;
                                    $scope.newVideo.location = {
                                        lat: relation.location_lat,
                                        lng: relation.location_lng,
                                        location_id: relation.location_id
                                    }
                                })
                                videoMarkers.push(marker);
                            }

                            if (video_index == videos.data.length - 1) {
                                leafletData.getMap('addExistingVideoMap').then(function (map) {
                                    // Clear map first;
                                    if ($scope.featureGroup != null) {
                                        map.removeLayer($scope.featureGroup);
                                    }
                                    $scope.featureGroup = new L.featureGroup(videoMarkers).addTo(map);
                                    map.fitBounds($scope.featureGroup.getBounds(), {
                                        animate: false,
                                        padding: L.point(50, 50)
                                    });
                                })
                            }
                        }

                    }, this);
                }, this);


                /**
                 * Function to search the videos
                 */

                $scope.searchVideo = function () {

                    var searchVideoMarkers = [];
                    relations.data.forEach(function (relation) {

                        // Add all if the term is empty
                        if ($scope.searchVideoTerm == "") {
                            if (relation.location_type != "indoor" && relation.location_lat != 0 && relation.location_lng != 0) {

                                var myIcon = new L.Icon({
                                    iconUrl: 'images/videomarker.png',
                                    iconRetinaUrl: 'images/videomarker@2x.png',
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41]
                                })

                                var popupContent = `Selected Video: <br> Video Name: ${relation.video_name} <br> Description: ${relation.video_description} `;
                                var marker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), {
                                    clickable: true,
                                    icon: myIcon
                                }).bindPopup(popupContent);

                                marker.on('click', function (e) {
                                    $scope.newVideo = {
                                        name: relation.video_name,
                                        description: relation.video_description,
                                        id: relation.video_id,
                                        recorded: relation.video_recorded,
                                        url: relation.video_url,
                                        created: relation.video_created,
                                        updated: relation.video_updated
                                    }
                                })
                                searchVideoMarkers.push(marker);
                            }
                            return;
                        }

                        // add matches
                        if (relation.video_name.search($scope.searchVideoTerm) != -1) {

                            var myIcon = new L.Icon({
                                iconUrl: 'images/videomarker.png',
                                iconRetinaUrl: 'images/videomarker@2x.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })

                            var popupContent = `Selected Video: <br> Video Name: ${relation.video_name} <br> Description: ${relation.video_description} `;
                            var marker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), {
                                clickable: true,
                                icon: myIcon
                            }).bindPopup(popupContent);
                            marker.on('click', function (e) {

                                $scope.newVideo = {
                                    name: relation.video_name,
                                    description: relation.video_description,
                                    id: relation.video_id,
                                    recorded: relation.video_recorded,
                                    url: relation.video_url,
                                    created: relation.video_created,
                                    updated: relation.video_updated
                                }

                                $scope.existingVideo = true;

                            })

                            searchVideoMarkers.push(marker);
                        }

                    }, this);

                    // Clear map and add new featureGroup with searchResults
                    leafletData.getMap('addExistingVideoMap').then(function (map) {
                        map.removeLayer($scope.featureGroup);
                        $scope.featureGroup = new L.featureGroup(searchVideoMarkers).addTo(map);
                        map.fitBounds($scope.featureGroup.getBounds(), {
                            animate: false,
                            padding: L.point(50, 50)
                        });
                    })
                }
            })
        })
    }

});

// Directive to handle the overlay positioning mockup
app.directive('ngDraggable', function ($document) {
    return {
        restrict: 'A',
        scope: {
            dragOptions: '=ngDraggable'
        },
        link: function (scope, elem, attr) {
            var startX, startY, x = 0,
                y = 0,
                start, stop, drag, container;

            var width = elem[0].offsetWidth,
                height = elem[0].offsetHeight;

            // Obtain drag options
            if (scope.dragOptions) {
                start = scope.dragOptions.start;
                drag = scope.dragOptions.drag;
                stop = scope.dragOptions.stop;
                var id = scope.dragOptions.container;
                if (id) {
                    container = document.getElementById(id).getBoundingClientRect();
                }
            }

            // Bind mousedown event
            elem.on('mousedown', function (e) {
                e.preventDefault();
                startX = e.clientX - elem[0].offsetLeft;
                startY = e.clientY - elem[0].offsetTop;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
                if (start) start(e);
            });

            // Handle drag event
            function mousemove(e) {
                y = e.clientY - startY;
                x = e.clientX - startX;
                setPosition();
                if (drag) drag(e);
            }

            // Unbind drag events
            function mouseup(e) {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                if (stop) stop(e);
            }

            // Move element, within container if provided
            function setPosition() {
                if (container) {
                    if (x < container.left) {
                        x = container.left;
                    } else if (x > container.right - width) {
                        x = container.right - width;
                    }
                    if (y < container.top) {
                        y = container.top;
                    } else if (y > container.bottom - height) {
                        y = container.bottom - height;
                    }
                }

                elem.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }
        }
    }

})