/* global kindFramework */
"use strict";
/**
 * ptz directive
 * @memberof kindFramework
 * @ngdoc directive
 * @name ptz
 * @param kindPTZService {service} ptz function of sunapi common module
 * @fires write a ptz element tag or attribute
 * @example <div ptz="your ptz data"></div>
 * @example <ptz ptz="your ptz data"></ptz>
*/
kindFramework
    .directive('ptz', function (KindPTZService) {
        return {
            restrict:'EA',
            link:function(scope,element,attrs){

                
                
                /**
                 * position value of AreaZoom 
                 * @var size
                 * @memberof ptz
                 */
                var size = {};
                /**
                 * get attrs.ptz value in scope
                 * @var ptzData
                 * @memberof ptz
                 */
//                var ptzData = scope.$eval(attrs.ptz);
                scope.$watch(attrs.ptz,function(ptzData){
                    // selection event disable
                    element.css({'user-select':'none','-webkit-user-select': 'none'  });

                    element.on('selectstart',function(event){
                        event.preventDefault();   
                    });

                    element.on("mousewheel",function(event){
                        event.preventDefault();
                    });
                    
                    if(element.find("ul.ptz_ul").length !== 0){
                        element.css({width:'100%',height:'100%'});   
                    }

                    if(element.find("ul.ptz_ul").length === 0 && ptzData.options.on === 'on'){

                        /**
                         * ptz function of sunapi common module
                         * @var ptzInterface
                         * @memberof ptz
                         */
                        var ptzInterface = new KindPTZService();
                        ptzInterface.setDeviceConnectionInfo(ptzData);

                        /**
                         * ptz button layout html tag                    
                         * @var ptzLayout
                         * @memberof ptz
                         */
                        var ptzLayout =
                            '<ul class="ptz_ul">'+
                                '<li data-type="up"><img src="images/up.png"></li>'+
                                '<li data-type="right"><img src="images/right.png"></li>'+
                                '<li data-type="down"><img src="images/down.png"></li>'+
                                '<li data-type="left"><img src="images/left.png"></li>'+
                            '</ul>';


                        // setting event of ptzLayout
                        element.prepend(ptzLayout);
                        element.find('li[data-type="up"]').click(function(){ ptzInterface.up(); });
                        element.find('li[data-type="right"]').click(function(){ ptzInterface.right(); });
                        element.find('li[data-type="down"]').click(function(){ ptzInterface.down(); });
                        element.find('li[data-type="left"]').click(function(){ ptzInterface.left(); });
                        element.addClass('ptz-wrap');

                        


                        var mousewheel = function(event){

                            /**
                             * This is old version IE  event variable for compatibility
                             * @var event
                             * @memberof ptz
                             */
                            var event = window.event || event;

                            /**
                             * identify the zoomIn and zoomOut
                             * @var delta
                             * @memberof ptz
                             */
                            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                            console.log(delta);
                            if(delta === -1){
                                ptzInterface.zoomOut();
                            }else if(delta === 1){
                                ptzInterface.zoomIn();
                            }

                        };

                        if(navigator.userAgent.indexOf('Firefox') !== -1){
                            element[0].addEventListener ("DOMMouseScroll", function(event){
                                mousewheel(event);
                            });

                        }else{
                            element.bind("mousewheel", function(event){
                                mousewheel(event);
                            });
                        }

                        element.bind('mousedown',function(event){
                            if(event.shiftKey === true){
                                size.startX = Math.floor(event.offsetX);
                                size.startY = Math.floor(event.offsetY);
                            }
                        });

                        element.bind('mouseup',function(event){
                            if(event.shiftKey === true){
                                size.endX = Math.floor(event.offsetX);
                                size.endY = Math.floor(event.offsetY);
                            }
                            
                            if(size.startX && size.startY && size.endX && size.endY){
                                ptzInterface.areaZoomIn(size.startX,size.startY,size.endX,size.endY,element.width(),element.height());
                                size = {};
                            }
                        });
                    }else if(ptzData.options.on === 'off'){
                        $("ul.ptz_ul",element).remove();
                        element.unbind();
                    }
                    
                },true);
                
            }
        };
    });

