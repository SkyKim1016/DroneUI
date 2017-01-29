"use strict"; 
/**
* RestClient module
* @memberof tgos
* @name RestClient
*/
var RestClient = (function(){
    function constructor(){

    }
    
    constructor.prototype = {
        initialize : function(){
            
        },
        /**
         * request uri to server with get method.
         * @function get
         * @memberof RestClient
         * @example 
         *      var rest_client = RestClient();
         *      rest_client.get('http://localhost:8080/device');
        */
        get : function(url, data){
            return $.get(url, data);
        },
        /**
         * request uri to server with post method.
         * @function post
         * @memberof RestClient
         * @example 
         *      var rest_client = RestClient();
         *      rest_client.post('http://localhost:8080/device', JSON.stringify({data:'ddd'});
        */
        post : function(url, data){
            return $.ajax({
                url:url,
                type:'POST',
                data:data,
                contentType: 'application/json'
            });
        },
        /**
         * request uri to server with put method.
         * @function put
         * @memberof RestClient
         * @example 
         *      var rest_client = RestClient();
         *      rest_client.put('http://localhost:8080/device', JSON.stringify({data:'ddd'});
        */
        put : function(url, data){
            return $.ajax({
                url:url,
                type:'PUT',
                data:data,
                contentType: 'application/json'
            });
        },
        /**
         * request uri to server with delete method.
         * @function delete
         * @memberof RestClient
         * @example 
         *      var rest_client = RestClient();
         *      rest_client.delete('http://localhost:8080/device', JSON.stringify({data:'ddd'});
        */
        delete : function(url, data){
            return $.ajax({
                url:url,
                type:'DELETE',
                data:data
            });
        }
    }
    
    return constructor;
})();

/**
* TgosMapList module
* @memberof tgos
* @name TgosMapList
*/
var TgosMapList = (function(){
    /**
     * Represents  a Constructor object of TgosMapListr.
     * @memberof TgosMapList
     * @name constructor
     */
    function constructor(){
        this.maplist = new Map();
    }
    
    constructor.prototype = {
        
        /**
         * When key is exist in map, it returns true .
         * @function constainsKey
         * @memberof TgosMapList
         * @param key {object} key of hash map
         * @return {boolean} is key exist.
         * @example 
         *      var map = TgosMapList();
         *      if(map.constainsKey('lock')){
         *          console.log('lock is exist');
         *      };
        */
        constainsKey : function(key) {
            return this.maplist.has(key);
        },
        /**
         * get object list by specific key.
         * @function get
         * @memberof TgosMapList
         * @param key {object} key of hash map
         * @return {array} object list.
         * @example 
         *      var map = TgosMapList();
         *      map.get('lock');
        */
        get : function(key) {
            return this.maplist.get(key);
        },
        /**
         * set object list by specific key.
         * @function set
         * @memberof TgosMapList
         * @param key {object} key of hash map
         * @param value {object} value to save.
         * @example 
         *      var map = TgosMapList();
         *      map.set('lock', ['ddd', 'aaa']);
        */
        set : function(key, value){
            var list = [];
            list.push(value);
            this.maplist.set(key, list);
        },
        /**
         * add object or list by specific key.
         * @function add
         * @memberof TgosMapList
         * @param key {object} key of hash map
         * @param value {object} value to save.
         * @example 
         *      var map = TgosMapList();
         *      map.add('lock', ['ddd', 'aaa']);
         *      map.add('lock', 'vvv');
        */
        add : function(key, value) {
            var list = [];
            if(this.constainsKey(key)) {
                list = this.get(key);
            }
            
            if(Array.isArray(value)){
                for(var arr in value){
                    list.push(value[arr]);
                }
            }
            else{
                 list.push(value);
            }
            
            this.maplist.set(key, list);
        },
        /**
         * delete object with specific key in map.
         * @function delete
         * @memberof TgosMapList
         * @param key {object} key of hash map
         * @param value {object} value to save.
         * @example 
         *      map.delete('lock', 'vvv');
        */
        delete : function(key, value) {
            if(value === undefined){
                this.maplist.delete(key);
            }
            else{
                var list = this.maplist.get(key);
                if(list === undefined){
                    console.log('Not Found Key ( ', key, ' ) in MapList');
                    return;
                }
                var index = list.indexOf(value);
                if(index == -1) {
                    console.log('Not Found value ( ', value, ' ) in key ( ', key,' )');
                    return;
                }
                list.splice(index, 1);
                if(list.length === 0){
                    this.maplist.delete(key);                    
                }
                else{
//                    this.set(key, list);
                }
                
            }
        },
        /**
         * It is clear in map .
         * @function clear
         * @memberof TgosMapList
         * @example 
         *      map.clear();
        */
        clear : function() {
            this.maplist.clear();
        },
        /**
         * get map size .
         * @function size
         * @memberof TgosMapList
         * @return {number} size of map.
         * @example 
         *      map.size();
        */
        size : function() {
            return this.maplist.size;
        },
        /**
         * is map empty .
         * @function isEmpty
         * @memberof TgosMapList
         * @return {number} is map empty
         * @example 
         *      map.isEmpty();
        */
        isEmpty : function() {
            return (this.size() === 0);
        }
    }
    
    return constructor;
})();

