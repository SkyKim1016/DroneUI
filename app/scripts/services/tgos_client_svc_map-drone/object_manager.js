/* global LetDroneRestApi, TgosMapList, RestClient */
"use strict";

var LetDroneObjectManager = (function () {
    var instance;

    function constructor() {
        this.objectMapList = new TgosMapList();
    }

    constructor.prototype = {
        initialize: function (restLetDrone) {
            console.log('==================LetDroneObjectManager.initialized===========================');
            if (restLetDrone) {
                this.letdrone_api = restLetDrone;
            }

            var geoFencelist = this.letdrone_api.getGeofence("1"); //"1" should be replaced with map_id later
            var self = this;
            geoFencelist.then(function (res) {
                if(res === "empty"){
                    return;
                }
                self.objectMapList.add('geofence', res);
            });

            var airZonelist = this.letdrone_api.getAirzone("1"); //"1" should be replaced with map_id later
            var self = this;
            airZonelist.then(function (res) {
                if(res === "empty"){
                    return;
                }
                self.objectMapList.add('airzone', res);
            });

            var obstaclelist = this.letdrone_api.getObstacle("1"); //"1" should be replaced with map_id later
            var self = this;
            obstaclelist.then(function (res) {
                if(res === "empty"){
                    return;
                }
                self.objectMapList.add('obstacle', res);
            });

        },
        getObjectList: function (type) {
            return this.objectMapList.get(type);
        },
        postObject: function (type, data, callback) {
            console.log(data);
            var self = this;
            //var jsonPath = JSON.stringify(data); 
            var createObject = this.letdrone_api.postObjectToServer(type, data);
            createObject.then(function (res) {
                self.objectMapList.add(type, res);
                if(callback !== undefined){
                    callback();
                }
                console.log(res);

            });
        },
        deleteObject: function (data) {
            var self = this;
            console.log(data);
            if (data.getId() === undefined){
                console.log('id is not exist');
                return;
            }
            var deleteObject = this.letdrone_api.deleteObjectFromServer(data.getId());
            deleteObject.then(function (res) {
                console.log(res);
                
                
                /// TODO when delete list, check whether shrink length
                var list = self.getObjectList(data.getProperties().type);
                for(var index in list){
                    if(list[index].objt_id === data.getId()){
                        list.splice(index, 1);
                    }
                }
            });

        },

        updateObject: function(type,data){
            console.log(data);
            var self = this;
            var updateObject = this.letdrone_api.updateObjectToServer(type,data);
            updateObject.then (function (res){
                var list = self.getObjectList(data.objt_type);
                for (var index in list){
                     if(list[index].objt_id === data.getId()){
                            list[index] = data;
                        }   
                }
            })

        }

    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = new constructor();
            }
            return instance;
        }
    };
})();
