var MapService = (function () {
    var modeList = ["View", "Edit", "Select"];
    var droneData = [];
    var currentDrone;
    var droneIconProp = {
        url: './images/drone.png',
        scale: 1,
        anchor: [0.5, 0.5]
    };

    function constructor() {
        this.mode = modeList[0];
        this.modeNum = 0;
        this.myMapMan;
        this.layerSvc;
        this.wpPathMan;
        this.wpLineMan;
        this.obListMan;
    }

    constructor.prototype = {
        /**
         * @method mapService.initialize
         * @param {Object} settings 
         * @description Map이 Loading될때 Map의 Control(지도 Zoom, 지도 이동 등), Interaction, 초기위치, 초기 Zoom Level을 설정한다.
         * @example
         * 
         *  mapService.initialize(settings);
         * 
         */
        initialize: function (settings) {
            this.myMapMan = MapManagerMaker.getInstance();
            this.myMapMan.initialize(settings);
            this.layerSvc = new LayerService();
            this.coordConverter = CoordConvertManager.getInstance();
            this.layerSvc.initialize();
            this.wpPathMan = new WaypointPathManager();
            this.wpLineMan = new WaypointLineManager();
            this.objManipulateMan = new ObjectManipulateManager();
            this.obListMan = observableListManager.getInstance();
            this.wpObList = this.obListMan.getObservableList('waypoint');
            this.objectObList = this.obListMan.getObservableList('object');
            this.selectedWps = [];
            this.GPSMode = this.setGpsMode('latlong');
            this.wpEmiter = this.wpPathMan.getEventInstance();
            this.wpEmiter.addListener('selected', this.selectedWpListener);
            this.wpEmiter.addListener('deSelected', this.deSelectedWpListener);
        },
        setMapView: function (settings) {
            this.myMapMan.setMapView(settings);
        },
        /**
         * @method mapService.setMapMode
         * @param {number} index
         * @description Map의 Mode를 설정 한다. Mode는 monitoring 또는 Edit가 있다.
         * @example
         * 
         *  mapService.getMapMode();
         * 
         */
        setMapMode: function (index) {
            if (typeof index === 'number') {
                if (0 <= index && index < 3) {
                    this.mode = modeList[index];
                    this.modeNum = index;
                    this.mapMotion(this.modeNum);
                }
            }

            console.log("setMapMode: mode:" + this.mode);
        },
        /**
         * @method mapService.getMapMode
         * @returns {String} modeList - monitoring 또는 Edit를 반환한다.
         * @description Map의 Mode를 반환 한다. Mode는 monitoring 또는 Edit가 있다.
         * @example
         * 
         *  mapService.getMapMode();
         * 
         */
        getMapMode: function () {
            console.log("getMapMode: mode:" + this.mode);
            return this.modeNum;
        },
        mapMotion: function (mode) {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            var layers = [wpLayer, lineLayer];
            if (typeof mode === 'number') {
                if (mode === 0) {
                    this.monitorMapMotion(wpLayer);
                } else if (mode === 1) {
                    this.editMapMotion(wpLayer, lineLayer);
                } else if (mode === 2) {
                    this.selectMapMotion(wpLayer);
                }
            }
            return layers;
        },
        monitorMapMotion: function (wpLayer) {
            this.myMapMan.removeInteractionAll();
            this.myMapMan.selectInteraction();
        },
        /**
         * @method mapService.editMapMotion
         * @retirns {Object} editLayer - waypoint path를 수정할 Layer를 반환한다. 
         * @description 해당 Layer에 Waypoint를 mouse로 만들기 위해 호출한다.
         * @example
         * 
         *  mapService.editMapMotion();
         * 
         */
        editMapMotion: function (wpLayer, lineLayer) {
            this.addWaypointOnLayer(wpLayer, lineLayer);
        },
        selectMapMotion: function (wpLayer) {
            this.myMapMan.removeInteractionAll();
            //this.selectWpSetting();
            this.dragWpSelect(wpLayer);
        },
        getCoordConverter: function () {
            return this.coordConverter;
        },
        getGpsMode: function () {
            return this.GpsMode;
        },
        setGpsMode: function (mode) {
            if (mode === 'latlong') {
                this.GpsMode = 'latlong';
            } else if (mode === 'utm') {
                this.GpsMode = 'utm';
            } else if (mode === 'mgrs') {
                this.GpsMode = 'mgrs'
            } else {
                console.log('not supported GpsMode');
            }
        },
        /**
         * @method mapService.addWaypointOnLayer
         * @param {Object} layer - Point가 그려질 Layer
         * @param {Object} lineLayer - Line 그려질 Layer
         * @description Map위에 Mouse를 이용하여 Waypoint Path를 그릴때 사용,
         * 이 함수를 호출하기 전에 Point, Line이 그려질 Layer가 사전에 생성되어 있어야 한다. 
         * Point가 2개 이상이 되면 Point간 Line을 그린다. 이때 Point와 Line은 서로다른 Layer에 그려진다.
         * @example
         * 
         *  var editLayer1 = makePathLayer('waypoint', 'wpLine');
         *  var editLayer = makePathLayer('waypoint', 'waypoint');
         *  addWaypointOnLayer(editLayer,editLayer1);
         * 
         */
        addWaypointOnLayer: function () {
            var that = this;
            this.myMapMan.removeInteractionAll();
            var layer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            var modify = this.myMapMan.modifyInteraction(layer);
             this.myMapMan.addInteraction('Point', layer);
            var orderMan = OrderManager.getInstance();
            var features = layer.getSource().getFeatures();
            if (features !== null && features !== undefined) {
                orderMan.setWpOrder(features.length);
            }
            var draw = this.myMapMan.getDraw();
            draw.on('drawend', function (evt) {
                if(that.selectedWps.length > 0){
                    that.wpEmiter.emit('defaultWp', -1);
                }
                evt.feature.type = 'point';
                var order = orderMan.nextWpOrder();
                that.wpPathMan.setWpOrderStyle(evt.feature, order);
                that.wpPathMan.setDefaultWpInfo(evt.feature);
                that.wpLineMan.addWaypointLine(evt.feature, layer, lineLayer);
                evt.feature.on('change', function (event) {
                    if (evt.feature.type === 'point') {
                        that.wpPathMan.moveWpCoord(evt.feature);
                        that.wpLineMan.changeWpLineCoord(evt.feature, lineLayer);
                    }
                });
            });
            modify.on('modifystart', function (evt) {
                if (evt.target.dragSegments_[0] !== undefined) {
                    var dragSegments = evt.target.dragSegments_[0][0];
                    var feature = dragSegments.feature;
                    if(that.selectedWps.length > 1){
                        that.wpEmiter.emit('defaultWp', -1);
                    }
                    var selectedStyle = that.wpPathMan.getSelectedWpStyle(feature, true);
                    feature.setStyle(selectedStyle);
                }
            });
            modify.on('modifyend', function (evt) {
                if (evt.target.dragSegments_[0] !== undefined) {
                    var dragSegments = evt.target.dragSegments_[0][0];
                    var feature = dragSegments.feature;
                    var defaultStyle = that.wpPathMan.getDefaultWpStyle(feature, true);
                    feature.setStyle(defaultStyle);
                }
            });
        },
        selectedWpListener: function (features) {
            var wpPathMan = features[0].wpPathMan;
            var feature = features[1];
            var selectedStyle = wpPathMan.getSelectedWpStyle(feature, false);
            feature.setStyle(selectedStyle);
            features[0].selectedWps.push(feature);
        },
        deSelectedWpListener: function (features) {
            var wpPathMan = features[0].wpPathMan;
            var feature = features[1];
            //            console.log('deSelectedWpListener call!!!!!!!!');
            var defaultStyle = wpPathMan.getDefaultWpStyle(feature, false);
            feature.setStyle(defaultStyle);
        },
        addSurveyGridOnLayer: function() {
            var svLayer = this.layerSvc.getLayer('waypoint', 'survey_wp');
            var svLineLayer = this.layerSvc.getLayer('waypoint', 'survey_wpLine');
            //this.myMapMan.addInteraction('Box', layer);
            //this.myMapMan.addInteraction('Polygon', layer);
        },
        loadWpPath: function (jsonPath) {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            console.log('jsonPath');
            console.log(jsonPath);
            return this.wpPathMan.loadWpPath(jsonPath, wpLayer, lineLayer);
        },
        loadSurveyWpPath: function (jsonPath) {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            return this.wpPathMan.loadSurveyWpPath(jsonPath, wpLayer, lineLayer);
        },
        saveWpPath: function (pathName) {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            return this.wpPathMan.saveWpPath(pathName, wpLayer);
        },
        wpClearLayer: function () {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            //            this.wpPathMan.observeWpList('removeAll');
            this.wpObList.removeAllItem();
            return this.layerSvc.clearLayer([wpLayer, lineLayer]);
        },
        getLayer: function (gtype, ltype) {
            return this.layerSvc.getLayer(gtype, ltype);
        },
        // JHPark: 레이어 클리어 
        clearLayer: function (layer) {
            return this.layerSvc.clearLayer(layer);
        },
        changeWpOrder: function (orders, action) {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            var features = wpLayer.getSource().getFeatures();
            return this.wpPathMan.changeWpOrder(features, orders, action, lineLayer);
        },
        addWaypoint: function () {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            return this.wpPathMan.newWaypoint(wpLayer, lineLayer);
        },
        deleteWaypoints: function (orders) {
            var wpLayer = this.layerSvc.getLayer('waypoint', 'waypoint');
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            this.selectedWps = [];
            orders.sort(function (a, b) {
                return b - a
            });
            console.log('deleteWaypoints:', orders);
            var features = [];
            var feature = wpLayer.getSource().getFeatures();
            if (orders instanceof Array) {
                orders.forEach(function (item, index) {
                    for (var i = 0; i < feature.length; i++) {
                        if (feature[i].getProperties().order === item) {
                            features.push(feature[i]);
                            break;
                        }
                    }
                });
            }
            return this.wpPathMan.deleteWaypoints(features, wpLayer, lineLayer);
        },
        changeWpInfo: function (feature, wpInfo) {
            var lineLayer = this.layerSvc.getLayer('waypoint', 'wpLine');
            if (wpInfo.latitude !== null && wpInfo.longitude !== null && wpInfo.latitude !== undefined && wpInfo.longitude !== undefined) {
                this.wpPathMan.changeWpCoord(feature, [wpInfo.longitude, wpInfo.latitude], lineLayer);
            }
            this.wpPathMan.changeWpPopInfo(feature, wpInfo);
        },
        template: function () {
            this.myMapMan.removeInteractionAll();
            this.myMapMan.rotateInteraction();
        },
        createObserver: function () {
            var observer = new Observer();
            return observer;
        },
        subscribeObserver: function (keyword, observer) {
            var obList = this.obListMan.getObservableList(keyword);
            obList.subscribeObserver(observer);
        },
        subscribeObserverOnce: function (keyword, observer) {
            var obList = this.obListMan.getObservableList(keyword);
            obList.subscribeObserverOnce(observer);
        },
        unsubscribeObserver: function (keyword, observer) {
            var obList = this.obListMan.getObservableList(keyword);
            obList.unsubscribeObserver(observer);
        },
        getObservableList: function (keyword) {
            var obList = this.obListMan.getObservableList(keyword);
            return obList;
        },
        /**
         * @method mapService.addCircleOnLayer
         * @param {Object} layer - Circle이 그려질 Layer
         * @description Map위에 Mouse를 이용하여 Circle을 그린다. GeoFence, 공역등을 그릴때 사용한다.
         * 해당 함수를 호출하기 전에 Circle을 그릴 Layer를 먼저 생성하야 한다.
         * @example
         *
         * var layer mapService.makeObjectLayer('object', 'AirZone');
         *  mapService.addCircleOnLayer(layer);
         * 
         */
        addCircleOnLayer: function (layer) {
            this.myMapMan.removeInteractionForDragBox();
            this.myMapMan.modifyInteraction(layer);
            this.myMapMan.addInteraction('Circle', layer);
        },
        /**
         * @method mapService.addSquareOnLayer
         * @param {Object} layer - Square가 그려질 Layer
         * @description Map위에 Mouse를 이용하여 Square를 그린다. 공역 또는 장애물을 그릴때 사용한다.
         * 해당 함수를 호출하기 전에 Square를 그릴 Layer를 먼저 생성하야 한다.
         * @example
         * 
         * var layer mapService.makeObjectLayer('object', 'AirZone');
         *  mapService.addSquareOnLayer(layer);
         * 
         */
        addSquareOnLayer: function (layer) {
            this.myMapMan.removeInteractionForDragBox();
            this.myMapMan.modifyInteraction(layer);
            this.myMapMan.addInteraction('Square', layer);
        },
        /**
         * @method mapService.addBoxOnLayer
         * @param {Object} layer - box가 그려질 Layer
         * @description Map위에 Mouse를 이용하여 box를 그린다. 공역 또는 장애물을 그릴때 사용한다.
         * 해당 함수를 호출하기 전에 Square를 그릴 Layer를 먼저 생성하야 한다.
         * @example
         * 
         * var layer mapService.makeObjectLayer('object', 'AirZone');
         *  mapService.addBoxOnLayer(layer);
         * 
         */
        addBoxOnLayer: function (layer) {
            this.myMapMan.removeInteractionForDragBox();
            this.myMapMan.modifyInteraction(layer);
            this.myMapMan.addInteraction('Box', layer);
        },
        /**
         * @method mapService.addDeviceOnLayer
         * @param {Object} layer - Device가 그려질 Layer
         * @description Map위에 Mouse를 이용하여 Device를 그린다. Device는 드론, 카메라, 센서중 하나가 될 수 있다.
         * 해당 함수를 호출하기 전에 Device를 그릴 Layer를 먼저 생성하야 한다.
         * @example
         * 
         * var layer mapService.makeDeviceLayer('device', 'drone');
         *  mapService.addDeviceOnLayer(layer);
         * 
         */
        addDeviceOnLayer: function (layer) {
            this.myMapMan.removeInteractionForDragBox();
            this.myMapMan.modifyInteraction(layer);
            this.myMapMan.addInteraction('Point', layer);
        },
        /**
         * @method mapService.addPolygonOnLayer
         * @param {Object} layer - Polygon이 그려질 Layer
         * @description Map위에 Mouse를 이용하여 Polygon을 그린다. 
         * 해당 함수를 호출하기 전에 Polygon을 그릴 Layer를 먼저 생성하야 한다.
         * @example
         * 
         * var layer mapService.makeObjectLayer('object', 'AirZone');
         *  mapService.addPolygonOnLayer(layer);
         * 
         */
        addPolygonOnLayer: function (layer) {
            this.myMapMan.removeInteractionForDragBox();
            this.myMapMan.modifyInteraction(layer);
            this.myMapMan.addInteraction('Polygon', layer);
        },

        addObjectOnLayer: function (layer, type, callback) {
            this.myMapMan.removeInteractionAll();
            //this.myMapMan.modifyInteraction(layer);
            this.myMapMan.addInteraction(type, layer);
            var myDraw = this.myMapMan.getDraw();
            var self = this;
            //var featureInfo;

            var defaultStyle = this.myMapMan.getDefaultStyle();

            myDraw.on('drawend', function (event) {

                console.log(event.feature);
                var feature = event.feature;
                feature.setStyle(defaultStyle);
                //callback(event.feature.setStyle(defaultStyle));
                callback(feature);
                self.objectObList.addItem(event.feature); //this will be deleted
            });

        },

        deleteObjectFromLayer: function (layer, featuresToDel) {
            var features = layer.getSource().getFeatures();
            for (var j = 0; j < featuresToDel.length; j++) {
                if (features !== undefined && features.length > 0) {
                    for (var i = 0; i < features.length; i++) {
                        if (features[i] === featuresToDel[j]) {
                            layer.getSource().removeFeature(features[i]);
                            break;
                        }
                    }

                }

            }

        },
        /**
         * @method mapService.modifyFeature
         * @param {Object} layer - Map위에 그려진 그림 객체를 수정할 Layer
         * @description Map위의 그려진 객체를 Mouse로 객체의 각 꼭지점을 수정할때 사용한다. 
         * @example
         * 
         *  mapService.modifyFeature(layer);
         * 
         */
        modifyFeature: function (layer) {
//            this.myMapMan.removeInteraction(this.myMapMan.getDraw());
////            this.myMapMan.modifyInteraction(layer);
//            this.myMapMan.objectModifyInteraction();
        },
        /**
         * @method mapService.select
         * @description Map위에서 그림그리는 것을 취하고 Map위의 객체를 선택시 호출한다. 
         * @example
         * 
         *  mapService.select();
         * 
         */
        select: function () {
            this.myMapMan.removeInteractionAll();
            this.myMapMan.selectInteraction();

            var selection = this.myMapMan.getSelection();
            var self = this;

            selection.on('select', function (event) {
                console.log('selected event triggered');
                var feature = event.selected;
                if (feature[0]) {
                    if (self.getDroneData(feature[0].getId())) {
                        console.log('drone is exist');
                        self.setCurrentDrone(feature[0].getId());
                        droneIconProp.url = './images/drone_current.png';
                        var style = self.myMapMan.getIconStyle(droneIconProp);
                        var droneLayer = self.layerSvc.getLayer('device', 'drone');
                        self.myMapMan.editFeature(self.getDroneData(feature[0].getId()), style, droneLayer);
                    }

                    for (var arrIndex in droneData) {
                        if (self.getCurrentDrone().id !== droneData[arrIndex].id) {
                            droneIconProp.url = './images/drone.png';
                            var style = self.myMapMan.getIconStyle(droneIconProp);
                            var droneLayer = self.layerSvc.getLayer('device', 'drone');
                            self.myMapMan.editFeature(self.getDroneData(droneData[arrIndex].id), style, droneLayer);

                        }
                    }
                }
            });
        },
        selectWpSetting: function () {
            var oldFeatures = [];
            var newFeatures = [];
            var self = this;

            var filter = function (feature) {
                if (feature.getProperties().objecttype === 'waypoint') {
                    return true;
                } else {
                    return false;
                }
            };
            var selection = this.myMapMan.selectInteractionByfilter(filter);
            selection.on('select', function (event) {
                console.log('selected Wp event triggered');
                var feature = event.selected;
                if (feature.length === 1) {
                    var selectedStyle = self.wpPathMan.getSelectedWpStyle(feature[0], true);
                    feature[0].setStyle(selectedStyle);
                    self.selectedWps.push(feature[0]);
                } else if (feature.length > 1) {
                    feature.forEach(function (item, index) {
                        var selectedStyle = self.wpPathMan.getSelectedWpStyle(item, true);
                        item.setStyle(selectedStyle);
                        self.selectedWps.push(item);
                    });
                }
            });
        },
        /**
         * @method mapService.dragSelect
         * @description 해당 Layer내에서 Box내의 Feature들을 반환한다.
         * @param {Object} layer - Map위에 그려진 그림 객체를 수정할 Layer
         * @example
         * 
         *  mapService.dragSelect(layer);
         * 
         */
        dragSelect: function (layers, callback) { //yame callback todo changing emitter.

            if (layers === undefined) {
                return;
            }
            var dragBox = this.myMapMan.dragSelection();
            var selectedFeatures = [];
            var selectedStyle = this.myMapMan.getSelectedStyle();
            var defaultStyle = this.myMapMan.getDefaultStyle();
            var self = this;

            dragBox.on('boxstart', function () {
                self.myMapMan.removeInteractionForDragBox();
                for (var i = 0; i < selectedFeatures.length; i++) {
                    selectedFeatures[i].setStyle(defaultStyle); //the style should be it's own style
                }

                while (selectedFeatures.length > 0) {

                    selectedFeatures.pop();

                }
            });

            dragBox.on('boxend', function () {
                if (layers === null) {
                    return;
                }
                var extent = dragBox.getGeometry().getExtent();
                for (var arrayIndex in layers){
                    var source = layers[arrayIndex].getSource();
                    source.forEachFeatureIntersectingExtent(extent, function (feature) {
                        feature.setStyle(selectedStyle);
                        selectedFeatures.push(feature);
                        // self.objectObList.addItem(feature);
                        console.log("objectListadded");

                    });    
                }
                console.log(selectedFeatures);

                if(selectedFeatures.length === 1){                
                   var obModify = self.myMapMan.objectModifyInteraction(new ol.Collection(selectedFeatures));
                    obModify.on('modifyend', function(evt){
                        if (evt.target.dragSegments_[0] !== undefined) {
                            var dragSegments = evt.target.dragSegments_[0][0];
                            var feature = dragSegments.feature;
                            console.log('modifyend:::DragBox(object)');
                            callback([feature]);
                        }
                    });
                }
                callback(selectedFeatures);
                
            });


            
            return selectedFeatures;
        },
        dragWpSelect: function (layer) {

            if (layer === undefined) {
                return;
            }
            var dragBox = this.myMapMan.dragSelection();
            var self = this;

            dragBox.on('boxstart', function () {
                for (var i = 0; i < self.selectedWps.length; i++) {
                    var defaultStyle = self.wpPathMan.getDefaultWpStyle(self.selectedWps[i], true);
                    self.selectedWps[i].setStyle(defaultStyle);
                }
                while (self.selectedWps.length > 0) {
                    self.selectedWps.pop();
                }
            });

            dragBox.on('boxend', function () {
                // console.log("boxEnd!!!!!!!!!!!!!!!!!!!!!!!!!!");
                var extent = dragBox.getGeometry().getExtent();
                var source = layer.getSource();
                source.forEachFeatureIntersectingExtent(extent, function (feature) {
                    var selectedStyle = self.wpPathMan.getSelectedWpStyle(feature, true);
                    feature.setStyle(selectedStyle);
                    self.selectedWps.push(feature);
                });
            });
        },
        getWpEvtInstance: function () {
            return this.wpEmiter;
        },
        /**
         * @method mapService.writefeatures
         * @param {Object} layer - 저장할 객체가 그려진 Layer
         * @description Map위에서 해당 Layer의 객체들을 Json 형태로 저장시 호출 
         * @example
         * 
         *  mapService.writefeatures(layer);
         * 
         */
        saveObject: function (feature) {
            console.log(feature);
            //var tempLayer = this.layerSvc.getLayer('object', 'temp');
            var legacyLayer = this.layerSvc.getLayer('object', feature.get('type'));
            //legacyLayer.getSource().addFeature(feature);
            //this.myMapMan.removeLayer(tempLayer);
            //return this.objManipulateMan.writeObject(legacyLayer);
            return this.objManipulateMan.writeObject(feature);
        },

        saveDevice: function (feature) {
            console.log(feature);
            //var tempLayer = this.layerSvc.getLayer('device', 'temp');
            var legacyLayer = this.layerSvc.getLayer('device', feature.get('type'));
            //legacyLayer.getSource().addFeature(feature);
            
            return this.objManipulateMan.writeDevice(feature);

        },

        updateObject: function (feature) {
            console.log('in updateObject', feature);
            //var tempLayer = this.layerSvc.getLayer('object', 'temp');
            var legacyLayer = this.layerSvc.getLayer('object', feature.get('type'));
            var style = this.myMapMan.getDefaultStyle(); //style should be replaced its own style
            var featureInfo = {};


            if (feature.getGeometry().getType().toLowerCase() !== "circle"){

                featureInfo = {
                    id: feature.getId(),
                    type: feature.getProperties().type,
                    name: feature.getProperties().name,
                    lowerHeight: feature.getProperties().lowerHeight,
                    upperHeight: feature.getProperties().upperHeight,
                    map_id: feature.getProperties().map_id,
                    coordinateInfo: {
                        type: feature.getGeometry().getType().toLowerCase(),
                        coordinate: feature.getGeometry().getCoordinates()
                    }
                }

            } else{

                featureInfo = {
                    id: feature.getId(),
                    type: feature.getProperties().type,
                    name: feature.getProperties().name,
                    lowerHeight: feature.getProperties().lowerHeight,
                    upperHeight: feature.getProperties().upperHeight,
                    map_id: feature.getProperties().map_id,
                    radius: feature.getProperties().radius,
                    groundRadius: feature.getProperties().groundRadius,
                    coordinateInfo: {
                        type: feature.getGeometry().getType().toLowerCase(),
                        coordinate: feature.getGeometry().getCenter(),
                        radius: feature.getGeometry().getRadius()
                    }
                }

            }


            this.myMapMan.editFeature(featureInfo, style, legacyLayer);
            //this.myMapMan.removeLayer(tempLayer);
            //return this.objManipulateMan.writeObject(legacyLayer);
            return this.objManipulateMan.writeObject(feature); 

        },

        updateDevice: function(feature) {
            console.log('update Device');

            var legacyLayer = this.layerSvc.getLayer('device', feature.get('type'));
            var style = this.myMapMan.getDefaultStyle(); //style should be replaced its own style

            var featureInfo = {
                id: feature.getId(),
                type: feature.getProperties().type,
                name: feature.getProperties().name,
                angle: feature.getProperties().angle,
                ip: feature.getProperties().ip,
                coordinateInfo: {
                    type: feature.getGeometry().getType().toLowerCase(),
                    coordinate: feature.getGeometry().getCoordinates()
                }
            }

            this.myMapMan.editFeature(featureInfo, style, legacyLayer);


        },
        /**
         * @method mapService.addDroneFromData
         * @param {Object} featureInfo - Done Data
         * @param {Object} layer - Drone이 그려질 Layer
         * @description Drone Data를 서버로 부터 수신하여 Map위에 그린다.
         * 해당 함수를 호출하려면 Device Layer가 먼저 생성되어야 한다.
         * @example
         * 
         *  var drn = device_service.read('drone');
         *    putTree(drn);
         *    var layer = mapService.makeDeviceLayer('device', 'drone');
         *    for (var arrIndex in drn) {
         *       mapService.addDroneFromData(drn[arrIndex], layer);
         *  }
         * 
         */
        addDroneFromData: function (drone, layer) {

            var featureInfo = this.objManipulateMan.converterDroneToFeatureInfo(drone);            
            droneData.push(drone);
            currentDrone = droneData[0];
            if (currentDrone.id === drone.id) {
                droneIconProp.url = './images/drone_current.png';

            } else {
                droneIconProp.url = './images/drone.png';
            }
            var style = this.myMapMan.getIconStyle(droneIconProp);
            layer.setZIndex(10);
            this.myMapMan.addFeature(featureInfo, style, layer);

            // var tempPosition = featureInfo.coordinateInfo.coordinate;
            // var transpos = this.myMapMan.transformCoord4326To3857(tempPosition);
            // featureInfo.coordinateInfo.coordinate = transpos;


            // droneData.push(featureInfo);
            // currentDrone = droneData[0];
            // if (currentDrone.id === featureInfo.id) {
            //     droneIconProp.url = './images/drone_current.png';

            // } else {
            //     droneIconProp.url = './images/drone.png';
            // }
            // var style = this.myMapMan.getIconStyle(droneIconProp);
            // layer.setZIndex(10);
            // this.myMapMan.addFeature(featureInfo, style, layer);
            console.log(droneData);
        },
        /**
         * @method mapService.addObjectFromData
         * @param {Object} featureInfo - Object Data
         * @param {Object} layer - Object가 그려질 Layer(geofence or airzone or obstacle, noflyzone)
         * @description Object Data를 서버로 부터 수신하여 Map위에 그린다.
         * 해당 함수를 호출하려면 Object Layer가 먼저 생성되어야 한다.
         * @example
         * 
         *  var geofence = LetDroneObjectService.getGeoFenceList();
         *   geofenceLayer = mapService.getLayer('object', 'geofence');
         *  for (var arrIndex in geofence) {
         *        mapService.addObjectFromData(geofence[arrIndex], currentLayer);
         *    }
         * 
         */
        addObjectFromData: function (obj, layer) {
            if (obj === undefined) {
                return 0;
            }

            //delete feature if feature id is undefined

            var src = layer.getSource();
            var features = src.getFeatures();

            for (var arrIndex in features) {
                if(features[arrIndex].getId() === undefined){
                    src.removeFeature(features[arrIndex]); 
                }
            }

            var featureInfo = this.objManipulateMan.convertObjectToFeatureInfo(obj);
            
            //choose style w.r.t featureInfo tye
            var style = this.myMapMan.getDefaultStyle(); //just temporary

            this.myMapMan.addFeature(featureInfo, style, layer);
        },

        addDeviceFromData: function (obj, layer) {
            if (obj === undefined) {
                return 0;
            }

            var src = layer.getSource();
            var features = src.getFeatures();

            for (var arrIndex in features) {
                if(features[arrIndex].getId() === undefined){
                    src.removeFeature(features[arrIndex]); 
                }
            }

            var featureInfo = this.objManipulateMan.convertDeviceToFeatureInfo(obj);
    
            //choose style w.r.t featureInfo tye
            var style = this.myMapMan.getDefaultStyle(); //just temporary

            this.myMapMan.addFeature(featureInfo, style, layer);
        },
        /**
         * @method mapService.moveDrone
         * @param {obj} droneProperty
         *              id   - Drone의 id
         *              long - Done의 경도
         *              lat - Drone의 위도
         *              hdg - Drone의 헤딩
         * @description Drone의 움직임을 Map위에 그린다.
         * @example
         * 
         *  var msg = JSON.parse(data);
         *  droneProperty.long = msg.lon*0.0000001;
         *  droneProperty.lat = msg.lat*0.0000001;
         *  droneProperty.hdg = msg.hdg*0.01;
         *   mapService.moveDrone(droneProperty);
         *  }
         * 
         */
        moveDrone: function (droneProperty) {

            var drone = this.getDroneData(droneProperty.id);

            if (drone === undefined) {
                return;
            }

            drone.coordinateInfo.coordinate = [droneProperty.long, droneProperty.lat];

            var featureInfo = this.objManipulateMan.converterDroneToFeatureInfo(drone);

            //drone.coordinateInfo.coordinate = featureInfo.coordinateInfo.coordinate;

            var droneLayer = this.layerSvc.getLayer('device', 'drone');
            droneIconProp.rotationInDegree = droneProperty.hdg;

            if (Number(currentDrone.id) === Number(droneProperty.id)) {
                droneIconProp.url = './images/drone_current.png';
            } else {
                droneIconProp.url = './images/drone.png';
            }


            var style = this.myMapMan.getIconStyle(droneIconProp);

            this.myMapMan.editFeature(featureInfo, style, droneLayer);

            

            // var drone = this.getDroneData(droneProperty.id);


            // if (drone === undefined) {
            //     return;
            // }
            // var tempPosition = [droneProperty.long, droneProperty.lat];
            // var transpos = this.myMapMan.transformCoord4326To3857(tempPosition);
            // drone.coordinateInfo.coordinate = transpos;

            // var droneLayer = this.layerSvc.getLayer('device', 'drone');
            // droneIconProp.rotationInDegree = droneProperty.hdg;



            // if (Number(currentDrone.id) === Number(droneProperty.id)) {
            //     droneIconProp.url = './images/drone_current.png';
            // } else {
            //     droneIconProp.url = './images/drone.png';
            // }


            // var style = this.myMapMan.getIconStyle(droneIconProp);

            // this.myMapMan.editFeature(drone, style, droneLayer);
        },
        /**
         * @method mapService.makeDronePath
         * @param {Object} droneProperty
         *         long - Done의 경도
         *         lat - Drone의 위도
         * @description Drone이 이동한 궤적을 Map위에 그린다.
         * @example
         * 
         *  var msg = JSON.parse(data);
         *
         *   mapService.makeDronePath(msg.lon*0.0000001, msg.lat*0.0000001);
         *  }
         * 
         */

        makeDronePath: function (droneProperty) {
            var dronePathLayer = this.layerSvc.getLayer('device', 'history');
            var tempPosition = [droneProperty.long, droneProperty.lat];

            var featureInfo = {
                coordinateInfo: {
                    type: 'point',
                    coordinate: this.myMapMan.transformCoord4326To3857(tempPosition)
                },
                properties: {
                    name: 'droneHistory',    
                    type: 'droneHistory'
                }

            }

            var fill = this.myMapMan.getFill('rgba(255, 255, 255, 0.2)');
            var stroke = this.myMapMan.getStroke('#00ff00', 2);
            var image = this.myMapMan.getImage(1, '#00ff00');
            var pathHistoryStyle = this.myMapMan.makeStyle(fill, stroke, image);

            this.myMapMan.addFeature(featureInfo, pathHistoryStyle, dronePathLayer);
            dronePathLayer.setZIndex(9);
            var features = dronePathLayer.getSource().getFeatures();

            if (features.length > 100) {
                //console.log('feature is more than 100');
                dronePathLayer.getSource().removeFeature(features[0]);
            }

            // var dronePathLayer = this.layerSvc.getLayer('device', 'history');
            // var tempPosition = [droneProperty.long, droneProperty.lat];

            // var featureInfo = {
            //     type: 'droneHistory',
            //     coordinateInfo: {
            //         type: 'point',
            //         coordinate: this.myMapMan.transformCoord4326To3857(tempPosition)
            //     },
            //     name: 'droneHistory',

            // }

            // var fill = this.myMapMan.getFill('rgba(255, 255, 255, 0.2)');
            // var stroke = this.myMapMan.getStroke('#00ff00', 2);
            // var image = this.myMapMan.getImage(1, '#00ff00');
            // var pathHistoryStyle = this.myMapMan.makeStyle(fill, stroke, image);
            
            // this.myMapMan.addFeature(featureInfo, pathHistoryStyle, dronePathLayer);
            // dronePathLayer.setZIndex(9);
            // var features = dronePathLayer.getSource().getFeatures();

            // if (features.length > 100) {
            //     //console.log('feature is more than 100');
            //     dronePathLayer.getSource().removeFeature(features[0]);
            // }

            //console.log(features.length);
        },
        getDroneData: function (droneId) {

            var droneExist = false;

            for (var arrIndex in droneData) {
                if (Number(droneId) === Number(droneData[arrIndex].id)) {
                    droneExist = true;
                    return droneData[arrIndex];
                }
            }
            if (droneExist === false) {
                //                console.log("there is no such a drone");
            }
        },


        /**
         * @method mapService.setCurrentDrone
         * @param {Int} droneId
         * @description Main의 Drone목록에서 선택된 Drone을 currentDrone에 할당한다.
         * @example
         * 
         *  mapService.setCurrentDrone(dorneId);
         * 
         */

        setCurrentDrone: function (droneId) {
            if (this.getDroneData(droneId)) {
                currentDrone = this.getDroneData(droneId);
            }
        },

        /**
         * @method mapService.getCurrentDrone
         * @returns {object} drone - drone 객체
         * @description Main의 Drone목록에서 선택된 Drone을 반환한다.
         * @example
         * 
         *  mapService.getCurrentDrone();
         * 
         */

        getCurrentDrone: function () {
            return currentDrone;
        },

        /**
         * @method mapService.moveMapCenter
         * @description Drone을 Map중심으로 Map을 다시 그린다.이동한 궤적을 Map위에 그린다.
         * @example
         * 
         * mapService.moveMapCenter();
         * 
         */
        moveMapCenter: function (droneId) {

            var drone = this.getDroneData(droneId);
            if (drone === undefined) {
                return;
            }

             var tempPosition = drone.coordinateInfo.coordinate;
             var transpos = this.myMapMan.transformCoord4326To3857(tempPosition);

            //this.myMapMan.doPan(drone.coordinateInfo.coordinate);
            this.myMapMan.doPan(transpos);
        },

        moveMapCenterByWP: function (coordinate) {
            this.myMapMan.doPan(coordinate);
        },

        getCoords: function (layer) {
            var features = layer.getSource().getFeatures();
            var points;
            if (features instanceof Array) {
                var coords = features[0].getGeometry().getCoordinates();
                points = {
                    coords: coords[0]
                };
            }
            console.log(points);
            return points;
            //            var pArray=[];
            //            for (var i = 0; i < features.length; i++){
            //                var coords = features[i].getGeometry().getCoordinates();
            //                var points = {
            //                    coords: coords[0]
            //                };
            //                pArray.push(points);
            //            }
            //            console.log(pArray);
            //            return pArray;
        },

        setMap: function (mapData) {
            console.log('set Map function is called in map service');
            return this.objManipulateMan.setMap(mapData);


        },
        setLayerVisible: function (layer, onoff) {
            var features = layer.getSource().getFeatures();
            this.myMapMan.setLayerVisible(layer, onoff);
        },

        getMapInfo : function () {
            var mapMinMaxZoom = this.myMapMan.getMapMinMaxZoom();
            var mapInfo = {
                zoomLevel: this.myMapMan.getCurrentZoomLevel(),
                center: this.myMapMan.transformCoord3857To4326(this.myMapMan.getCurrentViewCenter()),
                minZoom: mapMinMaxZoom.minZoom,
                maxZoom: mapMinMaxZoom.maxZoom
            };
            return mapInfo;

        },

        removeAllMapControl: function (){
            this.myMapMan.removeAllMapControl();
        },

        setMapControl: function (controls){
            this.myMapMan.setControl(controls);

        }

    }

    return constructor;
})();

