kindFramework.controller('letdroneDeviceManagerCtrl', ['$scope', '$rootScope', '$compile', 'LetDroneDeviceService'
	,
    function ($scope, $rootScope, $compile, LetDroneDeviceService) {

        $scope.init = function(){
            formInit();
            variableInit();
            propertyInit();
        }



        var formInit = function(){

            $scope.selectedFccLiItem = null; 
            $scope.selectedGimbalLiItem = null; 
            $scope.selectedReferenceKitLiItem = null; 
            $scope.selectedFccLiItemClass = 'colNum00';
            $scope.selectedGimbalLiItemClass = 'colNum00';
            $scope.selectedReferenceKitLiItemClass = 'colNum00';
        }


        var variableInit = function(){

            $scope.selectedRowNum = null;

            //sub thing list select
            $scope.selectedSubThingNum = null;


            $scope.selectedFccRowNum = null;
            $scope.selectedGimbalRowNum = null;
            $scope.selectedReferenceKitRowNum = null;
            $scope.selectedCommRowNum = null;

            $scope.droneModelList = null;
            $scope.droneList = null;
            $scope.droneSubModelList = null;
            $scope.droneSubThingList = null;
            $scope.droneSubThingData = null;

            $scope.thingList = null;

            $scope.subThingType = null;
            $scope.subThingItem = null;


        };

        // TODO : modal popup controller로 구현예정
        var propertyInit = function(){
            //new pop
            $scope.droneModelDisplayProperty = false;
            //open pop
            $scope.registerdDronDisplayProperty = false;
            //subtihng setting pop
            $scope.selectSubThingDisplayProperty = false;

            //communication item select box
            $scope.fccDisplayProperty = false;
            $scope.gimbalDisplayProperty = false;
            $scope.referenceKitDisplayProperty = false;

            $scope.communicationItemList = null;

            //advance setting pop
            $scope.advanceDisplayProperty = false;

            //subtihng setting pop tab
            $scope.subThingModelTabDisplayProperty = true;
            $scope.subThingRegisterTabDisplayProperty = false;
        };

        var getDroneSubThingSpec = function(type){

            // FCC
            var fccItem = {
                  tabName: 'FCC'
                , subject: 'FCC'
                , dataLabel: [{id: 'name', value: 'Name'}
                            , {id: 'description', value: 'Description'}]
            };

            // Gimbal
            var gimbalItem = {
                  tabName: 'Gimbal'
                , subject: 'Gimbal'
                , dataLabel: [{id: 'name', value: 'Name'}
                            , {id: 'description', value: 'Description'}
                            , {id: 'gimbalType', value: 'Gimbal Type'}]
            };

            // Camera type
            var cameraItem = {
                  tabName: type
                , subject: type
                , dataLabel: [{id: 'name', value: 'Name'}
                            , {id: 'description', value: 'Description'}
                            , {id: 'videoServerIp', value: 'Video Server IP'}
                            , {id: 'videoServerPort', value: 'Video Server Port'}
                            , {id: 'videoCameraIp', value: 'Video Camera IP'}
                            , {id: 'videoChannel', value: 'Video Channel'}
                            , {id: 'videoLoginId', value: 'Video Login ID'}
                            , {id: 'videoLoginPm', value: 'Video Login PW'}
                            , {id: 'zoomMin', value: 'Zoom Min'}
                            , {id: 'zoomMax', value: 'Zoom Max'}
                            , {id: 'fovMin', value: 'Fov Min'}
                            , {id: 'fovMax', value: 'Fov Max'}]
            };

            // Battery type
            var batteryItem = {
                  tabName: 'Battery'
                , subject: 'Battery'
                , dataLabel: [{id: 'name', value: 'Name'}
                            , {id: 'description', value: 'Description'}
                            , {id: 'batteryType', value: 'Battery Type'}
                            , {id: 'voltage', value: 'Voltage'}
                            , {id: 'power', value: 'Power'}
                            , {id: 'capacity', value: 'Capacity'}]
            };

            // Motor type
            var motorItem = {
                  tabName: 'Motor'
                , subject: 'Motor'
                , dataLabel: [{id: 'name', value: 'Name'}
                            , {id: 'description', value: 'Description'}
                            , {id: 'payload', value: 'Payload'}
                            , {id: 'panSpeedMin', value: 'PanSpeedMin'}
                            , {id: 'panSpeedMax', value: 'PanSpeedMax'}
                            , {id: 'panAngleMin', value: 'PanAngleMin'}
                            , {id: 'panAngleMax', value: 'PanAngleMax'}
                            , {id: 'pitchEndless', value: 'PitchEndless'}
                            , {id: 'pitchSpeedMin', value: 'PitchSpeedMin'}
                            , {id: 'pitchAngleMin', value: 'PitchSpeedMax'}
                            , {id: 'pitchAngleMin', value: 'PitchAngleMin'}
                            , {id: 'pitchAngleMax', value: 'PitchAngleMax'}]
            };


            if(type == 'fcc' || type == 'referenceKit'){
                return fccItem;

            }else if(type == 'flightCamera' || type == 'dayCamera' || type == 'nightCamera'){
                 return cameraItem;

            }else if(type == 'gimbal'){
                 return gimbalItem;

            }else if(type == 'battery'){
                 return batteryItem;

            }else if(type == 'motor'){
                 return motorItem;

            }


        }

        var makeThingListString = function(){
            var commList = [];
            var commStrList = {};

            console.log($scope.selectedFccRowNum);
            console.log($scope.selectedGimbalRowNum);
            console.log($scope.selectedReferenceKitRowNum);

            commList = $scope.dronInfo.commDeviceList;

            


            for (var i = 0; i < commList.length; i++) {
                if(i+1 == $scope.selectedFccRowNum){
                    commList[i].thingList = makestr('fcc');
                }
                if(i+1 == $scope.selectedGimbalRowNum){
                    commList[i].thingList = makestr('gimbal');
                }
                if(i+1 == $scope.selectedReferenceKitRowNum){
                    commList[i].thingList = makestr('referenceKit');
                }
            }

        };
        
        var makestr = function(ele){
            var str = '';
            if(str == ''){
                str += ele;
            }else{
                str += ',' + ele
            }
            return str;
        }; 


        // new button
        $scope.newDrone = function() {
            
            LetDroneDeviceService.getDroneModelList().then(
              function(response){
                $scope.droneModelList = response;
                $scope.$apply();
                console.log('drone model list >> ', response);
              },
              function(error){
                console.log(error);
              }
            );

            // TODO
            $scope.droneModelDisplayProperty = true;
        };

        // open button
        $scope.openDrone = function() {
            
            LetDroneDeviceService.getDroneDeviceList().then(
              function(response){
                
                $scope.droneList = response;
                $scope.$apply();
                console.log('registered drone list >> ', response);
              },
              function(error){
                console.log(error);
              }
            ); 

            // TODO
            $scope.registerdDronDisplayProperty = true;
        };

        // save button
        $scope.saveDrone = function() {

            if($scope.dronInfo == null){
                alert("드론을 먼저 설정해주세요");
                return false;

            }

            makeThingListString();

            var result = LetDroneDeviceService.updateDroneData($scope.dronInfo);
            console.log($scope.dronInfo);
            //formInit();
        };

        // save as button
        $scope.saveAsDrone = function() {

            if($scope.dronInfo == null){
                alert("드론을 먼저 설정해주세요");
                return false;

            }
            
            var result = LetDroneDeviceService.insertDroneData($scope.dronInfo);
            console.log($scope.dronInfo);
            //formInit();
        };

        // main drone info set
        $scope.setDroneInfo = function (data, type) {
            var commList = [];
            var commStrList = [];
            var commObjIndex = 0;

            var result = null;

            if(type == 'droneModel'){
                result = LetDroneDeviceService.getDroneModelData(data.id);
            }else{
                result = LetDroneDeviceService.getDroneData(data.id);
            }

            result.then(
              function(response){
                console.log('drone info >> ', response);
                $scope.dronInfo = response;


                // drone structure communication setting
                angular.element(document.querySelectorAll('#commTbody tr')).remove();;
                commList = response.commDeviceList;

                for (var i = 0; i < commList.length; i++) { 

                    commStrList = commList[i].thingList.split(',');

                    for (var j = 0; j < commStrList.length; j++) {

                        $scope.communicationItemList = [commStrList.length+1];
                        $scope.communicationItemList.unshift(i); 

                        if(commStrList[j] == 'fcc'){

                            commObjIndex = i+1;
                            $scope.selectedFccRowNum = commObjIndex;


                            if(commObjIndex == 10){
                                $scope.selectedFccLiItemClass = 'colNum' + commObjIndex;
                            }else{
                                $scope.selectedFccLiItemClass = 'colNum0' + commObjIndex;
                            }

                        }
                        if(commStrList[j] == 'gimbal'){

                            commObjIndex = i+1;
                            $scope.selectedGimbalRowNum = commObjIndex;

                            if(commObjIndex == 10){
                                $scope.selectedGimbalLiItemClass = 'colNum' + commObjIndex;
                            }else{
                                $scope.selectedGimbalLiItemClass = 'colNum0' + commObjIndex;
                            }

                        }
                        if(commStrList[j] == 'referenceKit'){

                            commObjIndex = i+1;
                            $scope.selectedReferenceKitRowNum = commObjIndex;

                            if(commObjIndex == 10){
                                $scope.selectedReferenceKitLiItemClass = 'colNum' + commObjIndex;
                            }else{
                                $scope.selectedReferenceKitLiItemClass = 'colNum0' + commObjIndex;
                            }
                            
                        }
                    }

                }

                $scope.$apply();
              },
              function(error){
                console.log(error);
              }
            );


            variableInit();
            $scope.modalClose(type);
        };



        // subThing popup open
        $scope.registerDroneSubThing = function(type) {
            if($scope.dronInfo == null){
                alert("드론을 먼저 설정해주세요");
                return false;

            }
            console.log('subthing type >>>> '+type);

            LetDroneDeviceService.getDroneSubModelList(type).then(
              function(response){
                console.log('sub model list >> ', response);
                $scope.droneSubModelList = response;
                $scope.$apply();
              },
              function(error){
                console.log(error);
              }
            ); 

            LetDroneDeviceService.getDroneSubThingList(type).then(
              function(response){
                console.log('sub thing list >> ', response);
                $scope.droneSubThingList = response;
                $scope.$apply();
              },
              function(error){
                console.log(error);
              }
            ); 

            $scope.subThingType = type;
            $scope.subThingItem = getDroneSubThingSpec(type);


            $scope.selectSubThingDisplayProperty = true;

            //temp
            $scope.selectedSubThingNum = false;
        };

        // popup subthing form set
        $scope.selectSubThingData = function(type, id, index){
            $scope.selectedSubThingNum = index;

            var subthingSpec = {};

            LetDroneDeviceService.getDroneSubThingData(id).then(
              function(response){
                console.log('sub thing data set >> ', response);
                $scope.droneSubThingData = response;

                subthingSpec = getDroneSubThingSpec(type);

                for (var i = 0; i < subthingSpec.dataLabel.length; i++) {
                    angular.element(document.querySelector('#' + subthingSpec.dataLabel[i].id)).val(response[subthingSpec.dataLabel[i].id]);
                }

                $scope.$apply();
              },
              function(error){
                console.log(error);
              }
            ); 
        };

    	$scope.setCommAdvSetting = function (data) {

            $scope.advanceDisplayProperty = true;
            $scope.advanceInfo = data;
    	};

        $scope.modalClose = function (type) {
            if(type == 'droneModel'){
                $scope.droneModelDisplayProperty = false;    
            }else if(type == 'registeredDrone'){
                $scope.registerdDronDisplayProperty = false;    
            }else if(type == 'advanceSetting'){
                $scope.advanceDisplayProperty = false;    
            }else if(type == 'droneSubThing'){
                $scope.selectSubThingDisplayProperty = false;    
            }
        };

        //popup list 클릭시 class on off
        $scope.selectedItem = function(index){
            $scope.selectedRowNum = index;
        };

        $scope.selectedFccItem = function(index){
            $scope.selectedFccRowNum = index;
        };
        $scope.selectedGimbalItem = function(index){
            $scope.selectedGimbalRowNum = index;
        };
        $scope.selectedReferenceKitItem = function(index){
            $scope.selectedReferenceKitRowNum = index;
        };

        $scope.selectedCommItem = function(index){
            $scope.selectedCommRowNum = index;
        };



        $scope.selectCommunicationItem = function(type, index){    

            if($scope.dronInfo == null){
                alert("드론을 먼저 설정해주세요");
                return false;

            }

            if(index == undefined){
                index = 0;
            }

            var makeClass = null;

            if(index == 10){
                makeClass = 'colNum' + index;
            }else{
                makeClass = 'colNum0'+ index;
            }

            console.log('index >> '+index);

            if(type == 'fcc'){


                $scope.selectedFccLiItem = index;  
                $scope.selectedFccLiItemClass = makeClass; 
                console.log('fcc index >> ' + $scope.selectedFccLiItemClass);

                if($scope.fccDisplayProperty){
                    $scope.fccDisplayProperty = false;
                }else{
                    $scope.fccDisplayProperty = true;
                }


            }else if(type == 'gimbal'){


                $scope.selectedGimbalLiItem = index;  
                $scope.selectedGimbalLiItemClass = "colNum0"+index; 
                console.log('gimbal index >> ' + $scope.selectedGimbalLiItemClass);

                if($scope.gimbalDisplayProperty){
                    $scope.gimbalDisplayProperty = false;
                }else{
                    $scope.gimbalDisplayProperty = true;
                }


            }else if(type == 'referenceKit'){


                $scope.selectedReferenceKitLiItem = index;  
                $scope.selectedReferenceKitLiItemClass = "colNum0"+index; 
                console.log('referenceKit index >> ' + $scope.selectedReferenceKitLiItemClass);

                if($scope.referenceKitDisplayProperty){
                    $scope.referenceKitDisplayProperty = false;
                }else{
                    $scope.referenceKitDisplayProperty = true;
                }

            }



        };

        $scope.showTab = function(){
            
            if($scope.subThingModelTabDisplayProperty){
                $scope.subThingModelTabDisplayProperty = false;
                $scope.subThingRegisterTabDisplayProperty = true;
            }else{
                $scope.subThingModelTabDisplayProperty = true;
                $scope.subThingRegisterTabDisplayProperty = false;
            }

            $scope.registerDroneSubThing($scope.subThingType);
        };

        // drone 정보에 변경된 communication, subthing 정보를 담음
        $scope.setDataset = function(type, obj){
            var subThingDataset = {};
            var communicationDataset = [];

            if(type == 'advanceSetting'){

                communicationDataset = obj;

                if ($scope.dronInfo.commDeviceList.indexOf(communicationDataset) == -1) {
                    $scope.dronInfo.commDeviceList[$scope.dronInfo.commDeviceList.length] = communicationDataset;
                }
            }else{
                subThingDataset = obj;
                $scope.dronInfo.subThing[$scope.subThingType] = subThingDataset;
            }
            console.log(subThingDataset);
            $scope.advanceDisplayProperty = false;
            $scope.selectSubThingDisplayProperty = false;
        };

        $scope.addrow = function(){

            if($scope.dronInfo == null){
                alert("드론을 먼저 설정해주세요");
                return false;

            }
            if($scope.dronInfo.commDeviceList.length >= 10){
                alert("더이상 등록할 수 없습니다");
                return false;

            }

            var row = angular.element(document.querySelector('#commTbody'));
            var count = angular.element(document.querySelectorAll('#commTbody tr')).length + 1;
            var str ='';
            var tempDataset = {};

/*            str += '<tr ng-click="selectedCommItem('+ count +')" ng-class="{on: '+ count +' == selectedCommRowNum}">';
            str += '    <td>';
            str += '    <span class="colNum0'+ count +'">' + count;
            str += '    </span>';
            str += '    </td>';
            str += '    <td></td>';
            str += '    <td></td>';
            str += '    <td>';
            str += '    <button ng-click="setCommAdvSetting(comm)">';
            str += '    <img src="images/btn/btnSet.png">';
            str += '    </button>';
            str += '    </td>';
            str += '</tr>';

            str = $compile(str)($scope);*/


            LetDroneDeviceService.getTempCommunicationList().then(
              function(response){
                response.thingList = "";
                if ($scope.dronInfo.commDeviceList.indexOf(response) == -1) {
                    $scope.dronInfo.commDeviceList.push(response);
                }
                $scope.$apply();
                console.log(response);
              },
              function(error){
                console.log(error);
              }
            );

            

            if ($scope.communicationItemList.indexOf(count) == -1) {
                $scope.communicationItemList.push(count);
            }

            //row.append(str);


        };

        $scope.removerow = function(){

            if($scope.dronInfo == null){
                alert("드론을 먼저 설정해주세요");
                return false;

            }

            angular.element(document.querySelectorAll('.on')).remove();
        };




/*        $scope.findCommunicationIndex = function (res) {
            var commList = [];
            var thingList = [];
            var fccIndex = 0;
            var gimbalIndex = 0;
            var referenceKitIndex = 0;

            commList = res.commDeviceList;

            for (var i = 1; i < commList.length + 1; i++) {
                thingList = commList[i].thingList.split(',');
                for (var j = 0; j < thingList.length; j++) {
                    if(thingList[j] == 'fcc'){
                        fccIndex = i;
                    }
                    if(thingList[j] == 'gimbal'){
                        gimbalIndex = i;
                    }
                    if(thingList[j] == 'referenceKit'){
                        referenceKitIndex = i;
                    }
                }

            }

            console.log(fccIndex + ', ' + gimbalIndex + ', ' + referenceKitIndex);
        };*/



    }

]);


