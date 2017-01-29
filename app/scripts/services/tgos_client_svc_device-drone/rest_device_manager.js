/* global RestClient */
"use strict";


/**
* LetDroneRestApi module 
* @memberof tgos
* @name LetDroneRestApi
*/
var LetDroneRestApi = (function(){
    /**
     * Represents  a Constructor object of Tgos LetDroneRestApi.
     * @memberof LetDroneRestApi
     * @name constructor
     */
    function constructor(rest){
        if(rest){
            this.rest_client = rest;
        }
        else{
            this.rest_client = new RestClient()
        }
        
        this.url = "http://127.0.0.1:3000/"
    }
    
    constructor.prototype = {
        /**
         * Initialize a rest api of LetDrone with host address and port configuration.
         * @function initialize
         * @memberof LetDroneRestApi
         * @param settings {object} host ip and port.
         * @example 
         *      var rest_client = new RestClient();
         *      rest_client.initialize(rest_client);
        */
        initialize : function(settings){
            if(settings){
                this.url = "http://"+settings.host+":"+settings.port+"/";
            }            
        },
        /**
         * set a rest client module.
         * @function setRestModule
         * @memberof LetDroneRestApi
         * @param rest_module {object} rest client object.
         * @example 
         *      var rest_client = new RestClient();
         *      rest_client.setRestModule(rest_client);
        */
        setRestModule: function(rest_module){
            this.rest_client = rest_module;
        },
        /**
         * get device list each device type.
         * @function getDeviceFromServer
         * @memberof LetDroneRestApi
         * @param type {string} device type.
         * @example 
         *      rest_client.getDeviceFromServer('drone'); //'camera', 'sensor'
        */
        getDeviceFromServer : function(type){
            return this.rest_client.get(this.url + type);
        },
        getDeviceDataFromServer : function(type, data){
            return this.rest_client.get(this.url + type + '/' + data);
        },
        /**
         * update device information to the server.
         * @function postDeviceToServer
         * @memberof LetDroneRestApi
         * @param type {string} device type.
         * @example 
         *      rest_client.postDeviceToServer('drone', data); //'camera', 'sensor'
        */
        postDeviceToServer : function(type, data){
            return this.rest_client.post(this.url + type, data);
        },
        /**
         * get object list each object type.
         * @function getObjectFromServer
         * @memberof LetDroneRestApi
         * @param type {string} object type.
         * @example 
         *      rest_client.getObjectFromServer('?????');
        */
        getObjectFromServer : function(type, map_id){
            return this.rest_client.get(this.url + type, map_id);
        },

        postObjectToServer : function(type, data){
          return this.rest_client.post(this.url+type, data);
        },

        updateObjectToServer : function(type, data) {
            return this.rest_client.put(this.url+type, data);
        },
        deleteObjectFromServer : function(id) {
            return this.rest_client.delete(this.url+'object/' + id);
        },

        /**
         * add drone device information with element value in the server.
         * @function addDroneConnection
         * @memberof LetDroneRestApi
         * @param type {string} object type.
         * @example
         *      var ele = {
         *          type: 'drone',
         *          coordinateInfo: {
         *              type: 'point',
         *              coordinate: [128.4145804901123, 35.71434671547798]
         *          },          
         *          id: $scope.drone_id,
         *          name: 'TgosDrone' + $scope.drone_id,
         *          direction: 90
         *      }
         *      rest_client.addDroneConnection('connect/drone', ele);
        */
        addDrone : function(uri, ele){
            return this.rest_client.post(this.url + uri, ele);
        },
        connectDrone : function(uri, ele){
            return this.rest_client.post(this.url + uri, ele);
        },
        getObstacle:function(id){
            return this.rest_client.get(this.url + 'obstacle/'+ id);
        },
        getNoflyzone:function(id){
            return this.rest_client.get(this.url + 'noflyzone/'+ id);
        },
        getAirzone:function(id){
            return this.rest_client.get(this.url + 'airzone/'+ id);
        },
        getGeofence:function(id){
            return this.rest_client.get(this.url + 'geofence/'+ id);
        },
        testSevice : function(){
            return this.rest_client.get(this.url+'waypointPath');
        },
        getPathByIdFromServer : function(type, data){
            return this.rest_client.get(this.url+type, data);
        },
        postWpPathFromServer : function(type, data){
            return this.rest_client.post(this.url+type, data);
        },
        deleteWpPathFromServer : function(type, data){
            return this.rest_client.delete(this.url+type, data);
        },
        getMapSettings : function(data){
            console.log('before rest call server');
            return this.rest_client.get(this.url + 'map', data);
        }
    }
    
    return constructor;
})();