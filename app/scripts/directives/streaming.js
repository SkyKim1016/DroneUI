"use strict";
kindFramework
    .directive('streaming', function (deviceDetector) {
        return {
            restrict:'EA',
            templateUrl:function(){
                return deviceDetector.browser == 'ie' ? 
                    'views/ie_streaming.html' : 'views/chrome_streaming.html';
            },
            link:function(scope,element,attrs){
            }
        };
    });

kindFramework
    .directive('tgosVideo', function (deviceDetector, $location) {
        return {
            restrict:'EA',
            template:function(elem, attrs){
                var html = '<kind-stream id="'+attrs.winid+'" kindplayer="'+attrs.kindplayer+'" ></kind-stream>';
                if(deviceDetector.browser == 'ie'){
                    html = '<OBJECT ID="'+ attrs.winid+'" classid=clsid:C3F99E59-433D-4A79-A188-B36ACE8F78F8  type="application/html"  ></OBJECT>'
                        + '<script> function '+ attrs.winid +'Inject(scope, location){ function '+ attrs.winid+'::OnLButtonDblClk(nFlag, x, y){'
                        + 'var path = location.path(); if(path === \'/letdrone/main\'){scope.goToCamera();}else if(path=== \'/letdrone/main/camera\'){scope.switchView(\'Camera_1\');}'
                        + 'console.log("window1 mouse up", x, y, scope.hideState);}}</script>';
                    console.log(html);
                }
                return html;
                
            },
            link:function(scope, elem, attrs){
                if(deviceDetector.browser === 'ie'){
                    eval(attrs.winid+'Inject')(scope, $location);
                }                
            },
            controller:['$scope', function($scope){
                if(deviceDetector.browser != 'ie'){
                }
            }]
        };
    });

kindFramework
    .directive('tgosVideoSdk', function (deviceDetector, $location) {
        return {
            restrict:'EA',
            compile: function(element, attrs){
                var html = '<div><div>';
                if(deviceDetector.browser == 'ie'){
                    html = '<OBJECT  ID=XnsSdkDevice style="visibility: hidden" classid=clsid:9BED9251-E8E7-4B67-B281-ADC06BA7988D type="application/html"></OBJECT>';
                }
                element.replaceWith(html);
            },
            controller:['$scope', function($scope){
                
                if(deviceDetector.browser != 'ie'){
                    return;
                }
                var conInfo = {
                    Model:"Samsung NVR",
                    IpAddress:"192.168.2.201",
                    Port:554,
                    ID:"admin",
                    PW:"init123!"
                };
                var info = {
                    windows:[XnsSdkWindow1, XnsSdkWindow2], 
                    sdk_id:XnsSdkDevice 
                };
                var ac = new TGOSStreamManager(info);    

                if(!ac){
                    console.log('Not Initialize Yet')
                    return;
                }

                ac.initialize(conInfo);
                setTimeout(function(self){
                    self.open({window_index:0, channel:0});
                    self.open({window_index:1, channel:1});
                }, 1000, ac);
            }]
            
        };
    });