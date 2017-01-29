kindFramework.controller('mapCtrl', ['$scope', '$rootScope', 'mapService', 'LetDroneObjectService', 'LetDroneRestService', 'OptimizeService',
                                     function ($scope, $rootScope, mapService, objSrv, restSrv, OptimizeService) {
        $rootScope.title = 'map';
        console.log($scope);

        var currentLayer;
        var currentLineLayer;
        var featuresTodelete = [];
        var featureToSave ;
        $scope.init = function () {
            // objSrv.initialize();

            var settings = {

                //optional 
                minimap: true,
                url: "./images/data/tiles/{z}/{x}/{y}.png",
                minZoom: 9,
                maxZoom: 18,

                extent: {
                    boundary: [128.349003, 35.599238, 128.476021, 35.725747],
                    prjfrom: 'EPSG:4326',
                    prjto: 'EPSG:3857'
                },
                interactions: {
                    doubleClickZoom: false
                },
                //optional
                controls: {
                    zoomSlider: true,
                    scaleLine: true,
                    zoom: true,
                    miniMap: true
                },
                controlExtents: {
                    mousePosition: true
                }
            }
            mapService.initialize(settings);


            var mapData = {
                    site_id: 1,
                    user_id: 1
                } //data should be replace with site_id and user id later
            console.log('======= inside  mapService.initialize(settings)');
            var mapSetting = restSrv.getMapSettings(mapData); //rest api call
            console.log('======= before  mapSetting.then(function');
            mapSetting.then(function (res) {

                console.log('======= inside  mapSetting.then(function');

                var settings = {
                    //mandotary ddd
                    center: res.center,
                    level: res.level,
                    url: res.url,
                    minZoom: res.min_level,
                    maxZoom: res.max_level

                }
                mapService.setMapView(settings);
            });
        }

        $scope.makePathLayer = function () {
            // currentLineLayer = mapService.makePathLayer('waypoint', 'wpLine');
            // currentLayer = mapService.makePathLayer('waypoint','waypoint');
            currentLineLayer = mapService.getLayer('waypoint', 'wpLine');
            currentLayer = mapService.getLayer('waypoint', 'waypoint');
        }

        $scope.makeObjectLayer = function () {
            currentLayer = mapService.getLayer('object', 'obstacle');
        }

        $scope.makeDeviceLayer = function () {
            currentLayer = mapService.getLayer('device', 'drone');
        }

        $scope.addCircleOnLayer = function () {
            //mapService.addCircleOnLayer(currentLayer);
            mapService.addObjectOnLayer(currentLayer, 'Circle', featureTomake);
            console.log('circile is selected');
            // var obs = mapService.createObserver();
            // obs.notify = function (status, features) {
            //     console.log("bobbobobobobobobbobobo");
            //     console.log(status);
            //     console.log(features);
            //     if (features[0] === undefined) {
            //         return;
            //     }
            //     console.log(features[0].getGeometry());
            //     console.log(features[0].getProperties());
            //     featureToSave.push(features[0]);
            // };
            // mapService.subscribeObserver('object', obs);

            //            var objjson = mapService.saveObject(features[0]);
            //            objSrv.postObject('obstacle', objjson);

        }

        $scope.addWaypointOnLayer = function () {
            mapService.addWaypointOnLayer();
        }

        $scope.addSquareOnLayer = function () {
            mapService.addSquareOnLayer(currentLayer);
        }

        $scope.addBoxOnLayer = function () {
            mapService.addBoxOnLayer(currentLayer);
        }

        $scope.addDeviceOnLayer = function () {
            mapService.addDeviceOnLayer(currentLayer);
        }

        $scope.modifyFeature = function () {
            mapService.modifyFeature(currentLayer);
        }

        $scope.addPolygonOnLayer = function () {
            //mapService.addPolygonOnLayer(currentLayer);
            mapService.addObjectOnLayer(currentLayer, 'Polygon', featureTomake);
            console.log('object is created');
            // var obs = mapService.createObserver();
            // obs.notify = function (status, features) {
            //     console.log("bobbobobobobobobbobobo");
            //     console.log(status);
            //     console.log(features);
            //     if (features[0] === undefined) {
            //         return;
            //     }
            //     console.log(features[0].getGeometry());
            //     console.log(features[0].getProperties());
            //     console.log(features[0].getGeometry().getCoordinates());
            // };
            // mapService.subscribeObserver('object', obs);
        }
        var featureTomake = function(feature) {
            console.log(feature);
            featureToSave = feature;

        }
        $scope.saveFeature = function () {
            //var objjson = mapService.writefeatures(currentLayer);
           var objjson = mapService.saveObject(featureToSave);
           objSrv.postObject('obstacle', objjson);

        }

        $scope.deleteFeature = function () {
            console.log('pushed delete button');
            mapService.deleteObjectFromLayer(currentLayer, featuresTodelete);

            for (var arrIndex in featuresTodelete) {
                objSrv.deleteObject(featuresTodelete[arrIndex]);
            }

        }

        $scope.select = function () {
            mapService.select();
        }
        $scope.dragSelect = function () {
            var layers = [];
            layers.push(currentLayer);
            mapService.dragSelect(layers,givemeobjects);

            // var obs = mapService.createObserver();
            // obs.notify = function (status, features) {
            //     featuresTodelete = features;
            //     console.log("bo MMMMMMMMMMMMMMM");
            //     console.log(status);
            //     console.log(features);
            //     if (features.length === 0) {
            //         return;
            //     }
            //     console.log(features[0].getGeometry());
            //     console.log(features[0].getProperties());
            //     console.log(features[0].getGeometry().getCoordinates());
            // };
            // mapService.subscribeObserver('object', obs);

        }

        givemeobjects = function (objects){
        //deleteFeature variable    
            featuresTodelete = objects;
        }


        $scope.moveMapCenter = function () {
            var droneId = mapService.getCurrentDrone().id;
            mapService.moveMapCenter(droneId); //향후 Center로 보낼 Drone id를 식별하여 인자로 전달 해야함
        }
        $scope.getObject = function () {
            //   objSrv.initialize();
            var geofence = objSrv.getObjectList('geofence');
            var airzone = objSrv.getObjectList('airzone');
            var obstacle = objSrv.getObjectList('obstacle');
            var geofenceLayer = mapService.getLayer('object', 'geofence');
            var airzoneLayer = mapService.getLayer('object', 'airzone');
            var obstacleLayer = mapService.getLayer('object', 'obstacle');

            for (var arrIndex in geofence) {
                mapService.addObjectFromData(geofence[arrIndex], geofenceLayer);
            }

            for (var arrIndex in airzone) {
                mapService.addObjectFromData(airzone[arrIndex], airzoneLayer);
            }

            for (var arrIndex in obstacle) {
                mapService.addObjectFromData(obstacle[arrIndex], obstacleLayer);
            }
        }
        $scope.getCoords = function () {
            var coords = mapService.getCoords(currentLayer);

            OptimizeService.solveSurveyGrid(coords);


            var jsonPath = OptimizeService.saveWpPathForSurvey();

            mapService.loadSurveyWpPath(jsonPath);
        }
        $scope.setMap = function () {
            console.log('setMap is called');
            var mapInfo = mapService.getMapInfo();
            var mapData = {
                    center: mapInfo.center,
                    level: mapInfo.zoomLevel,
                    map_id: 1,
                    user_id: 1,
                    minZoom: mapInfo.minZoom,
                    maxZoom: mapInfo.maxZoom
                } //this is should be by UI
            var objjson = mapService.setMap(mapData);
            objSrv.postObject('map', objjson);
            console.log(mapData);
        }

        $scope.setMiniMapInitialize = function () {

            mapService.removeAllMapControl();
        }

        $scope.returnHome = function(){
             controls = {
                    zoomSlider: true,
                    scaleLine: true,
                    zoom: true,
                    miniMap: true
                }

            mapService.setMapControl(controls);


        }

}]);
