kindFramework.controller('pannelCtrl', ['$scope','$rootScope','mapService',
    function ($scope, $rootScope,mapService){
        /*
            ** PTZ Control **
        */
        $scope.ptzdata = {
            cameraUrl: "192.168.2.72",
            echo_sunapi_server: '192.168.2.28:8087',
            user: "admin",
            password: "init123!",
            options: {
                unitSize: 3.0,
                pulseSize: 20,
                on: 'on'
            }
        };
        
        
        /*
            ** Map Control **
        */
        $scope.doBounce = function(city){
            var city = mapService.getPosition(city);
//            mapService.doBounce(city);
        }
        
        $scope.doPan = function(city){
            var city = mapService.getPosition(city);
//            mapService.doPan(city);
        }
        
        $scope.doRotate = function(){
//            mapService.doRotate();
        }
        
        $scope.doZoom = function(num){
//            mapService.doZoom(num);
        }
        
        $scope.drawObject = function(event){
//            mapService.drawObject(event);
        };
                
    }
]);
