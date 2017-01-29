"use strict";

kindFramework.directive("showFlightIndicator", function () {
   var compilationFunction = function (templateElement, templateAttributes, transclude) {
        if (templateElement.length === 1) {

            var node = templateElement[0];

            var width = 120;
            var height = 120;

            var canvas = document.createElement('div');
            canvas.setAttribute('id', 'attitude');
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.setAttribute('ng-model', node.getAttribute('ng-model'));

            node.parentNode.replaceChild(canvas, node);

            return {
                pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
                  var expression = canvas.getAttribute('ng-model');
                  scope.$watch(expression, function (newValue, oldValue) {
//                  console.log(newValue.roll);
                  var rollVal = newValue.roll.label;
                  var pitchVal = newValue.pitch.label;
                  var directionVal = newValue.yaw.label;
                  var settings = {
                        size : 145,
                        margin : -25,
                        roll : rollVal,
                        pitch : pitchVal,
                        direction : directionVal,
                        turn : 0,
                        heading: 0,
                        vario: 0,
                        airspeed: 0,
                        altitude: 0,
                        pressure: 1000,
                        showBox : true,
                        img_directory : './scripts/flightindicators/img/'
                  };

                  var constants = {
                        pitch_bound:30,
                        vario_bound : 1.95,
                        airspeed_bound_l : 0,
                        airspeed_bound_h : 160
                  }

                  $('#attitude').html('<div class="instrument attitude"><div class="roll box"><img src="' + settings.img_directory + 'horizon_back.svg" class="box" alt="" /><div class="pitch box"><img src="' + settings.img_directory + 'horizon_ball.svg" class="box" alt="" /></div><img src="' + settings.img_directory + 'horizon_circle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'horizon_mechanics.svg" class="box" alt="" /><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div>');
                  _setRoll(settings.roll);
                  _setPitch(settings.pitch);
                  _setDirection(settings.direction);
                  $('#attitude').find('div.instrument').css({height : settings.size, width : settings.size, marginTop :settings.margin});
                  $('#attitude').find('div.instrument img.box.background').toggle(settings.showBox);

                  // Private methods
                  function _setRoll(roll){
                        $('#attitude').each(function(){
                              $('#attitude').find('div.instrument.attitude div.roll').css('transform', 'rotate('+roll+'deg)');
                        });
                  }

                  function _setPitch(pitch){
                        // alert(pitch);
                        if(pitch>constants.pitch_bound){pitch = constants.pitch_bound;}
                        else if(pitch<-constants.pitch_bound){pitch = -constants.pitch_bound;}
                        $('#attitude').each(function(){
                              $('#attitude').find('div.instrument.attitude div.roll div.pitch').css('top', pitch*0.7 + '%');
                        });
                  }

                  //추가
                  function _setDirection(direction){
                        $('#attitude').each(function(){
                              $('#attitude').find('div.instrument.attitude div.mechanics').css('transform', 'rotate('+direction+'deg)');
                        });
                  }

                  }, true);
                },
                post: function postLink(scope, instanceElement, instanceAttributes, controller) {}
            };
        }
    };
    var showFlightIndicator = {
        compile: compilationFunction,
        replace: true
    };
    return showFlightIndicator;   
});