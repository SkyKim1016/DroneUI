kindFramework.controller('letdroneMapSettingCtrl', function ($scope, $rootScope, $timeout, mapService, LetDroneObjectService, LetDroneRestService, OptimizeService, LetDroneDeviceService) {

    $scope.coordConverter = CoordConvertManager.getInstance();
    $scope.deviceManager = LetDroneDeviceService;

    $scope.objectDrawn = $scope.dragSelectEnable;
    $scope.init = function(){
        $rootScope.title = 'Map Setting';
        $scope.zoneOn = false;
        $scope.obstacleOn = false;
        $scope.noFlyZoneOn = false;
        $scope.geoFenceOn = false;
        $scope.cameraOn = false;
        $scope.sensorOn = false;
        $scope.currentLayer = null;
        $scope.editSavedFeature = false;
        $scope.objectDrawn = true;// false
        $scope.dragSelectEnable = false;
        
        
        $scope.varInit();
        $scope.featuresTodelete = [];
        $scope.TEMPeditableLayer = {};
        $scope.featureData = [];
    };


    $scope.varInit = function(){
        $scope.showObjProperty = false;
        $scope.tempData = [];
        $scope.objType = "";

        $scope.objPropertyList = {
            name: true,
            location: false,
            radius: false,
            altitude1: false,
            altitude2: false,
            angle: false,
            device: false
        };
        $scope.objProperty = {};
        $scope.objProperty.locList = [];
        $scope.mapSetting = {};
        $scope.locationInfo = false;
        $scope.mapSettingModalOpen = false;
//        $scope.editableLayerCollection = [];
        // $scope.propertyShow = false;
    };

    $scope.makeObjectLayer = function(type){
        $scope.objObserver(type);
    };

    $scope.initObjValues = function(type, feature){

        if(type === "Circle"){
            $scope.objType = "circle";

            //$scope.objProperty.locList = $scope.convert3857To4326(feature.getGeometry().getCoordinates()[0]);

            $scope.objProperty.centerPoint = $scope.convert3857To4326(feature.getProperties().center);
            $scope.objProperty.radius = feature.getProperties().radius;
            $scope.selectList = [
                {
                    "name": "Air Zone",
                    "value": "airzone"
                },
                {
                    "name": "Obstacle",
                    "value": "obstacle"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;
            $scope.selectObjType();

        } else if (type === "Polygon"){

            $scope.objType = "polygon";
            $scope.objProperty.locList = $scope.convert3857To4326(feature.getGeometry().getCoordinates()[0]);
            $scope.objProperty.centerPoint = $scope.calculateCenterPoint($scope.objProperty.locList);
            $scope.selectList = [
                {
                    "name": "Air Zone",
                    "value": "airzone"
                },
                {
                    "name": "Obstacle",
                    "value": "obstacle"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;
            $scope.selectObjType();


        } else if (type === "Point"){

            $scope.objType = "point";
            $scope.objProperty.locList = $scope.convert3857To4326(feature.getGeometry().getCoordinates());
            $scope.objProperty.centerPoint = $scope.objProperty.locList;
            $scope.selectList = [
                {
                    "name": "Obstacle",
                    "value": "obstacle"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;
            $scope.selectObjType();


        } else if (type === "Camera"){

            $scope.objType = "camera";
            $scope.objProperty.locList = $scope.convert3857To4326(feature.getGeometry().getCoordinates());
            $scope.objProperty.centerPoint = $scope.objProperty.locList;
            $scope.selectList = [
                {
                    "name": "Camera",
                    "value": "camera"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;

            $scope.deviceList = $scope.getDeviceList($scope.objType);
            if($scope.deviceList){
                $scope.deviceNameList = [];
                for(var idx in $scope.deviceList){
                    $scope.deviceNameList.push($scope.deviceList[idx].name);
                }
            }
            $scope.objProperty.selectedDevice = $scope.deviceNameList[0];
            
            $scope.selectObjType();

        } else if (type === "Sensor"){

            $scope.objType = "sensor";
            $scope.objProperty.locList = $scope.convert3857To4326(feature.getGeometry().getCoordinates());
            $scope.objProperty.centerPoint = $scope.objProperty.locList;
            $scope.selectList = [
                {
                    "name": "Sensor",
                    "value": "sensor"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;

            $scope.deviceList = $scope.getDeviceList($scope.objType);
            if($scope.deviceList){
                $scope.deviceNameList = [];
                for(var idx in $scope.deviceList){
                    $scope.deviceNameList.push($scope.deviceList[idx].name);
                }
            }
            $scope.objProperty.selectedDevice = $scope.deviceNameList[0];
            
            $scope.selectObjType();

        } else if (type === "GeoFence"){

            $scope.objType = "geofence";
            $scope.objProperty.radius = feature.getProperties().radius;
            $scope.selectList = [
                {
                    "name": "GeoFence",
                    "value": "geofence"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;

            $scope.deviceList = $scope.getDeviceList($scope.objType);
            $scope.selectObjType();
        }
    };



    $scope.objObserver = function(type){
        var objectType = type;
        switch(type){
            case 'Camera':
            case 'Sensor':
                objectType = 'Point';
                break;
            case 'GeoFence':
                objectType = 'Circle';
                break;
            default:
                break;
        }
        $scope.currentLayer = mapService.getLayer('object', 'temp');
        mapService.addObjectOnLayer($scope.currentLayer,objectType);
        var obs = mapService.createObserver();
        obs.notify = function (status, features) {
            if(features[0] === undefined){
                return;
            }
            
            // TODO not features. returns only one feature
            $scope.featureData = features[features.length-1];
            $timeout(function(){
                // Edit  버튼 활성화 
                $scope.initObjValues(type, $scope.featureData); 
                $scope.showObjProperty = true;
            });
        };
        mapService.subscribeObserverOnce('object', obs);
    };

    $scope.convert3857To4326 = function(locList){

        var converted = [];

        if(locList.length == 2){
            converted = $scope.coordConverter.transformCoord3857To4326(locList);
        } else {
            for(var i in locList){
                converted.push($scope.coordConverter.transformCoord3857To4326(locList[i]));
            }
        }

        return converted;
    };

    $scope.convert4326To3857 = function(locList){

        var converted = [];

        if(locList.length == 2){
            converted = $scope.coordConverter.transformCoord4326To3857(locList);
        } else {
            for(var i in locList){
                converted.push($scope.coordConverter.transformCoord4326To3857(locList[i]));
            }
        }

        return converted;
    };

    $scope.getDeviceList = function(type){

        var list = {};

        if(type === "geofence"){
            list = $scope.deviceManager.getDroneList()
        } else if (type === "camera"){
            list = $scope.deviceManager.getCameraList()
        } else if (type === "sensor"){
            list = $scope.deviceManager.getSensorList()
        }
        
        return list;
    };

    $scope.setDeviceList = function(type, obj){

        // if(type === "geofence"){
        //     $scope.deviceManager.updateGeofence(   );
        // } else if (type === "camera"){
        //     $scope.deviceManager.updateCamera(  );
        // } else if (type === "sensor"){
        //     $scope.deviceManager.updateSensor(   );
        // }
 

    }


    $scope.calculateCenterPoint = function(list){
        var maxLat = 0;
        var minLat = 0;
        var maxLng = 0;
        var minLng = 0;
        var temp = 0;
        var center = [];

        maxLat = list[0][0]; 
        for(var i in list){
            temp = list[i][0];
            if(temp > maxLat){ maxLat = temp; }
        }

        maxLng = list[0][1];
        for(var i in list){
            temp = list[i][1];
            if(temp > maxLng){ maxLng = temp; }
        }

        minLat = list[0][0];
        for(var i in list){
            temp = list[i][0];
            if(temp < minLat){ minLat = temp; }
        }

        minLng = list[0][1];
        for(var i in list){
            temp = list[i][1];
            if(temp < minLng){ minLng = temp; }
        }

        center[0] = (maxLat + minLat) / 2;
        center[1] = (maxLng + minLng) / 2;

        return center;
    };


    // Right Side Object Select Menu Ctrl
    // Dependencies:    $scope.checkBoxStatus(selected, type);
    //                  $scope.getObjectView(selected, type);
    $scope.viewObjects = function(type){
        if(type === "zone"){
            ($scope.zoneOn == false) ? $scope.zoneOn = true : $scope.zoneOn = false;
            $scope.checkBoxStatus($scope.zoneOn, type);
            $scope.getObjectView($scope.zoneOn, type);
        } else if(type === "obstacle"){
            ($scope.obstacleOn == false) ? $scope.obstacleOn = true : $scope.obstacleOn = false;
            $scope.checkBoxStatus($scope.obstacleOn, type);
            $scope.getObjectView($scope.obstacleOn, type);
        } else if(type === "fly"){
            ($scope.noFlyZoneOn == false) ? $scope.noFlyZoneOn = true : $scope.noFlyZoneOn = false;
            $scope.checkBoxStatus($scope.noFlyZoneOn, type);
            $scope.getObjectView($scope.noFlyZoneOn, type);
        } else if(type === "geo"){
            ($scope.geoFenceOn == false) ? $scope.geoFenceOn = true : $scope.geoFenceOn = false;
            $scope.checkBoxStatus($scope.geoFenceOn, type);
            $scope.getObjectView($scope.geoFenceOn, type);
        } else if(type === "camera"){
            ($scope.cameraOn == false) ? $scope.cameraOn = true : $scope.cameraOn = false;
            $scope.checkBoxStatus($scope.cameraOn, type);
            $scope.getObjectView($scope.cameraOn, type);
        } else if(type === "sensor"){
            ($scope.sensorOn == false) ? $scope.sensorOn = true : $scope.sensorOn = false;
            $scope.checkBoxStatus($scope.sensorOn, type);
            $scope.getObjectView($scope.sensorOn, type);
        } 
    };

    // Class ON/OFF
    $scope.checkBoxStatus = function(selected, type){
        if(selected){
           $('#'+type).parent().addClass("on"); 
        } else {
            $('#'+type).parent().removeClass("on");
        }
    };

    // Object view ON/OFF
    $scope.getObjectView = function(selected, type){
        if(selected){
            if(type === "zone"){
                //LetDroneObjectService.initialize();
                $scope.airzone = LetDroneObjectService.getObjectList('airzone');
                $scope.airzoneLayer = mapService.getLayer('object', 'airzone');
                for (var arrIndex in $scope.airzone) {
                    mapService.addObjectFromData($scope.airzone[arrIndex], $scope.airzoneLayer);
                }

//                $scope.editableLayerCollection.push($scope.airzoneLayer);
                $scope.TEMPeditableLayer['airzone'] = $scope.airzoneLayer;

                mapService.setLayerVisible($scope.airzoneLayer, true);
            } else if (type === "obstacle"){
               // LetDroneObjectService.initialize();
                $scope.obstacle = LetDroneObjectService.getObjectList('obstacle');
                $scope.obstacleLayer = mapService.getLayer('object', 'obstacle');
                for (var arrIndex in $scope.obstacle) {
                    mapService.addObjectFromData($scope.obstacle[arrIndex], $scope.obstacleLayer);
                }
                
//                $scope.editableLayerCollection.push($scope.obstacleLayer);
                $scope.TEMPeditableLayer['obstacle'] = $scope.obstacleLayer;

                mapService.setLayerVisible($scope.obstacleLayer, true);
            } else if (type === "fly"){
               // LetDroneObjectService.initialize();
                $scope.noflyzone = LetDroneObjectService.getObjectList('noflyzone');
                $scope.noflyzoneLayer = mapService.getLayer('object', 'noflyzone');
                for (var arrIndex in $scope.noflyzone) {
                    mapService.addObjectFromData($scope.noflyzone[arrIndex], $scope.noflyzoneLayer);
                }
                
//                $scope.editableLayerCollection.push($scope.noflyzoneLayer);
                $scope.TEMPeditableLayer['noflyzone'] = $scope.noflyzoneLayer;

                mapService.setLayerVisible($scope.noflyzoneLayer, true);
            } else if (type === "geo"){
               // LetDroneObjectService.initialize();
                $scope.geofence = LetDroneObjectService.getObjectList('geofence');
                $scope.geofenceLayer = mapService.getLayer('object', 'geofence');
                for (var arrIndex in $scope.geofence) {
                    mapService.addObjectFromData($scope.geofence[arrIndex], $scope.geofenceLayer);
                }
                
//                $scope.editableLayerCollection.push($scope.geofenceLayer);
                $scope.TEMPeditableLayer['geofence'] = $scope.geofenceLayer;

                mapService.setLayerVisible($scope.geofenceLayer, true);
            } else if (type === "camera"){
                $scope.camera = LetDroneDeviceService.getCameraList();
                $scope.cameraLayer = mapService.getLayer('device', 'camera');
                for (var arrIndex in $scope.camera) {
                    if ($scope.camera[arrIndex].coordinateInfo.coordinate) {
                        mapService.addDeviceFromData($scope.camera[arrIndex], $scope.cameraLayer);
                    }
                }  
                
//                $scope.editableLayerCollection.push($scope.cameraLayer);
                $scope.TEMPeditableLayer['camera'] = $scope.cameraLayer;

                mapService.setLayerVisible($scope.cameraLayer, true);
            } else if (type === "sensor"){
                $scope.sensor = LetDroneDeviceService.getSensorList();
                $scope.sensorLayer = mapService.getLayer('device', 'sensor');
                for (var arrIndex in $scope.sensor) {
                    if ($scope.sensor[arrIndex].coordinateInfo.coordinate) {
                        mapService.addDeviceFromData($scope.sensor[arrIndex], $scope.sensorLayer);
                    }
                } 
                
//                $scope.editableLayerCollection.push($scope.sensorLayer);
                $scope.TEMPeditableLayer['sensor'] = $scope.sensorLayer;

                mapService.setLayerVisible($scope.sensorLayer, true);
            }
        } else {
            // De-select menu
            if(type === "zone"){
                mapService.setLayerVisible($scope.airzoneLayer, false);
                delete $scope.TEMPeditableLayer.airzone;                
            } else if (type === "obstacle"){
                mapService.setLayerVisible($scope.obstacleLayer, false);
                delete $scope.TEMPeditableLayer.obstacle;         
            } else if (type === "fly"){
                mapService.setLayerVisible($scope.noflyzoneLayer, false);
                delete $scope.TEMPeditableLayer.noflyzone;         
            } else if (type === "geo"){
                mapService.setLayerVisible($scope.geofenceLayer, false);
                delete $scope.TEMPeditableLayer.geofence;         
            } else if (type === "camera"){
                mapService.setLayerVisible($scope.cameraLayer, false);
                delete $scope.TEMPeditableLayer.camera;         
            } else if (type === "sensor"){
                mapService.setLayerVisible($scope.sensorLayer, false);
                delete $scope.TEMPeditableLayer.sensor;         
            }
        }
    };

    $scope.modifyFeature = function () {
        mapService.modifyFeature($scope.currentLayer);
    };

    $scope.select = function () {
        mapService.select();
    };

    function givemeobjects(objects){
        //deleteFeature variable    
        $scope.featuresTodelete = objects;
        console.log('givemeobjects', objects);
            $scope.selectedOne = false;
            $scope.$apply();
//        for(var objIndex in objects){
        if(objects.length === 1){
            $scope.featureData = objects[0];
            $scope.selectedOne = true;
            $scope.$apply();
            switch($scope.featureData.getGeometry().getType().toLowerCase()){
                case 'polygon':
                    console.log('givemebjects::polygon');
                    $scope.objProperty = {
                            name: $scope.featureData.getProperties().name,
                            obj: $scope.featureData.getProperties().type,
                            alt1: $scope.featureData.getProperties().lowerHeight,
                            alt2: $scope.featureData.getProperties().upperHeight,
                            locList: $scope.convert3857To4326($scope.featureData.getGeometry().getCoordinates()[0]),
                            get centerPoint() {
                                return $scope.calculateCenterPoint(this.locList);
                            } 
                        };
                        $scope.objType = "polygon";
                    break;

                case 'circle':
                    console.log('givemebjects::circle');
                    $scope.objProperty = {
                            name: $scope.featureData.getProperties().name,
                            obj: $scope.featureData.getProperties().type,
                            centerPoint: $scope.convert3857To4326($scope.featureData.getGeometry().getCenter()),
                            radius: $scope.featureData.getGeometry().getRadius(),
                            alt1: $scope.featureData.getProperties().lowerHeight,
                            alt2: $scope.featureData.getProperties().upperHeight
                            //locList: $scope.convert3857To4326($scope.featureData.getGeometry().getCoordinates()[0])
                        };
                        $scope.objType = "circle";
                    break;

                case 'point' :
                    console.log('givemebjects::point');
                    $scope.objProperty = {
                            name: $scope.featureData.getProperties().name,
                            obj: $scope.featureData.getProperties().type,
                            locList: $scope.convert3857To4326($scope.featureData.getGeometry().getCoordinates())
                        };
                        $scope.objType = "point";
                    break;

                default: 
                console.log('givemeobjects::getType-> ',$scope.featureData.getGeometry().getType().toLowerCase());
            }

            if($scope.featureData.getProperties().type === "airzone"){
                $scope.selectList = [
                    {
                        "name": "Air Zone",
                        "value": "airzone"
                    }
                ];  
            } else {
                $scope.selectList = [
                    {
                        "name": "Obstacle",
                        "value": "obstacle"
                    }
                ]; 
            }
            $scope.selectObjType();
        }
    }

    $scope.dragSelect = function () {
        ($scope.dragSelectEnable === false) ? $scope.dragSelectEnable = true : $scope.dragSelectEnable = false;
        
        if($scope.dragSelectEnable === true){
            $scope.objectDrawn = false;

            mapService.dragSelect($scope.TEMPeditableLayer, givemeobjects);
        } else {
            mapService.mapMotion(0);
        }
    };




    $scope.saveFeature = function(){

        if($scope.objType === 'circle'){

            $scope.tempProperties = $scope.featureData.getProperties();
            $scope.tempProperties.center = $scope.convert4326To3857($scope.objProperty.centerPoint);
            $scope.tempProperties.radius = $scope.objProperty.radius;
            $scope.tempProperties.name = $scope.objProperty.name;
            $scope.tempProperties.type = $scope.objProperty.obj;
            $scope.tempProperties.lowerHeight = $scope.objProperty.alt1;
            $scope.tempProperties.upperHeight = $scope.objProperty.alt2;
//            $scope.tempProperties.drawType = 'circle';

            $scope.featureData.setProperties($scope.tempProperties);
          //  $scope.featureData.getGeometry().setCoordinates([$scope.convert4326To3857($scope.objProperty.locList)]);

            if($scope.editSavedFeature === false){
                var objjson = mapService.saveObject($scope.featureData);
                LetDroneObjectService.postObject($scope.objProperty.obj, objjson);
            } else {
                // update ㅎ마수 
                //alert('Update completed!!');
                var objjson = mapService.updateObject($scope.featureData);
                console.log('inside mapsetting client for update circle', objjson);
            }

        } else if($scope.objType === 'polygon'){

            $scope.tempProperties = $scope.featureData.getProperties();
            $scope.tempProperties.type = $scope.objProperty.obj;
            $scope.tempProperties.name = $scope.objProperty.name;
            $scope.tempProperties.lowerHeight = $scope.objProperty.alt1;
            $scope.tempProperties.upperHeight = $scope.objProperty.alt2;
//            $scope.tempProperties.drawType = 'polygon';

            $scope.featureData.setProperties($scope.tempProperties);
            $scope.featureData.getGeometry().setCoordinates([$scope.convert4326To3857($scope.objProperty.locList)]);
            console.log('saveObject::polygon');
            console.log($scope.featureData);
            console.log($scope.objProperty.locList);
            if($scope.editSavedFeature === false){
                var objjson = mapService.saveObject($scope.featureData);
                LetDroneObjectService.postObject($scope.objProperty.obj, objjson);
            } else {
                // update ㅎ마수 
                //alert('Update completed!!');
                var objjson = mapService.updateObject($scope.featureData);
                console.log('inside mapsetting client for update polygon', objjson);
            }

        } else if ($scope.objType === 'point'){

            $scope.tempProperties = $scope.featureData.getProperties();
            $scope.tempProperties.type = $scope.objProperty.obj;
            $scope.tempProperties.name = $scope.objProperty.name;
//            $scope.tempProperties.drawType = 'point';

            $scope.featureData.setProperties($scope.tempProperties);
            $scope.featureData.getGeometry().setCoordinates($scope.convert4326To3857($scope.objProperty.locList));

            if($scope.editSavedFeature === false){
                var objjson = mapService.saveObject($scope.featureData);
                LetDroneObjectService.postObject($scope.objProperty.obj, objjson);
            } else {
                // update ㅎ마수 
                alert('Update completed!!');
            }

        } else if ($scope.objType === 'camera'){

            $scope.setDeviceList($scope.objType, $scope.objProperty.selectedDevice);

            var selectedDevice;
            for (var idx in $scope.deviceList) {
                if ($scope.deviceList[idx].name == $scope.objProperty.selectedDevice) {
                    selectedDevice = $scope.deviceList[idx];
                }
            }

            // $scope.featureData.values_.type2 = $scope.objType;
            $scope.tempProperties = $scope.featureData.getProperties();
            $scope.tempProperties.type = $scope.objProperty.obj;
            $scope.tempProperties.name = $scope.objProperty.name;

            $scope.featureData.setProperties($scope.tempProperties);
            $scope.featureData.getGeometry().setCoordinates($scope.convert4326To3857($scope.objProperty.locList));
            // $scope.featureData.values_.geometry.flatCoordinates[0] = $scope.convert4326To3857($scope.objProperty.locList)[0];
            // $scope.featureData.values_.geometry.flatCoordinates[1] = $scope.convert4326To3857($scope.objProperty.locList)[1];

            if (selectedDevice) {
                // 서버 저장용 데이터 생성
                selectedDevice.angle = $scope.objProperty.angle;
                selectedDevice.coordinateInfo.coordinate = $scope.convert4326To3857($scope.objProperty.locList);
            }

            if($scope.editSavedFeature === false){

                if (selectedDevice) {
                    $scope.featureData.values_.id = selectedDevice.id;
                    $scope.featureData.values_.name = selectedDevice.name;
                    $scope.featureData.values_.angle = selectedDevice.angle;
                    $scope.featureData.values_.ip = selectedDevice.ip;
                    $scope.featureData.values_.type = selectedDevice.type;
                    $scope.featureData.values_.coordinateInfo = selectedDevice.coordinateInfo;
                    var objjson = mapService.saveDevice($scope.featureData);
                    LetDroneDeviceService.updateCamera(selectedDevice);
                }
                //LetDroneObjectService.postObject($scope.objProperty.obj, objjson);
            } else {
                // update ㅎ마수 
                alert('Update completed!!');
            }

            //var objjson = mapService.saveDevice($scope.featureData);
            //LetDroneObjectService.postObject($scope.objProperty.obj, objjson);

        } else if ($scope.objType === 'sensor') {
            
            $scope.setDeviceList($scope.objType, $scope.objProperty.selectedDevice);

            var selectedDevice;
            for (var idx in $scope.deviceList) {
                if ($scope.deviceList[idx].name == $scope.objProperty.selectedDevice) {
                    selectedDevice = $scope.deviceList[idx];
                }
            }

            $scope.featureData.values_.type2 = $scope.objType;
            $scope.tempProperties = $scope.featureData.getProperties();
            
            $scope.tempProperties.type = $scope.objProperty.obj;
            $scope.tempProperties.name = $scope.objProperty.name;

            $scope.featureData.setProperties($scope.tempProperties);
            $scope.featureData.getGeometry().setCoordinates($scope.convert4326To3857($scope.objProperty.locList));

            // $scope.featureData.values_.geometry.flatCoordinates[0] = $scope.convert4326To3857($scope.objProperty.locList)[0];
            // $scope.featureData.values_.geometry.flatCoordinates[1] = $scope.convert4326To3857($scope.objProperty.locList)[1];

            if (selectedDevice) {
                // 서버 저장용 데이터 생성
                selectedDevice.angle = $scope.objProperty.angle;
                selectedDevice.coordinateInfo.coordinate = $scope.convert4326To3857($scope.objProperty.locList);
            }

            if($scope.editSavedFeature === false){
                if (selectedDevice) {
                    $scope.featureData.values_.id = selectedDevice.id;
                    $scope.featureData.values_.name = selectedDevice.name;
                    $scope.featureData.values_.angle = selectedDevice.angle;
                    $scope.featureData.values_.ip = selectedDevice.ip;
                    $scope.featureData.values_.type = selectedDevice.type;
                    $scope.featureData.values_.coordinateInfo = selectedDevice.coordinateInfo;
                    var objjson = mapService.saveDevice($scope.featureData);
                    LetDroneDeviceService.updateSensor(selectedDevice);
                }       
                //LetDroneObjectService.postObject($scope.objProperty.obj, objjson);
            } else {
                // update ㅎ마수 
                alert('Update completed!!');
            }

            //var objjson = mapService.saveDevice($scope.featureData);
            //LetDroneObjectService.postObject($scope.objProperty.obj, objjson);

        } else if ($scope.objType === 'geofence') {

            $scope.setDeviceList($scope.objType, $scope.objProperty.selectedDevice);

            $scope.tempProperties = $scope.featureData.getProperties();
            
            $scope.tempProperties.radius = $scope.objProperty.radius;
            $scope.tempProperties.type = $scope.objProperty.obj;
            $scope.tempProperties.name = $scope.objProperty.name;
            $scope.tempProperties.drone = "droneList";
            $scope.tempProperties.lowerHeight = $scope.objProperty.alt1;
            
            $scope.featureData.setProperties($scope.tempProperties);

            if($scope.editSavedFeature === false){
                var objjson = mapService.saveObject($scope.featureData);
                LetDroneObjectService.postObject($scope.objProperty.obj, objjson);
            } else {
                // update ㅎ마수 
                alert('Update completed!!');
            }

            //var objjson = mapService.saveObject($scope.featureData);
            //LetDroneObjectService.postObject($scope.objProperty.obj, objjson);
        }
        
        // Edit  버튼 비활성화  ???????????????????????????????????????????????????????????????????????????????????
//        $timeout(function(){
//            $scope.objectDrawn = true;
//        });

//        mapService.mapMotion(0);
        $scope.viewObjects();
        $scope.varInit(); 
        $scope.editSavedFeature = false;
        
        $scope.featureData = [];
        if ($scope.dragSelectEnable === false) {
            mapService.mapMotion(0);
        }
    };

    $scope.deleteFeature = function () {
        var reset = false;
        for(var layerIndex in $scope.TEMPeditableLayer){
            mapService.deleteObjectFromLayer($scope.TEMPeditableLayer[layerIndex], $scope.featuresTodelete);
            for(var index in $scope.featuresTodelete){
                reset = true;
                if ($scope.featuresTodelete[index].values_.type === 'camera') {
                    var data = $scope.featuresTodelete[index].values_;
                    delete data['geometry'];
                    data.coordinateInfo = {
                        type: 'point',
                        coordinate: undefined
                    }
                    LetDroneDeviceService.updateCamera(data);
                } else if($scope.featuresTodelete[index].values_.type === 'sensor') {
                    var data = $scope.featuresTodelete[index].values_;
                    delete data['geometry'];
                    data.coordinateInfo = {
                        type: 'point',
                        coordinate: undefined
                    }
                    LetDroneDeviceService.updateSensor(data);
                } else {
                    LetDroneObjectService.deleteObject($scope.featuresTodelete[index]);
                }
            }
        }
        if(reset){            
            $scope.featuresTodelete = [];
            $scope.selectedOne = false;
            $scope.editSavedFeature = false;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }
        
    };

    $scope.editFeature = function () {
        // Edit  버튼 활성화  
        $scope.selectObjType();
        $scope.showObjProperty = true;
        $scope.editSavedFeature = true;
    };

    $scope.cancelEditFeature = function(){
        $scope.editSavedFeature = false;
        $scope.varInit(); 
    }

    // button disabled
    $scope.disabled = function(){
        $('button:disabled').parent().addClass('off');
    };

    $scope.openLocationInfo = function(){
        ($scope.locationInfo == false)? $scope.locationInfo = true : $scope.locationInfo = false;
    };

    $scope.deviceSelected = function(){
        console.log($scope.objProperty.selectedDevice)
    }

    $scope.selectObjType = function(){

        if($scope.objType === "circle" && ($scope.objProperty.obj === "airzone" || $scope.objProperty.obj === "obstacle")){
            $scope.objPropertyList = {
                name: true,
                location: true,
                radius: true,
                altitude1: true,
                altitude2: true,
                angle: false,
                device: false
            };
        } 

        if($scope.objType === "polygon" && ($scope.objProperty.obj === "airzone" || $scope.objProperty.obj === "obstacle")){
            $scope.objPropertyList = {
                name: true,
                location: true,
                radius: false,
                altitude1: true,
                altitude2: true,
                angle: false,
                device: false
            };
        } 

        if($scope.objType === "point" && $scope.objProperty.obj === "obstacle"){
            $scope.objPropertyList = {
                name: true,
                location: true,
                radius: false,
                altitude1: false,
                altitude2: false,
                angle: false,
                device: false
            };
        }

        if($scope.objType === "camera"){
            $scope.objPropertyList = {
                name: false,
                location: true,
                radius: false,
                altitude1: false,
                altitude2: false,
                angle: true,
                device: "cameraList"
            };
        }

        if($scope.objType === "sensor"){
            $scope.objPropertyList = {
                name: false,
                location: true,
                radius: false,
                altitude1: false,
                altitude2: false,
                angle: true,
                device: "sensorList"
            };
        }

        if($scope.objType === "geofence"){
            $scope.objPropertyList = {
                name: false,
                location: false,
                radius: true,
                altitude1: true,
                altitude2: false,
                angle: false,
                device: "droneList"
            };
        }
    };


    $scope.cancelObjPropertyModal = function(){

//        mapService.mapMotion(0);
        $scope.selectedOne = false;
        $scope.editSavedFeature = false;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
            $scope.varInit();
        if ($scope.dragSelectEnable === false) {
            $scope.showObjProperty = false;
            mapService.mapMotion(0);
            $scope.currentLayer.getSource().removeFeature($scope.featureData);
        }

        // $scope.dragSelectEnable = true;

        // if($scope.TEMPeditableLayer.length === 1){
         
        //     $scope.showObjProperty = false;
        //     $scope.objPropertyList.name = true;

        // } else {              
                //$scope.currentLayer.getSource().removeFeature($scope.featureData);
                // $scope.varInit();
            
        // }
    }

    $scope.unitlist = function(){
         $('button').parent().removeClass('off');
        $('button:disabled').parent().addClass('off');
        $( ".airZone" ).click(function() {
            $( ".unitList" ).hide();
            $( ".figureunit li" ).removeClass('on');
            $( ".airZone" ).parent().addClass('on').children('dl').show();
        });
        $( ".obstacle" ).click(function() {
            $( ".unitList" ).hide();
            $( ".figureunit li" ).removeClass('on');
            $( ".obstacle" ).parent().addClass('on').children('dl').show();
        });
         $( ".unitList  button" ).click(function() {
            $( ".unitList" ).hide();
            $( ".figureunit li" ).removeClass('on');           
        });
         $( ".editUnit  button, .ectunit  button" ).click(function() {
            $( ".unitList" ).hide();
            $( ".figureunit li" ).removeClass('on');           
        });

    };

    $scope.openMapSettingModal = function(){
        $scope.mapSettingModalOpen = true;

        $scope.mapSetting.lat = 128.4130096435547;
        $scope.mapSetting.lng = 35.70306677476759;
        $scope.mapSetting.level = 16;
        $scope.mapSetting.map_id = 1;
        $scope.mapSetting.user_id = 1;
        $scope.mapSetting.zoomRange = [];
        $scope.mapSetting.zoomRange2 = [];
        for(var i=1; i<19; i++){
            $scope.mapSetting.zoomRange.push(i);
        }

        for(var i=1; i<19; i++){
            $scope.mapSetting.zoomRange2.push(i);
        }

        $scope.mapSetting.zoomMin = 1;
        $scope.mapSetting.zoomMax = 18;
    };

    $scope.minZoomChange = function(){
        $scope.mapSetting.zoomRange2 = [];
        for(var i=$scope.mapSetting.zoomMin+1; i<19; i++){
            $scope.mapSetting.zoomRange2.push(i);
        }
    };

    $scope.selectLocationType = function(){
        console.log($scope.locationType);
    }

    $scope.closeMapSettingModal = function(){
        $scope.mapSettingModalOpen = false;
    };

    $scope.getCoords = function () {
        var coords = mapService.getCoords(currentLayer);

        OptimizeService.solveSurveyGrid(coords);
        
        var jsonPath =  OptimizeService.saveWpPathForSurvey();
        mapService.loadSurveyWpPath(jsonPath);
    };

    $scope.setMap = function () {

        var mapData = {
                center: [$scope.mapSetting.lat, $scope.mapSetting.lng],
                level: $scope.mapSetting.level,
                map_id: $scope.mapSetting.map_id,
                user_id: $scope.mapSetting.user_id,
                max_level: $scope.mapSetting.zoomMax,
                min_level: $scope.mapSetting.zoomMin
            } //this is should be by UI
        var objjson = mapService.setMap(mapData);
        LetDroneObjectService.postObject('map', objjson);
   
        $scope.closeMapSettingModal();
    };
});

kindFramework.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace(/[^0-9\.]/g, '');
        var decimalCheck = clean.split('.');

        if(!angular.isUndefined(decimalCheck[1])) {
            decimalCheck[1] = decimalCheck[1].slice(0,10);
            clean =decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});