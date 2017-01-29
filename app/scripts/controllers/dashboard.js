kindFramework.controller('dashboardCtrl', function ($scope, $rootScope, mapService) {
    
    $scope.$watch('selected_drone_id', function(nv, ov){
       console.log('selected_drone_id:', ov , ', new:', nv) ;
        if(ov !== nv){
            console.log('Selected Drone ID:', ov, nv);
            
            var mqtt = StatusManager.getInstance();
            
            mqtt.unsubscribe('DRONE/PUBLISH/ATTITUDE/'+ov+'/?/?');
            mqtt.unsubscribe('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+ov+'/?/?');
            mqtt.unsubscribe('DRONE/PUBLISH/SYS_STATUS/'+ov+'/?/?');
            mqtt.unsubscribe('DRONE/PUBLISH/VFR_HUD/'+ov+'/?/?');
            mqtt.unsubscribe('DRONE/PUBLISH/GPS_RAW_INT/'+ov+'/?/?');

            mqtt.off('DRONE/PUBLISH/ATTITUDE/'+ov+'/?/?', attitudeListener);
            mqtt.off('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+ov+'/?/?', altitudeListener);
            mqtt.off('DRONE/PUBLISH/SYS_STATUS/'+ov+'/?/?', batteryListener);
            mqtt.off('DRONE/PUBLISH/VFR_HUD/'+ov+'/?/?', hudListener);
            mqtt.off('DRONE/PUBLISH/GPS_RAW_INT/'+ov+'/?/?', gpsListener);
            
            mqtt.subscribe('DRONE/PUBLISH/ATTITUDE/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/SYS_STATUS/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/VFR_HUD/'+nv+'/?/?');
            mqtt.subscribe('DRONE/PUBLISH/GPS_RAW_INT/'+nv+'/?/?');
            
            mqtt.on('DRONE/PUBLISH/ATTITUDE/'+nv+'/?/?', attitudeListener);
            mqtt.on('DRONE/PUBLISH/GLOBAL_POSITION_INT/'+nv+'/?/?', altitudeListener);
            mqtt.on('DRONE/PUBLISH/SYS_STATUS/'+nv+'/?/?', batteryListener);
            mqtt.on('DRONE/PUBLISH/VFR_HUD/'+nv+'/?/?', hudListener);
            mqtt.on('DRONE/PUBLISH/GPS_RAW_INT/'+nv+'/?/?', gpsListener);
            
            console.log('%cmqttClient : ', 'color:blue', mqtt);
        }
    });
    
    console.log('start status manager!');
    var attitudeListener = function(topic, data){
        var msg = JSON.parse(data);
        $scope.roll = (msg.roll * 180 / 3.14).toFixed(0);
        $scope.pitch = (msg.pitch * 180 / 3.14).toFixed(0);
        $scope.yaw = (msg.yaw * 180 / 3.14).toFixed(0);
        $scope.$apply();
        
    };
    
    var altitudeListener = function(topic, data){
        var msg = JSON.parse(data);
        $scope.alt = msg.relative_alt;        
        $scope.$apply();
    };
    
    var batteryListener = function(topic, data){
        var msg = JSON.parse(data);
        $scope.battery = msg.battery_remaining;  
        $scope.$apply();
    };
    
    var hudListener = function(topic, data){
        var msg = JSON.parse(data);
        $scope.vSpeed = msg.climb.toFixed(4);        
        $scope.gSpeed = msg.groundspeed.toFixed(4);
        $scope.$apply();
    };
    
    var gpsListener = function(topic, data){
        var msg = JSON.parse(data);
        $scope.satellites_count = msg.satellites_visible;  
        $scope.$apply();
    };    
});
