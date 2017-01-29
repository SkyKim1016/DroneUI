"use strict";

/**
 * If parent do not have both templateUrl and controller,
 * the ui-view is became templateUrl of child.
 */
kindFramework.constant('ROUTE_CONFIG', {
    default: 'letdrone/main',
    routes: [
        
        {
            urlName: 'home',
            name: 'home',
            templateUrl: 'views/home.html',
            controller: 'initTapCtrl',
            childs: [
                {
                    urlName: 'drone',
                    name: 'drone',
                    templateUrl: 'views/layout.html',
                    controller: 'layoutCtrl'
                },
                {
                    urlName: 'report',
                    name: 'report',
                    templateUrl: 'views/report.html',
                    controller: 'reportCtrl'
                }
            ]
        },
        {
            urlName: 'active',
            name: 'active',
            templateUrl: 'views/activex_player.html',
            controller: 'activeXLiveCtrl',
            
        },
        {
            urlName: 'map',
            name: 'map',
            templateUrl: 'views/map.html',
            controller: 'mapCtrl',
            
        },
        {
            urlName: 'device',
            name: 'device',
            templateUrl: 'views/main_template.html',
            controller: 'deviceTreeCtrl',
            
        }
        ,
        {
            urlName: 'woo',
            name: 'wootest',
            templateUrl: 'views/proto_layout.html',
            controller: 'deviceTreeCtrl',
            
        },


        // Development
        {
            urlName: 'letdrone',
            name: 'letdrone',
            templateUrl: 'views/letdrone.html',
            controller: 'letdroneCtrl',
            childs: [
                {
                    urlName: 'main',
                    name: 'letdroneMain',
                    templateUrl: 'views/letdrone_main.html',
                    controller: 'letdroneMainCtrl'
                },
                {
                    urlName: 'main/camera',
                    name: 'letdroneCamera',
                    templateUrl: 'views/letdrone_camera.html',
                    controller: 'letdroneCameraCtrl'
                },
                {
                    urlName: 'main/waypoint',
                    name: 'letdroneWaypoint',
                    templateUrl: 'views/letdrone_waypoint.html',
                    controller: 'letdroneWayPointCtrl'
                },
                {
                    urlName: 'main/mapsetting',
                    name: 'letdroneMapsetting',
                    templateUrl: 'views/letdrone_mapsetting.html',
                    controller: 'letdroneMapSettingCtrl'
                },
                {
                    urlName: 'main/scenario',
                    name: 'letdroneScenario',
                    templateUrl: 'views/letdrone_scenario.html',
                    controller: 'letdroneScenarioCtrl'
                },
                {
                    urlName: 'main/deviceManager',
                    name: 'letdroneDeviceManager',
                    templateUrl: 'views/letdrone_device_manager.html',
                    controller: 'letdroneDeviceManagerCtrl'
                }
            ]
        },

        // Publishing with dummy Controller
        {
            urlName: 'publish',
            name: 'publishTest',
            templateUrl: 'views/publish/main.html',
            controller: 'publishCtrl'

        }
    ]
});