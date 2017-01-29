"use strict";

kindFramework.controller('streamingCtrl', function ($scope, $rootScope, deviceDetector) {
    $rootScope.title = 'DroneStatus';
    $scope.hideState = [false, false];
    $scope.doHide = function(id){
        $scope.hideState[id] = true;
        if($scope.hideState[0] === true && $scope.hideState[1] === true){
            $scope.viewCameraModal();
        }
    }
    
    $scope.playerdata = [];

    var profileInfo = {
        device: {
            channelId: 0,
            port: '8088',
            server_address: '55.101.45.55',
            cameraIp: '192.168.2.201:558',
            user: 'admin',
            password: 'init123!'
        },
        media: {
            type: 'live',
            requestInfo: {
                cmd: 'open',
                url: 'LiveChannel/1/media.smp',
                scale: 1 //
            }
        },
        callback: {
            error: function (err) {
                alert(err.description);
                console.log(err);
            }
        }

    };
    
    
    var profileInfo1 = {
        device: {
            channelId: 1,
            port: '8088',
            server_address: '55.101.45.55',
            cameraIp: '192.168.2.201:558',
            user: 'admin',
            password: 'init123!'
        },
        media: {
            type: 'live',
            requestInfo: {
                cmd: 'open',
                url: 'LiveChannel/0/media.smp',
                scale: 1 //
            }
        },
        callback: {
            error: function (err) {
                alert(err.description);
                console.log(err);
            },
            success: function () {
                console.log('success');
            }
        }
    };
    
    $scope.playerdata[0] = profileInfo;
    
    if(deviceDetector.browser == 'ie'){
        console.log("IE BROWSER!!!!!!!!!!!!!!!!");
        
    }
    else{
        console.log("CHROME BROWSER!!!!!!!!!!!!");
        setTimeout(function () {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                
                $scope.playerdata[1] = profileInfo1;
                console.log("CHROME BROWSER!!!!!!!!!!!!");
                $scope.$apply();
            }
        }, 500);    
    }
    
});