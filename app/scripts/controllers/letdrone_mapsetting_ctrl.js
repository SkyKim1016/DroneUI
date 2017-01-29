kindFramework.controller('letdroneMapSettingCtrl', ['$scope', '$rootScope', 'mapService', 'LetDroneObjectService', 'LetDroneDeviceService', 'LetDroneRestService', 'OptimizeService',
                                     function ($scope, $rootScope, mapService, objSrv, deviceSrv, restSrv, OptimizeService) {


    var currentLayer;

    //delete data
    var featuresTodelete = [];

    //save data
    var featureToSave;

    var TEMPeditableLayer = {};



    //menu select object type
    var objectDrawType = null;
    var drawType = null;

    //
    var objectDrawn = $scope.DRAGABLE_STATUS;

    (function init(){
    	buttonStatusInit();
    	popupFormInit();
    	checkboxCheckedInit();
    })();



    function variableInit(){
    	objectDrawType = null;
    	drawType = null;

    	objectDrawn = true;
    	currentLayer = null;
    }

    //popup form variable init
    function popupFormInit(){
	    $scope.objType = null;
	    $scope.objProperty = {};
        $scope.objProperty.locList = [];
	    $scope.objPropertyList = {
            name: true,
            location: false,
            radius: false,
            altitude1: false,
            altitude2: false,
            angle: false,
            device: false
        };	

        $scope.locationInfo = false;
    }


    //check box checked
    function checkboxCheckedInit(){
	    $scope.airzoneOn = false;
	    $scope.obstacleOn = false;
	    $scope.noFlyZoneOn = false;
	    $scope.geoFenceOn = false;
	    $scope.cameraOn = false;
	    $scope.sensorOn = false;
    }

	//button init
    function buttonStatusInit(){
        $scope.editSavedFeature = false;
    	$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = true;
		$scope.EDIT_BUTTON = true;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = true;
		$scope.AIRZONE_BUTTON = false;
		$scope.OBSTACLE_BUTTON = false;
		$scope.CAMERA_BUTTON = false;
		$scope.SENSOR_BUTTON = false;
    }

	function initObjectNoneButton(){
    	$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = true;
		$scope.EDIT_BUTTON = true;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = true;
		$scope.AIRZONE_BUTTON = false;
		$scope.OBSTACLE_BUTTON = false;
		$scope.CAMERA_BUTTON = false;
		$scope.SENSOR_BUTTON = false;
	}

	function initObjectMoreThanOneButton(){
    	$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = false;
		$scope.EDIT_BUTTON = true;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = true;
		$scope.AIRZONE_BUTTON = false;
		$scope.OBSTACLE_BUTTON = false;
		$scope.CAMERA_BUTTON = false;
		$scope.SENSOR_BUTTON = false;
	}

	function saveObjectButton(){
    	$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = false;
		$scope.EDIT_BUTTON = true;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = true;
		$scope.AIRZONE_BUTTON = false;
		$scope.OBSTACLE_BUTTON = false;
		$scope.CAMERA_BUTTON = false;
		$scope.SENSOR_BUTTON = false;
	}


	function selectObjectNoAddButton(){
    	//$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = false;
		$scope.EDIT_BUTTON = true;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = true;
		$scope.AIRZONE_BUTTON = true;
		$scope.OBSTACLE_BUTTON = true;
		$scope.CAMERA_BUTTON = true;
		$scope.SENSOR_BUTTON = true;
	}

	function selectedObjectOneButton(){
    	//$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = true;
		$scope.EDIT_BUTTON = false;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = false;
		$scope.AIRZONE_BUTTON = true;
		$scope.OBSTACLE_BUTTON = true;
		$scope.CAMERA_BUTTON = true;
		$scope.SENSOR_BUTTON = true;
	}

	function selectedObjectMoreThanOneButton(){
    	//$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = true;
		$scope.EDIT_BUTTON = true;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = false;
		$scope.AIRZONE_BUTTON = true;
		$scope.OBSTACLE_BUTTON = true;
		$scope.CAMERA_BUTTON = true;
		$scope.SENSOR_BUTTON = true;
	}

	function noSelectedObjectMoreThanOneButton(){
    	//$scope.DRAGABLE_STATUS = false;
		$scope.SELECT_BUTTON = false;
		$scope.EDIT_BUTTON = true;
		//$scope.CANCLE_BUTTON = false;
		$scope.DELETE_BUTTON = true;
		$scope.AIRZONE_BUTTON = true;
		$scope.OBSTACLE_BUTTON = true;
		$scope.CAMERA_BUTTON = true;
		$scope.SENSOR_BUTTON = true;
	}

    function initObjValues(type, feature){

        if(type === "Circle"){
            $scope.objType = "circle";
            $scope.locationInfoDisplay = true;

            $scope.objProperty.id = feature.getId();
            $scope.objProperty.centerPoint = convert3857To4326(feature.getProperties().center);
            //$scope.objProperty.radius = feature.getProperties().radius;
            $scope.objProperty.groundRadius = feature.getProperties().groundRadius;

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

            if(objectDrawType === "airzone"){
            	$scope.objProperty.obj = $scope.selectList[0].value;
            }else{
            	$scope.objProperty.obj = $scope.selectList[1].value;
            }
            
            selectObjType();

        } else if (type === "Polygon"){

            $scope.objType = "polygon";
            $scope.locationInfoDisplay = false;

            $scope.objProperty.id = feature.getId();
            $scope.objProperty.locList = convert3857To4326(feature.getGeometry().getCoordinates()[0]);
            $scope.objProperty.centerPoint = calculateCenterPoint($scope.objProperty.locList);
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

            if(objectDrawType == "airzone"){
            	$scope.objProperty.obj = $scope.selectList[0].value;
            }else{
            	$scope.objProperty.obj = $scope.selectList[1].value;
            }

            selectObjType();


        } else if (type === "Point"){

            $scope.objType = "point";
            $scope.locationInfoDisplay = true;

            $scope.objProperty.id = feature.getId();
            $scope.objProperty.locList = convert3857To4326(feature.getGeometry().getCoordinates());
            $scope.objProperty.centerPoint = $scope.objProperty.locList;
            $scope.selectList = [
                {
                    "name": "Obstacle",
                    "value": "obstacle"
                }
            ];

            $scope.objProperty.obj = $scope.selectList[0].value;

            selectObjType();


        } else if (type === "camera"){

            $scope.objType = "camera";
            $scope.locationInfoDisplay = true;

            $scope.objProperty.id = feature.getId();
            $scope.objProperty.locList = convert3857To4326(feature.getGeometry().getCoordinates());
            $scope.objProperty.centerPoint = $scope.objProperty.locList;
            
            $scope.selectList = [
                {
                    "name": "Camera",
                    "value": "camera"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;

            $scope.deviceList = getDeviceList($scope.objType);
            if($scope.deviceList){
                $scope.deviceNameList = [];
                for(var idx in $scope.deviceList){
                    $scope.deviceNameList.push($scope.deviceList[idx].name);
                    $scope.objProperty.angle = $scope.deviceList[idx].angle;
                }
            }
            $scope.objProperty.selectedDevice = $scope.deviceNameList[0];
            
            selectObjType();

        } else if (type === "sensor"){

            $scope.objType = "sensor";
            $scope.locationInfoDisplay = true;

            $scope.objProperty.id = feature.getId();
            $scope.objProperty.locList = convert3857To4326(feature.getGeometry().getCoordinates());
            $scope.objProperty.centerPoint = $scope.objProperty.locList;
            $scope.selectList = [
                {
                    "name": "Sensor",
                    "value": "sensor"
                }
            ];
            $scope.objProperty.obj = $scope.selectList[0].value;

            $scope.deviceList = getDeviceList($scope.objType);
            if($scope.deviceList){
                $scope.deviceNameList = [];
                for(var idx in $scope.deviceList){
                    $scope.deviceNameList.push($scope.deviceList[idx].name);
                    $scope.objProperty.angle = $scope.deviceList[idx].angle;
                }
            }
            $scope.objProperty.selectedDevice = $scope.deviceNameList[0];
            
            selectObjType();

        }
    }

    function selectObjType(){

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
                altitude1: true,
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

    function featureTomake(feature) {
        console.log("############### feature >> ", feature);
        console.log("############### drawType >> ", drawType);
        console.log("############### objectDrawType >> ", objectDrawType);

        if(drawType === 'Point' && (objectDrawType === 'camera' || objectDrawType === 'sensor')){
        	initObjValues(objectDrawType, feature);

        }else{
        	initObjValues(drawType, feature);

        }


        //temp
        $scope.showObjProperty = true;
        if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
        }

        featureToSave = feature;

    }

    function givemeobjects(objects){

    	//deleteFeature variable    
        featuresTodelete = objects;

        console.log('givemeobjects', objects);
            $scope.selectedOne = false;

//        for(var objIndex in objects){
        if(objects.length === 1){
    		featureToSave = objects[0];
            $scope.selectedOne = true;
            $scope.$apply();

            switch(featureToSave.getGeometry().getType().toLowerCase()){
                case 'polygon':
                    console.log('givemebjects::polygon');
            		$scope.locationInfoDisplay = false;
                    $scope.objProperty = {
                            name: featureToSave.getProperties().name,
                            obj: featureToSave.getProperties().type,
                            alt1: featureToSave.getProperties().lowerHeight,
                            alt2: featureToSave.getProperties().upperHeight,
                            locList: convert3857To4326(featureToSave.getGeometry().getCoordinates()[0]),
                            get centerPoint() {
                                return calculateCenterPoint(this.locList);
                            } 
                        };
                        $scope.objType = "polygon";
                    break;

                case 'circle':
                    console.log('givemebjects::circle');
            		$scope.locationInfoDisplay = true;
                    $scope.objProperty = {
                            name: featureToSave.getProperties().name,
                            obj: featureToSave.getProperties().type,
                            centerPoint: convert3857To4326(featureToSave.getGeometry().getCenter()),
                            //radius: featureToSave.getProperties().radius,
                            groundRadius: featureToSave.getProperties().groundRadius,
                            alt1: featureToSave.getProperties().lowerHeight,
                            alt2: featureToSave.getProperties().upperHeight
                            //locList: convert3857To4326(featureToSave.getGeometry().getCoordinates()[0])
                        };
                        $scope.objType = "circle";
                    break;

                case 'point' :


	                if(featureToSave.getProperties().type == 'camera'){
	                    console.log('givemebjects::camera');
	            		$scope.locationInfoDisplay = true;
	                    $scope.objProperty = {
	                            name: featureToSave.getProperties().name,
	                            obj: featureToSave.getProperties().type,
	                            angle: featureToSave.getProperties().angle,
	                            //locList: convert3857To4326(featureToSave.getGeometry().getCoordinates()),
	                            centerPoint: convert3857To4326(featureToSave.getGeometry().getCoordinates()),
	                        };
	                        $scope.objType = "camera";

	                }else if(featureToSave.getProperties().type == 'sensor'){
	                    console.log('givemebjects::sensor');
	            		$scope.locationInfoDisplay = true;
	                    $scope.objProperty = {
	                            name: featureToSave.getProperties().name,
	                            obj: featureToSave.getProperties().type,
	                            angle: featureToSave.getProperties().angle,
	                            //locList: convert3857To4326(featureToSave.getGeometry().getCoordinates()),
	                            centerPoint: convert3857To4326(featureToSave.getGeometry().getCoordinates()),
	                        };
	                        $scope.objType = "sensor";
	                }else{
	                    console.log('givemebjects::point');
	            		$scope.locationInfoDisplay = true;
	                    $scope.objProperty = {
	                            name: featureToSave.getProperties().name,
	                            obj: featureToSave.getProperties().type,
	                            //locList: convert3857To4326(featureToSave.getGeometry().getCoordinates()),
	                            centerPoint: convert3857To4326(featureToSave.getGeometry().getCoordinates()),
	                        };
	                        $scope.objType = "point";

	                }

                    break;

                default: 
                console.log('givemeobjects::getType-> ',featureToSave.getGeometry().getType().toLowerCase());
            }

            if(featureToSave.getProperties().type === "airzone"){
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

            selectObjType();


        	//button control
        	selectedObjectOneButton();
        }else if(objects.length == 0 || objects === undefined){
        	noSelectedObjectMoreThanOneButton();
        }else{
        	//button control
        	selectedObjectMoreThanOneButton();
        }

        $scope.$apply();

    }

    function checkBoxStatus(selected, type){
        if(selected && objectList !== undefined){
           angular.element(document.querySelector('#'+type)).parent().addClass("on"); 
        } else {
            angular.element(document.querySelector('#'+type)).parent().removeClass("on");
        }
        if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
        }
    }

    function getObjectView(selected, type){
    	var objectList = objSrv.getObjectList(type);
    	var objectLayer = mapService.getLayer('object', type);

    	//button control
    	if(objectList === undefined){
        	initObjectNoneButton();
    	}else{
    		initObjectMoreThanOneButton();
    	}

        if(selected && objectList !== undefined){
            for (var i in objectList) {
                mapService.addObjectFromData(objectList[i], objectLayer);
            }

            TEMPeditableLayer[type] = objectLayer;

            mapService.setLayerVisible(objectLayer, true);
        }else{
			mapService.setLayerVisible(objectLayer, false);
            delete TEMPeditableLayer.type;

        }
    }

    function getDeviceView(selected, type){

    	if (type === 'camera') {
    		var deviceList = deviceSrv.getCameraList();
    	} else {
    		var deviceList = deviceSrv.getSensorList();
    	}

    	var deviceLayer = mapService.getLayer('device', type);

    	//button control
    	if(deviceList === undefined){
        	initObjectNoneButton();
    	}else{
    		initObjectMoreThanOneButton();
    	}

        if(selected && deviceList !== undefined){

            for (var arrIndex in deviceList) {
                if (deviceList[arrIndex].coordinateInfo.coordinate) {
                    mapService.addDeviceFromData(deviceList[arrIndex], deviceLayer);
                }
            }  
            
            TEMPeditableLayer[type] = deviceLayer;

            mapService.setLayerVisible(deviceLayer, true);
        } else {
            mapService.setLayerVisible(deviceLayer, false);
            delete TEMPeditableLayer.type;   
        }
    }

    function convert3857To4326(locList){

        var converted = [];

        if(locList.length == 2){
            converted = mapService.getCoordConverter().transformCoord3857To4326(locList);
        } else {
            for(var i in locList){
                converted.push(mapService.getCoordConverter().transformCoord3857To4326(locList[i]));
            }
        }

        return converted;
    }

    function convert4326To3857(locList){

        var converted = [];

        if(locList.length == 2){
            converted = mapService.getCoordConverter().transformCoord4326To3857(locList);
        } else {
            for(var i in locList){
                converted.push(mapService.getCoordConverter().transformCoord4326To3857(locList[i]));
            }
        }

        return converted;
    }

    function calculateCenterPoint(list){
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

    function getDeviceList(type){

        var list = {};

        if(type === "geofence"){
            list = deviceSrv.getDroneList()
        } else if (type === "camera"){
            list = deviceSrv.getCameraList()
        } else if (type === "sensor"){
            list = deviceSrv.getSensorList()
        }
        
        return list;
    };



    $scope.makeObjectLayer = function(type){
    	objectDrawType = type;
        currentLayer = mapService.getLayer('object', type);
    };

    $scope.makeDeviceLayer = function (type) {
    	objectDrawType = type;
        currentLayer = mapService.getLayer('device', type);
        $scope.drawObjectOnLayer('Point');
    }

    $scope.drawObjectOnLayer = function (type) {
    	drawType = type;
        mapService.addObjectOnLayer(currentLayer, type, featureTomake);
        console.log(type + ' is created');
    }

    $scope.addDeviceOnLayer = function () {
        mapService.addDeviceOnLayer(currentLayer);
    }

    $scope.dragSelect = function () {


        ($scope.DRAGABLE_STATUS === false) ? $scope.DRAGABLE_STATUS = true : $scope.DRAGABLE_STATUS = false;
        
        if($scope.DRAGABLE_STATUS === true){
            angular.element(document.querySelector('.ectselect')).parent().addClass('on');
            objectDrawn = false;

        	mapService.dragSelect(TEMPeditableLayer, givemeobjects);

        	//button control
        	selectObjectNoAddButton();

        } else {
            mapService.mapMotion(0);
            angular.element(document.querySelector('.ectselect')).parent().addClass('on');

            //button control
            initObjectMoreThanOneButton();
        }
    }


    $scope.viewObjects = function(type){
        if(type === "airzone"){
            ($scope.airzoneOn == false) ? $scope.airzoneOn = true : $scope.airzoneOn = false;
            checkBoxStatus($scope.airzoneOn, type);
            getObjectView($scope.airzoneOn, type);
        } else if(type === "obstacle"){
            ($scope.obstacleOn == false) ? $scope.obstacleOn = true : $scope.obstacleOn = false;
            checkBoxStatus($scope.obstacleOn, type);
            getObjectView($scope.obstacleOn, type);
        } else if(type === "fly"){
            ($scope.noFlyZoneOn == false) ? $scope.noFlyZoneOn = true : $scope.noFlyZoneOn = false;
            checkBoxStatus($scope.noFlyZoneOn, type);
            getObjectView($scope.noFlyZoneOn, type);
        } else if(type === "geo"){
            ($scope.geoFenceOn == false) ? $scope.geoFenceOn = true : $scope.geoFenceOn = false;
            checkBoxStatus($scope.geoFenceOn, type);
            getObjectView($scope.geoFenceOn, type);
        } else if(type === "camera"){
            ($scope.cameraOn == false) ? $scope.cameraOn = true : $scope.cameraOn = false;
            checkBoxStatus($scope.cameraOn, type);
            getDeviceView($scope.cameraOn, type);
        } else if(type === "sensor"){
            ($scope.sensorOn == false) ? $scope.sensorOn = true : $scope.sensorOn = false;
            checkBoxStatus($scope.sensorOn, type);
            getDeviceView($scope.sensorOn, type);
        }
    };

    $scope.editFeature = function () {
        selectObjType();
        $scope.showObjProperty = true;
        $scope.editSavedFeature = true;
    };

    $scope.saveFeature = function () {




        if($scope.objType === 'circle'){

	    	if($scope.objProperty.name == undefined){
	    		alert("name을 입력해주세요");
	    		return;
	    	}

	        featureToSave.setProperties(
	        	{
	        		type: $scope.objProperty.obj ,
	        		name: $scope.objProperty.name ,
	        		//radius: $scope.objProperty.radius ,
	        		groundRadius: $scope.objProperty.groundRadius ,
	        		center: convert4326To3857($scope.objProperty.centerPoint) ,
	        		lowerHeight: $scope.objProperty.alt1 ,
	        		upperHeight: $scope.objProperty.alt2
	        	}
	        );
	        
            console.log('saveObject::circle');
            console.log(featureToSave);
            console.log($scope.objProperty.centerPoint);

            if($scope.editSavedFeature === false){
				var objjson = mapService.saveObject(featureToSave);
				objSrv.postObject($scope.objProperty.obj, objjson, function(){
					if(($scope.airzoneOn == false && objectDrawType === "airzone")
					|| ($scope.obstacleOn == false && objectDrawType === "obstacle")
						){
						$scope.viewObjects(objectDrawType);
					}			
				});


            } else {
                var objjson = mapService.updateObject(featureToSave);
                console.log('inside mapsetting client for update circle', objjson);
                objSrv.updateObject($scope.objProperty.obj, objjson);


            }

        } else if($scope.objType === 'polygon'){

	    	if($scope.objProperty.name == undefined){
	    		alert("name을 입력해주세요");
	    		return;
	    	}

	        featureToSave.setProperties(
	        	{
	        		type: $scope.objProperty.obj ,
	        		name: $scope.objProperty.name ,
	        		lowerHeight: $scope.objProperty.alt1 ,
	        		upperHeight: $scope.objProperty.alt2
	        	}
	        );
			featureToSave.getGeometry().setCoordinates([convert4326To3857($scope.objProperty.locList)]);

            console.log('saveObject::polygon');
            console.log(featureToSave);
            console.log($scope.objProperty.locList);

            if($scope.editSavedFeature === false){
				var objjson = mapService.saveObject(featureToSave);
				objSrv.postObject($scope.objProperty.obj, objjson, function(){
					if(($scope.airzoneOn == false && objectDrawType === "airzone")
					|| ($scope.obstacleOn == false && objectDrawType === "obstacle")
						){
						$scope.viewObjects(objectDrawType);
					}			
				});

            } else {
                var objjson = mapService.updateObject(featureToSave);
                console.log('inside mapsetting client for update polygon', objjson);
                objSrv.updateObject($scope.objProperty.obj, objjson);
            }

        } else if ($scope.objType === 'point'){

	    	if($scope.objProperty.name == undefined){
	    		alert("name을 입력해주세요");
	    		return;
	    	}

	        featureToSave.setProperties(
	        	{
	        		type: $scope.objProperty.obj ,
	        		name: $scope.objProperty.name ,
	        		locList: convert4326To3857($scope.objProperty.centerPoint) ,
	        		lowerHeight: $scope.objProperty.alt1 ,
	        		upperHeight: $scope.objProperty.alt2
	        	}
	        );
			featureToSave.getGeometry().setCoordinates(convert4326To3857($scope.objProperty.centerPoint));

            if($scope.editSavedFeature === false){
				var objjson = mapService.saveObject(featureToSave);
				objSrv.postObject($scope.objProperty.obj, objjson, function(){
					if(($scope.airzoneOn == false && objectDrawType === "airzone")
					|| ($scope.obstacleOn == false && objectDrawType === "obstacle")
						){
						$scope.viewObjects(objectDrawType);
					}			
				});

            } else {
                var objjson = mapService.updateObject(featureToSave);
                console.log('inside mapsetting client for update Point', objjson);
                objSrv.updateObject($scope.objProperty.obj, objjson);
            }

        } else if ($scope.objType === 'camera'){

            var selectedDevice;
            for (var idx in $scope.deviceList) {
                if ($scope.deviceList[idx].name == $scope.objProperty.selectedDevice) {
                    selectedDevice = $scope.deviceList[idx];
                }
            }

/*	        featureToSave.setProperties(
	        	{
	        		id: selectedDevice.id ,
	        		name: selectedDevice.name ,
	        		angle: selectedDevice.angle ,
	        		//ip: selectedDevice.ip ,
	        		type: selectedDevice.type ,
	        		coordinateInfo: selectedDevice.coordinateInfo
	        	}
	        );
            featureToSave.getGeometry().setCoordinates(convert4326To3857($scope.objProperty.locList));*/

            if (selectedDevice) {
                selectedDevice.angle = $scope.objProperty.angle;
                selectedDevice.coordinateInfo.coordinate = convert4326To3857($scope.objProperty.locList);
            }

            if($scope.editSavedFeature === false){
                if (selectedDevice) {
                    //var objjson = mapService.saveDevice(featureToSave);
                    deviceSrv.updateCamera(selectedDevice);
                    $scope.viewObjects(objectDrawType);

                }

            } else {
                //alert('Update completed!!');
            }

        } else if ($scope.objType === 'sensor') {

            var selectedDevice;
            for (var idx in $scope.deviceList) {
                if ($scope.deviceList[idx].name == $scope.objProperty.selectedDevice) {
                    selectedDevice = $scope.deviceList[idx];
                }
            }

/*	        featureToSave.setProperties(
	        	{
	        		id: selectedDevice.id ,
	        		name: selectedDevice.name ,
	        		angle: selectedDevice.angle ,
	        		//ip: selectedDevice.ip ,
	        		type: selectedDevice.type ,
	        		coordinateInfo: selectedDevice.coordinateInfo
	        	}
	        );
            featureToSave.getGeometry().setCoordinates(convert4326To3857($scope.objProperty.locList));*/

            if (selectedDevice) {
                selectedDevice.angle = $scope.objProperty.angle;
                selectedDevice.coordinateInfo.coordinate = convert4326To3857($scope.objProperty.locList);
            }


            if($scope.editSavedFeature === false){

                if (selectedDevice) {
                    //var objjson = mapService.saveDevice(featureToSave);
                    deviceSrv.updateSensor(selectedDevice);
                    $scope.viewObjects(objectDrawType);
                }

            } else {
                //alert('Update completed!!');
            }

        }



		//temp
		$scope.showObjProperty = false;
        $scope.editSavedFeature = false;

		popupFormInit();   
				
		//button control
		saveObjectButton();     

        if ($scope.DRAGABLE_STATUS === false) {
            mapService.mapMotion(0);
        }

    }

    $scope.deleteFeature = function () {
        console.log('pushed delete button');


		var reset = false;

        for(var layerIndex in TEMPeditableLayer){
            mapService.deleteObjectFromLayer(TEMPeditableLayer[layerIndex], featuresTodelete);
            for(var index in featuresTodelete){
                reset = true;
                if (featuresTodelete[index].values_.type === 'camera') {
                    var data = featuresTodelete[index].values_;
                    delete data['geometry'];
                    data.coordinateInfo = {
                        type: 'point',
                        coordinate: undefined
                    }
                    deviceSrv.updateCamera(data);
                } else if(featuresTodelete[index].values_.type === 'sensor') {
                    var data = featuresTodelete[index].values_;
                    delete data['geometry'];
                    data.coordinateInfo = {
                        type: 'point',
                        coordinate: undefined
                    }
                    deviceSrv.updateSensor(data);
                } else {
                    objSrv.deleteObject(featuresTodelete[index]);
                }
            }
        }


        if(reset){            
            featuresTodelete = [];
            $scope.editSavedFeature = false;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }

        //button control
        if(TEMPeditableLayer.length == 0){
        	initObjectNoneButton();
        }else{
        	initObjectMoreThanOneButton();
        }

    }

    $scope.cancleEditFeature = function(){
        $scope.editSavedFeature = false;

        popupFormInit();
        buttonStatusInit();
    };

    $scope.cancleObjPropertyModal = function(){

        $scope.selectedOne = false;
        $scope.editSavedFeature = false;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

        popupFormInit();

    	//button control
    	initObjectMoreThanOneButton();

        if ($scope.DRAGABLE_STATUS === false) {
            $scope.showObjProperty = false;
            mapService.mapMotion(0);
            //currentLayer.getSource().removeFeature(featureToSave);

            if($scope.EDIT_BUTTON == false){
            	currentLayer.getSource().removeFeature(featureToSave);
            }else{
		        for(var layerIndex in TEMPeditableLayer){
		            TEMPeditableLayer[layerIndex].getSource().removeFeature(featureToSave);
		        }


	             $scope.viewObjects(featureToSave.getProperties().type);
	             $scope.viewObjects(featureToSave.getProperties().type);
            }


        }

    };

    $scope.openLocationInfo = function(){
        ($scope.locationInfo == false)? $scope.locationInfo = true : $scope.locationInfo = false;
    };


   $scope.openMapSettingModal = function(){
        $scope.mapSettingModalOpen = true;

        var gpsMode = mapService.getGpsMode();
        var mapInfo = mapService.getMapInfo();
        // console.log('gspMode==>>', gpsMode);
        console.log('mapInfo==>>', mapInfo);
        
        $scope.locationType = gpsMode;

        $scope.mapSetting_lat = mapInfo.center[0];
        $scope.mapSetting_lng = mapInfo.center[1];
        $scope.mapSetting_zoomLevel = mapInfo.zoomLevel;
        
        //temp data
        $scope.mapSetting_map_id = 1;
        $scope.mapSetting_user_id = 1;
        $scope.mapSetting_zoomRange = [];
        $scope.mapSetting_zoomRange2 = [];
         
        
        for(var i=1; i <=20; i+=1){
            $scope.mapSetting_zoomRange.push(i);
        }

        for(var i=1; i<= 20; i+=1){
            $scope.mapSetting_zoomRange2.push(i);
        }
        
        $scope.mapSetting_zoomMin = mapInfo.minZoom;
        $scope.mapSetting_zoomMax = mapInfo.maxZoom;
        
    };

    $scope.setMap = function () {
        console.log($scope.locationType);

        mapService.setGpsMode($scope.locationType);
      	var mapData = {
            center: [$scope.mapSetting_lat, $scope.mapSetting_lng],
            level: $scope.mapSetting_zoomLevel,
            map_id: $scope.mapSetting_map_id,
            user_id: $scope.mapSetting_user_id,
            max_level: $scope.mapSetting_zoomMax,
            min_level: $scope.mapSetting_zoomMin
        }
        console.log('mapData==>>', mapData);
        mapService.setMapView(mapData);

        var objjson = mapService.setMap(mapData);
        objSrv.postObject('map', objjson);
   
        $scope.closeMapSettingModal();
    };

    /**
    * MapSetting Modal Close
    */
    $scope.closeMapSettingModal = function(){
        $scope.mapSettingModalOpen = false;
    };

    $scope.minZoomChange = function(){
        $scope.mapSetting.zoomRange2 = [];
        for(var i=$scope.mapSetting.zoomMin+1; i<19; i++){
            $scope.mapSetting.zoomRange2.push(i);
        }
    };

	// airzone, obstacle  class on off
    $scope.objectClassInit = function(){
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




















}
]);

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