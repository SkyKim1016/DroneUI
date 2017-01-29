var LetDroneModule = angular.module('LetDroneModule',[]);

LetDroneModule.factory('LetDroneRestService', function(){
    var settings = {
        host:'127.0.0.1',
        port:3000
    };
    var letDroneRest = new LetDroneRestApi();
    letDroneRest.initialize(settings); 
    return letDroneRest;
});

LetDroneModule.factory('LetDroneDeviceService', ['LetDroneRestService', function(LetDroneRestService){
    LetDroneDeviceManager.getInstance().initialize(LetDroneRestService); 
    return LetDroneDeviceManager.getInstance();
}]);

LetDroneModule.factory('LetDroneWaypointService', ['LetDroneRestService', function(LetDroneRestService){
    LetDroneWaypointManager.getInstance().initialize(LetDroneRestService); 
    return LetDroneWaypointManager.getInstance();
}]);

LetDroneModule.factory('LetDroneObjectService', ['LetDroneRestService', function(LetDroneRestService){
    LetDroneObjectManager.getInstance().initialize(LetDroneRestService); 
    return LetDroneObjectManager.getInstance();
}]);

LetDroneModule.factory('mapService',[function(){
    
    //var settings = undefined;

    var mapService = new MapService();
    //mapService.initialize(settings);
    return mapService;
}]);

