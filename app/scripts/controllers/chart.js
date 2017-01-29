kindFramework.controller('chartCtrl', ['$scope','$rootScope','RestClient,
    function ($scope, $rootScope, RestClient){
        $scope.getDroneStatusData = function(){
            var clientServer = new RestClient('server');
                clientServer.get('http://192.168.2.91:4000/kind/server/common-module/redis/data-service/sample/select').then(function(result){
                console.log('result:', result);
            });
        }
}]);