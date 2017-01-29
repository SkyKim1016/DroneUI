kindFramework.controller('letdroneCtrl', function ($scope, $rootScope, $state, $interval, mapService, colorpicker) {

/*
*	Main Wrapper Controller
*	Controlls the Header & Footer
*/

	// Initialization
	$scope.cameraModal = false;		// show/hide camera modal
	$scope.footerHide = false;		// show/hide footer
	$scope.gnbHide = false;			// show/hide GNB
    $scope.gnbPlanHide = false;     // show/hide GNB/Plan
    $scope.mainViewArea = true;     // show/hide Main content

    $scope.satellites_count = 0;
    $scope.battery = 0;
    $scope.gpsStatus = 'None';
    $scope.batteryStatus = 'None';
    $scope.wirelessStatus = 'None';
    $scope.deviceConnection = 'None';


    $scope.$on('scrollbar.show', function(){
      console.log('Scrollbar show');
    });

    $scope.$on('scrollbar.hide', function(){
      console.log('Scrollbar hide');
    });

    /************* Guage controlls *************/
    // baseInfo

    var heartbeatListener = function(topic, data){
        var msg = JSON.parse(data);

        // base_mode와 custom_mode를 이용하여 mode & state 정의 필요.
        $scope.droneArmState = msg.base_mode;
        $scope.droneState = msg.custom_mode;

        // $HEARTBEAT이 들어오면 장비가 연결되었다고 판단한다.
        $scope.gaugeData.deviceConnection = 'Connected';
        $scope.$apply();
    }
        
     var attitudeListener = function(topic, data){
         var msg = JSON.parse(data);
 //        $scope.roll = (msg.roll * 180 / 3.14).toFixed(0);
 //        $scope.pitch = (msg.pitch * 180 / 3.14).toFixed(0);
 //        $scope.yaw = (msg.yaw * 180 / 3.14).toFixed(0);
         $scope.rollGaugeData.label = (msg.roll * 180 / 3.14).toFixed(0);
         $scope.pitchGaugeData.label = (msg.pitch * 180 / 3.14).toFixed(0);
         $scope.directionGaugeData.label = (msg.yaw * 180 / 3.14).toFixed(0);
         $scope.$apply();
        
     };    
    
    var altitudeListener = function(topic, data){
        var msg = JSON.parse(data);
        //        $scope.alt = msg.relative_alt;        
        if(msg.relative_alt < 0){
            $scope.altitudeData.label = 0.00001;
        }
        else{
            $scope.altitudeData.label = msg.relative_alt * 0.001;    
        }
        
		$scope.$apply();
    };
    

    var batteryListener = function(topic, data){
        var msg = JSON.parse(data);
//        $scope.battery = msg.battery_remaining;  
        $scope.gaugeData.battery = msg.battery_remaining;

        var batteryText = ['None', 'Bad', 'Normal', 'Good'];
        var range = 34;

        // Battery Status
        if (msg.battery_remaining > 0) {
            $scope.gaugeData.batteryStatus = batteryText[parseInt(msg.battery_remaining / range) + 1];
        } 
        else {
            $scope.gaugeData.batteryStatus = batteryText[0];
        }

        $scope.$apply();
    };

    var hudListener = function(topic, data){
        var msg = JSON.parse(data);
//        $scope.vSpeed = msg.climb.toFixed(4);        
//        $scope.gSpeed = msg.groundspeed.toFixed(4);
        if(msg.climb < 0){
            $scope.verticalSpeedData.label = 0.00001;
        }
        else {
            $scope.verticalSpeedData.label = msg.climb.toFixed(4);    
        }
        
        if(msg.groundspeed < 0){
            $scope.groundSpeedData.label = 0.00001;
        }
        else{
            $scope.groundSpeedData.label = msg.groundspeed.toFixed(4);    
        }
        
        $scope.$apply();
    };
    
    var gpsListener = function(topic, data){
        var msg = JSON.parse(data);
        var gpsText = ['None', 'Bad', 'Normal', 'Good'];
        var range = 3;

//        $scope.satellites_count = msg.satellites_visible;  
        $scope.gaugeData.satellites_count = msg.satellites_visible;  

        // GPS Status (0-3 -> Bad, 4-8, Normal, 8- -> Good)
        if (msg.satellites_visible > 0) {
            var level = parseInt(msg.satellites_visible / range);
            $scope.gaugeData.gpsStatus = level >= range ? gpsText[range] : gpsText[level];
        } 
        else {
            $scope.gaugeData.gpsStatus = gpsText[0];
        }
        $scope.$apply();
    };

    var deviceDisconnectedListener = function(){
        // $DEVICE_DISCONNECTED이 들어오면 장비 연결이 되지 않았다고 판단한다.
        $scope.gaugeData.deviceConnection = 'Disconnected';
        $scope.$apply();
    }

    // Weather
    $scope.weatherInit = (function(){
        $scope.weather = {};
        var weatherListener = function(topic, data){
            var msg = JSON.parse(data);
        //        {hum: hum, temp: temp, windS: windS, windD: windD, sky: sky}
            console.log('received weather!');
            $scope.weather = msg;
            $scope.weather.temp = msg.temp.toFixed(1);
            $scope.weather.windS = msg.windS.toFixed(1);
            $scope.$apply();
        }

        //var mqtt = StatusManager.getInstance();
       // mqtt.subscribe('WEATHER/PUBLISH/LIVE_WEATHER/+/?/?');
       // mqtt.on('WEATHER/PUBLISH/LIVE_WEATHER/+/?/?', weatherListener);  
        
        console.log('Init Weather!');
    })();
    
    // Temporary    
	// Watch drone posture status
    $scope.$watch('selected_drone_id', function(nv, ov){
       	//console.log('selected_drone_id:', ov , ', new:', nv) ;
        if(ov !== nv){
            var mqtt = StatusManager.getInstance();

            // 어떤 부작용이 있을지 몰라 unsubscribe 하지 않겠음.
            // mqtt.unsubscribe('DRONE/PUBLISH/HEARTBEAT/'+ov+'/?/?');
            // mqtt.unsubscribe('DRONE/PUBLISH/ATTITUDE/'+ov+'/?/?');
            // mqtt.unsubscribe('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+ov+'/?/?');
            // mqtt.unsubscribe('DRONE/PUBLISH/SYS_STATUS/'+ov+'/?/?');
            // mqtt.unsubscribe('DRONE/PUBLISH/VFR_HUD/'+ov+'/?/?');
            // mqtt.unsubscribe('DRONE/PUBLISH/GPS_RAW_INT/'+ov+'/?/?');
            // mqtt.unsubscribe('DRONE/PUBLISH/DEVICE_DISCONNECTED/'+ov+'/?/?');

            mqtt.off('DRONE/PUBLISH/HEARTBEAT/'+ov+'/?/?', heartbeatListener);
            mqtt.off('DRONE/PUBLISH/ATTITUDE/'+ov+'/?/?', attitudeListener);
            mqtt.off('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+ov+'/?/?', altitudeListener);
            mqtt.off('DRONE/PUBLISH/SYS_STATUS/'+ov+'/?/?', batteryListener);
            mqtt.off('DRONE/PUBLISH/VFR_HUD/'+ov+'/?/?', hudListener);
            mqtt.off('DRONE/PUBLISH/GPS_RAW_INT/'+ov+'/?/?', gpsListener);
            mqtt.off('DRONE/PUBLISH/DEVICE_DISCONNECTED/'+ov+'/?/?', deviceDisconnectedListener);
            
            mqtt.subscribe('DRONE/PUBLISH/HEARTBEAT/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/ATTITUDE/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/SYS_STATUS/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/VFR_HUD/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/GPS_RAW_INT/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/DEVICE_DISCONNECTED/'+nv+'/?/?');
            
            mqtt.on('DRONE/PUBLISH/HEARTBEAT/'+nv+'/?/?', heartbeatListener);
            mqtt.on('DRONE/PUBLISH/ATTITUDE/'+nv+'/?/?', attitudeListener);
            mqtt.on('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+nv+'/?/?', altitudeListener);
            mqtt.on('DRONE/PUBLISH/SYS_STATUS/'+nv+'/?/?', batteryListener);
            mqtt.on('DRONE/PUBLISH/VFR_HUD/'+nv+'/?/?', hudListener);
            mqtt.on('DRONE/PUBLISH/GPS_RAW_INT/'+nv+'/?/?', gpsListener);
            mqtt.on('DRONE/PUBLISH/DEVICE_DISCONNECTED/'+nv+'/?/?', deviceDisconnectedListener);
        }
    });

    $scope.$on('selected_drone', function(event, drone){
        $scope.selected_drone_id = drone;
    });

    //*** Gauge directive data ***//
    $scope.rollGaugeData = { 
    	label: $scope.roll || 0 
    };

    $scope.pitchGaugeData = { 
    	label: $scope.pitch || 0 
    };

	$scope.directionGaugeData = { 
		label: $scope.yaw || 0 
	};
    $scope.verticalSpeedData = {
        label: $scope.aSpeed || 0,
        maxValue: 100
    };
    $scope.groundSpeedData = {
        label: $scope.gSpeed || 0,
        maxValue: 100
    };
    $scope.altitudeData = {
        label: $scope.alt || 0,
        maxValue: 100
    };



/*    var count = 1;
    $interval(function(){
        $scope.rollGaugeData.label += count;
        $scope.pitchGaugeData.label += count;
        count++;

        console.log($scope.rollGaugeData.label);
        console.log($scope.pitchGaugeData.label);

    }, 2000);*/



    // Watch drone vertical speed
    $scope.$watch('verticalSpeedData', function (newValue, oldValue) {        
        newValue.percentage = newValue.label / (100 * $scope.verticalSpeedData.maxValue / 75);
    }, true);

    // Watch drone ground speed
    $scope.$watch('groundSpeedData', function (newValue, oldValue) {        
        newValue.percentage = newValue.label / (100 * $scope.groundSpeedData.maxValue / 75);
    }, true);

    // Watch drone altitude speed
    $scope.$watch('altitudeData', function (newValue, oldValue) {        
        newValue.percentage = newValue.label / (100 * $scope.altitudeData.maxValue / 75);
    }, true);

    // Watch drone direction 
    $scope.$watch('directionGaugeData', function (newValue, oldValue) {
        newValue.percentage = newValue.label;
    }, true);
	
    // Watch drone roll 
	$scope.$watch('rollGaugeData', function (newValue, oldValue) {
        newValue.percentage = newValue.label;
        //console.log(newValue.percentage);
    }, true);

	// Watch drone pitch 
	$scope.$watch('pitchGaugeData', function (newValue, oldValue) {
        newValue.percentage = newValue.label;
    }, true);


    //*** Drone Guage Collection ***//
	$scope.gaugeData = {
		gps: $scope.satellites_count,
		battery: $scope.battery,
        gpsStatus: $scope.gpsStatus,
        batteryStatus: $scope.batteryStatus,
        wirelessStatus: $scope.wirelessStatus,

		vs: $scope.verticalSpeedData,
		gs: $scope.groundSpeedData,
		alt: $scope.altitudeData,
		roll: $scope.rollGaugeData,
		pitch: $scope.pitchGaugeData,
		yaw: $scope.directionGaugeData,
        deviceConnection: $scope.deviceConnection
	};

    /************* Header Icon Controll *************/
    $scope.getConnectionStatus = function(){
        if (!$scope.gaugeData.deviceConnection) {
            return "cnNone";
        }
        return "cn" + $scope.gaugeData.deviceConnection;
    }

    $scope.getGpsStatus = function(){
        if (!$scope.gaugeData.gpsStatus) {
            return "gpsNone";
        }
        return "gps" + $scope.gaugeData.gpsStatus;
    }

    $scope.getWirelessStatus = function(){
        if (!$scope.gaugeData.gpsStatus) {
            return "cnNone";
        }
        return "nt" + $scope.gaugeData.wirelessStatus;
    }

    $scope.getBatteryStatus = function(){   
        if (!$scope.gaugeData.gpsStatus) {
            return "btNone";
        }  
        return "bt" + $scope.gaugeData.batteryStatus;
    }

    $scope.getWindDirection = function() {

        if (!$scope.weather.windD) {
            return "wdNE";
        }

        return "wd" + $scope.weather.windD;
    }

    $scope.getWeatherSky = function() {
        if (!$scope.weather.sky) {
            return "sunny";
        }
        return $scope.weather.sky;
    }

	/************* Footer controlls *************/
	// Opens camera modal
	$scope.viewCameraModal = function(){
		
		if($scope.video == true && $scope.flight_video == true && $scope.cameraModal == true){
				$scope.video = false;
				$scope.flight_video = false;
                
		} else if($scope.video == true || $scope.flight_video == true){
			$scope.video = false;
			$scope.flight_video = false;
			$scope.cameraModal = false;
          
		} else {
			($scope.cameraModal == true) ? $scope.cameraModal = false : $scope.cameraModal = true;            
            
                $('.btnViewCamera').removeClass('on').text("Camera");
                $scope.mainViewArea = true;
                $scope.cameraViewArea  = false;                         
          
		}
		
	};

	// Closes view camera modal
	$scope.viewCameraModalClose = function(type){
		if(type == "flight_video"){
			$scope.flight_video = true;
		} else if(type == "video"){
			$scope.video = true;
		}
	};


    

    // message popup //
    $scope.messagePop = function(){
    $scope.$broadcast('rebuild:me');
        $('.messageBox').show();
        $('.num').hide();
    };
    $scope.messageClose = function(){
        $('.messageBox').hide();        
    };

   
    $scope.droneConDisplay = function(){         
        ($scope.droneConOpen == true) ? $scope.droneConOpen = false : $scope.droneConOpen = true; 
    };


    // Drone Control popup //    
     $scope.droneCon = function(){
        // 개발후 삭제
        $('.btnReturn').click(function(){
            $('.conBtn').hide();$('.btnPlay').show();                       
        });
         // 개발후 삭제

        $('.conBtn button').click(function(){
            $('.conBtn button').removeClass('on');
            $(this).addClass('on');            
        });
        $('.btnStop').click(function(){
            $('.btnPlay button').removeClass('on');
            $(this).addClass('on');

        });
        $('.btnPauseRes').click(function(){ 
            $('.btnStop').removeClass('on');
            if ($('.btnPauseRes').is('.on')){
                $('.btnPauseRes').removeClass('on').text("Pause");                                
            }else{
                $('.btnPauseRes').addClass('on').text("Resume"); 
            }         
        });
   };

     $scope.takeOpen = function(){        
     ($scope.takeOpenLayer == true) ? $scope.takeOpenLayer = false : $scope.takeOpenLayer = true; 
      var dimedH = $(document).height();    
        $('.dimed').css('height',dimedH);      
    };

    $scope.flightOpen = function(){        
     ($scope.flightOpenLayer == true) ? $scope.flightOpenLayer = false : $scope.flightOpenLayer = true;
      var dimedH = $(document).height();    
        $('.dimed').css('height',dimedH);       
    };
    
    // Drone Control popup // 


	/************* Header controlls *************/
	// Redirects to main
	$scope.goToMain = function(){
       var controls = {
                    zoomSlider: true,
                    scaleLine: true,
                    zoom: true,
                    miniMap: true
                }

        $state.go('letdrone.main');
        $scope.footerHide = false;
        $scope.gnbClose();

        mapService.setMapControl(controls);
            
        // Todo check!!
        // Initialization
            $('.btnViewCamera').removeClass('on').text("Camera");
			$scope.cameraModal = false;   
//        $scope.cameraModal = false;		// show/hide camera modal
//        $scope.footerHide = false;		// show/hide footer
//        $scope.gnbHide = false;			// show/hide GNB
//        $scope.gnbPlanHide = false;     // show/hide GNB/Plan
	};


	$scope.gnbView = function(){
		$scope.gnbHide = true;
          $('nav > div').fadeOut('fast');$('.gnbMain').fadeIn('fast');  
        var dimedH = $(document).height();    
        $('.dimed').css('height',dimedH);
        $('.iframebox').css('height',dimedH);
	};

	$scope.gnbClose = function(){
		$scope.gnbHide = false;
	};

    $scope.gnbBack = function(){
       // ($scope.gnbPlanHide == false) ? $scope.gnbPlanHide = true : $scope.gnbPlanHide = false;
       $('nav > div').fadeOut('fast');$('.gnbMain').fadeIn('fast');
    };

    $scope.gnbPlan = function(){
       // ($scope.gnbPlanHide == false) ? $scope.gnbPlanHide = true : $scope.gnbPlanHide = false;
       $('.gnbMain').fadeOut('fast');$('.gnbPlan').fadeIn('fast');
    };

    $scope.gnbReport = function(){
       // ($scope.gnbReportHide == false) ? $scope.gnbReportHide = true : $scope.gnbReportHide = false;
       $('.gnbMain').fadeOut('fast');$('.gnbReport').fadeIn('fast');
    };

    $scope.gnbSetting = function(){
       // ($scope.gnbReportHide == false) ? $scope.gnbReportHide = true : $scope.gnbReportHide = false;
       $('.gnbMain').fadeOut('fast');$('.gnbSetting').fadeIn('fast');
    };



	// Redirect to way point
	$scope.goToWaypoint = function(){
		$state.go('letdrone.main/waypoint');
		$scope.footerHide = true;
        $scope.gnbPlan();
        $scope.gnbClose();
	};

    $scope.goToScenario = function(){
        $state.go('letdrone.main/scenario');
        $scope.footerHide = true;
        $scope.gnbPlan();
        $scope.gnbClose();
    };

    $scope.goToSetting = function(){
        $state.go('letdrone.main/deviceManager');
        $scope.footerHide = true;
        $scope.gnbPlan();
        $scope.gnbClose();
    };


    //go to device manager page
    $scope.goToDeviceManager = function(){
        $state.go('letdrone.main/deviceManager');
        $scope.footerHide = false;
        $scope.gnbClose();
    };

    $scope.goToMapSetting = function(){
        $state.go('letdrone.main/mapsetting');
        $scope.footerHide = false;
        $scope.gnbClose();
    };

        // Closes camera modal & redirect to main/camera
    $scope.goToCameraView = function(){
        $state.go('letdrone.main');
        $scope.mainViewArea = false;
        $scope.cameraViewArea = true; 
        $('.btnViewCamera').addClass('on').text("Map View");
        $scope.gnbClose();     

    };

   $scope.goToCamera = function(){
       ($scope.cameraViewArea == true) ? $scope.cameraViewArea = false : $scope.cameraViewArea = true;
        $scope.mainViewArea = false;
        $scope.footerHide = false;
        $scope.video = false;
        $scope.flight_video = false;
        $('.btnViewCamera').addClass('on').text("Map View");
        $scope.gnbClose();
       // mapService.removeAllMapControl();
    };

	if($state.is('letdrone.main/waypoint')){
		$scope.footerHide = true;
	} else if($state.is('letdrone.main/mapsetting')){
        $scope.footerHide = true;
    }else {
		$scope.footerHide = false;
	}


/***************************************************************/
/*                        Camera View                          */
/***************************************************************/
 $scope.dayMight = function (){

       $('.day').click(function(){
            $('.day, .night').removeClass("on");
            $('.day').addClass("on"); 
       });
       $('.night').click(function(){
            $('.day, .night').removeClass("on");
            $('.night').addClass("on"); 
       }); 
       
    };

    $scope.switchView = function (view){
        console.log(view);

        var mainView = $("#mainView").children();
        var smallView = $("#smallView dd").children();

        mainView.detach();


        $(mainView).appendTo("#smallView dd");
        $(smallView).appendTo("#mainView");

    };




    function refreshSwatch(ev, ui) {
        var red = $scope.colorpicker.red,
            green = $scope.colorpicker.green,
            blue = $scope.colorpicker.blue;
            colorpicker.refreshSwatch(red, green, blue);
    }

    $scope.slider = {
        'options': {
            start: function(event, ui) {
                $log.info('Event: Slider start - set with slider options', event);
            },
            stop: function(event, ui) {
                $log.info('Event: Slider stop - set with slider options', event);
            }
        }
    };

     $scope.colorpicker = {
        red: 255,
        green: 140,
        blue: 0,
        blue2: 0,
        options: {
            orientation: 'horizontal',
            min: 0,
            max: 255,
            range: 'min',
            change: refreshSwatch,
            slide: refreshSwatch
        }
    };

    /***************************************************************/
    /*                      TEST CODE START                        */
    /***************************************************************/
    $scope.doTakeoff = function(){
        var topic = 'DRONE/PUBLISH/COMMAND/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        var data = {alt: 100};
        mqtt.publish( topic, JSON.stringify({command:'takeoff', params:data}));
    };

    $scope.doLand = function(){
        console.log('doLand');
        var topic = 'DRONE/PUBLISH/COMMAND/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        var data = {lat: 0, lon: 0};
        mqtt.publish( topic, JSON.stringify({command:'land', params:data}));
    };

    $scope.doHover = function(){
        console.log('doHover');
        var topic = 'DRONE/PUBLISH/COMMAND/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        mqtt.publish( topic, JSON.stringify({command:'hover', params:$scope.selected_drone_id}));
    };

    $scope.goto = function(){
        console.log('goto');
        var topic = 'DRONE/PUBLISH/COMMAND/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        var data = {x: -35.370435, y: 149.171730, z: 100};
        mqtt.publish( topic, JSON.stringify({command:'goto', params:data}));
    };

    $scope.doRth = function(){
        console.log('doRth');
        var topic = 'DRONE/PUBLISH/COMMAND/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        mqtt.publish( topic, JSON.stringify({command:'home', params:$scope.selected_drone_id}));
    };

    $scope.downLoadMission = function(){
        console.log('downLoadMission');
        var topic = 'DRONE/PUBLISH/REQUEST/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        mqtt.publish( topic, JSON.stringify({command:'downLoadMission', params:$scope.selected_drone_id}));
    };

    $scope.upLoadMission = function(){
        console.log('upLoadMission');
        var topic = 'DRONE/PUBLISH/REQUEST/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        var data = [
            {  'target_system' : 1,
               'target_component' : 1,
               'seq' : 0,
               'frame' : 0,
               'command' : 16,
               'current' : 0,
               'autocontinue' : 1,
               'param1' : 0,
               'param2' : 0,
               'param3' : 0,
               'param4' : 0,
               'x' : -35.9098,
               'y' : 148.5043,
               'z' : 100},
            {  'target_system' : 1,
               'target_component' : 1,
               'seq' : 1,
               'frame' : 0,
               'command' : 16,
               'current' : 0,
               'autocontinue' : 1,
               'param1' : 0,
               'param2' : 0,
               'param3' : 0,
               'param4' : 0,
               'x' : -35.9198,
               'y' : 148.5043,
               'z' : 90},
            {  'target_system' : 1,
               'target_component' : 1,
               'seq' : 2,
               'frame' : 0,
               'command' : 16,
               'current' : 0,
               'autocontinue' : 1,
               'param1' : 0,
               'param2' : 0,
               'param3' : 0,
               'param4' : 0,
               'x' : -35.9298,
               'y' : 148.5043,
               'z' : 80}
            ];
        mqtt.publish( topic, JSON.stringify({command:'upLoadMission', params:data}));
    };

    $scope.startMission = function(){
        console.log('downLoadMission');
        var topic = 'DRONE/PUBLISH/COMMAND/' + $scope.selected_drone_id + '/?/?';
        var mqtt = StatusManager.getInstance();
        mqtt.publish( topic, JSON.stringify({command:'startMission', params:$scope.selected_drone_id}));
    };

    $scope.openDebugProtocolPanel = function(){
        console.log('openDebugProtocolPanel');
        $('.debug_protocol_panel').show();
    }

    $scope.closeDebugProtocolPanel = function(){
        $('.debug_protocol_panel').hide();
    }

    $scope.paramVal = {
        requestParamID : 'TERRAIN_SPACING',
        requestParamValue : 100
    };

    $scope.publishRequestGetParamList = function(){
        var mqtt = StatusManager.getInstance();
        var topic = 'DRONE/PUBLISH/REQUEST/171/?/?';
        var msg = {
            command : 'request_get_param_list'
        };
        
        mqtt.publish(topic, JSON.stringify(msg), {qos:1});
        console.log('publishRequestGetParamList', msg);
    }

    $scope.publishRequestSetParamList = function(){
        var mqtt = StatusManager.getInstance();
        var topic = 'DRONE/PUBLISH/REQUEST/171/?/?';
        var msg = {
            command : 'request_set_param_list'
        };
        
        mqtt.publish(topic, JSON.stringify(msg), {qos:1});
        console.log('publishRequestSetParamList', msg);   
    }  

    $scope.publishRequestModifyParam = function(){

        var mqtt = StatusManager.getInstance();
        var topic = 'DRONE/PUBLISH/REQUEST/171/?/?';
        var msg = {
            command : 'request_debug_param_modification',
            param_id : $scope.paramVal.requestParamID,
            param_value : parseInt($scope.paramVal.requestParamValue)
        };
        
        mqtt.publish(topic, JSON.stringify(msg), {qos:1});
        console.log('publishRequestModifyParam', msg);   
    }



    /***************************************************************/
    /*                      TEST CODE END                          */
    /***************************************************************/



    /************* Tesing tobe deleted *************/

    //var myScroll = new IScroll('#wrapper');
  



});

kindFramework.factory('colorpicker', function() {
    function hexFromRGB(r, g, b) {
        var hex = [r.toString(16), g.toString(16), b.toString(16)];
        angular.forEach(hex, function(value, key) {
            if (value.length === 1)
                hex[key] = "0" + value;
        });
        return hex.join('').toUpperCase();
    }
    return {
        refreshSwatch: function(r, g, b) {
            var color = '#' + hexFromRGB(r, g, b);
            angular.element('#swatch').css('background-color', color);
        }
    };
});
