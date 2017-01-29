///**
// * MQTT Client module
// * @memberof tgos
// * @name MqttClient
// */
//var MqttClient = (function () {
//    /**
//     * Represents  a constructor object of Tgos StatusManager.
//     * @memberof MqttClient
//     * @name constructor
//     */
//    function constructor(settings) {
//        this.topicMap = new Map();
//
//        if (settings !== undefined) {
//            this.settings = settings;
//        } else {
//            //default settings
//            this.settings = {
//                server: {
//                    port: 9001
//                    , hostName: '127.0.0.1' //55.101.44.215'
//                }
//                , opt: {
//                    reconnectPeriod: 3000
//                    , clientId: "clientId"
//                    , clean: false
//                }
//            }
//        }
//
//        this.client = mqtt.createClient(this.settings.server.port, this.settings.server.hostName, this.settings.opt);
//        self = this;
//        this.client.on("connect", function () {
//            console.log('open connection!');
//            self.topicMap.forEach(function (callback, topic, mapObj) {
//                self.subscribe(topic, callback);
//            });
//        });
//
//        this.client.on("close", function () {
//            console.log('close connection!');
//        });
//
//        this.client.on("message", function (topic, msg) {
//            var message = JSON.parse(msg);
//            if (self.topicMap.has(topic)) {
//                var callback = self.topicMap.get(topic);
//                callback(topic, msg);
//            }
//
//        });
//    }
//
//    constructor.prototype = {
//        /**
//         * subscribe data for specific topic.
//         * @function subscribe
//         * @memberof MqttClient
//         * @param topic {string} topic name to receive specific data.
//         * @param callback {function} callback function.
//         * @example 
//         *
//         *      var callback = function(topic, msg){
//         *
//         *      }
//         *      this.mqtt_client.subscribe(topic, callback);
//         *
//         */
//        subscribe: function (topic, callback) {
//                this.topicMap.set(topic, callback);
//                this.client.subscribe(topic, {
//                    qos: 0
//                }, function (err, result) {
//                    console.log("Subscribed:" + topic);
//                });
//            }
//            /**
//             * unsubscribe data for specific topic.
//             * @function unsubscribe
//             * @memberof MqttClient
//             * @param topic {string} topic name to not receive specific data.
//             * @example 
//             *
//             *      this.mqtt_client.unsubscribe(topic);
//             *
//             */
//            
//        , unsubscribe: function (topic) {
//            this.topicMap.delete(topic);
//            if (this.client) {
//                this.client.unsubscribe(topic, function () {
//                    // we need to change async.
//                    console.log("unsubscribed:" + topic);
//                });
//            }
//        }
//    }
//
//    return constructor;
//})();
//
///**
// * Status Manager module
// * @memberof tgos
// * @name StatusManager
// */
//var StatusManager = (function () {
//    /**
//     * singleton variable.
//     * @var instance
//     * @memberof StatusManager
//     */
//    var instance;
//
//    /**
//     * Represents  a constructor object of Tgos StatusManager.
//     * @memberof StatusManager
//     * @name constructor
//     */
//    function constructor() {
//        //        this.mqtt_client = new MqttClient();
//        this.mqtt_client = new MqttService();
//        this.listenerMap = new TgosMapList();
//
//        this.settings = {
//            url: 'ws://127.0.0.1:9001'
//            , connectOptions: {
//                keepalive: 60
//                , clientId: 'client_status_manager'
//            }
//            , subList: []
//            , useTopicEmmiter: true
//        }
//
//        this.initialize = (function (self, param) {
//            self.mqtt_client.connect(param.url, param.subList, param.connectOptions, param.useTopicEmmiter);
//            console.log('Initialize Status Manager!');
//        })(this, this.settings);
//
//    }
//
//    constructor.prototype = {
//        /**
//         * It is a inner function to dispatchs data for specific topic to each listeners.
//         * @function notifyToListeners
//         * @memberof StatusManager
//         * @param topic {string} topic name to receive specific data.
//         * @param msg {function} specific data.
//         * @example 
//         *
//         *      this.mqtt_client.subscribe(topic, this.notifyToListeners.bind(this));
//         *      //or  
//         *      this.mqtt_client.emmiter.on(topic, this.notifyToListeners.bind(this));
//         *
//         */
//        notifyToListeners: function (topic, msg) {
//                if (this.listenerMap.constainsKey(topic)) {
//                    var list = this.listenerMap.get(topic);
//                    for (var i in list) {
//                        try {
//                            //                        if (typeof (list[i]) === "function") {
//                            list[i](topic, msg);
//                            //                        }
//                        } catch (err) {
//                            console.log('remove listener already!!');
//                        }
//                    }
//                }
//            }
//            /**
//             * Add listener to receive data for topic in status manager.
//             * @function addListener
//             * @memberof StatusManager
//             * @param topic {string} topic name to receive specific data.
//             * @param listener {function} callback function to receive data.
//             * @example 
//             *      var attitudeListener = function(topic, data){
//             *          var msg = JSON.parse(data);
//             *          $scope.roll = msg.roll.toFixed(4);
//             *          $scope.pitch = msg.pitch.toFixed(4);
//             *          $scope.yaw = msg.yaw.toFixed(4);
//             *          $scope.$apply();
//             *      };
//             *      StatusManager.getInstance().addListener("TopicName", attitudeListener);
//             */
//            
//        , addListener: function (topic, listener) {
//                if (this.listenerMap.constainsKey(topic)) {
//                    this.listenerMap.add(topic, listener);
//                } else {
//                    this.listenerMap.set(topic, listener);
//                    //                this.mqtt_client.subscribe(topic, this.notifyToListeners.bind(this));
//
//                    this.mqtt_client.emmiter.on(topic, this.notifyToListeners.bind(this));
//                    this.mqtt_client.subscribe(topic, {
//                        qos: 0
//                    });
//                }
//                console.log('this.listenerMap', this.listenerMap);
//            }
//            /**
//             * delete listener to receive data for topic in status manager.
//             * @function deleteListener
//             * @memberof StatusManager
//             * @param topic {string} topic name to receive specific data.
//             * @param listener {function} callback function to receive data.
//             * @example 
//             *      var attitudeListener = function(topic, data){
//             *          var msg = JSON.parse(data);
//             *          $scope.roll = msg.roll.toFixed(4);
//             *          $scope.pitch = msg.pitch.toFixed(4);
//             *          $scope.yaw = msg.yaw.toFixed(4);
//             *          $scope.$apply();
//             *      };
//             *      StatusManager.getInstance().deleteListener("TopicName", attitudeListener);
//             */
//            
//        , deleteListener: function (topic, listener) {
//            if (this.listenerMap.constainsKey(topic)) {
//                this.listenerMap.delete(topic, listener);
//            }
//        }
//        , initialize: function (settings) {
//            //TODO. You have to add validation logic for setting;
//            this.mqtt_client.connect(settings.url, settings.subList, settings.connectOptions, settings.useTopicEmmiter);
//        }
//    }
//
//    return {
//        /**
//         * Singleton Interface of Status Manager.
//         * @function getInstance
//         * @memberof StatusManager
//         * @example 
//         *      StatusManager.getInstance();
//         */
//        getInstance: function () {
//            if (!instance) {
//                instance = new constructor();
//            }
//            return instance;
//        }
//    };
//})();
//
/**
 * Status Manager module
 * @memberof tgos
 * @name StatusManager
 */
var StatusManager = (function () {

    /**
     * singleton variable.
     * @var instance
     * @memberof StatusManager
     */
    var instance;

    return {
        /**
         * Singleton Interface of Status Manager.
         * @function getInstance
         * @memberof StatusManager
         * @example 
         *      StatusManager.getInstance();
         */
        getInstance: function () {
            if (!instance) {
                var param = {
                    url: 'ws://127.0.0.1:9001'
                    , connectOptions: {
                        keepalive: 60
                        , clientId: 'client_status_manager'
                    }
                    , subList: []
                    , useTopicEmmiter: true
                }
                instance = new MqttService();
                instance.connect(param.url, param.subList, param.connectOptions, param.useTopicEmmiter);
            }
            return instance;
        }
    };
})();