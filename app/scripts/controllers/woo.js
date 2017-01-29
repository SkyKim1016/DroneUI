kindFramework.controller('wooCtrl', function ($scope, $rootScope) {
    $scope.init = function(){
        $scope.data = [
            {
                id: 1,
                type:'cameraroot',
                name:'cameras',
                items:[
                    {
                        id: 1,
                        type:'camera',
                        name:'camera1',
                        items:[]
                    },
                    {
                        id: 1,
                        type:'camera',
                        name:'camera2',
                        items:[]
                    }
                ]
            }
            ,{
                id: 2,
                type:'droneroot',
                name:'drones',
                items:[]
            }
        ];
    }
    
    
    $scope.toggle = function(self){
        console.log('toggle', self.node.name);
    }
});
