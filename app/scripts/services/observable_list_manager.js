var observableListManager = (function () {
    var instance;
    function constructor() {
        this.observableLists = {};
    }
    constructor.prototype = {
        getObservableList:function (key){
            if(this.observableLists[key] !== null 
               && this.observableLists[key] !== undefined){
                return this.observableLists[key];
            }else{
                var val = new ObservableList(key);
                this.observableLists[key] = val;
                return this.observableLists[key];
            }
            return false;    
        }
    }
    return {
        getInstance: function (){
            if(!instance){
                instance = new constructor();
            }
            return instance;
        }
    }
})();
var ObservableList = (function () {
    function constructor(keyword) {          
        this.array = [];
        this.keyword = keyword;
        this.observers = [];
        this.mayflyObservers = [];
    }
    
    constructor.prototype = {
        addItem: function(feature){
            if(this.keyword === 'waypoint'){
                var order = feature.getProperties().order;
                this.array[order] = feature; 
                this.notifyObservers('add',this.array);
            }else if(this.keyword === 'object' ) {
                this.array.push(feature);
                this.notifyObservers('add',this.array);
            }else {
                var input = JSON.stringify(feature);
                this.array.push(input);
                this.notifyObservers('add',this.array);
            }
        },
        removeItem:function(order){
            if(this.keyword === 'waypoint'){
                if(order > -1){
                    this.array.splice(order,1);
                }
                this.notifyObservers('remove',this.array);
            }else{
                var input = JSON.stringify(order);
                var index = this.array.indexOf(input);
                console.log(this.array);
                console.log(input);
                console.log('removeItem.index: ',index);
                if(index > -1) {
                    this.array.splice(index, 1);
                    this.notifyObservers('remove',this.array);
                }
            }
        },
        removeAllItem: function(){
            this.array = [];
            this.notifyObservers('removeAll',this.array);
        },
        updateItem:function(feature) {
            if(feature === null || feature === undefined){
                console.log('updateItem: input data is null(undefined)..')
                return;
            }
            var input = JSON.stringify(feature);
            console.log('updateItem:', this.array);
            var index = this.array.indexOf(input);
            console.log('updateItem: ',index);
                if(index > -1) {
                    this.array[index] = input;
                }else{
                    this.array.push(input);
                }
            console.log('updateItem: ', this.array);
            this.notifyObservers('update', this.getItems());
        },
        getItems: function(){
            if(this.array.length === 0){
                console.log(this.keyword+': '+'this.array is empty..');
                return false;
            }
            var arr = [];
            if(this.keyword === 'waypoint'){
                return this.array;
            }else{
                this.array.forEach(function(item, index){
                    arr[index] = JSON.parse(item);
                });
            }
            return arr;
        },
        subscribeObserver: function(observer) {
            this.observers.push(observer);
        },
        subscribeObserverOnce: function(observer) {
            this.mayflyObservers.push(observer);  
        }, 
        unsubscribeObserver: function(observer) {
            var index = this.observers.indexOf(observer);
            if(index > -1) {
                this.observers.splice(index, 1);
            }
        },
        notifyObservers: function(status,features) {
            for(var j = this.mayflyObservers.length ; j > 0 ; j--){
                this.mayflyObservers[j-1].notify(status, features);
                this.mayflyObservers.pop();
            }
            for(var i = 0; i < this.observers.length; i++){
                this.observers[i].notify(status, features);
            }
        }
    }
    
    return constructor;
})();

var Observer = function() {
    return {
        notify: function(status, features) {
            //console.log("Observer " + status + " is notified!", features); 
            
        }
    }
};