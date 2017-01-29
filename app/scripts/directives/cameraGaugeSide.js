"use strict";

kindFramework.directive('cameraGaugeSide', function () {        

    var compilationFunction = function (templateElement, templateAttributes, transclude) {
        if (templateElement.length === 1) {

            var node = templateElement[0];

            var width = 40;
            var height = 350;

            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.setAttribute('ng-model', node.getAttribute('ng-model'));

            node.parentNode.replaceChild(canvas, node);

            var gaugeSide = node.getAttribute('guage-side');
            var labelColor = '#ffffff';
            var labelFont = '80 8pt Arial';

            return {
                pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
                  var expression = canvas.getAttribute('ng-model');
                  scope.$watch(expression, function (newValue, oldValue) {
                  // Create the content of the canvas
                  //newValue.label == Gauge Value

                        if(gaugeSide == "left"){
                            var ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, width, height);

                            ctx.beginPath();

                              // Line
                            ctx.lineCap="round";
                            ctx.strokeStyle="#ffffff";
                            ctx.moveTo(30,0);
                            ctx.lineWidth=0.5;
                            ctx.lineTo(30,height);
                            ctx.closePath();
                            ctx.stroke();

                              // Triangle pointer
                            ctx.beginPath();
                            ctx.moveTo(22, height/2);
                            ctx.lineTo(30, height/2-5);
                            ctx.lineTo(30, height/2+5);
                            ctx.fillStyle = "red";
                            ctx.fill()

                              // Label
                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label+3, 3, height*0.01);

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label+2, 3, height*0.5*1/3);

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label+1, 3, height*0.5*2/3);

                            // Base Value
                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label, 3, height*0.5);

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label-1, 3, (height*0.5)+(height*0.5*1/3));

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label-2, 3, (height*0.5)+(height*0.5*2/3));

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label-3, 3, height*0.98);                           

                        } else if(gaugeSide == "right"){
                            var ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, width, height);

                            ctx.beginPath();

                              // Line
                            ctx.lineCap="round";
                            ctx.strokeStyle="#ffffff";
                            ctx.moveTo(10,0);
                            ctx.lineWidth=0.5;
                            ctx.lineTo(10,height);
                            ctx.closePath();
                            ctx.stroke();

                              // Triangle pointer
                            ctx.beginPath();
                            ctx.moveTo(18, height/2);
                            ctx.lineTo(10, height/2-5);
                            ctx.lineTo(10, height/2+5);
                            ctx.fillStyle = "red";
                            ctx.fill()

                              // Label
                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label+3, 20, height*0.01);

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label+2, 20, height*0.5*1/3);

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label+1, 20, height*0.5*2/3);

                            // Base Value
                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label, 20, height*0.5);

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label-1, 20, (height*0.5)+(height*0.5*1/3));

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label-2, 20, (height*0.5)+(height*0.5*2/3));

                            ctx.font = labelFont;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = labelColor;
                            ctx.fillText(newValue.label-3, 20, height*0.98);
                        }
                    }, true);
                },
                post: function postLink(scope, instanceElement, instanceAttributes, controller) {}
            };
        }
    };
    var cameraGaugeSide = {
        compile: compilationFunction,
        replace: true
    };
    return cameraGaugeSide;   
});