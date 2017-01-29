"use strict";

kindFramework
    .directive('droneGuage', function () {        
    var compilationFunction = function (templateElement, templateAttributes, transclude) {
        if (templateElement.length === 1) {

            var node = templateElement[0];

            var width = node.getAttribute('guage-width') || '400';
            var height = node.getAttribute('guage-height') || '400';

            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', width*1.45);
            canvas.setAttribute('height', height*1.3);
            canvas.setAttribute('drone-guage-data-model', node.getAttribute('drone-guage-data-model'));

            node.parentNode.replaceChild(canvas, node);

            var maxValue = node.getAttribute('guage-max-value');
            
            var outerCircleRadius = node.getAttribute('guage-circle-radius') || (height/2*0.9);
            var outerCircleWidth = node.getAttribute('guage-circle-width') || (outerCircleRadius/2*0.4);
            var outerCircleBackgroundColor = node.getAttribute('guage-background-color') || '#E6EEFF';
            var outerCircleForegroundColor = node.getAttribute('guage-foreground-color') || '#4988FF';
            var labelColor = node.getAttribute('guage-label-color') || '#ffffff';
            var labelFont = node.getAttribute('guage-label-font') || 'Bold '+ (outerCircleWidth*4) +'pt Arial';
            var labelTitleFont = node.getAttribute('guage-label-title-font') || 'Bold '+ (outerCircleWidth*2) +'pt Arial';
            var labelUnitFont = node.getAttribute('guage-label-unit-font') || 'Bold '+ (outerCircleWidth*1.5) +'pt Arial';;
            var labelTitle = node.getAttribute('guage-label-title') || 'Nan';
            var labelUnit = node.getAttribute('guage-label-unit') || 'Nan';
            return {
                pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
                    var expression = canvas.getAttribute('drone-guage-data-model');
                    scope.$watch(expression, function (newValue, oldValue) {
                    // Create the content of the canvas
                        var ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, width+(width*0.2), height);

                        // The "background" circle
                        var x = width / 2;
                        var y = height / 2;
                        ctx.beginPath();
                        ctx.arc(x, y, parseInt(outerCircleRadius), 0.5 * Math.PI, Math.PI * 2, false);
                        ctx.lineWidth = parseInt(outerCircleWidth);
                        ctx.strokeStyle = outerCircleBackgroundColor;
                        ctx.stroke();

                        // Inner Value
                        ctx.font = labelFont;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'top';
                        ctx.fillStyle = labelColor;
                        ctx.fillText(newValue.label, x, y);

                        // Title ('v.s.', 'g.s.', 's')
                        ctx.font = labelTitleFont;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = labelColor;
                        ctx.fillText(labelTitle, x, y-(y/4));

                        // Unit ('M/s', 'Km/s', 'Km/h')
                        ctx.font = labelUnitFont;
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'top';
                        ctx.fillStyle = labelColor;
                        ctx.fillText(labelUnit, width, height);

                        // The "foreground" circle
                        var startAngle = - (Math.PI * 1.5);
                        if(newValue.percentage <= 0){ var endAngle = - (Math.PI * 1.5); }
                        if(newValue.percentage > 0 && newValue.percentage <= 0.75){ var endAngle = ((Math.PI * 2 ) * newValue.percentage) - (Math.PI * 1.5); }
                        if(newValue.percentage > 0.75){ var endAngle = (Math.PI * 0 ); }
                        var anticlockwise = false;
                        ctx.beginPath();
                        ctx.arc(x, y, parseInt(outerCircleRadius), startAngle, endAngle, anticlockwise);
                        ctx.lineWidth = parseInt(outerCircleWidth);
                        ctx.strokeStyle = outerCircleForegroundColor;
                        ctx.stroke();
                    }, true);
                },
                post: function postLink(scope, instanceElement, instanceAttributes, controller) {}
            };
        }
    };
    var roundProgress = {
        compile: compilationFunction,
        replace: true
    };
    return roundProgress;

});