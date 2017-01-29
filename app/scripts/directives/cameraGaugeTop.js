"use strict";

kindFramework.directive('cameraGaugeTop', function () {        

    var compilationFunction = function (templateElement, templateAttributes, transclude) {
        if (templateElement.length === 1) {

            var node = templateElement[0];

            var width = 800;
            var height = 60;

            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.setAttribute('ng-model', node.getAttribute('ng-model'));

            node.parentNode.replaceChild(canvas, node);

            var labelColor = '#ffffff';
            var directLabelFont = 'Bold 10pt Arial';
            var nomalLabelFont = 'Nomal 10pt Arial';
            var seperatorFont = 'Normal 6pt Arial';

            return {
                pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
                  var expression = canvas.getAttribute('ng-model');
                  scope.$watch(expression, function (newValue, oldValue) {
                  // Create the content of the canvas
/*                  console.log(expression);
                  console.log(newValue.label);*/
                  //newValue.label == Gauge Value

         
                  // N == 0
                  // NE == 45 
                  // E == 90
                  // SE == 135
                  // S == 180
                  // SW == 225
                  // W == 270
                  // NW == 315
                  // N == 360

                  window.requestAnimationFrame = window.requestAnimationFrame
                  || window.webkitRequestAnimationFrame
                  || window.mozRequestAnimationFrame
                  || function(callback) { window.setTimeout(callback, 3000 / 60); };


                  var context = canvas.getContext('2d');
                  //ctx.clearRect(0, 0, width, height);

                  var totalSeconds = 0;

                  var img = new Image();
                  img.onload = imageLoaded;
                  img.src = 'images/temp/temTopimg.jpg';


                  function imageLoaded() {
                        draw(0);

/*                        var btn = document.getElementById('btnStart');
                        btn.addEventListener('click', function() {
                              startStop();
                        });*/
                         startStop();
                  }

                  var lastFrameTime = 0;

                  function startStop() {
                        lastFrameTime = Date.now();
                        requestAnimationFrame(loop);
                  }

                  var directionVal = newValue.label * 4.725 / 100;

                  function loop() {

                        //requestAnimationFrame(loop);

                        var now = Date.now();
                        var deltaSeconds = (now - lastFrameTime) / 1000;
                        lastFrameTime = now;
                        draw(deltaSeconds);
                  }

                  function draw(delta) {
                        totalSeconds += directionVal;

                        var vx = 50; // the background scrolls with a speed of 100 pixels/sec
                        var numImages = Math.ceil(canvas.width / img.width) + 1;
                        var xpos = totalSeconds * vx % img.width;  

                        console.log(xpos + ', ' + directionVal * vx % img.width);

                        context.save();
                        context.translate(-xpos, 0);
                        for (var i = 0; i < numImages; i++) {
                              context.drawImage(img, i * img.width, 0);
                        }
                        context.restore();
                  }


/*                  var point = 0;
                  if(newValue.label > 360){
                        point = 360 - newValue.label;
                  } else {
                        point = newValue.label;
                  }

                  // console.log(point);


                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*0/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("NW", width*1/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*2/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("330", width*3/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*4/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("345", width*5/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*6/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("N", width*7/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*8/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("15", width*9/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*10/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("30", width*11/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*12/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("NE", width*13/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*14/14-2, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("60", width*15/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*16/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("70", width*17/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*18/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("E", width*19/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*20/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("105", width*21/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*22/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("120", width*23/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*24/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("SE", width*25/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*26/14, 0);


                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("150", width*27/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*28/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("165", width*29/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*30/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("S", width*31/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*32/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("195", width*33/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*34/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("210", width*35/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*36/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("SW", width*37/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*38/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("240", width*39/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*40/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("255", width*41/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*42/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("W", width*43/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*44/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("285", width*45/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*46/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("300", width*47/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*48/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("NW", width*49/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*50/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("330", width*51/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*52/14, 0);

                  ctx.font = nomalLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("345", width*53/14-5, 0);

                  ctx.font = seperatorFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("|", width*54/14, 0);

                  ctx.font = directLabelFont;
                  ctx.textAlign = 'left';
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = labelColor;
                  ctx.fillText("N", width*55/14-5, 0);*/











                    }, true);
                },
                post: function postLink(scope, instanceElement, instanceAttributes, controller) {}
            };
        }
    };
    var cameraGaugeTop = {
        compile: compilationFunction,
        replace: true
    };
    return cameraGaugeTop;   
});