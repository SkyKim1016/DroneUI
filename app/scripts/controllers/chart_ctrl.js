kindFramework.controller('chartCtrl', function ($scope,$rootScope,$http) {
    $( "#accordion" ).accordion({
        collapsible: true,
        active: false
    });    
    
    $scope.data;
    $scope.showCart = function(){
        $http({
            method: 'GET',
            url: 'http://192.168.2.91:4000/kind/server/common-module/redis/data-service/sample/select'
        }).then(function (response) {
            function sinAndCos() {
                if(response.data.length) return null;
                var yaw = [],roll = [],
                    pitch = [];
                angular.forEach(response.data, function(value, key) {
                    var value = JSON.parse(JSON.parse(value));
                    
                    
                    
                    var dateTimeStamp = new Date(value.date).getTime();
                    var timeBootMs = value.yaw;
                    yaw.push({
                        x:dateTimeStamp,
                        y:value.yaw
                    });
                });            
                
                yaw = yaw.sort(CompareForSort);
                function CompareForSort(first, second)
                {
                    if (first.x == second.x)
                        return 0;
                    if (first.x < second.x)
                        return -1;
                    else
                        return 1; 
                }
                return [
                    {
                        values: yaw,      //values - represents the array of {x,y} data points
                        key: 'Yaw', //key  - the name of the series.
                        color: '#ff7f0e'  //color - optional: choose your own line color.
                    }
                ];
                
                
            }
            var data = sinAndCos();
            if(data !== null){
                $scope.data = data;
            }
        },function errCallback(response){
               console.log('data load error ');
        });
    };

    

    
   $scope.options = {
        chart: {
            type: 'lineChart',
            height: 450,
            width: 900,
            margin : {
                top: 20,
                right: 40,
                bottom: 40,
                left: 90
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d){
                    var dateObj = new Date(d);
                    var month = dateObj.getMonth();
                    var date = dateObj.getDate();
                    var hours = dateObj.getHours();
                    var minute = dateObj.getMinutes();
                    var sec = dateObj.getSeconds();

                    var formates = hours+":"+minute+":"+sec;
                    return formates;
                },
            },
            yAxis: {
                axisLabel: 'Voltage (v)',
                tickFormat: function(d){
                    return d3.format('.05f')(d);
                },
//                axisLabelDistance: -10
            },
            callback: function(chart){
                console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Yaw Chart'
        }
    };
    
    
});