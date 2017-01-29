kindFramework.controller('letdroneMainCtrl', ['$interval', '$scope', '$rootScope', 'mapService', 'LetDroneDeviceService'
											  , function ($interval, $scope, $rootScope, mapService, LetDroneDeviceService) {
		// Initialization
		$scope.listMenu = false;
		$scope.listObject = false;
		$scope.listDrone = false;
		$scope.listCamera = false;
		$scope.listSensor = false;

		// Toggle List Button
		$scope.listBtnClick = function () {
			($scope.listMenu == false) ? $scope.listMenu = true: $scope.listMenu = false;
			if ($scope.listMenu == false) {
				$scope.listMenuReset();
			}
            else{
                $('.btnConnect').hide();
                $(".slideBtnBox").hide();
            }
		};

		// Resets the menu status
		$scope.listMenuReset = function () {
			$scope.listObject = false;
			$scope.listDrone = false;
			$scope.listCamera = false;
			$scope.listSensor = false;

			$('.listMenu').removeClass('on');
			$('.btnObject').removeClass('on');
			$('.btnDrone').removeClass('on');
			$('.btnCamera').removeClass('on');
			$('.btnSensor').removeClass('on');
		}

		  $scope.advanceClose = function(){
        $('#advancelLayer').hide();        
	    };
	    $scope.adcanSet = function(){
	        $('#advancelLayer').show();        
	    };
	    $scope.connectClose = function(){
	        $('.connectionLayer').hide();        
	    };
	    $scope.connectOpen = function(){
	        $('.connectionLayer').show();        
	    };
		
		//drone slide set
		var baseNum = 1 ;
	    $scope.ShiftRight = function(){
	    	
	        var boxNum = $('div.droneBox ul').size();
			var droneBoxW = boxNum*320 +'px';
			$('.droneBox').css('width', droneBoxW );
			$('.slideBtnBox span').text(boxNum); 

	        if(baseNum < boxNum){ 
	            $(".droneBox").animate({left:"-=320"}, 800);
	            baseNum++;	          
	        }
	         $('.slideBtnBox span').text(baseNum); 
	    };
	    $scope.ShiftLeft = function(){
	    	
	        var boxNum = $('div.droneBox ul').size();					
			var droneBoxW = boxNum*320 +'px';
			$('.droneBox').css('width', droneBoxW );
	        if(baseNum > 1){  
	            $(".droneBox").animate({left:"+=320"}, 800);
	            baseNum--;	            
	          } 
	          $('.slideBtnBox span').text(baseNum);
	    };

	    var baseNum2 = 1 ;
	    $scope.ShiftRightA = function(){
	    	
	        var boxNum2 = $('div.droneBoxA ul').size();
			var droneBoxAW = boxNum2*665 +'px';
			$('.droneBoxA').css('width', droneBoxAW );
			$('.slideBtnBoxA span').text(boxNum2); 

	        if(baseNum2 < boxNum2){ 
	            $(".droneBoxA").animate({left:"-=665"}, 800);
	            baseNum2++;	          
	        }
	         $('.slideBtnBoxA span').text(baseNum2); 
	    };
	    $scope.ShiftLeftA = function(){
	    	
	        var boxNum2 = $('div.droneBoxA ul').size();					
			var droneBoxAW = boxNum2*665 +'px';
			$('.droneBoxA').css('width', droneBoxAW );
	        if(baseNum2 > 1){  
	            $(".droneBoxA").animate({left:"+=665"}, 800);
	            baseNum2--;	            
	          } 
	          $('.slideBtnBoxA span').text(baseNum2);
	    };	
		



		// List Menu Click toggle
		$scope.listMenuClick = function (location) {
			if (location == "btnObject") {
				($scope.listObject == false) ? $scope.listObject = true: $scope.listObject = false;
				if ($scope.listObject == true) {
					$scope.listMenuReset();
					$scope.listObject = true;
					$('.btnObject').addClass('on');
				} else {
					$('.btnObject').removeClass('on');
					$scope.listObject = false;
				}
                $('.btnConnect').hide();
                $(".slideBtnBox").hide();
			}

			if (location == "btnDrone") {
				($scope.listDrone == false) ? $scope.listDrone = true: $scope.listDrone = false;
				if ($scope.listDrone == true) {
					$scope.listMenuReset();
					$scope.listDrone = true;
					$('.btnDrone').addClass('on');

					//drone list size set
					var boxNum = $('div.droneBox ul').size();					
					var droneBoxW = boxNum*320 +'px';
					$('.btnConnect').show();
					$('.droneBox').css('width', droneBoxW );
					if (boxNum == 1) {
						$(".slideBtnBox").hide();
					}else if (boxNum > 1) {
						$(".slideBtnBox").show();
					}



				} else {
					$('.btnDrone').removeClass('on');
					$scope.listDrone = false;
					var boxNum = $('div.droneBox ul').size();
					$('.btnConnect').hide();
                    $(".slideBtnBox").hide();
				}
			}

			if (location == "btnCamera") {
				($scope.listCamera == false) ? $scope.listCamera = true: $scope.listCamera = false;
				if ($scope.listCamera == true) {
					$scope.listMenuReset();
					$scope.listCamera = true;
					$('.btnCamera').addClass('on');
				} else {
					$('.btnCamera').removeClass('on');
					$scope.listCamera = false;
				}
                $('.btnConnect').hide();
                $(".slideBtnBox").hide();
			}

			if (location == "btnSensor") {
				($scope.listSensor == false) ? $scope.listSensor = true: $scope.listSensor = false;
				if ($scope.listSensor == true) {
					$scope.listMenuReset();
					$scope.listSensor = true;
					$('.btnSensor').addClass('on');
				} else {
					$('.btnSensor').removeClass('on');
					$scope.listSensor = false;
				}
                $('.btnConnect').hide();
                $(".slideBtnBox").hide();
			}
		};

		// List Menu -> Object
		$scope.listObjectClick = function (id) {
			$('#' + id).toggleClass("on");
            console.log(id);
          //  console.log($('#' + id).toggleClass("on"));
		};

		// List Menu -> Dummy Drone Data

		$scope.dummyData = [
			{
				type: 'drone'
				, coordinateInfo: {
					type: 'point'
					, coordinate: [128.4145804901123, 35.71434671547798]
				}
				, id: 93
				, name: 'Drone 93'
				, direction: 90
		}
			, {
				type: 'drone'
				, coordinateInfo: {
					type: 'point'
					, coordinate: [128.4145804901123, 35.71434671547798]
				}
				, id: 171
				, name: 'Drone 171'
				, direction: 90
		}
			, {
				id: "drone3"
				, name: "Drone 3"
			}
			, {
				id: "drone4"
				, name: "Drone 4"
			}
			, {
				id: "drone5"
				, name: "Drone 5"
			}
			, {
				id: "drone6"
				, name: "Drone 6"
			}
			, {
				id: "drone7"
				, name: "Drone 7"
			}
			, {
				id: "drone8"
				, name: "Drone 8"
			}
			, {
				id: "drone9"
				, name: "Drone 9"
			}
			, {
				id: "drone10"
				, name: "Drone 10"
			}
			, {
				id: "drone11"
				, name: "Drone 11"
			}
			, {
				id: "drone12"
				, name: "Drone 12"
			}
			, {
				id: "drone13"
				, name: "Drone 13"
			}
			, {
				id: "drone14"
				, name: "Drone 14"
			}
			, {
				id: "drone15"
				, name: "Drone 15"
			}
			, {
				id: "drone16"
				, name: "Drone 16"
			}
	];



		$scope.dummyDataInit = function () {

			console.log($scope.listMenu);

			// add static 2 drones.
			for (var i = 0; i < 2; i++) {
				var drone = $scope.dummyData[i];

				var result = LetDroneDeviceService.addDrone(drone);
				result.then(function (res) {
					// console.log('add drone:', res)
					var layer = mapService.getLayer('device', 'drone');
					mapService.addDroneFromData(res.data, layer);
					var result = LetDroneDeviceService.connectDrone(res.data);
					console.log('connect drone : ', res.data.id);

                    var topic = 'DRONE/PUBLISH/GLOBAL_POSITION_INT/'+res.data.id+'/?/?';
                    var mqtt = StatusManager.getInstance();
                    mqtt.subscribe(topic);
                    mqtt.on(topic, droneMoveListener);
				});
			}
		}



	// List Menu -> Camera Select
	$scope.selectCameraClick = function(id){			
		if($( '#'+id).is('.on')) {
			$( '#'+id).removeClass('on');
			} else {
				$('ul.camera li Button').removeClass('on')
				$( '#'+id).addClass('on');
			}				
	};

	// List Menu -> Camera Select
	$scope.selectSensorClick = function(id){			
		if($( '#'+id).is('.on')) {
			$( '#'+id).removeClass('on');
			} else {
				$('ul.sensor li Button').removeClass('on')
				$( '#'+id).addClass('on');
			}				
	};


		// List Menu -> Drone Select
		$scope.selectDroneClick = function (id) {
			var select_drone_element;
			for (drone in $scope.dummyData) {
				$('#' + $scope.dummyData[drone].id).removeClass("on");
				if ($scope.dummyData[drone].id === id) {
					select_drone_element = $scope.dummyData[drone];
				}
			}
			$('#' + id).addClass("on");
			$scope.$emit('selected_drone', select_drone_element.id);
			console.log("select_drone_command", select_drone_element);
            mapService.setCurrentDrone(select_drone_element.id);
            mapService.moveMapCenter(select_drone_element.id);
            

		};
	


		var droneMoveListener = function (topic, data) {
			var msg = JSON.parse(data);
			var drone_name = topic.split('/')[3];
			var droneProperty = {
				id: Number(drone_name)
				, long: msg.lon * 0.0000001
				, lat: msg.lat * 0.0000001
				, hdg: msg.hdg * 0.01
			};
			mapService.moveDrone(droneProperty);
			mapService.makeDronePath(droneProperty);
		}

}]);
