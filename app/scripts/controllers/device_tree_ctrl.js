kindFramework.controller('deviceTreeCtrl', ['$scope', '$rootScope', 'mapService', 'LetDroneDeviceService'
    ,
    function ($scope, $rootScope, mapService, LetDroneDeviceService) {
        
        $scope.drone_id = 55;
        $scope.selected_drone_id = 0;
        
        $scope.visible = function (scope) {

            var nodeData = scope.$modelValue;
            console.log('visible:', nodeData);
            $scope.selected_drone_id = nodeData.data.id;
            
            var result = LetDroneDeviceService.connectDrone(nodeData.data);
        };

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.moveLastToTheBeginning = function () {
            var a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
        };
        var gpsListener = function(topic, data){
            var drone_name = topic.split('/')[0];
            var drone_identity = drone_name.slice(5, drone_name.length);
            
            var msg = JSON.parse(data);
            var droneProperty = {
                id : Number(drone_identity),
                long: msg.lon*0.0000001,
                lat: msg.lat*0.0000001,
                hdg: msg.hdg*0.01
            };
            mapService.moveDrone(droneProperty);
            mapService.makeDronePath(droneProperty);
            $scope.$apply();
        };
        
        $scope.addItem = function (scope) {
            var nodeData = scope.$modelValue;
            console.log("drone", $scope.drone_id);

//            var drone_element = {
//                type: 'drone',
//                coordinateInfo: {
//                    type: 'point',
//                    coordinate: [128.4145804901123, 35.71434671547798]
//                },
//                
//                id: $scope.drone_id,
//                name: 'TgosDrone' + $scope.drone_id,
//                direction: 90
//            }
            
        // dummy data generate
        var drone_element =  {
                id : $scope.drone_id
                , type : "drone"
                , name : 'TgosDrone' + $scope.drone_id
                , coordinateInfo: {
                    type: 'point',
                    coordinate: [128.4145804901123, 35.71434671547798]
                }
                , manufacturer : "HTW"
                , description : "Default drone"
                , droneType : "QuadCopter"
                , maxFlightSpeed : 30
                , maxFlightDistance : 1000
                , maxFlightTime : 20
                , maxWeight : 1000
                , maxPayload : 1000
                , maxWindTime : 15
                , commDeviceList:
                [   
                    {
                        commDeviceId : 1
                        , deviceName : "DroneComm1"
                        , commType : "UDP"
                        , socketType : "Server"
                        , protocolType : "mavlink"
                        , ip : "192.168.2.2"
                        , port : "mavlink"
                        , thingList : "fcc,gimbal"
                    }

                    , {
                        commDeviceId : 2
                        , deviceName : "DroneComm2"
                        , commType : "UDP"
                        , socketType : "Server"
                        , protocolType : "mavlink"
                        , ip : "192.168.2.3"
                        , port : "mavlink"   
                        , thingList : "referenceKit"
                    }
                ]
                , subThing :
                {

                    fcc : 
                    {
                        id : 2
                        , name : "FCC1"
                        , manufacturer : "HTW"
                        , description : "Default fcc"
                    }

                    , flightCamera : 
                    {
                        id : 3
                        , name : "FlightCamera1"
                        , manufacturer : "HTW"
                        , zoomMin : 0
                        , zoomMax : 1000
                        , fovMin : 0
                        , fovMax : 1000
                        , videoIP : "192.168.100.2"
                        , videoPort : 543
                        , videoChannel : 2
                    }

                    , gimbal : 
                    {
                        id : 4
                        , name : "Gimbal1"
                        , manufacturer : "HTW"
                        , description : "Default gimbal"
                        , subThing :
                        {
                            motor :
                            {
                                id : 7
                                , name : "GimbalMotor1"
                                , manufacturer : "HTW"
                                , description : "Default gimbal motor"
                                , payload : 1000
                                , panEndless : true
                                , panSpeedMin : 0
                                , panSpeedMax : 10
                                , panAngleMin : 0
                                , panAngleMax : 10
                                , pitchEndless : true
                                , pitchSpeedMin : 0
                                , pitchSpeedMax : 10
                                , pitchAngleMin : 0
                                , pitchAngleMax : 10
                                , fovMin : 0
                                , fovMax : 1000
                            }
                            , dayCamera : 
                            {
                                id : 8
                                , name : "DayCamera1"
                                , manufacturer : "HTW"
                                , description : "Default day camera"
                                , zoomMin : 0
                                , zoomMax : 1000
                                , fovMin : 0
                                , fovMax : 1000
                                , videoIP : "192.168.100.3"
                                , videoPort : 543
                                , videoChannel : 3
                            }
                            , nightCamera : 
                            {
                                id : 9
                                , name : "DayCamera2"
                                , manufacturer : "HTW"
                                , description : "Default night camera"
                                , zoomMin : 0
                                , zoomMax : 1000
                                , fovMin : 0
                                , fovMax : 1000                    
                                , videoIP : "192.168.100.3"
                                , videoPort : 543
                                , videoChannel : 4
                            }
                        }
                    }

                    , battery : 
                    {
                        id : 5
                        , name : "Battery1"
                        , manufacturer : "HTW"
                        , description : "Default battery"
                        , batteryType : "Li-po"
                        , capacity : 3
                        , power : 3300
                        , volage : 11.1
                    }

                    , referenceKit : 
                    {
                        id : 6
                        , name : "RefKit1"
                        , manufacturer : "HTW"
                        , description : "Default Reference Kit"
                    }
                }     
            };
            
            var result = LetDroneDeviceService.addDrone(drone_element);
            result.then(function(res){
                console.log('scope', res)
                assign(res.data);
                mapService.addDroneFromData(res.data, layer);
            });
            
            var layer = mapService.getLayer('device', 'drone');
            
            var mqtt = StatusManager.getInstance();
            var topic = 'DRONE/PUBLISH/GLOBAL_POSITION_INT/'+$scope.drone_id+'/?/?';
            mqtt.subscribe(topic);
            mqtt.on(topic, gpsListener);
            console.log('%c## Here is device_tree_ctrl.js #219', 'color:green');
        };

        $scope.collapseAll = function () {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };

        $scope.data = [
            {
                'id': 1,
                'type': 'drone',
                'title': 'drones',
                'nodes': []
            }
            , {
                'id': 2,
                'type': 'camera',
                'title': 'cameras',
                'nodes': []
            }
            , {
                'id': 3,
                'type': 'sensor',
                'title': 'sensors',
                'nodes': []
            }
        ];

//        var device_service = LetDroneDeviceManager.getInstance();
//        device_service.initialize();

        var putTree = function (arr) {
            for (var arrIndex in arr) {
                assign(arr[arrIndex]);
            }
        }
        var assign = function (ele) {
            for (var index in $scope.data) {
                if ($scope.data[index].type === ele.type) {
                    var element = {
                        'id': $scope.data[index].id * 10 + $scope.data[index].nodes.length,
                        'title': ele.name,
                        'data': ele,
                        nodes: []
                    }

                    $scope.data[index].nodes.push(element);
                }
            }
            if ($scope.$$phase != '$apply' && $scope.$$phase != '$digest' ) {
                $scope.$apply();    
            }
            
        }

        // TODO: change event
        setTimeout(function () {
            var drn = LetDroneDeviceService.getDroneList();
            putTree(drn);
            var layer = mapService.getLayer('device', 'drone');
            for (var arrIndex in drn) {
               
                mapService.addDroneFromData(drn[arrIndex], layer);

                var topic = 'DRONE/PUBLISH/GLOBAL_POSITION_INT/'+drn[arrIndex].id+'/?/?';
                var mqtt = StatusManager.getInstance();
                mqtt.subscribe(topic);
                mqtt.on(topic, gpsListener);
                console.log('%c## Here is device_tree_ctrl.js #293', 'color:green');
            }
            var cam = LetDroneDeviceService.getCameraList();
            putTree(cam);
            var sen = LetDroneDeviceService.getSensorList();
            putTree(sen);


        }, 1000);

    }]);
