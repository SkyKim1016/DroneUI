/* global LetDroneRestApi, TgosMapList  */
"use strict"; 


var ChangedDeviceListener = (function(){    
    function constructor(){        
    }
    
    constructor.prototype = {
        onChangedDroneList:function(){
            
        },
        onChangedDroneData:function(){
            
        },
        onChangedCameraList:function(){
            
        },
        onChangedCameraData:function(){ 
            
        }
    }
    
    return constructor;
})();

/**
* LetDroneDeviceManager module
* @memberof tgos
* @name LetDroneDeviceManager
*/
var LetDroneDeviceManager = (function(){
    /**
     * singleton variable.
     * @var instance
     * @memberof LetDroneDeviceManager 
     */
    var instance;
    /**
     * Represents  a Constructor object of Tgos LetDroneDeviceManager.
     * @memberof LetDroneDeviceManager
     * @name constructor
     */
    function constructor(){        
        this.deviceMapList = new TgosMapList();
        this.changedDataListeners = [];
    }
    
    constructor.prototype = {
        /**
         * Initialize a device manager with rest client.
         * @function initialize
         * @memberof LetDroneDeviceManager
         * @param restLetDrone {object} rest client object.
         * @example 
         *      var rest_client = new RestClient();
         *      LetDroneDeviceManager.getInstance().initialize(rest_client);
        */
        initialize : function(restLetDrone){
            if(restLetDrone){
                this.letdrone_api = restLetDrone;    
            }
            // 
            var cameralist = this.letdrone_api.getDeviceFromServer('camera');
            var self = this;
            cameralist.then(function(res){
                self.deviceMapList.add('camera', res.list);
            });
            var dronelist = this.letdrone_api.getDeviceFromServer('drone');
            dronelist.then(function(res){
                self.deviceMapList.add('drone', res.list);
            });
            var sensorlist = this.letdrone_api.getDeviceFromServer('sensor');            
            sensorlist.then(function(res){
                self.deviceMapList.add('sensor', res.list);
            });
            
            var wlist = this.letdrone_api.testSevice();            
            wlist.then(function(res){
                console.log('=-=-=-==-=-=-=-=-===-=-=-=-=-=-'+res);
            });
        },
        
        addChangedDataListener: function(listener){
            this.changedDataListeners.push(listener);
        },
        removeChangedDataListener: function(listener){
            
        },
        /**
         * Get drone list from server.
         * @function getDroneList
         * @memberof LetDroneDeviceManager
         * @example 
         *      LetDroneDeviceManager.getInstance().getDroneList();
        */
        getDroneList : function(){
            return this.deviceMapList.get('drone');
        },
        
        /**
         * Get camera list from server.
         * @function getCameraList
         * @memberof LetDroneDeviceManager
         * @example 
         *      LetDroneDeviceManager.getInstance().getCameraList();
        */
        getCameraList : function(){
            return this.deviceMapList.get('camera');
        },
        /**
         * Get sensor list from server.
         * @function getSensorList
         * @memberof LetDroneDeviceManager
         * @example 
         *      LetDroneDeviceManager.getInstance().getSensorList();
        */
        getSensorList : function(){
            return this.deviceMapList.get('sensor');
        },
        getCameraData: function(id){
            
        },
        getSensorData: function(id){
            
        },
        getDroneCurrentUploadedWaypointPath: function(id){
            
        },
        getDroneCurrentScenario: function(id){
            
        },
        getDroneCurrentEvaluation: function(id){
            
        },
        
        /**
         * request to add drone in the server.
         * @function addDroneConnection
         * @memberof LetDroneDeviceManager
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
         *      LetDroneDeviceManager.getInstance().addDroneConnection(ele);
        */
        addDrone : function(ele){
            var elem = JSON.stringify(ele);
            return this.letdrone_api.addDrone('drone', elem);            
        },
        connectDrone : function(ele) {
            var elem = JSON.stringify(ele);
            return this.letdrone_api.connectDrone('connection/drone', elem);            
        },
        updateCamera : function(ele) {
            var elem = JSON.stringify(ele);
            return this.letdrone_api.postDeviceToServer('camera', elem);      
        },
        updateSensor : function(ele) {
            var elem = JSON.stringify(ele);
            return this.letdrone_api.postDeviceToServer('sensor', elem);      
        },
        getDroneDeviceList : function(){
            return this.letdrone_api.getDeviceFromServer('dronePath/drone'); 
        },
        getDroneData : function(id){
            return this.letdrone_api.getDeviceDataFromServer('dronePath/drone', id); 
        },
        updateDroneData : function(ele) {
            var elem = JSON.stringify(ele);
            return this.letdrone_api.postDeviceToServer('dronePath/updateDrone', elem);      
        },
        insertDroneData : function(ele) {
            var elem = JSON.stringify(ele);
            return this.letdrone_api.postDeviceToServer('dronePath/insertDrone', elem);      
        },
        getDroneModelList : function(){
            return this.letdrone_api.getDeviceFromServer('dronePath/droneModel'); 
        },
        getDroneModelData : function(id){
            return this.letdrone_api.getDeviceDataFromServer('dronePath/droneModel', id); 
        },
        getDroneSubModelList : function(type){
            return this.letdrone_api.getDeviceDataFromServer('dronePath/droneSubModel', type); 
        },
        getDroneSubThingList : function(type){
            return this.letdrone_api.getDeviceDataFromServer('dronePath/droneSubThing', type); 
        },
        getDroneSubThingData : function(id){
            return this.letdrone_api.getDeviceDataFromServer('dronePath/droneSubThing', id); 
        },
        getTempCommunicationList : function(){
            return this.letdrone_api.getDeviceFromServer('dronePath/getDeviceCommunicationList'); 
        }
    }
    
    return {
        /**
         * Singleton Interface of Let Drone Device Manager.
         * @function getInstance
         * @memberof LetDroneDeviceManager
         * @example 
         *      LetDroneDeviceManager.getInstance();
        */
        getInstance: function(){
            if( !instance ) {
                instance = new constructor();
            }
            return instance;
        }
    };
})();

