/*!
 * The iPED Toolkit
 * Overlays
 *
 * (c) 2014 Morin Ostkamp
 * Institute for Geoinformatics (ifgi), University of Münster
 */

define(['threejs/js/three.min',
        'threejs/js/Detector',
        'threejs/js/CSS3DRenderer',
        'threejs/js/TransformControls',
        'underscorejs/js/underscore'
    ],

    function(THREE, Detector, CSS3DRenderer, TransformControls, Underscore) {

        /**
         * The Backbone.js model of a location
         */
        Location = Backbone.Model.extend({
            urlRoot: '/api/locations',
            initialize: function() {}
        });

        /**
         * The Backbone.js model of an overlay
         */
        Overlay = Backbone.Model.extend({
            urlRoot: '/api/overlays',
            initialize: function() {}
        });

        /**
         * The Backbone.js collection of overlays
         */
        Overlays = Backbone.Collection.extend({
            model: Overlay,
            url: '/api/overlays'
        });

        /**
         * Overlays can be placed on top of a video to create the illusion of 3D objects that are blended into the simulation, e.g., public displays.
         * @constructor
         */
        function OverlayPlugin(opts) {
            JL('iPED Toolkit.OverlayPlugin')
                .info('OverlayPlugin loaded');

            this.parent = opts.parent;
            this.overlays = opts.overlays || null;

            this.jqueryElement = null;
            this.isRunning = true;
            this.video = null;
            this.top = 0;
            this.left = 0;
            this.width = 0;
            this.height = 0;
            this.myHooks = [];
            this.myHooks['render'] = [];
            this.location = null;

            this.camera = '';
            this.gridhelper = '';
            this.scene = '';
            this.cssScene = '';
            this.renderer = '';
            this.cssRenderer = '';
            this.videos = new Array();
            this.videoTextures = new Array();
            this.showUI = false;
            this.controls = new Array();

            _.bindAll(this, 'render', 'onKeyDown', 'onResize', 'updateOverlay', 'setLocationId');

            this.init();

            // Hooks the Overlay plugin to the frontend's functions
            // Morin: This could also be done by using Backbone.js's on change listener
            if (this.parent.myHooks) {
                if (this.parent.myHooks['setLocationId']) {
                    this.parent.myHooks['setLocationId'].push(this.setLocationId);
                }
            }

            this.enableEventListeners(true);

            if (this.parent.location && this.parent.location.get) {
                this.setLocationId(this.parent.location.get('id'));
            }
            if (this.overlays) {
                this.createOverlays();
            }

            this.render();

            if (opts.showUI && opts.showUI == true) {
                var thiz = this;
                setTimeout(function() {
                    thiz.toggleUI();
                }, 1000);
            }
        }

        /**
         * Stops the overlay, i.e., requestAnimationFrame
         */
        OverlayPlugin.prototype.stop = function() {
            this.isRunning = false;

            this.camera = null;
            this.gridhelper = null;
            this.scene = null;
            this.cssScene = null;
            this.renderer = null;
            this.cssRenderer = null;
            this.videos = null;
            this.videoTextures = null;
            this.controls = null;
        }

        /**
         * Initializes the Overlay plugin
         */
        OverlayPlugin.prototype.init = function() {
            this.video = $('#iPED-Video');
            this.video.on('loadeddata', this.onResize); // Give browsers time to recalculate dimensions
            $(window)
                .resize(function() {
                    this.render();
                    console.log("Resize event recognized -> rendering initiated");
                }); // Recalculate dimensions when browser window is resized
            // Create DOM element: <div id="iPED-Overlay"></div>
            if (this.jqueryElement) {
                this.jqueryElement.remove();
            }
            this.video.after('<div id="iPED-Overlay"></div>');
            this.jqueryElement = $('#iPED-Overlay');
            this.jqueryElement.css('position', 'absolute');

            // Make sure that Three.js uses CORS to load external urls as textures, for example.
            THREE.ImageUtils.crossOrigin = '';

            this.cssRenderer = new THREE.CSS3DRenderer({
                antialias: true,
                alpha: true
            });
            this.cssRenderer.setSize(this.width, this.height);
            this.cssRenderer.domElement.style.position = 'absolute';
            this.cssRenderer.domElement.style.zIndex = '9999';
            this.jqueryElement.append(this.cssRenderer.domElement);

            if (Detector.webgl) {
                this.renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true
                });
            } else {
                this.renderer = new THREE.CanvasRenderer();
            }
            this.renderer.setSize(this.width, this.height);
            this.renderer.domElement.style.position = 'absolute';
            this.jqueryElement.append(this.renderer.domElement);

            this.cssScene = new THREE.Scene();
            this.scene = new THREE.Scene();
            this.gridhelper = new THREE.GridHelper(500, 100);
            this.gridhelper.setColors('#00ff00', '#00ff00')
            //this.scene.add(this.gridhelper);

            this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 3000);
            this.camera.position.set(0, 101, 300);
            this.camera.lookAt(new THREE.Vector3(0, 101, 0));

            var light = new THREE.AmbientLight(0xffffff);
            light.position.set(1, 1, 1);
            this.scene.add(light);
        };

        /**
         * Enables or disables the key down event listener
         * @param enabled - true: enables listeners, false: disables listeners
         */
        OverlayPlugin.prototype.enableEventListeners = function(enabled) {
            if (enabled) {
                window.addEventListener('keydown', this.onKeyDown);
            } else {
                window.removeEventListener('keydown', this.onKeyDown);
            }
        };

        /**
         * Hooked to the corresponding frontend method
         */
        OverlayPlugin.prototype.setLocationId = function(locationId) {
            JL('iPED Toolkit.OverlayPlugin')
                .info('Set Location ID to: ' + locationId);
            this.init();
            this.location = new Location({
                id: locationId
            });
            this.fetchOverlays();
        }

        /**
         * Fetch overlays
         */
        OverlayPlugin.prototype.fetchOverlays = function() {
            thiz = this;

            this.overlays = new Overlays();
            this.overlays.url = '/api/locations/' + this.location.get('id') + '/overlays';
            this.overlays.fetch({
                success: function(model, response, options) {
                    thiz.createOverlays();
                },
                error: function(model, response, options) {
                    JL('iPED Toolkit.OverlayPlugin')
                        .error(respone);
                }
            });
        };

        /**
         * Creates an Three.js object for each overlay
         */
        OverlayPlugin.prototype.createOverlays = function() {
            thiz = this;

            if (!thiz.overlays || thiz.overlays.length == 0) {
                JL('iPED Toolkit.OverlayPlugin')
                    .info('There are no overlays at this location');
            } else {
                JL('iPED Toolkit.OverlayPlugin')
                    .info('There are ' + thiz.overlays.length + ' overlays at this location');
                JL('iPED Toolkit.OverlayPlugin')
                    .debug(thiz.overlays);
                thiz.overlays.forEach(function(overlay) {
                    var object;
                    switch (overlay.get('type')) {
                        case 'html':
                            var element = document.createElement('iframe');
                            element.src = overlay.get('url');
                            element.style.width = parseInt(overlay.get('w'), 10) + 'px';
                            element.style.height = parseInt(overlay.get('h'), 10) + 'px';
                            element.style.border = '0px';

                            object = new THREE.CSS3DObject(element);
                            thiz.cssScene.add(object);
                            break;


                        case 'video':
                            var n = thiz.videos.push(document.createElement('video')) - 1;
                            thiz.jqueryElement[0].appendChild(thiz.videos[n]);

                            var mp4Source = document.createElement('source');
                            mp4Source.src = overlay.get('url') + '.mp4';
                            mp4Source.type = 'video/mp4';
                            thiz.videos[n].appendChild(mp4Source);

                            var ogvSource = document.createElement('source');
                            ogvSource.src = overlay.get('url') + '.ogg';
                            ogvSource.type = 'video/ogg';
                            thiz.videos[n].appendChild(ogvSource);

                            thiz.videos[n].autoplay = 'autoplay';
                            thiz.videos[n].loop = 'loop';
                            thiz.videos[n].style.display = 'none';

                            if (thiz.videos[n]) {
                                var m = thiz.videoTextures.push(new THREE.Texture(thiz.videos[n])) - 1;
                                var material = new THREE.MeshLambertMaterial({
                                    map: thiz.videoTextures[m]
                                });
                                thiz.videos[n].play(); // Make sure the video plays
                            }

                            var geometry = new THREE.BoxGeometry(parseInt(overlay.get('w'), 10), parseInt(overlay.get('h'), 10), parseInt(overlay.get('d'), 10));
                            object = new THREE.Mesh(geometry, material);
                            thiz.scene.add(object);
                            break;


                        case 'image':
                            var texture = THREE.ImageUtils.loadTexture(overlay.get('url'), new THREE.UVMapping(), thiz.render);
                            texture.anisotropy = thiz.renderer.getMaxAnisotropy();
                            var material = new THREE.MeshLambertMaterial({
                                map: texture,
                                transparent: true
                            });

                            var geometry = new THREE.BoxGeometry(parseInt(overlay.get('w'), 10), parseInt(overlay.get('h'), 10), parseInt(overlay.get('d'), 10));
                            object = new THREE.Mesh(geometry, material);
                            thiz.scene.add(object);
                            break;


                        default:
                            var material = new THREE.MeshBasicMaterial({
                                color: 0xff0000,
                                side: THREE.DoubleSide
                            });
                            var geometry = new THREE.BoxGeometry(parseInt(overlay.get('w'), 10), parseInt(overlay.get('h'), 10), parseInt(overlay.get('d'), 10));
                            object = new THREE.Mesh(geometry, material);
                            thiz.scene.add(object);
                            break;
                    }

                    object._overlay = overlay;
                    object.position.x = parseInt(overlay.get('x'), 10);
                    object.position.y = parseInt(overlay.get('y'), 10);
                    object.position.z = parseInt(overlay.get('z'), 10);
                    object.rotation.x = parseFloat(overlay.get('rx'));
                    object.rotation.y = parseFloat(overlay.get('ry'));
                    object.rotation.z = parseFloat(overlay.get('rz'));
                    object.scale.x = 0.25; //FIXME: This is a magic number without meaning
                    object.scale.y = 0.25; //FIXME: This is a magic number without meaning

                    var n = thiz.controls.push(new THREE.TransformControls(thiz.camera, thiz.renderer.domElement)) - 1;
                    thiz.controls[n].addEventListener('change', thiz.updateOverlay);
                    thiz.controls[n].attach(object);
                    //thiz.scene.add(thiz.controls[n]);
                });
            }
        };

        /**
         * Handles key events, e.g., "toggle interactive mode (i)" or "disable chroma keying (k)".
         */
        OverlayPlugin.prototype.onKeyDown = function(event) {
            if (!this.controls) {
                return;
            }
            switch (event.keyCode) {
                case 81: // Q
                    this.controls.forEach(function(control) {
                        control.setSpace(control.space == "local" ? "world" : "local");
                    }, this);
                    break;
                case 87: // W
                    this.controls.forEach(function(control) {
                        control.setMode("translate");
                    }, this);
                    break;
                case 69: // E
                    this.controls.forEach(function(control) {
                        control.setMode("rotate");
                    }, this);
                    break;
                case 82: // R
                    this.controls.forEach(function(control) {
                        control.setMode("scale");
                    }, this);
                    break;
                case 187:
                case 107: // +,=,num+
                    this.controls.forEach(function(control) {
                        control.setSize(control.size + 0.1);
                    }, this);
                    break;
                case 189:
                case 10: // -,_,num-
                    this.controls.forEach(function(control) {
                        control.setSize(Math.max(control.size - 0.1, 0.1));
                    }, this);
                    break;
                case 73: //I
                    this.toggleUI();
                    this.render();
                    break;
            }
        };

        /*
         * Toggles the UI
         */
        OverlayPlugin.prototype.toggleUI = function() {
            if (this.showUI == true) {
                this.controls.forEach(function(control) {
                    this.scene.remove(control);
                }, this);
                this.scene.remove(this.gridhelper);
                this.cssRenderer.domElement.style.zIndex = '9999';
                this.showUI = false;
            } else {
                this.controls.forEach(function(control) {
                    this.scene.add(control);
                }, this);
                this.scene.add(this.gridhelper);
                this.cssRenderer.domElement.style.zIndex = '0';
                this.showUI = true;
            }
        }

        /**
         * Updates Three.js according to window resizing events.
         */
        OverlayPlugin.prototype.onResize = function() {
            this.top = this.video.position()
                .top;
            this.left = this.video.position()
                .left;
            this.width = this.video.width();
            this.height = this.video.height();

            this.jqueryElement.css('top', this.top + 'px');
            this.jqueryElement.css('left', this.left + 'px');
            this.jqueryElement.css('width', this.width + 'px');
            this.jqueryElement.css('height', this.height + 'px');

            if (this.camera) {
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
            }

            if (this.cssRenderer) {
                this.cssRenderer.setSize(this.width, this.height);
            }
            if (this.renderer) {
                this.renderer.setSize(this.width, this.height);
            }

            if (this.render) {
                this.render();
            }
        };

        /**
         * Updates the overlay model according to the user control
         */
        OverlayPlugin.prototype.updateOverlay = function(event) {
            var overlay = event.target.object._overlay;
            var position = event.target.object.position;
            var rotation = event.target.object.rotation;

            overlay.set('x', position.x);
            overlay.set('y', position.y);
            overlay.set('z', position.z);

            overlay.set('rx', rotation.x);
            overlay.set('ry', rotation.y);
            overlay.set('rz', rotation.z);

            this.render();
        }

        /**
         * Renders the Three.js scene. Is called by window.requestAnimationFrame().
         */
        OverlayPlugin.prototype.render = function() {
            if (this.isRunning) {
                requestAnimationFrame(this.render);
            }

            if (this.videos) {
                var i = 0;
                this.videos.forEach(function(video) {
                    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
                        this.videoTextures[i].needsUpdate = true;
                    }
                    i++;
                }, this);
            }

            if (this.controls) {
                this.controls.forEach(function(control) {
                    control.update();
                });
            }

            if (this.cssRenderer) {
                this.cssRenderer.render(this.cssScene, this.camera);
            }

            if (this.renderer) {
                this.renderer.render(this.scene, this.camera);
            }

            this.myHooks['render'].forEach(function(hook) {
                hook();
            }, this);
        };

        return OverlayPlugin;
    }
);
