kindFramework.controller('monitoringCtrl', function ($scope, $rootScope, deviceDetector) {
    
    
    var clientId = deviceDetector.browser == 'ie' ? 'IEDroneStatusSubcriber' : 'NOTIEDroneStatusSubcriber';
    var server = {
        port: 4000,
        hostName: '192.168.2.91'
    }

    var opt = {
        reconnectPeriod: 3000,
        clientId: clientId,
        clean: false
    };

    var client;

    $scope.topic = "tgos_drone_status";

    $scope.subscribe = function (topic) {
        if (!client) {

            client = mqtt.createClient(server.port, server.hostName, opt);
            console.log(client);

            client.on("connect", function () {
                console.log('open connection!');
            });

            client.on("close", function () {
                console.log('close connection!');
            });

            client.on("message", function (topic, message) {
                $scope.message = JSON.parse(message);
                /* TODO apply를 watch로 바꾸기  */
                $scope.$apply();
                // changeMotion($scope.message.yaw * 0.002, $scope.message.pitch * 0.002, $scope.message.roll * 0.002);
                changeMotion($scope.message.pitch, $scope.message.yaw, $scope.message.roll);
            });
        }

        // we need to change async.
        client.subscribe(topic, {
            qos: 0
        }, function (err, result) {
            console.log("subscribed:" + topic);
        });
    };


    $scope.unsubscribe = function (topic) {
        if (client) {
            client.unsubscribe(topic, function () {
                // we need to change async.
                console.log("unsubscribed:" + topic);
            });
        }
    };
});