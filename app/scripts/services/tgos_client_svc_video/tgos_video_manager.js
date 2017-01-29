
var TGOSVideoService = (function(){
    function constructor(){
        
    }
    
    constructor.prototype = {
        onChangeData:function(){
            
        }
    }
    
    return constructor;
})();

var StreamManager = (function(){
    function constructor(){
        this.value = 1;
    }
    
    constructor.prototype = {
        initialize: function(){
            var result = 0;
            console.log('initialize');
            return result;
        },
        operate:function(){
            var result = 0;
            console.log('operate');
            return result;
        }
    }
    
    return constructor;
})();
/**
* TGOSStreamManager module
* @memberof tgos
* @name TGOSStreamManager
*/
var TGOSStreamManager = (function(){
    /**
     * Represents  a Constructor object of Tgos TGOSStreamManager.
     * @memberof TGOSStreamManager
     * @name constructor
     * @param info {object} target windows list And specific sdk id.
     */
    function constructor(info){
        this.activePlayers = [];
        this.source = new MediaSources(info);

        for(var index in info.windows){
            this.activePlayers[index] = new ActiveXPlayer({win:info.windows[index], source:this.source});
            
        }
    }
    constructor.prototype = {
        
        /**
         * Initialize a TGOS Stream Manager.
         * @function initialize
         * @memberof TGOSStreamManager
         * @param info {object} model name, ip address, port, id and password.
         * @example 
         *      var conInfo = {
         *          Model:"Samsung NVR",
         *          IpAddress:"192.168.xxx.xxx",
         *          Port:554,
         *          ID:"admin",
         *          PW:"admin"
         *      }
         *      var active_player = new TGOSStreamManager(conInfo);
        */
        initialize: function(info){
            var result = 0;
            
            
            this.source.initialize(info);
            
            
            for( var index in this.activePlayers ){
                this.activePlayers[index].initialize();
            }
            
            // temporary. get source media profiles.
            setTimeout(function(self){
                self.source.openMedia();
            }, 100, this);
            
            console.log('initialize');
            return result;
        },
        /**
         * play video stream.
         * @function open
         * @memberof TGOSStreamManager
         * @param info {object} channel id of property.
         * @example          
         *      active_player.open({channel:1});
        */
        open:function(info){
            this.activePlayers[info.window_index].open(info);
        }
    }
    
    return constructor;
})();