var MapManagerMaker = (function () {
    var instance;

    function createInstance() {
        var myMapManager = new MapManager();
        return myMapManager;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

var OrderManager = (function () {
    var instance;

    function constructor() {
        this.wpOrder = 0;
    }
    constructor.prototype = {
        setWpOrder: function (order) {
            this.wpOrder = order;
        },
        nextWpOrder: function () {
            this.wpOrder = this.wpOrder + 1;
            return this.wpOrder;
        },
        deleteWpOrder: function () {
            this.wpOrder = this.wpOrder - 1;
            return this.wpOrder;
        },
        getWpOrder: function () {
            return this.wpOrder;
        }
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = new constructor();
            }
            return instance;
        }
    };
})();

var LayerService = (function () {
    var GROUP = ["waypoint", "device", "object"];

    function constructor() {
        this.myMapMan = MapManagerMaker.getInstance();
    }

    constructor.prototype = {
        initialize: function () {
            // for initiating LayerGroup 
            var that = this;
            GROUP.forEach(function (item, index) {
                that.myMapMan.addLayerGroup(item);
            });
            this.makeDeviceLayer('device', 'history');
            this.makeDeviceLayer('device', 'drone');

            this.makePathLayer('waypoint', 'wpLine');
            this.makePathLayer('waypoint', 'waypoint');
        },
        getLayer: function (gtype, ltype) {
            var layerGroup = this.myMapMan.getLayerGroup(gtype);
            var layers = layerGroup.getLayers();
            for (i = 0; i < layers.getLength(); i++) {
                if (layers.getArray()[i].get('type') === ltype) {
                    return layers.getArray()[i];
                }
                //                console.log(layers.getArray()[i]);
            }

            if (gtype === 'device') {
                return this.makeDeviceLayer(gtype, ltype);
            } else if (gtype === 'waypoint') {
                return this.makePathLayer(gtype, ltype);
            } else if (gtype === 'object') {
                return this.makeObjectLayer(gtype, ltype);
            }

            return null;
        },
        makePathLayer: function (gtype, ltype) {
            this.myMapMan.removeInteractionAll();
            var layer = this.myMapMan.createLayer(gtype, ltype);
            this.myMapMan.addLayer(layer);
            return layer;
        },
        makeObjectLayer: function (gtype, ltype) {
            this.myMapMan.removeInteractionForDragBox();
            var layer = this.myMapMan.createLayer(gtype, ltype);
            console.log(layer.get('GROUP'));
            this.myMapMan.addLayer(layer);

            return layer;
        },
        makeDeviceLayer: function (gtype, ltype) {
            this.myMapMan.removeInteractionForDragBox();
            var layer = this.myMapMan.createLayer(gtype, ltype);
            this.myMapMan.addLayer(layer);

            return layer;
        },
        clearLayer: function (layers) {
            console.log("clearLayer");
            console.log(layers);
            if (layers instanceof Array) {
                layers.forEach(function (item, index) {
                    item.getSource().clear();
                    //                    console.log('cleare layers!!');
                });
            } else {
                layers.getSource().clear();
                //                console.log('cleare layers!!');
            }
            var orderMan = OrderManager.getInstance();
            orderMan.setWpOrder(0);
        }
    }
    return constructor;
})();

var CoordConvertManager = (function () {

    var instance;

    function constructor() {
        this.myMapMan = MapManagerMaker.getInstance();
        this.GpsMode;
    }

    constructor.prototype = {

        /**
         * @method mapService.latlongToUtm
         * @param {number} latitude - 위도
         * @param {number} longitude - 경도
         * @returns {object} utm - utm 좌표
         * @description 경위도 좌표를 UTM 자표로 변환한다.
         * UTM 포멧 31 N 448251 5411932(zone, hemisphere, easting, northing)
         *
         * @example
         * 
         * mapService.latlongToUtm(latitude, longitude);
         * 
         */
        latlongToUtm: function (latitude, longitude) {
            return this.myMapMan.latlongToUtm(latitude, longitude);
        },
        /**
         * @method mapService.latlongToMgrs
         * @param {number} latitude - 위도
         * @param {number} longitude - 경도
         * @returns {object} mgrs - mgrs 좌표
         * @description 경위도 좌표를 mgrs 자표로 변환한다.
         * MGRS 포멧: 31U DQ 48251 11932(zone, band, e100k, n100k, easting, northing)
         * @example
         * 
         * mapService.latlongToMgrs(latitude, longitude);
         * 
         */
        latlongToMgrs: function (latitude, longitude) {
            return this.myMapMan.latlongToMgrs(latitude, longitude);
        },
        /**
         * @method mapService.utmToLatlong
         * @param {object} utm - utm 좌표
         * @returns {object} latlong - 경위도 좌표
         * @description UTM좌표를 경위도 좌표로 변환한다.
         * @example
         * 
         * mapService.utmToLatlong(utm);
         * 
         */
        utmToLatlong: function (utm) {
            return this.myMapMan.utmToLatlong(utm);
        },
        /**
         * @method mapService.mgrsToUtm
         * @param {object} mgrs - mgrs 좌표
         * @returns {object} utm - utm 좌표
         * @description MGRS좌표를 UTM좌표로 변환한다.
         * @example
         * 
         * mapService.mgrsToUtm(mgrs);
         * 
         */
        mgrsToUtm: function (mgrs) {
            return this.myMapMan.mgrsToUtm(mgrs);
        },
        /**
         * @method mapService.mgrsToLatlong
         * @param {object} mgrs - mgrs 좌표
         * @returns {object} latlong - 경위도 좌표
         * @description MGRS좌표를 경위도 좌표로 변환한다.
         * @example
         * 
         * mapService.mgrsToLatlong(mgrs);
         * 
         */
        mgrsToLatlong: function (mgrs) {
            return this.myMapMan.mgrsToLatlong(mgrs);
        },
        /**
         * @method mapService.utmToMgrs
         * @param {object} utm - utm 좌표
         * @returns {object} mgrs - mgrs 좌표
         * @description UTM좌표를 MGRS좌표로 변환한다.
         * @example
         * 
         * mapService.utmToMgrs(utm);
         * 
         */
        utmToMgrs: function (utm) {
            return this.myMapMan.utmToMgrs(utm);
        },

        transformCoord4326To3857: function (coordinate) {
            return this.myMapMan.transformCoord4326To3857(coordinate);
        },

        transformCoord3857To4326: function (coordinate) {
            return this.myMapMan.transformCoord3857To4326(coordinate);
        },

        utmToString: function(utm){
            return this.myMapMan.utmToString(utm);
        },

        mgrsToString: function(mgrs){
            return this.myMapMan.mgrsToString(mgrs);
        },

        stringToUtm: function(str){
            return this.myMapMan.stringToUtm(str);
        },

        stringToMgrs: function(str){
            return this.myMapMan.stringToMgrs(str);
        },
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = new constructor();
            }
            return instance;
        }
    };
})();