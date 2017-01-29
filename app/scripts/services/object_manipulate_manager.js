var MapManagerMaker = (function () {
    var instance;

    function createInstance() {
        var myMapManager = new MapManager();
        return myMapManager;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


var ObjectManipulateManager = (function () {
    function constructor() {
        this.myMapMan = MapManagerMaker.getInstance();
    }

    constructor.prototype = {
        writeObject: function (feature) {

            if (feature === undefined) {
                console.log('feature is empty');
                return 0;
            }
            var featureArray = [];
            //for (var i = 0; i < features.length; i++) {
            var obj = {};


            if (feature.getId() !== undefined) {
                obj.objt_id = feature.getId();
                    
            }

            if (feature.getProperties.type === "geofence"){
                //here should be a drone id;
                //thing_id: feature.getProperties().drone_id,
            }


            if (feature.getGeometry().getType().toLowerCase() === "circle") {
                obj.objt_type = feature.getProperties().type;
                obj.objt_name = feature.getProperties().name;
                obj.lowerHeight = feature.getProperties().lowerHeight;
                obj.upperHeight = feature.getProperties().upperHeight;
                obj.groundRadius = feature.getProperties().groundRadius;
                obj.map_id = 1;
                obj.coordinateInfo = {}; 
                obj.coordinateInfo.type = feature.getGeometry().getType().toLowerCase();
                obj.coordinateInfo.coordinate = feature.getProperties().center;
                obj.coordinateInfo.radius = feature.getProperties().groundRadius*1.22868773406
            } else {
                obj.objt_type = feature.getProperties().type;
                obj.objt_name = feature.getProperties().name;
                obj.lowerHeight = feature.getProperties().lowerHeight;
                obj.upperHeight = feature.getProperties().upperHeight;
                obj.map_id = 1;
                obj.coordinateInfo = {}; 
                obj.coordinateInfo.type = feature.getGeometry().getType().toLowerCase();
                obj.coordinateInfo.coordinate = feature.getGeometry().getCoordinates();
            }
                featureArray.push(obj);
                var obtJson = JSON.stringify(featureArray);

               console.log(obtJson);

                return obtJson;

        },

        writeDevice: function (feature) {

            if (feature === undefined) {
                console.log('feature is empty');
                return 0;
            }

            var featureArray = [];
            //for (var i = 0; i < features.length; i++) {
            var obj = {};

            if (feature.getId() !== undefined) {
                obj.objt_id = feature.getId();
            }

            obj.objt_type = feature.getProperties().type;
            obj.objt_name = feature.getProperties().name;
            obj.angle = feature.getProperties().angle;
            obj.ip = feature.getProperties().ip;
            obj.map_id = 1;
            obj.coordinateInfo = {}; 
            obj.coordinateInfo.type = feature.getGeometry().getType().toLowerCase();
            obj.coordinateInfo.coordinate = feature.getGeometry().getCoordinates();
                
            featureArray.push(obj);
            var obtJson = JSON.stringify(featureArray);

            console.log(obtJson);

            return obtJson;

        },

        converterDroneToFeatureInfo: function(drone){

            var tempPosition = drone.coordinateInfo.coordinate;
            var transpos = this.myMapMan.transformCoord4326To3857(tempPosition);

            var featureInfo = {
                coordinateInfo: {
                    type: drone.coordinateInfo.type,
                    coordinate: transpos,
                },
                properties : {
                    id: drone.id,
                    type: drone.type,
                    name: drone.name,
                }

            };

            return featureInfo;
        },

        convertObjectToFeatureInfo: function(obj){

            var featureInfo = {
                coordinateInfo: {
                    type: obj.coordinateInfo.type,
                    coordinate: obj.coordinateInfo.coordinate,
                    radius: obj.coordinateInfo.radius
                },
                properties : {
                    id: obj.objt_id,
                    type: obj.objt_type,
                    name: obj.objt_name,
                    lowerHeight: obj.lowerHeight,
                    upperHeight: obj.upperHeight,
                    map_id: obj.map_id,
                    groundRadius: obj.groundRadius
                }

            };


            return featureInfo;

        },

        convertObjectFeatureToFeatureInfo: function (feature) {
           
            var featureInfo = {};

            if (feature.getGeometry().getType().toLowerCase() === "circle") {
                featureInfo = {
                    properties: {
                        type: feature.getProperties().type,
                        name: feature.getProperties().name,
                        lowerHeight: feature.getProperties().lowerHeight,
                        upperHeight: feature.getProperties().upperHeight,
                        groundRadius: feature.getProperties().groundRadius,
                        map_id: 1  
                    },
                    coordinateInfo: {
                        type: feature.getGeometry().getType().toLowerCase(),
                        coordinate: feature.getProperties().center,
                        radius: feature.getProperties().groundRadius*1.22868773406
                    }
                };

            } else {
                featureInfo = {
                    properties: {
                        type: feature.getProperties().type,
                        name: feature.getProperties().name,
                        lowerHeight: feature.getProperties().lowerHeight,
                        upperHeight: feature.getProperties().upperHeight,
                        map_id: 1,

                    },
                    
                    coordinateInfo: {
                        type: feature.getGeometry().getType().toLowerCase(),
                        coordinate: feature.getGeometry().getCoordinates()
                    }
                };

            }

            return featureInfo;
        },

        convertDeviceToFeatureInfo: function(obj) {

            var featureInfo = {
                coordinateInfo: {
                    type: obj.coordinateInfo.type,
                    coordinate: obj.coordinateInfo.coordinate
                },

                properties : {
                    id: obj.id,
                    type: obj.type,
                    name: obj.name,
                    angle: obj.angle,
                    ip: obj.ip
                }

            };


            return featureInfo;

        },

        setMap: function (mapData) {
            var obtJson = JSON.stringify(mapData);
            console.log(obtJson);
            return obtJson;
        }

    }

    return constructor;
})();

