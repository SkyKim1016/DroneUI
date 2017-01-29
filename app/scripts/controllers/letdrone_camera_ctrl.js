kindFramework.controller('letdroneCameraCtrl', function ($scope, $rootScope, $state, colorpicker) {

       
    $scope.dayMight = function (){

       $('.day').click(function(){
            $('.day, .night').removeClass("on");
            $('.day').addClass("on"); 
       });
       $('.night').click(function(){
            $('.day, .night').removeClass("on");
            $('.night').addClass("on"); 
       }); 
       
    };

	$scope.switchView = function (view){
		console.log(view);

		var mainView = $("#mainView").children();
		var smallView = $("#smallView dd").children();

		mainView.detach();


		$(mainView).appendTo("#smallView dd");
		$(smallView).appendTo("#mainView");

	};




	function refreshSwatch(ev, ui) {
	    var red = $scope.colorpicker.red,
			green = $scope.colorpicker.green,
			blue = $scope.colorpicker.blue;
			colorpicker.refreshSwatch(red, green, blue);
	}

	$scope.slider = {
	    'options': {
	        start: function(event, ui) {
	            $log.info('Event: Slider start - set with slider options', event);
	        },
	        stop: function(event, ui) {
	            $log.info('Event: Slider stop - set with slider options', event);
	        }
	    }
	};

	 $scope.colorpicker = {
        red: 255,
        green: 140,
        blue: 0,
        blue2: 0,
        options: {
            orientation: 'horizontal',
            min: 0,
            max: 255,
            range: 'min',
            change: refreshSwatch,
            slide: refreshSwatch
        }
    };



});


kindFramework.factory('colorpicker', function() {
    function hexFromRGB(r, g, b) {
        var hex = [r.toString(16), g.toString(16), b.toString(16)];
        angular.forEach(hex, function(value, key) {
            if (value.length === 1)
                hex[key] = "0" + value;
        });
        return hex.join('').toUpperCase();
    }
    return {
        refreshSwatch: function(r, g, b) {
            var color = '#' + hexFromRGB(r, g, b);
            angular.element('#swatch').css('background-color', color);
        }
    };
});