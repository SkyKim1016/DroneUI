
var LetDroneWaypointManager = (function(){
    var instance;
    
    function constructor(){
        this.obListMan = observableListManager.getInstance();
        this.pathObList;
    }
    
    constructor.prototype = {
        initialize : function(restLetDrone){
            if(restLetDrone){
                this.letdrone_api = restLetDrone;    
            }
//            console.log("waypointManger: initialize()");
            this.pathObList = this.obListMan.getObservableList('waypointPath');     
            var wpPathlist = this.letdrone_api.getDeviceFromServer('waypointPath');  
            var self = this;
            wpPathlist.then(function(res){
                console.log(res);
                if(res instanceof Array){
                    for(var i=0; i<res.length; i++){
                        self.pathObList.addItem(res[i]);
                    }
                }
            });  
        },
        getPathById: function(type,data){
            var addr = "waypointPath/"+type;
            var wpObList = this.obListMan.getObservableList(addr); 
            console.log(wpObList);
            var wpPathInfo = this.letdrone_api.getPathByIdFromServer(addr,data);
            var self = this;
            wpPathInfo.then(function(res){
                console.log('getPathById', res); 
                wpObList.updateItem(res);     
            }); 
        },
        postWpPath: function(type, data, id){
            var self = this;
            console.log(data);
            var jsonPath = JSON.stringify(data);
            if(id === undefined || id === null){
                var createWpPath = this.letdrone_api.postWpPathFromServer(type,jsonPath);
                createWpPath.then(function(res){
                    self.pathObList.addItem(res.pathInfo);
                });
            }else{
                var addr = "waypointPath/"+id;
                var pathId = {way_pont_path_id: id}; 
                var deleteWpPath = this.letdrone_api.deleteWpPathFromServer(addr,pathId);
                deleteWpPath.then(function(res){
                    console.log(res);
                    if(self.pathObList !== null && self.pathObList !== undefined){
                        console.log("self.pathObList.delete");
                        var pathInfo = {"way_pont_path_id":id,"way_pont_path_name": data.pathInfo.way_pont_path_name};
                        self.pathObList.removeItem(pathInfo);
                    }
                    var wpObList = self.obListMan.getObservableList(addr);
                    if(wpObList !== null && wpObList !== undefined){
                        // console.log('post: wpObList is exist..');
                        wpObList.removeAllItem();
                    }
                    var createWpPath = self.letdrone_api.postWpPathFromServer(type,jsonPath);
                    createWpPath.then(function(res){
                        // console.log('postWpPath: ', res.pathInfo);
                        self.pathObList.addItem(res.pathInfo);
                    });
                })
            }
        },  
        deleteWpPath: function(type, data){
            var addr = "waypointPath/"+type;
            var pathId = {way_pont_path_id: data.way_pont_path_id};
            var deleteWpPath = this.letdrone_api.deleteWpPathFromServer(addr,pathId);
            var self = this;
            deleteWpPath.then(function(res){
                console.log(res);
                if(self.pathObList !== null && self.pathObList !== undefined){
                    console.log("self.pathObList.delete");
                    self.pathObList.removeItem(data);
                }
            });
        },
        getWpPathList : function(){
            var self = this;
            var wpPathlist = this.letdrone_api.getDeviceFromServer('waypointPath');  
            wpPathlist.then(function(res){
                self.pathObList.removeAllItem();
                if(res instanceof Array){
                    for(var i=0; i<res.length; i++){
                        self.pathObList.addItem(res[i]);
                    }
                }
            });  
            return self.pathObList.getItems();
        }
    }
    
    return {
        getInstance: function(){
            if( !instance ) {
                instance = new constructor();
            }
            return instance;
        }
    };
})();