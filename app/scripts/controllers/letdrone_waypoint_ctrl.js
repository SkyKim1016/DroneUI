kindFramework.controller('letdroneWayPointCtrl', function ($scope, $rootScope, $timeout, mapService, LetDroneWaypointService, colorpicker) {
/*
*   Waypoint Controller
*/

    // Initialization
    $scope.modeState = {
        viewMode : true,
        modeText : "View Mode"
    };

    //Initialize valiables
    $scope.NewPathName = "";
    $scope.modalOpenExistingPath = false;
    $scope.SelectedWP = [];
    $scope.WPinfoShow = false;
    $scope.WPinfoActionShow = false;
    $scope.distanceInterval = 0;
    $scope.DisableWPinfoModal = false;
    $scope.WPDataSet = [];
    $scope.modalOpenSaveAsPath = false;
    $scope.SaveAsPathName = "";
    $scope.GPSMode = 'latlong';
    
    //no matching UI 
    var edited = false;
    var loadedPathName = "";
    var loadedPathId = null;
    var selectedBtn = false;
    var wpSelectEmiter = undefined;
    //Modal Variables
    $scope.modamodalOpenNewPathlOpen = false;
    
    //Ng-Disabled
    $scope.LoadExistingPathDisabled = true;
    $scope.SelectWPBtnOn = false;
    $scope.SelectAllWPBtnOn = false;

    //Validation
    //loadPath(true) or newPath(false)
    $scope.ExistingPathOpened = false;
    //waypoint action property style
    $scope.wpDataActionSet = [];

    //Total waypoint counter(in view)
    $scope.TotalWPs = 0;
    $scope.DistBtwTwoWPs = 0;
    $scope.TotalDist = 0;
    $scope.TotalFlight = 0;
    $scope.SelectedWpOrder = '';

    //LeftSide: Save button ON/OFF
    $scope.SaveOnOff = function(){
        // console.log(!$scope.modeState.viewMode,!$scope.ExistingPathOpened,$scope.TotalWPs !== 0);
        if((!$scope.modeState.viewMode)&&(!$scope.ExistingPathOpened)&&($scope.TotalWPs !== 0)){
            return true;
        }
        return false;
    }
    //LeftSide: SaveAs button ON/OFF
    $scope.SaveAsOnOff = function(){
        if($scope.ExistingPathOpened&&($scope.TotalWPs !== 0)){
            return true;
        }
        return false;
    }
    //RightSide: Select, SelectAll button ON/OFF
    $scope.SelectOnOff = function(){
        if(($scope.TotalWPs !== 0) &&(!$scope.modeState.viewMode)){
            return true;
        }
        if($scope.SelectWPBtnOn){ $scope.SelectWPBtn(); }
        if($scope.SelectAllWPBtnOn){ $scope.SelectAllWPBtn(); }
        return false;
    }
    $scope.RemoveOnOff = function(){
        if(($scope.TotalWPs !== 0) &&(!$scope.modeState.viewMode)&&($scope.SelectedWP.length != 0)){
            return true;
        }
        return false;
    }
    $scope.RemoveAllOnOff = function(){
        if(($scope.TotalWPs !== 0) &&(!$scope.modeState.viewMode)){
            return true;
        }
        return false;   
    }
    $scope.EditBtnOnOff = function(){
        if($scope.SelectedWP.length == 1){
            if($scope.SelectWPBtnOn == true || $scope.SelectAllWPBtnOn == true){
                return true;
            }
        }
        return false;
    }
    $scope.UpBtnOnOff = function(){
        if($scope.SelectedWP.length < 1){
            return false;
        }else if($scope.SelectedWP.length == $scope.TotalWPs){
            return false;
        }else{

            for(var i in $scope.SelectedWP){
                var order = $scope.SelectedWP[i];
                if(order == 1){
                    return false;
                }
            }
        }
        return true;
    }
    $scope.DownBtnOnOff = function(){
        // console.log('down : ',$scope.SelectedWP.length);
        if($scope.SelectedWP.length < 1){
            return false;
        }else if($scope.SelectedWP.length == $scope.TotalWPs){
            return false;
        }else{
            for(var i in $scope.SelectedWP){
                var order = $scope.SelectedWP[i];
                if(order == $scope.TotalWPs){
                    return false;
                }
            }
        }
        return true;
    }

    $timeout(function(){
        wpSelectEmiter = mapService.getWpEvtInstance();
        wpSelectEmiter.addListener('defaultWp', defaultWpListener);
        wpSelectEmiter.addListener('selectedWp', selectedWpListener); 

        var obs = mapService.createObserver();
        obs.notify = function(status, features){
            $timeout(function(){
                // console.log("New WP Feature", features);
                $scope.WPDataSet = features;
                $scope.TotalDist = TotalDistance(features);
                if($scope.WPDataSet.length === 0){
                    $scope.TotalWPs =  $scope.WPDataSet.length;                    
                }else{
                    $scope.TotalWPs =  $scope.WPDataSet.length - 1;                    
                }
                var wpAreaW = $(".wpArea ul li").size()* 100 * $scope.WPDataSet.length + 'px';
                $(".wpArea ul").css('width',  wpAreaW );
            });
        };
        mapService.subscribeObserver('waypoint', obs);
        
        var obs1 = mapService.createObserver();
        obs1.notify = function(status, features){
            // console.log('path noti',status);
            if(status === 'remove'){
                //path list refresh after Delete path
                $scope.OpenExistingPathModal();
            }
        };
        mapService.subscribeObserver('waypointPath', obs1);
    });


    // button disabled
    $scope.disabled = function(){
        $('button:disabled').parent().addClass('off');
    };


    var validateStr = function (str){
        var iChars = "!@#$%^&amp;*()+=-[]\\\';,./{}|\":<;>;?";
        if(str == "" || str == undefined){
            alert("Failed:: Enter the path name");
            return false;
        }else if(str.length > 20){
            alert("Max length is 20..");
            return false;
        }
        for (var i = 0; i < str.length; i++) {
            if (iChars.indexOf(str.charAt(i)) != -1) {
                // console.log('Special Characters: ',str.charAt(i));
                alert ("Special Characters are not allowed..");
                return false;
            }
        }
    };



//LEFT SIDE MENU [ New, Open, Switch mode, Save, Save As ]
/************************ SWITCH MODE [View mode, Edit mode etc.] **************************/

    // Switches between View Mode vs. Edit Mode
    $scope.switchMode = function(mode){
        // console.log(mode);
        if(mode == 'edit'){
            mapService.setMapMode(1);
            $scope.modeState.viewMode = false;
            $scope.modeState.modeText = "Edit Mode";
            $scope.DisableWPinfoModal = false;
            edited = true;
        } else if (mode == 'view'){
            mapService.setMapMode(0);
            $scope.modeState.viewMode = true;
            $scope.modeState.modeText = "View Mode";
            $scope.DisableWPinfoModal = true;
            $scope.SelectedWP = [];
            edited = false;
        }
    };

    // Cancel edit mode
    $scope.CancelEditMode = function(){
        console.log('$scope.ExistingPathOpened',$scope.ExistingPathOpened);
        if($scope.ExistingPathOpened === true){
            $('#viewMode').addClass('on');

            //$scope.cancelOpendWP = true;
            mapService.wpClearLayer();

            if(loadedPathName !== ""){
                loadedPathId = getLoadedPathId(loadedPathName);
                $scope.LoadExistingPathDisabled = true;
                if(loadedPathId !== null){
                    $scope.SelectExistingPath(loadedPathId,loadedPathName);
                    $scope.OpenExistingPath();
                }
            }
        } else {
            mapService.wpClearLayer();
            $('#editWP').removeClass('on');
            $scope.LoadExistingPathDisabled = true;
        }

        $scope.switchMode('view');
        $scope.SelectWPBtnOn = false;
        $scope.SelectAllWPBtnOn = false;
        $scope.NewPathName = "";
    };

/************************ NEW PATH [new button, new path modal etc.] **************************/
    // Open new path modal
    $scope.OpenNewPathModal = function(){
        $scope.modalOpenNewPath = true;
        $scope.WPDataSet = [];
        $('#viewMode').removeClass("on");
        mapService.wpClearLayer();
        var dimedH = $(document).height();    
        $('.dimed').css('height',dimedH);   
    };

    // open new path
    $scope.CreateNewPath = function(){
        $scope.ExistingPathOpened = false;
        $scope.TotalWPs = 0;
        //load path list in DB
        $scope.ExistingPathList = LetDroneWaypointService.getWpPathList('waypointPath');
        //check empty path name
        var validate = validateStr($scope.NewPathName);
        if(validate === false){
            $scope.NewPathName = "";
            document.getElementById("newPathName").focus();
            return;
        }
        //check duplicate path name
        for(var i in $scope.ExistingPathList){
            if($scope.NewPathName === $scope.ExistingPathList[i].way_pont_path_name){
                alert("Path alreay exist");
                return 0;
            }
        }
        $scope.switchMode("edit");
        $scope.modalOpenNewPath = false;
    };

    // Close new path modal
    $scope.CloseNewPathModal = function(){
        $scope.modalOpenNewPath = false;
        $scope.CancelEditMode();
    };


/************************ LOAD PATH [open button, load path modal, Preview path etc.] **************************/
    // Open existing path modal
    $scope.OpenExistingPathModal = function(){
        var dimedH = $(document).height();    
        $('.dimed').css('height',dimedH);

        $scope.modalOpenExistingPath = true;
        $scope.WPDataSet = [];
        $('#viewMode').removeClass("on");
        mapService.wpClearLayer();

        $scope.ExistingPathList = LetDroneWaypointService.getWpPathList('waypointPath');
    
        console.log($scope.ExistingPathList);
    };

    // Select existing path
    $scope.SelectExistingPath = function(id, name){
        mapService.wpClearLayer();
        loadedPathId = id;
        loadedPathName = name;
        var saveAsNum = 1;
        $scope.SaveAsPathName = loadedPathName + "_1"
        // console.log(loadedPathId + " ===== " + loadedPathName);
        for(i in $scope.ExistingPathList){
            $('#pathList_'+$scope.ExistingPathList[i].way_pont_path_id).removeClass("on");
        }

        $scope.LoadExistingPathDisabled = false;
        $('#pathList_'+id).addClass("on");

        var input = {way_pont_path_id: loadedPathId};
        var path = LetDroneWaypointService.getPathById(loadedPathId, input);
        var pathInfo;
        var addr = 'waypointPath/'+loadedPathId;

        var preWpList = mapService.createObserver();
        preWpList.notify = function(status, features){
            //mapService.wpClearLayer();
            if(features instanceof Array){
                features.forEach(function(item, index){     
                    loadPath = mapService.loadWpPath(item);                        
                });
            }else {
                loadPath = mapService.loadWpPath(features);
            }
            // console.log('SelectExistingPath: ',features);
        };
        mapService.subscribeObserverOnce(addr, preWpList);
    };

    // Delete path
    $scope.DeletePath = function(){
        if($scope.LoadExistingPathDisabled == true){
            alert('select path !!');
            return;
        }
        if(loadedPathId !== null && loadedPathId !== undefined){
            var input = {way_pont_path_id: loadedPathId,
                         way_pont_path_name: loadedPathName};
            LetDroneWaypointService.deleteWpPath(loadedPathId, input);
            mapService.wpClearLayer();
            // $scope.CloseExistingPathModal();
            $('#viewMode').removeClass('on');
            $scope.ExistingPathOpened = false;
            loadedPathId = null;
            loadedPathName = "";
            $scope.SaveAsPathName = "";
        }
        $scope.LoadExistingPathDisabled = true; 
    };

    $scope.OpenExistingPath = function(){
        if($scope.LoadExistingPathDisabled == true){
            alert('select path !!');
            return;
        }
        $scope.modalOpenExistingPath = false;
        $scope.switchMode("edit");
        $scope.ExistingPathOpened = true;
        $scope.LoadExistingPathDisabled = true;
    };

    // Close existing path modal
    $scope.CloseExistingPathModal = function(){
        $scope.modalOpenExistingPath = false;
        $scope.CancelEditMode();
    };

/************************ SAVE PATH [save path , save as path etc.] **************************/
    //Get path id through path name
    var getLoadedPathId = function(pathName){
        var loadPathId;
        $scope.ExistingPathList = LetDroneWaypointService.getWpPathList('waypointPath');
        for(var i in $scope.ExistingPathList){
            if($scope.ExistingPathList[i].way_pont_path_name === pathName){
                loadPathId = $scope.ExistingPathList[i].way_pont_path_id;
                return loadPathId;  
            }                    
            console.log('loadedPathId is null: '+i+' : '+ loadedPathId);
        }
        return null;    
    };

    // Save new path
    $scope.SaveNewPath = function(){
        if($scope.NewPathName === "" && loadedPathName !== ""){
            console.log('save existing');
            console.log('Save WP::' + loadedPathName);
            if(loadedPathId === null || loadedPathId === undefined){
                loadedPathId = getLoadedPathId(loadedPathName);
            }
            var pathJSON = mapService.saveWpPath( loadedPathName );
            LetDroneWaypointService.postWpPath('waypointPath',pathJSON,loadedPathId);

        } else if($scope.NewPathName !== "") {
            console.log('save new');
            console.log('Save WP::' + $scope.NewPathName);
            
            var pathJSON = mapService.saveWpPath( $scope.NewPathName );
            LetDroneWaypointService.postWpPath('waypointPath',pathJSON, null);   
            //TODO : 추후 저장이 안되는 경우 처리 필요(DB message check) 
            loadedPathName = $scope.NewPathName;
        }
        loadedPathId = null;
        var saveAsNum = 1;
        $scope.SaveAsPathName = loadedPathName + "_1"
        $scope.NewPathName = "";
        $scope.ExistingPathOpened = true;
        $('#viewMode').addClass('on');
        $scope.switchMode('view');
    };

    // open saveAsPath name input modal 
    $scope.OpenSaveAsPathModal = function(){
        var saveAsNum = 1;
        if(loadedPathName !== ""){
            $scope.SaveAsPathName = loadedPathName + '_'+saveAsNum.toString();
            $scope.ExistingPathList = LetDroneWaypointService.getWpPathList('waypointPath');
            for(var i in $scope.ExistingPathList){
                //check duplicate SaveAsPath name
                if($scope.SaveAsPathName === $scope.ExistingPathList[i].way_pont_path_name){
                    saveAsNum += 1;
                    $scope.SaveAsPathName = loadedPathName + "_"+ saveAsNum.toString();
                }                    
            }
        }else{
            $scope.SaveAsPathName = "";
        }
        $scope.modalOpenSaveAsPath = true;
    };

    //close saveAsPath name input modal
    $scope.CloseSaveAsPathModal = function(){
        $('#viewMode').addClass('on');
        $scope.switchMode('view'); 
        $scope.modalOpenSaveAsPath = false;
    };

    // Save path as 
    $scope.SaveNewPathAs = function(){

        console.log('save as existing');
        console.log('Save as WP::' + $scope.SaveAsPathName);
        // saveas path name validation check
        var validate = validateStr($scope.SaveAsPathName);
        if(validate === false){
            //$scope.SaveAsPathName = "";
            document.getElementById("saveAsPathName").focus();
            return;
        }
        //check duplicate saveas path name
        $scope.ExistingPathList = LetDroneWaypointService.getWpPathList('waypointPath');
        for(var i in $scope.ExistingPathList){
            if($scope.SaveAsPathName === $scope.ExistingPathList[i].way_pont_path_name){
                alert("Path alreay exist");
                return 0;
            }
        }

        var pathJSON = mapService.saveWpPath( $scope.SaveAsPathName );
        LetDroneWaypointService.postWpPath('waypointPath',pathJSON);
        
        loadedPathName = $scope.SaveAsPathName;
        loadedPathId = null;
        $scope.ExistingPathOpened = true;
        $scope.SaveAsPathName = $scope.SaveAsPathName + "_1";
        
        $scope.CloseSaveAsPathModal();
    };


//RIGHT SIDE MENU [ Select, SelectAll, Remove, RemoveAll, Template, Survey grid ]
/************************ SELECT PATH [Select, Selecte All, etc.] **************************/
    //emit (selectedWp) event listener
    var num = 0;
    var selectedWpListener = function(feature){
        $('#wp_'+feature).addClass("on");
        var index = $scope.SelectedWP.indexOf((feature).toString());
        if(index < 0){
            $scope.SelectedWP.push((feature).toString());
        }
    };
    //emit (defaultWp) event listener
    var defaultWpListener = function(feature){
        if($scope.WPDataSet.length <= feature){
            console.log('defaultWpListener : ', self.selectedWps);
            return;
        }
        if(feature === -1){
            if($scope.SelectAllWPBtnOn === true){
                $scope.SelectAllWPBtn();
                return;
            }
            return;
        }
        $('#wp_'+$scope.WPDataSet[feature].getProperties().order).removeClass("on");
        var index = $scope.SelectedWP.indexOf((feature).toString());
        if(index < 0){

        }else{
            $scope.SelectedWP.splice(index, 1);
        }
    };

    // Select WP
    $scope.SelectWPBtn = function() {
        if($scope.modeState.viewMode === false){
           ($scope.SelectWPBtnOn === false) ? $scope.SelectWPBtnOn = true : $scope.SelectWPBtnOn = false; 
           
           if($scope.SelectWPBtnOn === true){
                selectedBtn = true;
                mapService.setMapMode(2);
                // if(mapService.getMapMode() === 1){
                    
                // } else if(mapService.getMapMode() === 2){
                //     mapService.setMapMode(2);
                // }
           } else {
                mapService.setMapMode(1);
                if(selectedBtn === true){
                    $scope.SelectedWP = [];
                    for(i in $scope.WPDataSet){
                        $('#wp_'+$scope.WPDataSet[i].getProperties().order).removeClass("on");
                        wpSelectEmiter.emit('deSelected',[mapService, $scope.WPDataSet[i]]);
                    }
                    selectedBtn = false;

                } else {
                    mapService.setMapMode(1);
                }
           }
        }
    };

    //Select All WP
    $scope.SelectAllWPBtn = function() {        
        ($scope.SelectAllWPBtnOn === false)? $scope.SelectAllWPBtnOn = true : $scope.SelectAllWPBtnOn = false;

        if($scope.SelectAllWPBtnOn === true){
            $scope.SelectedWP = [];
            for(i in $scope.WPDataSet){
               wpSelectEmiter.emit('selected',[mapService, $scope.WPDataSet[i]]); 
               $scope.SelectedWP.push(($scope.WPDataSet[i].getProperties().order).toString());
                $('#wp_'+$scope.WPDataSet[i].getProperties().order).addClass("on");
            }
        } else {
            $scope.SelectedWP = [];
            for(i in $scope.WPDataSet){
                wpSelectEmiter.emit('deSelected',[mapService, $scope.WPDataSet[i]]);
                $('#wp_'+$scope.WPDataSet[i].getProperties().order).removeClass("on");
            }
        }
    };

/************************ REMOVE PATH [Remove, Remove All, etc.] **************************/
    $scope.RemoveSelectedWP = function(){
        if($scope.modeState.viewMode == false &&($scope.SelectWPBtnOn === true || $scope.SelectAllWPBtnOn === true )){
            console.log('RemoveSelectedWP: ',$scope.SelectedWP);
            var wpOrder = $scope.SelectedWP;
            if(wpOrder != 0 || wpOrder != undefined){
                wpOrder.forEach(function(item, index){
                    wpOrder[index] = Number(item); 
                });
            }
            console.log('remove: ', $scope.SelectedWP);
            for(i in $scope.SelectedWP){
                $('#wp_'+$scope.SelectedWP[i]).removeClass("on");
            }
            mapService.deleteWaypoints(wpOrder); 
            
            selectedBtn = false;
            $scope.SelectAllWPBtnOn = false;

            $scope.SelectedWP = [];
        }
    };
    // Remove All WP
    $scope.RemoveAllWP = function () {
        if($scope.modeState.viewMode == false){
            for(i in $scope.WPDataSet){
                $('#wp_'+$scope.WPDataSet[i].way_pont_ord_no).removeClass("on");
            }
            $scope.WPDataSet = [];
            $scope.SelectedWP = [];
            mapService.wpClearLayer();
        }
    };

/************************ TEMPLATE, SURVEY GRID **************************/
    $scope.tempOpen = function(){
       $('#templateLayer').show();
    };
    $scope.tempClose = function(){        
       $('#templateLayer').hide();
    };    
    $scope.surveyOpen = function(){
       $('#surveyGridLayer').show();
    };
     $scope.surveyClose = function(){       
       $('#surveyGridLayer').hide();
    };
     $scope.surveyLayer = function(){ 

        $('.survey button').click(function(){
                 
            if ($(this).is('.on')){                
                $(this).removeClass('on')                             
            }else{
                $('.survey button').removeClass('on')
                $(this).addClass('on')
            }         
        });
    };
    $scope.templateLayer = function(){ 
        $('.layerTypeA').draggable();
        $('.btnTemplat button').click(function(){                 
            if ($(this).is('.on')){                
                $(this).removeClass('on')                             
            }else{
                $('.btnTemplat button').removeClass('on')
                $(this).addClass('on')
            }         
        });

        $('.btnCircle, .btnTempZ').click(function(){                 
             $('.numPoint select').prop("disabled",false)     
        });
         $('.btnSquare, .btnTriangle').click(function(){                 
             $('.numPoint select').prop("disabled",true)     
        });

    };


//BOTTOM SIDE MENU [ WP List, WP property modal, WP action modal, chageOrder, Total Dist, WP Dist, Total Flight, Total Waypoints ]    
/************************ SELECT WP LIST  [select bottom side wplist, open/close wp property modal, etc.] **************************/
    // Select WP from Bottom()
    $scope.SelectWP = function(id){
        //select wplist when select button is pressed.
        if($scope.SelectWPBtnOn === true && $scope.modeState.viewMode === false){
            $('#wp_'+id).toggleClass("on");
            var index = $scope.SelectedWP.indexOf(id.toString());
            // console.log('selectWP: ',index);

            if(index < 0){
                wpSelectEmiter.emit('selected',[mapService, $scope.WPDataSet[id]]);
                $scope.SelectedWP.push(id.toString());
            } else {
                wpSelectEmiter.emit('deSelected',[mapService,$scope.WPDataSet[id]]);
                $scope.SelectedWP.splice(index, 1);
            }
            //select wplist when select button is not pressed.
        }  else {
            $('#wp_'+id).toggleClass("on");
            wpSelectEmiter.emit('selected',[mapService, $scope.WPDataSet[id]]);
            $scope.SelectedWP.push(id.toString());
            $scope.OpenWPinfoModal(); 
        }
    };
    //open property modal of selected wp
    $scope.OpenWPinfoModal = function(){
        // console.log('OpenWPinfoModal: ',$scope.SelectedWP);
        $scope.GPSMode = mapService.getGpsMode();
        if($scope.SelectedWP.length == 0){
            alert('Select One WP!!');
            return;
        }else if($scope.SelectedWP.length > 1){
            alert('Select One WP!!');
            return 0;
        } else {
            // console.log('OpenWPinfoModal::'+$scope.SelectedWP[0]);
            $scope.SelectedWpOrder = $scope.SelectedWP[0];
            $scope.wpData = $scope.WPDataSet[$scope.SelectedWP[0]];
            // console.log('-----point info------');
            // console.log($scope.wpData);
            $scope.coords = $scope.CoordsConvert($scope.wpData);

            if($scope.wpData.getProperties().action == undefined){
                console.log('actn_str:undefined',$scope.wpData);
            } else {
                $scope.DeleteWPinfoAction();
                var act = $scope.wpData.getProperties().action;
                for(var i in act){
                    var type = act[i].type;
                    switch(type){
                        case 'takeoff':
                            $scope.wpDataActionSet.push(act[i]);
                            break;
                        case 'speed':
                            $scope.wpDataActionSet.push(act[i]);
                        break;
                        case 'camera':
                            $scope.wpDataActionSet.push(act[i]);
                        break;
                        case 'land':
                            $scope.wpDataActionSet.push(act[i]);
                        break;
                        case 'home':
                            $scope.wpDataActionSet.push(act[i]);
                        break;
                        default: console.log('action type: ', type);
                    }
                }       
                // console.log('action:',$scope.wpData.getProperties().action);
            }
            $scope.slider = {
                alt: $scope.wpData.getProperties().altitude,
                speed: $scope.wpData.getProperties().speed,
                wt: $scope.wpData.getProperties().wait,
                options: {
                    orientation: 'horizontal',
                    min: 0,
                    max: 255,
                    range: 'min',
                    change: refreshSwatch,
                    slide: refreshSwatch
                }
            };            
            $scope.WPinfoShow = true;
        }
    };

    $scope.SaveWpinfo = function(){
        var coords = $scope.CoordsReConvert($scope.coords);
        if(coords === false){
            return;
        }
        console.log('SaveWpinfo::::' , coords);
        var wpInfo ={
                'latitude': Number(coords[1]),
                'longitude': Number(coords[0]),
                'altitude': $scope.slider.alt,
                'speed': $scope.slider.speed,
                'wait': $scope.slider.wt,
                // 'action': [$scope.wpDataAction]
                'action': $scope.wpDataActionSet 
        };
        mapService.changeWpInfo($scope.WPDataSet[$scope.SelectedWP[0]],wpInfo);
        console.log('WPData Change');
        console.log($scope.WPDataSet[$scope.SelectedWP[0]]);
        $scope.CloseWPinfoModal();
    };

    $scope.CloseWPinfoModal = function(){
        $scope.WPinfoShow = false;
        $scope.DeleteWPinfoAction();
        var id = Number($scope.SelectedWP[0]);
        // console.log('CloseWPinfoModal: ',$scope.WPDataSet[id]);
        wpSelectEmiter.emit('deSelected',[mapService,$scope.WPDataSet[id]]);
        $('#wp_'+$scope.SelectedWP[0]).toggleClass("on");
        
        $scope.SelectedWP = [];
    };

    
    //click cancel button in wp property modal(initialize action UI, before open another wp property) 
    $scope.DeleteWPinfoAction = function(){
        $scope.wpDataActionSet = [];
    };
    //click a wastebasket icon in property modal
    $scope.DelCheckedWPAction = function(){
       for(var i in $scope.wpDataActionSet){
            var id = $scope.wpDataActionSet[i].type;
            // console.log('Deeeeee: ',document.getElementById(id));
            if(document.getElementById(id).checked){
                $scope.wpDataActionSet.splice(i,1);
            } 
        }        
    };
    //open wp action modal when addaction button is clicked(in wp property modal)
    $scope.OpenWPinfoActionModal = function(){
        if($scope.modeState.viewMode == false){
            $scope.HideRange = true;
            $scope.WPinfoActionShow = true;
        }
    };

    $scope.CloseWPinfoActionModal = function(){
        $scope.WPinfoActionShow = false;
        $scope.WPactionProperty = '';
        $scope.distanceInterval = 0;
        $scope.wpDataActionMsg = '';
        $scope.wpDataActionMsgUnit = '';
    };

    //distanceInterval UP(add - rightside arrow button )/DOWN(sub - leftside arrow button )
    $scope.AddDistanceInterval = function(){
        if(isNaN($scope.distanceInterval)){
            if($scope.WPactionProperty != 'Land' && $scope.WPactionProperty != 'Home'){
                alert('Enter a numeric value.');
                $scope.distanceInterval = 0;
                return;
            }
        }
        if($scope.distanceInterval < 1000){
            $scope.addDisable = false;
            $scope.distanceInterval++;
        } else {
            $scope.addDisable = true;
        }
    };
    $scope.SubDistanceInterval = function(){
        if(isNaN($scope.distanceInterval)){
            if($scope.WPactionProperty != 'Land' && $scope.WPactionProperty != 'Home'){
                alert('Enter a numeric value.');
                $scope.distanceInterval = 0;
                return;
            }
        }
        if($scope.distanceInterval > 0){
            $scope.subDisable = false;
            $scope.distanceInterval--;
        } else {
            $scope.subDisable = true;
        } 
    };

    //Occure when action property type select box is changed.
    $scope.AddWPActionPropertyChange = function(){
         console.log('AddWPActionPropertyChange: ', $scope.WPactionProperty);  
         if($scope.WPactionProperty != 'Land' && $scope.WPactionProperty != 'Home' 
            && $scope.WPactionProperty != undefined){
            if($scope.wpDataActionSet.length == 0){
                $scope.distanceInterval = 0;
            }
            for(var i in $scope.wpDataActionSet){
                var id = $scope.wpDataActionSet[i].type;
                if(id == $scope.WPactionProperty.toLowerCase()){
                    $scope.distanceInterval = $scope.wpDataActionSet[i].value;
                    break;
                }else{
                    $scope.distanceInterval = 0;
                }
            } 
        }
        if($scope.WPactionProperty == 'Takeoff'){
            $scope.HideRange = false;
            $scope.wpDataActionMsg = "Takeoff";
            $scope.wpDataActionMsgUnit = "(m/s)"; 
          
        } else if ($scope.WPactionProperty == 'Speed'){
            $scope.HideRange = false;
            $scope.wpDataActionMsg = "Change Speed";
            $scope.wpDataActionMsgUnit = "(m/s)"; 
             
        } else if ($scope.WPactionProperty == 'Camera'){
            $scope.HideRange = false;
            $scope.wpDataActionMsg = "Distance interval";
            $scope.wpDataActionMsgUnit = "(m)"; 
          
        } else if ($scope.WPactionProperty == 'Land'){
            $scope.HideRange = true; 
        } else if ($scope.WPactionProperty == 'Home'){
            $scope.HideRange = true;
        }else{
            $scope.HideRange = true; 
        }
    }
    //Occure When OK button is clicked.
    $scope.AddWPActionProperty = function(){
        console.log('AddWPActionProperty: ',$scope.WPactionProperty);
        if($scope.WPactionProperty == undefined){
            return;
        }
        if(isNaN($scope.distanceInterval)){
            if($scope.WPactionProperty != 'Land' && $scope.WPactionProperty != 'Home'){
                alert('Enter a numeric value.');
                return;
            }
        }else if($scope.distanceInterval < 1){
            if($scope.WPactionProperty != 'Land' && $scope.WPactionProperty != 'Home'){
                alert('Enter the interval.');
                return;
            }
        }

       for(var i in $scope.wpDataActionSet){
            var id = $scope.wpDataActionSet[i].type;
            if(id == $scope.WPactionProperty.toLowerCase()){
                $scope.WPactionProperty = "";
                if(id != 'land' && id !='home'){
                    $scope.wpDataActionSet[i].value = $scope.distanceInterval;
                }
            }
        } 
        switch($scope.WPactionProperty){
            case 'Takeoff':
                var obj = {type: 'takeoff', value: $scope.distanceInterval};
                $scope.wpDataActionSet.push(obj);
                break;
            case 'Speed':
                var obj = {type: 'speed', value: $scope.distanceInterval};
                $scope.wpDataActionSet.push(obj);
                break;
            case 'Camera':
                var obj = {type: 'camera', value: $scope.distanceInterval};
                $scope.wpDataActionSet.push(obj);
                break;
            case 'Land':
                var obj = {type: 'land'};
                $scope.wpDataActionSet.push(obj);
                break;
            case 'Home':
                var obj = {type: 'home'};
                $scope.wpDataActionSet.push(obj);
                break;
        }
        $scope.CloseWPinfoActionModal();
    };

/************************ ASSOCIATED WITH A COUNT [total dist, wp-wp dist, total flight, total waypoints, etc.] **************************/
    // Change selected WP order
    $scope.ChangeWPOrder = function(action){
        // $scope.wpChangeOrder('up');
        // $scope.wpChangeOrder('down');
        if($scope.SelectWPBtnOn == true){
            var beforeOrder = $scope.SelectedWP;
            if(beforeOrder !== 0 || beforeOrder !== undefined){
                beforeOrder.forEach(function (item, index) {
                    beforeOrder[index] = Number(item);
                });
            
                switch(action){
                    case 'up':
                        mapService.changeWpOrder(beforeOrder,'up');
                        break;
                    case 'down':
                        mapService.changeWpOrder(beforeOrder,'down');
                        break;
                    default: console.log('changeWpOrder is failed..||action: ', action);
                }

                for(i in $scope.SelectedWP){
                     $('#wp_'+$scope.WPDataSet[$scope.SelectedWP[i]].getProperties().order).removeClass("on");
                }
                $scope.SelectedWP = [];
            }
        }
    };


//Todo: Finding effective call location
//wp - wp distance(The distance between two points)
 var DistBetweenTwoWP = function(order){
    if(order === 0 || order === 1){
        return 0;
    }else{
        // console.log('distBtwTwoWPs: ', order);
        var wp1 = $scope.WPDataSet[(order-1)].getGeometry().getCoordinates();
        var wp2 = $scope.WPDataSet[(order)].getGeometry().getCoordinates(); 

        var wgs84Sphere = new ol.Sphere(6378137);
        var dist = wgs84Sphere.haversineDistance(
                    ol.proj.transform(wp1, 'EPSG:3857', 'EPSG:4326'),
                    ol.proj.transform(wp2, 'EPSG:3857', 'EPSG:4326')
                );
        var distance = Math.round(dist);
        // console.log('DistBetweenTwoWP: ',distance);
        //total distance
        $scope.TotalDist += distance;
        return distance;
    }
 };

var TotalDistance = function(features){
    var distance;
    for(var i in features){
        // console.log(i);
        if(i == 0 || i == 1){
            distance = 0;
        }else{
             // console.log('distBtwTwoWPs: ', features);
            var wp1 = features[i-1].getGeometry().getCoordinates();
            var wp2 = features[i].getGeometry().getCoordinates(); 
            var wgs84Sphere = new ol.Sphere(6378137);
            var dist = wgs84Sphere.haversineDistance(
                    ol.proj.transform(wp1, 'EPSG:3857', 'EPSG:4326'),
                    ol.proj.transform(wp2, 'EPSG:3857', 'EPSG:4326')
                );
            distance +=  Math.round(dist);
        }
    }
    return distance;
 }


    //Todo: total time

    //Todo: Total Flight

    //gps mode 
    $scope.CoordsConvert = function(feature){
        var convert = mapService.getCoordConverter();
        var coords = feature.getGeometry().getCoordinates();
            coords = convert.transformCoord3857To4326(coords);
        //0: longitude, 1: latitude
        var converted = [];
        switch($scope.GPSMode){
            case 'utm':
                converted[0] = convert.latlongToUtm(coords[1], coords[0]);
                converted[0] = convert.utmToString(converted[0]);
                // console.log('ctrl: CoordsConvert::',converted[0]);
                return converted;
            case 'mgrs':
                converted[0] = convert.latlongToMgrs(coords[1], coords[0]);
                converted[0] = convert.mgrsToString(converted[0]); 
                // console.log('ctrl: CoordsConvert::',converted[0]);
                return converted;
            case 'latlong':
            default: 
                console.log('ctrl: CoordsConvert:: GpsMode: ', $scope.GPSMode);
                return coords; 
        }
    };

    $scope.CoordsReConvert = function(coords){
        var convert = mapService.getCoordConverter();        
            //0: longitude, 1: latitude
        var converted = undefined;
        switch($scope.GPSMode){
            case 'utm':
                // console.log("ctrl: CoordsReConvert:: ", coords[0]);
                var coord = convert.stringToUtm(coords[0]);
                if(coord === 0){
                    return false;
                }else if(!(coord instanceof Object)){
                    alert('Invalid UTM coordinate');
                    return false;
                }
                converted = convert.utmToLatlong(coord);
                // console.log("ctrl: CoordsReConvert:: ", converted);
                break;
            case 'mgrs': 
                // console.log("ctrl: CoordsReConvert:: ", coords[0]);
                var coord = convert.stringToMgrs(coords[0]);
                if(coord === false){
                    return false;
                }else if(!(coord instanceof Object)){
                    alert('Invalid MGRS grid reference');
                    return false;
                }
                converted = convert.mgrsToLatlong(coord);
                // console.log("ctrl: CoordsReConvert:: ", converted);
                break;
            case 'latlong':
                //validation check : input value
                if (isNaN(Number(coords[1]))){
                    alert('Invalid Coordinate :: latitude');
                    return false;
                } 
                if (isNaN(Number(coords[0]))){
                    alert('Invalid Coordinate :: longitude');
                    return false;
                }
                coords = [Number(coords[0]), Number(coords[1])];
                coords = convert.transformCoord4326To3857(coords); 
                // console.log('ctrl: CoordsReConvert:: ',coords);
                //validation check : output value
                if(isNaN(coords[1])){
                    alert('Invalid Coordinate :: latitude');
                    return false;
                }
                if(isNaN(coords[0])){
                    alert('Invalid Coordinate :: longitude');
                    return false;
                }
                return coords;
            default: console.log('ctrl: CoordsReConvert:: ', $scope.GPSMode);
                return false;
        }
         var result = convert.transformCoord4326To3857([converted.lon, converted.lat]);
        return result;
    }


/************************ BOTTOM SIDE WP LIST ANIMATIONS [shiftLeft(<), shiftRight(>), etc.] **************************/   
    var baseNum = 1 ;
    //Occure when bottom wp list < button is clicked.
    $scope.ShiftLeft = function(){
        var wpAreaW = $(".wpArea ul li").size()*100 + 'px';
        $(".wpArea ul").css('width', wpAreaW);

        if(baseNum > 1){  
            $(".wpArea ul").animate({left:"+=100"}, 300);
            baseNum--;
        } 
    };
    //Occure when bottom wp list > button is clicked.
    $scope.ShiftRight = function(){
        var wpAreaW = $(".wpArea ul li").size() * 100  + 'px';
        $(".wpArea ul").css('width', wpAreaW);
        
        var addSize = $(".wpArea ul li").size()-10;       
        if(baseNum < addSize){ 
            $(".wpArea ul").animate({left:"-=100"}, 300);
            baseNum++;
        }
    };
//Todo: UI(bottom wp list animation) -> when added wp or deleted wp







    function refreshSwatch(ev, ui) {
        var alt = $scope.wpData.alt,
            speed = $scope.wpData.speed,
            wt = $scope.wpData.wt;
            colorpicker.refreshSwatch(alt, speed, wt);
    }
});

// Color range selector initialization
// JHPark::  Refector colorpicker directives
kindFramework.factory('colorpicker', function() {
    function hexFromRGB(r, g, b) {
        var hex = [r.toString(), g.toString(), b.toString()];
        angular.forEach(hex, function(value, key) {
            if (value.length === 1)
                hex[key] = "0" + value;
        });
        return hex.join('').toUpperCase();
    }
    return {
        refreshSwatch: function(r, g, b) {
            // var color = '#' + hexFromRGB(r, g, b);
            // angular.element('#swatch').css('background-color', color);
        }
    };
});
