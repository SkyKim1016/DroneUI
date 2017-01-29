kindFramework.controller('activeXLiveCtrl', ['$scope','$rootScope',
    function ($scope, $rootScope){
        
        var xnsWindowContainer = [XnsSdkWindow1, XnsSdkWindow2];
        $scope.info = {
            Model:"Samsung NVR",
            IpAddress:"192.168.2.201",
            Port:554,
            ID:"admin",
            PW:"init123!"
        }

        var hDevice = 0;
        var hMediaSource = [];
        var nError;
        
        $scope.channelid = 0;
        
        var WINDOWS_COUNT = 2;

        //[ XNS ACTIVEX HELP ]
        //-----------------------------------------------------------------------
        //@ JavaScript Window Load Event.
        //----------------------------------------------------------------------- 
        function window_onload()
        {
            hDevice = 0;
            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Initializes the DLL files. 
            // For this, XnsActiveX library requires config.xml, device.xml, 
            // and xns.xml files and the DLL file list should be mentioned 
            // in Xns.xml file. The path of the DLL file can not exceed 512 bytes
            // in length. The XnsActiveX library searches for xns.xml using 
            // XnsSDKDevice.ocx installed in "{$SDK path}\Config" folder.
            // -----------------------------------------------------------------------
            nError = XnsSdkDevice.Initialize();
            console.log("Initialize():: " + "(" + nError + ") [" + XnsSdkDevice.GetErrorString(nError) + "]");	

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Initializes the XnsSdkWindow control. 
            // Namely, this will specify the window handle in order to display 
            // images on the screen. 
            // -----------------------------------------------------------------------
            for(var index = 0; index < WINDOWS_COUNT; index++){
                nError = xnsWindowContainer[index].Initialize(0, 0);
                console.log("Initialize():: " + "(" + nError + ") [" + XnsSdkDevice.GetErrorString(nError) + "]");	
            }
        }


        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // @ JavaScript Window Unload Event.
        // ----------------------------------------------------------------------- 
        function window_onUnload()
        {
            console.log("ReleaseDevice()")
            XnsSdkDevice.ReleaseDevice(hDevice);
        }


        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // for Device Connect Function.
        // ----------------------------------------------------------------------- 
        function Do_Connect()
        {	// [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Assigns memory space for saving device information. 
            // This function will return the device handle, which the application 
            // can use to control the device.
            // [in] Device ID The value should be a greater integer than 0.
            // Minimum value: 1 , Maximum value: 3000
            // -----------------------------------------------------------------------
            if(hDevice == 0)
            {
                hDevice = XnsSdkDevice.CreateDevice(1);
                if(hDevice == 0)
                {
                    console.log("CreateDevice() fail");
                    return;
                }
            }

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Sets the device information so that the application can connect 
            // to the device.
            // -----------------------------------------------------------------------
            XnsSdkDevice.SetConnectionInfo(hDevice, "Samsung", $scope.info.Model, 1, $scope.info.IpAddress, $scope.info.Port, 0, $scope.info.ID, $scope.info.PW);        

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Enables the application to connect to the device using the connection 
            // information. You can use SetConnectionInfo() to configure the 
            // connection settings. This function performs as non-blocking function, 
            // and will be returned immediately even if the connection is not 
            // completed. The connection result will be transferred through the event. 
            // When connection is made successfully, the OnDeviceStatusChanged() event
            // will occur. When failed, the OnConnectFailed event occurs.
            // -----------------------------------------------------------------------    
            nError = XnsSdkDevice.ConnectNonBlock(hDevice, false, false);
            console.log("ConnectNonBlock():: " + "(" + nError + ") [" + XnsSdkDevice.GetErrorString(nError) + "]");
        }


        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // for Device DisConnect Function.
        // ----------------------------------------------------------------------- 
        function Do_Disconnect()
        {
            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Check if there exists stream source.
            // -----------------------------------------------------------------------
            if(xnsWindowContainer[index].IsMedia() == 1)
            {
                // [ XNS ACTIVEX HELP ]
                // -----------------------------------------------------------------------
                // Stops receiving the stream data from the media source handle.
                // -----------------------------------------------------------------------
                hMediaSource = xnsWindowContainer[index].Stop();
            }

            if(hMediaSource != 0)
            {
                // [ XNS ACTIVEX HELP ]
                // -----------------------------------------------------------------------
                // Terminates transferring media stream data from the device. The media
                // stream data will be separated by hMediaSource
                // (i.e., phMediaSource of OpenMedia()).
                // -----------------------------------------------------------------------
                XnsSdkDevice.CloseMedia(hDevice, hMediaSource);
                hMediaSource = 0;
            }

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Disconnects from the device.
            // -----------------------------------------------------------------------	
            nError = XnsSdkDevice.Disconnect(hDevice);
            console.log("Disconnect():: " + "(" + nError + ") [" + XnsSdkDevice.GetErrorString(nError) + "]");	
        }
var tempindex = 0;

        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // for Media Open Function.
        // ----------------------------------------------------------------------- 
        function Do_MediaOpen()
        {	
            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Returns the connection status of the device.
            // -----------------------------------------------------------------------
            if(XnsSdkDevice.GetDeviceStatus(hDevice) != 1)
            {
                console.log ("Not connected..")
                return;
            }

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Returns the type of control module corresponding to the control ID.
            // Control Module : DVR Check
            // -----------------------------------------------------------------------
            if(XnsSdkDevice.GetControlType(hDevice, 1) == 1)
            {
                // [ XNS ACTIVEX HELP ]
                // -----------------------------------------------------------------------
                // Returns the number of control modules. 
                // The application can get the number of specific type of control modules, 
                // and can get also the whole number of video recorders or cameras.
                // -----------------------------------------------------------------------
                nCount = XnsSdkDevice.GetControlCount(hDevice, 8);
                for(i = 0; i < nCount; i++)
                {
                    // [ XNS ACTIVEX HELP ]
                    // -----------------------------------------------------------------------
                    // Returns the capabilities of the control module.
                    // -----------------------------------------------------------------------
                    if(XnsSdkDevice.GetControlCapability(hDevice, i+2, 37) != 0)
                    {
                        // [ XNS ACTIVEX HELP ]
                        // -----------------------------------------------------------------------
                        // When called, it will start getting media streams from the device.
                        // The receiving media streams will, then, be forwarded to the XnsSdkWindow 
                        // component that will play the streams after decoding.
                        // phMediaSource is needed to link the stream data with XnsSdkWindow. 
                        // The value can be obtained from a parameter (out-parameter) of OpenMedia(). 
                        // When XnsSdkWindow receives this value, it can get stream data from the device.
                        // phMediaSource is also used for controlling playback of multimedia files. 
                        // As a result, the application should keep this value at all times.
                        // -----------------------------------------------------------------------
                        hMediaSource[tempindex] = XnsSdkDevice.OpenMediaEx(hDevice, i+2, 1, 0, 0);
                        if(hMediaSource[tempindex] != 0)
                        {
                            console.log("DVR Media Open Success.");
                            console.log('hMediaSource', hMediaSource[tempindex]);
                            tempindex++;
                        }
                        else
                        {
                            console.log("Media Open Failed.");
                        }
//                        return;
                    }
                }
            }
            // Control Module : Network Camera or Encoder Box (video Server)
            else if(XnsSdkDevice.GetControlType(hDevice, 1) == 2 || XnsSdkDevice.GetControlType(hDevice, 1) == 4)
            {
                nCount = XnsSdkDevice.GetControlCount(hDevice, 16);
                for (i = 0; i < nCount; i++)
                {
                    if(XnsSdkDevice.GetControlCapability(hDevice, i + 4, 37) == 1)
                    {
                        hMediaSource = XnsSdkDevice.OpenMediaEx(hDevice, i + 4, 1, 0, 0);
                        if(hMediaSource != 0)
                        {
                            console.log("Media Open Success.");
                        }
                        else
                        {
                            console.log("Media Open Failed");
                        }
                        return;
                    }
                }	
            }
        }


        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // for Media Close Function.
        // ----------------------------------------------------------------------- 
        function Do_MediaClose()
        {	
            if(XnsSdkDevice.GetDeviceStatus(hDevice) != 1)
            {
                console.log("Not Connected..");
                return;
            }

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Check if there exists stream source.
            // -----------------------------------------------------------------------
            if (xnsWindowContainer[index].IsMedia() == 1)	
            {
                // [ XNS ACTIVEX HELP ]
                // -----------------------------------------------------------------------
                // Stops receiving the stream data from the media source handle.  
                // -----------------------------------------------------------------------
                hMediaSource = xnsWindowContainer[index].Stop();	
            }

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Terminates transferring media stream data from the device. The media 
            // stream data will be separated by hMediaSource 
            // (i.e., phMediaSource of OpenMedia()).
            // -----------------------------------------------------------------------
            nError = XnsSdkDevice.CloseMedia(hDevice, hMediaSource);
            if(nError == 0)
            {
                hMediaSource = 0;
                console.log("Media Close Success.");
            }
            else
            {
                console.log("Media Close Failed.");
            }
        }


        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // for Play Video Function.
        // ----------------------------------------------------------------------- 
        function Do_PlayVideo(index)
        {	
              
            console.log($scope.channelid, index)
            if(XnsSdkDevice.GetDeviceStatus(hDevice) != 1)
            {
                console.log("Not Connected..");
                return;
            }

            if(xnsWindowContainer[index].IsMedia() == 1)
            {
                console.log("Already Media Play..");
                return;
            }

            if(hMediaSource[index] != 0)
            {
                // [ XNS ACTIVEX HELP ]
                // -----------------------------------------------------------------------
                // Adds the media source handle to XnsSdkWindow. 
                // The media source handle is created by XnsSdkDevice. 
                // If the application calls XnsSdkDevice::OpenMedia(), 
                // it will receive media stream from the device and return the MediaSource 
                // handle. The application uses uses Start() to forward the mediasource 
                // handle to XnsSdkWindow so that XnsSdkWindow can obtain stream data. 
                // -----------------------------------------------------------------------
                nError = xnsWindowContainer[index].Start(hMediaSource[index]);
                if(nError == 0)
                {
                    console.log("Medida Play Success.");
                }
                else
                {
                    console.log("Media Play Failed.");
                }
            }
            else
            {
                console.log("No Media Stream..");
            }
        }


        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // for Stop Video Function.
        // ----------------------------------------------------------------------- 
        function Do_StopVideo()
        {	
            if(XnsSdkDevice.GetDeviceStatus(hDevice) != 1)
            {
                console.log("Not Connected..");
                return;
            }

            if(xnsWindowContainer[index].IsMedia() == 0)
            {
                console.log("No Media Play..");
                return;
            }

            // [ XNS ACTIVEX HELP ]
            // -----------------------------------------------------------------------
            // Stops receiving the stream data from the media source handle.  
            // -----------------------------------------------------------------------
            var stopSource = xnsWindowContainer[index].Stop();
            if(stopSource != 0)
            {
                console.log("Media Play Stopped.");	
            }
        }

        

        // XNS ACTIVEX EVENT 

        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // @ Device Control Event.
        // This event occurs if the device status has 
        // d. It occurs if the
        // application uses Connect() to connect or reconnect to the device after
        // disconnected. When reconnecting, the third argument nDeviceStatus is
        // true, all media must be reopened using ReopenAllStream().
        // -----------------------------------------------------------------------
        function XnsSdkDevice::OnDeviceStatusChanged(nDeviceID, nErrorCode, nDeviceStatus, nHddCondition)
        {
            console.log("OnDeviceStatusChanged() EVENT:: device_id=" + nDeviceID + ", status=" + nDeviceStatus + ", error=" + nErrorCode + "[" + XnsSdkDevice.GetErrorString(nErrorCode) + "]");
            if(nErrorCode == 0 && nDeviceStatus == 1) 
            {
                console.log("Connected...");
                return;
            }
        }


        // [ XNS ACTIVEX HELP ]
        // -----------------------------------------------------------------------
        // @ Device Control Event.
        // If the application has failed in non-blocking connection using ConnectNonBlock(),
        // the OnConnectFailed event occurs.
        // As Connect() returns an immediate error message if failed,
        // it does not trigger this event.
        // -----------------------------------------------------------------------
        function XnsSdkDevice::OnConnectFailed(nDeviceID, nErrorCode)
        {
            console.log("OnConnectFailed() EVENT:: device_id=" + nDeviceID + ", error=" + nErrorCode + "[" + XnsSdkDevice.GetErrorString(nErrorCode) + "]");
        }
        
        function XnsSdkWindow1::OnLButtonUp(nFlag, x, y){
            
            $scope.clickEvent("#va");
            console.log('window1 mouse up', x, y);
        }
        
        function XnsSdkWindow2::OnLButtonUp(nFlag, x, y){
            $scope.clickEvent("#drone");
            console.log('window2 mouse up', x, y);
        }

        $scope.do_connect = Do_Connect;
        $scope.activex_onload = function(){
            window_onload();
            Do_Connect();
            setTimeout(function(){
                Do_MediaOpen();
                Do_PlayVideo(0);
                Do_PlayVideo(1);
            }, 100);
            
        }
        $scope.open_media = Do_MediaOpen;
        $scope.play_media = Do_PlayVideo;
        $scope.switchChannel = function(index){
            Do_StopVideo();
            Do_PlayVideo($scope.channelid);      
        }
             
	}]);