TGOSStreamManager.prototype.__proto__ = StreamManager.prototype;
/**
* MediaSources module
* @memberof tgos
* @name MediaSources
*/
var MediaSources = (function(){
    /**
     * Represents  a Constructor object of Tgos MediaSources.
     * @memberof MediaSources
     * @name constructor
     * @param info {object} specific sdk id.
     */
    function constructor(info){
        
        this.sdk = info.sdk_id;
        this.hDevice = 0;
        this.hMediaSource = [];
    }
    
    constructor.prototype = {
        /**
         * Initialize a Media Sources.
         * @function initialize
         * @memberof MediaSources
         * @param info {object} model name, ip address, port, id and password.
         * @example 
         *      var conInfo = {
         *          Model:"Samsung NVR",
         *          IpAddress:"192.168.xxx.xxx",
         *          Port:554,
         *          ID:"admin",
         *          PW:"admin"
         *      }
         *      player.initialize(conInfo);
        */
        initialize: function(info){
            this.sdk.Initialize();
            if(this.hDevice === 0){
                this.hDevice = this.sdk.CreateDevice(1);
                if(this.hDevice === 0){
                    console.log("CreateDevice() fail");
                    return;
                }
            }
            this.sdk.SetConnectionInfo(this.hDevice, "Samsung", info.Model, 1, info.IpAddress, info.Port, 0, info.ID, info.PW);        
            this.sdk.ConnectNonBlock(this.hDevice, false, false);
        },
        /**
         * oepn a Media Sources.
         * @function openMedia
         * @memberof MediaSources
         * @example 
         *      player.openMedia();
        */
        openMedia: function(){
            if(this.sdk.GetDeviceStatus(this.hDevice) !== 1){
                console.log ("Not connected..")
                return;
            }

            // Currently, Only NVR/DVR
            if(this.sdk.GetControlType(this.hDevice, 1) === 1){
                var nCount = this.sdk.GetControlCount(this.hDevice, 8);
                var index = 0;
                for(i = 0; i < nCount; i++){
                    if(this.sdk.GetControlCapability(this.hDevice, i+2, 37) != 0){
                        this.hMediaSource[index] = XnsSdkDevice.OpenMediaEx(this.hDevice, i+2, 1, 0, 0);
                        if(this.hMediaSource[index] !== 0){
                            console.log("DVR Media Open Success.");
                            console.log('hMediaSource', this.hMediaSource[index]);
                            index++;
                        }
                        else{
                            console.log("Media Open Failed.");
                        }
                    }
                }//for
            }
        },
        /**
         * oepn a Media Sources fron target device.
         * @function isAvailableSource
         * @memberof MediaSources
         * @param channel {Number} channel id.
         * @example 
         *      player.isAvailableSource(1);
        */
        isAvailableSource:function(channel){
            
            if(this.sdk.GetDeviceStatus(this.hDevice) !== 1){
                console.log("Not Connected..");
                return false;
            }

            if(this.hMediaSource[channel] !== 0){
                return true;
            }
            else{
                console.log("No Media Stream..");
                return false;
            }
            
        },
        /**
         * get a Media Sources.
         * @function getMediaSource
         * @memberof MediaSources
         * @param channel {Number} channel id.
         * @example 
         *      player.getMediaSource(1);
        */
        getMediaSource:function(channel){
            return this.hMediaSource[channel];
        }
    }
    
    return constructor;
})();
/**
* ActiveXPlayer module
* @memberof tgos
* @name ActiveXPlayer
*/
var ActiveXPlayer = (function(){
    /**
     * Represents  a Constructor object of Tgos ActiveXPlayer.
     * @memberof ActiveXPlayer
     * @name constructor
     * @param info {object} specific target window to draw video And MediaSource.
     */
    function constructor(info){
        this.win = info.win;
        this.source = info.source;
    }
    
    constructor.prototype = {
        /**
         * Initialize a activex player.
         * @function initialize
         * @memberof ActiveXPlayer
         * @param info {object} TBD.
         * @example          
         *      var player = new ActiveXPlayer({win:info.window, source:this.source});
        */
        initialize: function(info){
            this.win.Initialize(0, 0);
        },
        /**
         * play video stream.
         * @function open
         * @memberof ActiveXPlayer
         * @param info {object} channel id of property.
         * @example          
         *      player.open({channel:1});
        */
        open: function(info){
            if(this.win.IsMedia() === 1){
                console.log("Already Media Play..");
                return false;
            }

            if(this.source.isAvailableSource(info.channel)){
                var nError = this.win.Start(this.source.getMediaSource(info.channel));
                
                if(nError === 0){
                    console.log("Window[", info.window_index, "] Medida Play Success.", info.channel);
                    return true;
                }
                else{
                    console.log("Media Play Failed.!");
                }
            }
            
            return false;
        },
        
        /**
         * stop video stream.
         * @function close
         * @memberof ActiveXPlayer
         * @param info {object} channel id of property.
         * @example          
         *      player.close({channel:1});
        */
        close: function(info){
            if(this.win.IsMedia() === 0){
                console.log("No Media Play..");
                return false;
            }
            //maybe it is necessary to check only device status
            if(this.source.isAvailableSource(info.channel)){ 
                var stopSource = this.win.Stop();
                if(stopSource !== 0){
                    console.log("Media Play Stopped.");
                    return true;
                }
            }
            return false;
        },
        pause: function(info){
            console.log('Not Supported!');
        },
        resume: function(info){
            console.log('Not Supported!');
        }
    }
    
    return constructor;
})();
