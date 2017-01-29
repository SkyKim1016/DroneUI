var WaypointPathManager = (function () {
    function constructor() {
        this.wpLineManager = new WaypointLineManager();
        this.myMapMan = MapManagerMaker.getInstance();
        this.orderMan = OrderManager.getInstance();
        this.iconProperty = {
            url: './images/waypoint.png',
            scale: 1,
            anchor: [0.5, 1],
        }

        this.textProperty = {
            //text: order.toString(),
            color: '#000000',
            offsetY: -27,
            font: 'bold 13px Noto Sans',
        }
        this.obListMan = observableListManager.getInstance();
        this.wpObList = this.obListMan.getObservableList('waypoint');
        this.wpEmiter = new EventEmitter;
    }

    constructor.prototype = {
        setDefaultWpInfo: function (feature) {
            var coord = feature.getGeometry().getCoordinates();
            feature.setProperties({
                'id': feature.getId(),
                'order': feature.getProperties().order,
                'objecttype': 'waypoint',
                'drawtype': 'point',
                'name': 'wp' + feature.getId(),
                'latitude': coord[1],
                'longitude': coord[0],
                'altitude': 50,
                'speed': 10,
                'wait': 0,
                'action':[]
            });
            this.wpObList.addItem(feature);
        },
        changeWpInfo: function (feature, wpInfo) {
            feature.setProperties({
                'id': wpInfo.id,
                'order': wpInfo.order,
                'objecttype': 'waypoint',
                'drawtype': 'point',
                'name': 'wp' + wpInfo.order,
                'latitude': wpInfo.latitude,
                'longitude': wpInfo.longitude,
                'altitude': wpInfo.altitude,
                'speed': wpInfo.speed,
                'wait': wpInfo.wait,
                'action': wpInfo.action,
            });
            this.wpObList.addItem(feature);
        },
        changeWpPopInfo: function (feature, wpInfo) {
            feature.setProperties({
//                'id': wpInfo.id,
//                'order': wpInfo.order,
                'objecttype': 'waypoint',
                'drawtype': 'point',
//                'name': 'wp' + wpInfo.order,
//                'latitude': wpInfo.latitude,
//                'longitude': wpInfo.longitude,
                'altitude': wpInfo.altitude,
                'speed': wpInfo.speed,
                'wait': wpInfo.wait,
                'action': wpInfo.action,
            });
            this.wpObList.addItem(feature);
        },
        changeWpCoord: function (feature, coord, lineLayer) {
            feature.getGeometry().setCoordinates(coord);
            this.moveWpCoord(feature);
            this.wpLineManager.changeWpLineCoord(feature, lineLayer);
        },
        moveWpCoord : function(feature) {
            var coord = feature.getGeometry().getCoordinates();
            feature.setProperties({
                'latitude': coord[1],
                'longitude': coord[0],
            });
            this.wpObList.addItem(feature);
        },
        setWpOrderStyle: function(feature, order){
            feature.setProperties({'order':order});
            this.wpObList.addItem(feature);
            this.textProperty.text = String(feature.getProperties().order);
            var wpStyle = this.getWaypointStyle(this.iconProperty, this.textProperty);
            feature.setStyle(wpStyle);
        },
        /**
         * @method WaypointPathManager.changeWpOrder
         * @param {object} features - waypoint 객체
         * @param {Array} orders - waypoint 순서 목록
         * @param {Object} action - waypoint action 객체(드론이 해당 Waypoint에서 수행해야 할 임무)
         * @description Waypoint path에서 Waypoint의 순서를 변경한다. 
         * @example
         * 
         *  
         * 
         */
        changeWpOrder: function (features, orders, action, lineLayer) {
            if (orders instanceof Array) {
                var length = orders.length;
                orders.sort(function (a, b) {return a-b});
                if (action === 'up') {
                    if ((orders[0] - 1) <= 0) {
                        return;
                    }
                    for (var i = 0; i < orders.length; i++) {
                        this.innerChangeOrder(features, orders[i], action, lineLayer);
                    }

                } else if (action === 'down') {
                    if ((orders[length - 1] + 1) > features.length) {
                        return;
                    }
                    for (var i = (orders.length - 1); i >= 0; i--) {
                        this.innerChangeOrder(features, orders[i], action, lineLayer);
                    }
                }
            } else {
                if (action === 'up') {
                    if (orders - 1 <= 0) {
                        return;
                    }
                } else if (action === 'down') {
                    if ((orders + 1) > features.length) {
                        return;
                    }
                }
                this.innerChangeOrder(features, orders, action, lineLayer);
            }
        },
        innerChangeOrder: function (features, orders, action, lineLayer) {
            if (action === 'up') {
                //up 2 -> 1 , 1 -> 2
                if ((orders - 1) <= 0) {
                    return;
                }
                var changed0 = false;
                var changed1 = false;
                for (var i = 0; i < features.length; i++) {
                    if (features[i].getProperties().order === (orders - 1)) {
                        this.setWpOrderStyle(features[i],orders);
                        this.wpLineManager.changeWpLineCoord(features[i], lineLayer);
                        changed0 = true;
                    }else if(features[i].getProperties().order === orders) {
                        this.setWpOrderStyle(features[i],orders-1);
                        this.wpLineManager.changeWpLineCoord(features[i], lineLayer);
                        changed1 = true;
                    }
                    if (changed0 && changed1) {
                        break;
                    }
                }
            } else if (action === 'down') {
                //down 2 -> 3 , 3 -> 2
                if ((orders + 1) > features.length) {
                    return;
                }
                var changed0 = false;
                var changed1 = false;
                for (var i = 0; i < features.length; i++) {
                    if (features[i].getProperties().order === orders) {
                        this.setWpOrderStyle(features[i],orders+1);
                        this.wpLineManager.changeWpLineCoord(features[i], lineLayer);
                        changed0 = true;
                    } else if (features[i].getProperties().order === (orders + 1)) {
                        this.setWpOrderStyle(features[i],orders);
                        this.wpLineManager.changeWpLineCoord(features[i], lineLayer);
                        changed1 = true;
                    }
                    if (changed0 && changed1) {
                        break;
                    }
                }
            }
        },
        getWaypointStyle: function (iconProperty, textProperty) {
            var waypointStyle = [];
            var iconStyle = this.myMapMan.getIconStyle(iconProperty);
            var textStyle = this.myMapMan.getTextStyle(textProperty);
            waypointStyle.push(iconStyle);
            waypointStyle.push(textStyle);

            return waypointStyle;
        },
        getDefaultWpStyle: function (feature,mode) {
            var waypointStyle = [];
            var order = feature.getProperties().order;
            this.textProperty.text = String(order);
            var iconStyle = this.myMapMan.getIconStyle(this.iconProperty);
            var textStyle = this.myMapMan.getTextStyle(this.textProperty);
            waypointStyle.push(iconStyle);
            waypointStyle.push(textStyle);
            if(mode !== undefined && mode !== null){
                if(mode === true){
                    this.wpEmiter.emit('defaultWp',order);
                }           
            }
            return waypointStyle;
        },
        getSelectedWpStyle: function (feature,mode) {
            var waypointStyle = [];
            var iconProperty = {
                url: './images/select_waypoint.png',
                scale: 1,
                anchor: [0.5, 1],
            };

            var textProperty = {
                //text: order.toString(),
                color: '#000000',
                offsetY: -27,
                font: 'bold 13px Noto Sans',
            };
            var order = feature.getProperties().order;
            textProperty.text = String(order);
            var iconStyle = this.myMapMan.getIconStyle(iconProperty);
            var textStyle = this.myMapMan.getTextStyle(textProperty);
            waypointStyle.push(iconStyle);
            waypointStyle.push(textStyle);
            if(mode !== undefined && mode !== null){
                if(mode === true){
                    this.wpEmiter.emit('selectedWp',order);
                }           
            }
            return waypointStyle;
        },
        newWaypoint: function (wpLayer, lineLayer) {
            var that = this;
            var coord = [14294212.769711845, 4257193.731542766];
            if(this.orderMan.getWpOrder() > 0){
//                console.log('getWpOrder:'+this.orderMan.getWpOrder());
                var features = wpLayer.getSource().getFeatures();
                for(var i = 0; i < features.length; i++){
                    if(features[i].getProperties().order === this.orderMan.getWpOrder()){
                        var lat = features[i].getProperties().latitude; 
                        var long = features[i].getProperties().longitude;
                        coord[0] = (Number(long)+10);
                        coord[1] = Number(lat);
                        break;
                    }
                }
            }
            var wpInfo = {
                type: 'waypoint',
                coordinateInfo: {
                    type: 'point',
                    //Todo:초기 생성시 기준좌표 결정필요
                    coordinate: coord
                },
                properties:{
                    type: 'waypoint'
                }
            }
            this.textProperty.text = String(this.orderMan.nextWpOrder());
            var wpStyle = this.getWaypointStyle(this.iconProperty, this.textProperty);
            var feature = this.myMapMan.addFeature(wpInfo, wpStyle, wpLayer);
            feature.type = 'point';
            feature.setProperties({
                'order': this.orderMan.getWpOrder()
            });
            //feature.setId(wpId++);
            this.setDefaultWpInfo(feature);
            feature.on('change', function (evt) {
                        if (evt.target.type === 'point') {
                            //Todo: waypoint layer 전체의 feature에 대한 이벤트로 변경필요
                            that.moveWpCoord(evt.target);
                            that.wpLineManager.changeWpLineCoord(evt.target, lineLayer);
                        }
                    });
            this.wpLineManager.addWaypointLine(feature, wpLayer, lineLayer);

            return feature;
        },

        addWaypoint: function (features, wpLayer,lineLayer) {
            var that = this;
            console.log('features');
            console.log(features);
            if (features instanceof Array) {
                for (var i = 0; i < features.length; i++) {
                    this.textProperty.text = String(features[i].order);
                    //console.log("features["+i+"] :"+this.textProperty.text);
                    var wpStyle = this.getWaypointStyle(this.iconProperty, this.textProperty);
                    var feature = this.myMapMan.addFeature(features[i], wpStyle, wpLayer);
                    feature.type = 'point';
                    that.changeWpInfo(feature, features[i]);
                    that.wpLineManager.addWaypointLine(feature, wpLayer, lineLayer);
                    that.orderMan.setWpOrder(features.length);                    
                    feature.on('change', function (evt) {
                        if (evt.target.type === 'point') {
                            that.moveWpCoord(evt.target);
                            that.wpLineManager.changeWpLineCoord(evt.target, lineLayer);
                        }
                    });
                }
            } else {
                this.textProperty.text = String(features.order);
                var wpStyle = this.getWaypointStyle(this.iconProperty, this.textProperty);
                var feature = this.myMapMan.addFeature(features, wpStyle, wpLayer);
                feature.type = 'point';
                that.changeWpInfo(feature, features);
                that.wpLineManager.addWaypointLine(feature, wpLayer, lineLayer);
                that.orderMan.setWpOrder(1);
                feature.on('change', function (evt) {
                    if (evt.target.type === 'point') {
                        that.moveWpCoord(evt.target);
                        that.wpLineManager.changeWpLineCoord(evt.target, lineLayer);
                    }
                });
            }
            //            return feature;
        },
        deleteWaypoints: function (features, wpLayer, lineLayer) {
            var that = this;
            var feature = wpLayer.getSource().getFeatures();
            if (features instanceof Array) {
//                console.log("deleteWaypoints : features is Array.");
                features.forEach(function (item, index) {
                    var order = item.getProperties().order;
//                    console.log(order+'vs'+ feature.length);
                    that.wpObList.removeItem(order);
                    if(order === feature.length){
                        wpLayer.getSource().removeFeature(item);
                        that.wpLineManager.deleteWaypointLine(order, wpLayer, lineLayer);
                    }else{
                        for(var i = 0; i < feature.length; i++){
                            var ord = feature[i].getProperties().order;
//                            console.log('feature.length: '+ feature.length);
                            if(ord === order){                                     
                                that.wpLineManager.deleteWaypointLine(order, wpLayer, lineLayer);              
                            }else if(ord > order){
                                that.setWpOrderStyle(feature[i],ord-1);
                            }
                        }
                        wpLayer.getSource().removeFeature(item);
                    }
                    that.orderMan.deleteWpOrder();
                });
            } else {
//                console.log("deleteWaypoints : features is not Array.")
                var order = features.getProperties().order;
                this.wpObList.removeItem(order);
                if(order === feature.length){
                    wpLayer.getSource().removeFeature(features);
                    this.wpLineManager.deleteWaypointLine(order, wpLayer, lineLayer);
                }else{
                    for(var i = 0; i < feature.length; i++){
                        var ord = feature[i].getProperties().order;
                        if(ord === order){                                                               
                            that.wpLineManager.deleteWaypointLine(order, wpLayer, lineLayer);                           }else if(ord > order){
                            that.setWpOrderStyle(feature[i],ord-1);
                        }
                    }
                    wpLayer.getSource().removeFeature(features);
                }
                this.orderMan.deleteWpOrder();
            }
        },
        /**
         * @method mapService.saveWpPath
         * @param {string} pathName - waypoint path 이름
         * @param {Object} pathLayer - waypoint path가 위치한 Layer
         * @returns {object} jsonPath - waypoint path Json 객체
         * @description Waypoint path를 JSON객체로 반환한다. 
         * @example
         * 
         *  mapService.saveWpPath(pathName, pathLayer);
         * 
         */
        saveWpPath: function (pathName, pathLayer) {
            if (pathLayer !== null && pathLayer !== undefined) {
                var features = pathLayer.getSource().getFeatures();
                var wpArry = [];
                var wpPathCoords = [];
                for (var i = 0; i < features.length; i++) {
                    var properties = features[i].getProperties();
                    var jsonAction = JSON.stringify(properties.action);
                    var wp = {
                        way_pont_ord_no: properties.order,
                        lttd_db: properties.latitude,
                        lgte_db: properties.longitude,
                        //attd_number:properties.altitude,
                        attd_no: properties.altitude,
                        sped_no: properties.speed,
                        wait_time_no: properties.wait,
                        actn_str: jsonAction
                    };
                    wpArry.push(wp);
                    var coord = [wp.lgte_db, wp.lttd_db];
                    wpPathCoords.push(coord);
                }

                var path = {
                    pathInfo: {
                        way_pont_path_name: pathName
                    },
                    waypointList: wpArry,
                    inpt_user_id: 1,
                    inpt_dt: '2016-04-27 11:10:24+09',
                };
                var jsonPath = JSON.stringify(path);
                console.log(path);
                this.getPathBoundary(wpPathCoords);
                return path;
            }
        },
        loadWpPath: function (jsonPath, wpLayer,lineLayer) {
            console.log("jsonPath.pathInfo");
            console.log(jsonPath);
            if(jsonPath === null || jsonPath === undefined){
                return;
            }
            if(jsonPath instanceof Array){
                jsonPath = jsonPath[0];
            }
//            var pathInfo = jsonPath.pathInfo[0];
            var pathName = jsonPath.way_pont_path_name;
            var pathId = jsonPath.way_pont_path_id;
            var waypointList = jsonPath.way_ponts;
            if(waypointList.length === 0){
                console.log('waypoint count : 0');
                return;
            }
            var wpPath = [];
            var wpPathCoords = [];
            if (waypointList instanceof Array) {
                for (var j = 0; j < waypointList.length; j++) {
                    var wpInfo = {
                        type: 'waypoint',
                        coordinateInfo: {
                            type: 'point',
                            coordinate: [waypointList[j].lgte_db, waypointList[j].lttd_db]
                        },
                        properties: {
                            type: 'waypoint'
                        },
                        'id': waypointList[j].way_pont_ord,
                        'order': waypointList[j].way_pont_ord_no,
                        'objecttype': 'waypoint',
                        'drawtype': 'point',
                        'name': 'wp' + waypointList[j].way_pont_ord,
                        'latitude': waypointList[j].lttd_db,
                        'longitude': waypointList[j].lgte_db,
                        'altitude': waypointList[j].attd_no,
                        'speed': waypointList[j].sped_no,
                        'wait': waypointList[j].wait_time_no,
                        'action': waypointList[j].actn_str,
                    };
                    wpPath.push(wpInfo);
                    var coord = [waypointList[j].lgte_db, waypointList[j].lttd_db];
                    wpPathCoords.push(coord);
                }
            } else {
                var wpInfo = {
                    type: 'waypoint',
                    coordinateInfo: {
                        type: 'point',
                        coordinate: [waypointList[j].lgte_db, waypointList[j].lttd_db]
                    },
                    properties: {
                        type: 'waypoint'
                    },
                    'id': waypointList[j].way_pont_ord,
                    'order':waypointList[j].way_pont_ord_no,
                    'objecttype': 'waypoint',
                    'drawtype': 'point',
                    'name': 'wp' + waypointList[j].way_pont_ord,
                    'latitude': waypointList[j].lttd_db,
                    'longitude': waypointList[j].lgte_db,
                    'altitude': waypointList[j].attd_no,
                    'speed': waypointList[j].sped_no,
                    'wait': waypointList[j].wait_time_no,
                    'action': waypointList[j].actn_str,
                };
                wpPath.push(wpInfo);
                var coord = [waypointList[j].lgte_db, waypointList[j].lttd_db];
                wpPathCoords.push(coord);
            }
            this.addWaypoint(wpPath, wpLayer, lineLayer);
            this.getPathBoundary(wpPathCoords);
            return {
                id: pathId,
                name: pathName
            };
        },
        loadSurveyWpPath: function (jsonPath, wpLayer,lineLayer) {
            console.log("jsonPath.pathInfo");
            console.log(jsonPath);
//            var pathInfo = jsonPath.pathInfo[0];
            var pathName = jsonPath.way_pont_path_name;
            var waypointList = jsonPath.way_ponts;
            var wpPath = [];
            if (waypointList instanceof Array) {
                for (var j = 0; j < waypointList.length; j++) {
                    var wpInfo = {
                        type: 'waypoint',
                        coordinateInfo: {
                            type: 'point',
                            coordinate: [waypointList[j].lgte_db, waypointList[j].lttd_db]
                        },
                        properties: {
                            type: 'waypoint'
                        },
                        'order': waypointList[j].way_pont_ord_no,
                        'objecttype': 'waypoint',
                        'drawtype': 'point',
                        'name': 'wp' + waypointList[j].way_pont_ord_no,
                        'latitude': waypointList[j].lttd_db,
                        'longitude': waypointList[j].lgte_db,
//                        'altitude': waypointList[j].attd_no,
//                        'speed': waypointList[j].sped_no,
//                        'wait': waypointList[j].wait_time_no,
//                        'action': waypointList[j].actn_str,
                    };
                    wpPath.push(wpInfo);
                }
            } else {
                var wpInfo = {
                    type: 'waypoint',
                    coordinateInfo: {
                        type: 'point',
                        coordinate: [waypointList[j].lgte_db, waypointList[j].lttd_db]
                    },
                    properties: {
                        type: 'waypoint'
                    },
                    'order':waypointList[j].way_pont_ord_no,
                    'objecttype': 'waypoint',
                    'drawtype': 'point',
                    'name': 'wp' + waypointList[j].way_pont_ord_no,
                    'latitude': waypointList[j].lttd_db,
                    'longitude': waypointList[j].lgte_db,
//                    'altitude': waypointList[j].attd_no,
//                    'speed': waypointList[j].sped_no,
//                    'wait': waypointList[j].wait_time_no,
//                    'action': waypointList[j].actn_str,
                };
                wpPath.push(wpInfo);
            }
            this.addWaypoint(wpPath, wpLayer, lineLayer);
            return {
                name: pathName
            };
        },
        getPathBoundary: function(coords){
            var minlong = coords[0][0];
            var maxlong = coords[0][0];
            var minlat = coords[0][1];
            var maxlat = coords[0][1];
            var centerlong;
            var centerlat;
            if(coords.length === 1){
                inlong = minlong- 800;
                minlat = minlat- 800;
                maxlong = maxlong + 800;
                maxlat = maxlat + 800;
                var extentCoords = [[minlong,minlat],[minlong,maxlat],[maxlong,minlat],[maxlong,maxlat]];
                this.myMapMan.getBoundary(extentCoords);
            }else{
                coords.forEach(function(item, index){
                    if(minlong > item[0]){
                        minlong = item[0];
                    }else if(maxlong<item[0]){
                        maxlong = item[0];
                    }
                    if(minlat > item[1]){
                        minlat = item[1];
                    }else if(maxlat<item[1]){
                        maxlat = item[1];
                    }    
                }); 
                minlong = minlong- 800;
                minlat = minlat- 800;
                maxlong = maxlong + 800;
                maxlat = maxlat + 800;
                var extentCoords = [[minlong,minlat],[minlong,maxlat],[maxlong,minlat],[maxlong,maxlat]];
                this.myMapMan.getBoundary(extentCoords);
            }
        },
        getEventInstance: function(){
            return this.wpEmiter;
        },
    }

    return constructor;
})();