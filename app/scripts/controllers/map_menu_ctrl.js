kindFramework.controller('mapMenuCtrl',['$scope', '$rootScope', 'mapService', 'LetDroneWaypointService',
                                        function ($scope, $rootScope, mapService, LetDroneWaypointService) {
    // $rootScope.title = 'map';
    var pathName;
    var pathId;
    var loadPathId;
    var pathLayers;
    var pathLayer;
    var selectedWpListener = function(feature){
            console.log('selectedWpListner call!!!!!!!!!!!!');
            console.log(feature);
        };
    var defaultWpListener = function(feature){
            console.log('defaultWpListener call!!!!!!!!!!!!');
            console.log(feature);
        };
    var wpEmiter;
    

    $scope.mapMenu_onload = function () {
        $scope.mapMenu = 'monitorView';
        $scope.selectMenu();
        $('#editMenu').hide();
        $('#inputPathName').hide();
        $('#inputPathId').hide();
        $('#inputOrder').hide();
        $('#inputWpOrder').hide();
        
        console.log("onLoad");   
    };

    $scope.selectMenu = function () {
        var menu = $scope.mapMenu;
        console.log("selectMenu(): " + menu);
        if (menu === 'monitorView') {
            $('#wpPathMenu').hide();
            $('#monitorMenu').show();
        } else if (menu === 'wpPathView') {
            $('#monitorMenu').hide();
            $('#wpPathMenu').show();
        } else {
            $('#wpPathMenu').hide();
            $('#monitorMenu').show();
        }
    };

    //VIEW MODE
    $scope.newWpPath = function () {
        console.log("newWpPath() 호출");
        $('#inputPathName').show();
    };
    $scope.setPathName = function () {
        console.log("setPathName() 호출");
        pathName = $('#pathName').val();
        $('#inputPathName').hide();
//        var obs = mapService.createObserver();
//        obs.notify = function(status, features){
//          console.log("bbbbbbbbb");  
//        };
//        mapService.subscribeObserver('waypoint',obs);
        //1. Map mode 변경
        mapService.setMapMode(1);
        //2.Map mode에 따라 메뉴 변경
        $('#viewMenu').hide();
        $('#editMenu').show();
        //하단에 wp list 출력
         pathLayers = mapService.mapMotion(mapService.getMapMode());    
         console.log(pathLayers);
         pathLayer = pathLayers[0];
    };
    $scope.loadPathById = function(){
        console.log("loadPathId() 호출");
        $('#inputPathId').show();
    }
    $scope.setPathId = function () {
        console.log("setPathId() 호출");
        pathLayers = mapService.mapMotion(mapService.getMapMode());    
        console.log(pathLayers);
        pathLayer = pathLayers[0];
        
        loadPathId = $('#pathId').val();
        console.log(loadPathId);
        $('#inputPathId').hide();
        var input = {way_pont_path_id: loadPathId};
        var pathInfo;
        var loadPath=[];
        
        var addr = 'waypointPath/'+loadPathId;
        var obsWpList = mapService.createObserver();
        obsWpList.notify = function(status, features){
            console.log('obsPathList: ',features);
            mapService.wpClearLayer();
            if(features instanceof Array){
                console.log("pathInfo");
                features.forEach(function(item, index){     
                    loadPath = mapService.loadWpPath(item);
                    pathName = loadPath.name;
                    pathId = loadPath.id;                           
                });
            }else {
                loadPath = mapService.loadWpPath(features);
                pathName = loadPath.name;
                pathId = loadPath.id;
            }
        };
        mapService.subscribeObserverOnce(addr,obsWpList);
        var path = LetDroneWaypointService.getPathById(loadPathId,input);        
    };
    $scope.loadPathList = function () {
        var path = LetDroneWaypointService.getWpPathList();
        console.log('getObservableList: ',path);
    };
    $scope.deletePath = function () {
        if(loadPathId !== null && loadPathId !== undefined){
            var input = {way_pont_path_id: Number(loadPathId),
                         way_pont_path_name: pathName};
            LetDroneWaypointService.deleteWpPath(pathId,input);
            mapService.wpClearLayer();
        } 
    };

    //EDIT MODE
    $scope.clearPath = function () {
        mapService.wpClearLayer();
        $('#inputPathName').hide();
        $('#inputPathId').hide();
        $('#inputOrder').hide();
        $('#inputWpOrder').hide();
    };
    $scope.savePath = function () {
        var pathJSON = mapService.saveWpPath(pathName);
        LetDroneWaypointService.postWpPath('waypointPath',pathJSON);
    };
    $scope.saveAsScenario = function () {
        
    };
    $scope.changeMode = function () {
        if(mapService.getMapMode() === 1){
            //view mode
            console.log("mode: 1");
            mapService.setMapMode(0);
            $('#editMenu').hide();
            $('#viewMenu').show();
            mapService.mapMotion(mapService.getMapMode());
        }else if(mapService.getMapMode() === 0){
            //edit mode
            console.log("mode: 0");
            mapService.setMapMode(1);
            $('#viewMenu').hide();
            $('#editMenu').show();
            mapService.mapMotion(mapService.getMapMode());    
        }
    };
    $scope.inputOrders = function(){
        $('#inputOrder').show();
    };                                        
    $scope.changeOrder = function(action) {
        var temp = $('#beforeOrder').val();
        var beforeOrder = temp.split(',');
        if(beforeOrder !== 0 || beforeOrder !==undefined){
            beforeOrder.forEach(function (item, index) {
                beforeOrder[index] = Number(item);
            });
        }
        if(action === 'up'){
            mapService.changeWpOrder(beforeOrder,'up');
        }else if(action === 'down'){
            mapService.changeWpOrder(beforeOrder,'down');
        }
    };
                                            
    $scope.addWaypoint = function(){
        mapService.addWaypoint();
    };
                                            
    $scope.inputWaypoint = function(){
        $('#inputWpOrder').show();
    };
                                            
    $scope.deleteWaypoint = function(){
        var temp = $('#wpOrder').val();
        var wpOrder = temp.split(',');
        if(wpOrder !== 0 || wpOrder !== defined){
            wpOrder.forEach(function(item, index){
               wpOrder[index] = Number(item); 
            });
        }
        mapService.deleteWaypoints(wpOrder);
    };
    $scope.selectMode = function(){
        wpEmiter = mapService.getWpEvtInstance();
        wpEmiter.addListener('defaultWp', defaultWpListener);
        wpEmiter.addListener('selectedWp', selectedWpListener);
        //wpEmiter.removeListener('selectedWp', selectedWpListener);
        if(mapService.getMapMode() === 1){
            mapService.setMapMode(2);
            $('#viewMenu').hide();
            $('#editMenu').show();
            mapService.mapMotion(mapService.getMapMode());
        } else if(mapService.getMapMode() === 2){
            mapService.setMapMode(1);
            $('#viewMenu').hide();
            $('#editMenu').show();
        }
    };   
}]);