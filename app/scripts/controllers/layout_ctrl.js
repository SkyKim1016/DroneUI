kindFramework.controller('layoutCtrl', function ($scope,$rootScope,mapService) {
    $rootScope.title = 'DroneStatus';

    $scope.mapLayout = 'views/pannel/drone.html';
    
    $scope.clickEvent = function(target) {
        var target = $(target);
        setHeight();
        setPannel(target.attr('id'));
        $scope.changePosition(target);
    };
    

    setPannel('drone');
    setHeight();
    
    function setPannel(id) {
        switch (id) {
        case 'drone':
            $scope.pannel = "views/pannel/drone.html";
            break;
        case 'va':
            $scope.pannel = "views/pannel/va.html";
            break;
        case 'map_layout':
            $scope.pannel = "views/pannel/map.html";
            $scope.pannelControl = 'mapPannelCtrl';
            break;
        }
        
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }
    
    $scope.$watch('pannel',function(value){
        console.log('Pannel Change : '+value);
    });
    

            
    var w = $("#kind_monitoring_wrap").width()* 0.8;
    var h= $("#kind_monitoring_wrap").height()* 0.76;
    
    function setHeight() {
        // dog hardcoding
                 var monitoring_wrap_width = $("#kind_monitoring_wrap").width();
        var main_visual_height_px = $("#kind_monitoring_wrap").height() * 0.76;
        var section_height_px = monitoring_wrap_width * 0.625;

        $("#kind_monitoring_wrap").css('height', section_height_px + 'px');
        $(".main_visual").css('height', main_visual_height_px + 'px');
        $("#controller").css('height', main_visual_height_px + 'px');

        $(".sub_visual_1").css('height', '24%');
        $(".sub_visual_2").css('height', '24%');
        $(".sub_visual_3").css('height', '24%');
    //    $(".sub_visual_2 > img").css('height', '100%');
        $(".main_visual canvas").css('height', '100%');

//        mapService.setSize([w,h]);
        sceneManager.setWindowSize(monitoring_wrap_width * 0.6, section_height_px * 0.24);
    };

    $scope.changePosition = function(target) {
        console.log('in change position');
        var type = $(target).attr('id');
        var object = [
            $("#map_layout"),
            $("#va"),
            $("#drone")
        ];

        switch (type) {
        case 'drone':
            object[0].attr('class', 'sub_visual_2');
            object[1].attr('class', 'sub_visual_3');
            object[2].attr('class', 'main_visual');
            break;
        case 'va':
            object[0].attr('class', 'sub_visual_2');
            object[2].attr('class', 'sub_visual_3');
            object[1].attr('class', 'main_visual');
            break;
        case 'map_layout':
            object[2].attr('class', 'sub_visual_2');
            object[1].attr('class', 'sub_visual_3');
            object[0].attr('class', 'main_visual');

    //            $(window).resize(setHeight);
            break;
        }
    //    console.log($(".main_visual").width(),$("#controller").height());
        setHeight();
    };

    setTimeout(function () {
        setHeight();
    }, 100);

    $(window).resize(setHeight);    
    
    
});