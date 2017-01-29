
kindFramework.controller('initTapCtrl', function ($scope, $rootScope,$state) {
    $scope.onDrone = function(){
//        $state.reload();
    };
    
    $rootScope.clientId = 'DroneStatusSubcriber';
    
    $scope.onReport = function(){
        
    };
    
    
});
