kindFramework.controller('activeXLiveCtrl', function ($scope, $rootScope) {
    var info = {
        windows:[XnsSdkWindow1, XnsSdkWindow2], 
        sdk_id:XnsSdkDevice 
    };
    var conInfo = {
            Model:"Samsung NVR",
            IpAddress:"192.168.2.201",
            Port:554,
            ID:"admin",
            PW:"init123!"
        }
    
//    var ac = new ActiveXPlayer(info);
    var ac = new TGOSStreamManager(info);
    
    $scope.activex_onload = function(){
        ac.initialize(conInfo);
        setTimeout(function(self){
            try{
                self.open({window_index:0, channel:0});
                self.open({window_index:1, channel:1});    
            }
            catch(err){
                console.log('error video open!');
            }
            
        }, 1000, ac);
            
    }
    $scope.isHide = true;
    $scope.toggleHide = function(){
        $scope.isHide = !$scope.isHide;
    }
});
