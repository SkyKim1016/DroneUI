var Point2D = (function () {
    function constructor() {
        this.pointX;
        this.pointY;
        this.pointID;
    }

    constructor.prototype = {
        setPointX: function (pointX) {
            this.pointX = pointX;
        },
        setPointY: function (pointY) {
            this.pointY = pointY;
        },
        setPoint2D: function (pointX, pointY) {
            this.pointX = pointX;
            this.pointY = pointY;
        },
        setPointID: function ( pointID )
        {
	        this.pointID = pointID;
        },
        getPointX: function () {
            return this.pointX;
        },
        getPointY: function () {
            return this.pointY;
        },
        getPointID: function ()
        {
	        return this.pointID;
        }
    }
    return constructor;
    
})();


var PolygonEdge = (function () {
    
    function constructor() {
        this.startPoint = new Point2D();
        this.endPoint   = new Point2D();
        this.polygonEdgeID = 0;
    }     
      
    constructor.prototype = {
        setStartPoint: function (startPoint) {
            this.startPoint = startPoint;
        },    
        setEndPoint: function (endPoint) {
            this.endPoint = endPoint;
        },       
        setPolygonEdge : function (startPoint, endPoint) {
            this.startPoint = startPoint;
            this.endPoint   = endPoint;
        },
        setPolygonEdgeID: function ( id )
        {
	        this.polygonEdgeID = id;
        },
        getStartPoint: function () {
            return this.startPoint;
        },       
        getEndPoint: function () {
            return this.endPoint;
        },
        getPolygonEdgeID: function ()
        {
	        return this.polygonEdgeID;
        }
    }
    
    return constructor;
    
})();


function SurveyGridSolver() {
    var    fov;
    var    rotationAngle; // degree
	var    upperBound;
	var    lowerBound;

	var    pointList = [];
	var    polygonEdgeList = [];
	var    wayPointList =[];
    

    var setUpperBound = function ( upperBound )
    {
        this.upperBound = upperBound;
    }

    var setLowerBound = function ( lowerBound )
    {
        this.lowerBound = lowerBound;
    }

    var setFov = function ( fov )
    {
        this.fov = fov;
    } 
    
    var setRotationAngle = function ( rotationAngle )
    {
        this.rotationAngle = rotationAngle;
    }
    
    var addPointForPolygon = function ( point )
    {
	    this.pointList.push( point );
    }
    
    var addPolygonEdge = function ( polygonEdge )
    {
        this.polygonEdgeList.push( polygonEdge );
    }
    
    var addWayPoint = function ( point )
    {
	    this.wayPointList.push( point );
    }
    
    var readPolygonData = function ( points )
    {
        for ( i = 0; i < points.coords.length-1; i++ ) {
            pointList[i] = new Point2D();
            //*** 1. (x, y) = (long, latt) ***//
            pointList[i].setPointX( points.coords[i][0]);
            pointList[i].setPointY( points.coords[i][1]);
            //pointList[i].setPointX( points.coords[i][1]);
            //pointList[i].setPointY( points.coords[i][0]);
            pointList[i].setPointID(i);
            
            //console.log(i, pointList[i], pointList[i].getPointID(i));               
        }
        console.log("complete read");
    }
    
    
    var sortPointsByCoordiY = function ()
    {
        var		pointIDForBiggestY  = 0;
        var     yCoordiForBiggestY  = 0.0;
        var     yCooidiForSmallestY = 100000000;
        
        
        //*** 1. SurveyLine의 upper/lower bound 지정 ***//
        for ( i = 0; i < pointList.length; i++ ) {
            if ( pointList[i].getPointY() > yCoordiForBiggestY ) {
                pointIDForBiggestY = i;
                yCoordiForBiggestY = pointList[i].getPointY();
            }

            if ( pointList[i].getPointY() < yCooidiForSmallestY ) {
                yCooidiForSmallestY = pointList[i].getPointY();
            }
        }
        
        setUpperBound( yCoordiForBiggestY );
        setLowerBound( yCooidiForSmallestY );
            

        //*** 2. y-좌표가 가장 큰 point를 기점으로 그 뒤로 연결된 point들을 순서대로 담는다. ***//
        var sortedPointList = [];
        var sortedPointID = 0;
        for ( i = 0; i < pointList.length; i++ ) {
           // console.log('temp', i, pointList[i]);
            if ( pointList[i].getPointID() >= pointIDForBiggestY ) {
                //pointList[i].setPointID(sortedPointID);                             
                //console.log(i, sortedPointID, pointList[i]);
                
                sortedPointList[sortedPointID] = pointList[i];
                sortedPointList[sortedPointID].setPointID(sortedPointID); 
                sortedPointID++;
            }
        }

        //*** 2-1.원래 input의 맨 처음 point 부터 y-좌표가 가장 큰 point 전까지 point들을 순서대로 담는다. ***//
        //*** 2-2. sortedPointID 순서대로 배열에 다시 담는다. ***///
        for ( i = 0; i < pointIDForBiggestY; i++ ) {
            //console.log('temp', i, pointList[i]);
            if ( pointList[i].getPointID() < pointIDForBiggestY ) {
                //pointList[i].setPointID(sortedPointID);
                //console.log(sortedPointID, pointList[i]);
                
                sortedPointList[sortedPointID] = pointList[i];
                sortedPointList[sortedPointID].setPointID(sortedPointID);
                sortedPointID++;
            } else { //( it->getPointID() == pointIDForBiggestY ) 
                break;
            }
        }
        pointList = sortedPointList;
        

        //*** 2-2. sortedPointID 순서대로 배열에 다시 담는다. ***///
/*        var  newPointID = 0;
        var  tempPointList = [];
        for ( i = 0; i < pointList.length; i++ ) {
            newPointID = pointList[i].getPointID();
          
            tempPointList[newPointID] = pointList[i];
            //console.log(i, pointList[i]);
            //console.log(newPointID, tempPointList[newPointID]);           
        }        
        pointList = tempPointList;
*/      
        console.log("complete sort");

    }
    
    
    var constructEdgeDataStructure = function ()
    {        
        //*** 1. 정렬된 point 순서대로 polygone의 Edge를 만든다. ***//
        var edgeIndex = 0;
        for ( i = 0; i < pointList.length; i++ ) {
            var polygonEdge = new PolygonEdge();
            
            polygonEdge.setStartPoint( pointList[i] );
            polygonEdge.setPolygonEdgeID( edgeIndex );

            if ( edgeIndex != pointList.length - 1 ) {
                polygonEdge.setEndPoint( pointList[i+1] );
            } else {//edgeIndex == m_pointList.size()-1
                polygonEdge.setEndPoint( pointList[0] );
            }

            polygonEdgeList[edgeIndex] = polygonEdge;
            edgeIndex++;		
        }
        console.log('complete Edge DS');
        //console.log(polygonEdgeList);
    }
    
    
    var constructWayPointList = function ()
    {   
       // var yCoordiOfSurveyLine = this.upperBound - this.fov/2.0;
        
        var intersectionInfo = {
            'yCoordiOfSurveyLine': this.upperBound - this.fov/2.0,
            'intersectionX': 0.0,
            'intersectionY': 0.0,
        };

        //surveyLine 이동 방향, false = upper --> lower, true = lower --> upper
        var reverse = false; 
        //intersection point 존재 여부
        var intersection = false;

        //polygonEdge 기울기 y=ax+b
        var gradientForPolygonEdge = 0.0;
        //polygonEdge y절편
        var yInterceptForPolygonEdge = 0.0;

        var wpIndex = 0;
        for ( i = 0; i < polygonEdgeList.length; i++ ) {
            if ( intersection === true ) {
                    i--;
            } 
            
            var startPointForCurrEdge = polygonEdgeList[i].getStartPoint();
            var endPointForCurrEdge   = polygonEdgeList[i].getEndPoint();

            //console.log("StartP", startPointForCurrEdge, "EndP", endPointForCurrEdge);
            
            //polygonEdge - surveyLine 교점 계산
            //var intersectionX = 0.0;
            //var intersectionY = 0.0;
            
            //computeIntersectionPoint( startPointForCurrEdge, endPointForCurrEdge, yCoordiOfSurveyLine,
            //                          intersectionX, intersectionY );
            
            //*** 1. surveyLine & polygonEdge 의 교점 계산 ***//
            computeIntersectionPoint( startPointForCurrEdge, endPointForCurrEdge, intersectionInfo);

            //*** 2. wayPoint 생성 ***//
            var newWayPoint = new Point2D();
            if( (intersectionInfo.intersectionX >= startPointForCurrEdge.getPointX() && intersectionInfo.intersectionX <= endPointForCurrEdge.getPointX()) || 
                (intersectionInfo.intersectionX <= startPointForCurrEdge.getPointX() && intersectionInfo.intersectionX >= endPointForCurrEdge.getPointX()) ) {
                newWayPoint.setPointX(intersectionInfo.intersectionX);
                newWayPoint.setPointY(intersectionInfo.intersectionY);
                newWayPoint.setPointID(wpIndex);
                
                wayPointList[wpIndex] = newWayPoint;
                wpIndex++;

                //이전 WP와 동일한 WP가 나오면 추가 하지 않는다.
                if ( wpIndex !== 1 ) {
                    var prevWP = wayPointList[wpIndex-2];
                    if ( prevWP.getPointX() === intersectionInfo.intersectionX && prevWP.getPointY() === intersectionInfo.intersectionY ) {
                        wpIndex--;
                    }
                }			
            } else {
                newWayPoint = null;	
            }

            //*** 3. FoV 업데이트 ***//
            if ( newWayPoint !== null ) { // 교점 있는 경우: 다음 surveyLine으로 이동. 
                intersection = true;
                if ( reverse === false ) { // surveyLine 이동 방향: 정방향 upper --> lower.
                    intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine - this.fov;	

                    if ( intersectionInfo.yCoordiOfSurveyLine < this.lowerBound ) { //surveyLine이 lowerbound를 벗어나면 edge를 이동, 마지막 surveyLine 반복 후 역방향으로 이동.
                        reverse = true;
                        i++;
                        intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;
                    }

                } else { // reverse == true, surveyLine 이동 방향 lower --> upper.

                    if ( intersectionInfo.yCoordiOfSurveyLine === startPointForCurrEdge.getPointY() && intersectionInfo.yCoordiOfSurveyLine === endPointForCurrEdge.getPointY() ) {
                    // surveyLine과 polygonEdge가 일치하면 surveyLine update 하지 않고 다음 polygonEdge로 이동.
                        intersection = false;
                    } else {
                      intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;
                    }

                    if ( polygonEdgeList[i].getPolygonEdgeID() === polygonEdgeList.length-1 ) {// 마지막 edge, surveyLine 남았는데 for 문 종료되면 안되니까. 
                        i--;
                    }

                    if ( intersectionInfo.yCoordiOfSurveyLine > this.upperBound ) {
                        //reverse 방향의 surveyLine도 더 이상 존재 하지 않으므로 waypoint 계산 종료.
                        break;
                    }
                }

            } else {// 교점 없는 경우: 다음 polygon edge로 이동.
                intersection = false;
            }

        }
        console.log('complete constructWP');

}
    
    var computeIntersectionPoint = function ( startPointForCurrEdge,  endPointForCurrEdge, intersectionInfo )
    {
        var gradientForPolygonEdge = 0.0;
        var yInterceptForPolygonEdge = 0.0;

        if ( startPointForCurrEdge.getPointX() !== endPointForCurrEdge.getPointX() &&
             startPointForCurrEdge.getPointY() !== endPointForCurrEdge.getPointY() ) { //*** 1.  y = ax + b, a != 0
            //polygonEdge  기울기 a = (y2-y1) / (x2-x1) ***//
            gradientForPolygonEdge = ( endPointForCurrEdge.getPointY() - startPointForCurrEdge.getPointY() )/
                                     ( endPointForCurrEdge.getPointX() - startPointForCurrEdge.getPointX() );
            
            //polygonEdge  y절편 = y1 - a*x1 ***//
            yInterceptForPolygonEdge = startPointForCurrEdge.getPointY() - gradientForPolygonEdge*startPointForCurrEdge.getPointX();
    
            //polygonEdge & surveyLine  교점 ( (fov-b)/a, fov) ) ***//
            intersectionInfo.intersectionX = (intersectionInfo.yCoordiOfSurveyLine-yInterceptForPolygonEdge)/gradientForPolygonEdge;
            intersectionInfo.intersectionY = intersectionInfo.yCoordiOfSurveyLine;
            
            console.log("intersectionP", intersectionInfo.intersectionX, intersectionInfo.intersectionY);

        } else if ( startPointForCurrEdge.getPointX() === endPointForCurrEdge.getPointX() ) { //*** 2. x = x'
            //polygonEdge & surveyLine  교점
            intersectionInfo.intersectionX = startPointForCurrEdge.getPointX();
            intersectionInfo.intersectionY = intersectionInfo.yCoordiOfSurveyLine;

        } else if ( startPointForCurrEdge.getPointY() === endPointForCurrEdge.getPointY() ) { //*** 3. y = y'
            //polygonEdge & surveyLine  교점

            if ( intersectionInfo.yCoordiOfSurveyLine === startPointForCurrEdge.getPointY() ) { // surveyLine 과 polygonEdge 일치
                intersectionInfo.intersectionX = startPointForCurrEdge.getPointX();
                intersectionInfo.intersectionY = intersectionInfo.yCoordiOfSurveyLine;

            } else { // surveyLine 과 plygonEdge 평행: 교점 없음   
                intersectionInfo.intersectionX = null;
                intersectionInfo.intersectionY = null;
            }
        }
        console.log('complete intersectP');
        return intersectionInfo;
    }
    
    
    var constructWayPointListCoveredConcave = function ()
    {  
        console.log('fov', fov); 
        var intersectionInfo = {
            'yCoordiOfSurveyLine': this.upperBound - this.fov/2.0,
            'intersectionX': 0.0,
            'intersectionY': 0.0,
        };
               
        //surveyLine 이동 방향, false = upper --> lower, true = lower --> upper
        var reverseForSL = false;

        //polygonEdge 방향, false = upper --> lower, true = lower --> upper
        var reverseForPolygonEdge = false;

        //intersection point 존재 여부
        var intersection = false;

        //polygonEdge 기울기 y=ax+b
        var gradientForPolygonEdge = 0.0;
        //polygonEdge y절편
        var yInterceptForPolygonEdge = 0.0;

        var wpIndex = 0;
        for ( i = 0;  i < polygonEdgeList.length; i++ ) {
            if ( intersection === true ) {
                    i--;
            }

            var startPointForCurrEdge = polygonEdgeList[i].getStartPoint();
            var endPointForCurrEdge   = polygonEdgeList[i].getEndPoint();

            //Edge 방향 결정
            if ( startPointForCurrEdge.getPointY() < endPointForCurrEdge.getPointY() ) {
                reverseForPolygonEdge = true;
            } else {
                reverseForPolygonEdge = false;
            }


            //*** 1. surveyLine & polygonEdge 의 교점 계산 ***//
            console.log('EdgeId', polygonEdgeList[i].getPolygonEdgeID());
            computeIntersectionPoint( startPointForCurrEdge, endPointForCurrEdge, intersectionInfo );

            //*** 2. wayPoint 생성 ***//
            var newWayPoint = new Point2D();
            if ( (intersectionInfo.intersectionX >= startPointForCurrEdge.getPointX() && intersectionInfo.intersectionX <= endPointForCurrEdge.getPointX()) || 
                 (intersectionInfo.intersectionX <= startPointForCurrEdge.getPointX() && intersectionInfo.intersectionX >= endPointForCurrEdge.getPointX()) ) {
                newWayPoint.setPointX(intersectionInfo.intersectionX);
                newWayPoint.setPointY(intersectionInfo.intersectionY);
                newWayPoint.setPointID(wpIndex);
                
                wayPointList[wpIndex] = newWayPoint;
                wpIndex++;
                
                //이전 WP와 동일한 WP가 나오면 추가 하지 않는다.
                if ( wpIndex !== 1 ) {
                    var prevWP = wayPointList[wpIndex-2];
                    if ( prevWP.getPointX() === intersectionInfo.intersectionX && prevWP.getPointY() === intersectionInfo.intersectionY ) {
                        wpIndex--;
                    }
                }			
            } else {
                newWayPoint = null;		
            }

            //*** 3. FoV, surveyLine 이동방향 업데이트 ***//
            if ( newWayPoint !== null ) { //*** 3-1. 교점 있는 경우: 다음 surveyLine으로 이동.  ***//
                intersection = true;
                if ( reverseForSL === false &&  reverseForPolygonEdge === false ) { // surveyLine 이동 방향: 정방향 upper --> lower.
                    intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine - this.fov;	

                    if ( intersectionInfo.yCoordiOfSurveyLine < this.lowerBound ) { //surveyLine이 lowerbound를 벗어나면 edge를 이동, 마지막 surveyLine 반복 후 역방향으로 이동.
                        reverseForSL = true;
                        i++;
                        intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;
                    }
                }  else if ( reverseForSL === true &&  reverseForPolygonEdge === true ) { // surveyLine 이동 방향 lower --> upper, Edge 방향: reverse

                    if ( intersectionInfo.yCoordiOfSurveyLine === startPointForCurrEdge.getPointY() && yCoordiOfSurveyLine === endPointForCurrEdge.getPointY() ) {
                    // surveyLine과 polygonEdge가 일치하면 surveyLine update 하지 않고 다음 polygonEdge로 이동.
                        intersection = false;
                    } else {
                      intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;
                    }

                    if ( polygonEdgeList[i].getPolygonEdgeID() === polygonEdgeList.length-1 ) {// 마지막 edge, surveyLine 남았는데 for 문 종료되면 안되니까.
                        intersection = false;
                        i--;
                    }

                    if( intersectionInfo.yCoordiOfSurveyLine > this.upperBound ) {
                        //reverse 방향의 surveyLine도 더 이상 존재 하지 않으므로 waypoint 계산 종료.
                        break;
                    }
                } else if( reverseForSL === false &&  reverseForPolygonEdge === true ) { // surveyLine 이동 방향: 정방향 upper --> lower, Edge 방향: reverse
                    intersectionInfo. yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;	
                    intersection = true;

                    if( intersectionInfo.yCoordiOfSurveyLine < this.lowerBound ) { //surveyLine이 lowerbound를 벗어나면 edge를 이동, 마지막 surveyLine 반복 후 역방향으로 이동.
                        reverseForSL = true;
                        i++;
                        intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;
                    }
                } else if ( reverseForSL === true &&  reverseForPolygonEdge === false ) { // surveyLine 이동 방향 lower --> upper.

                    if ( intersectionInfo.yCoordiOfSurveyLine === startPointForCurrEdge.getPointY() && intersectionInfo.yCoordiOfSurveyLine === endPointForCurrEdge.getPointY() ) {
                    // surveyLine과 polygonEdge가 일치하면 surveyLine update 하지 않고 다음 polygonEdge로 이동.
                        intersection = false;
                    } else {
                      intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;
                    }

                    if( polygonEdgeList[i].getPolygonEdgeID() === polygonEdgeList.length-1) {// 마지막 edge, surveyLine 남았는데 for 문 종료되면 안되니까.
                        i--;
                    }

                    if( intersectionInfo.yCoordiOfSurveyLine > this.upperBound ) {
                        //reverse 방향의 surveyLine도 더 이상 존재 하지 않으므로 waypoint 계산 종료.
                        break;
                    }
                } 

            } else {//*** 3-2. 교점 없는 경우: 다음 polygon edge로 이동. ***//

                intersection = false; // reverse == false &&  reverseForPolygonEdge == false

                if( reverseForSL === false &&  reverseForPolygonEdge === true ) { // surveyLine 이동 방향: 정방향 upper --> lower, Edge 방향: reverse
                    intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine + this.fov;	
                    intersection = true;
                    reverseForSL = true;
                } else if ( reverseForSL === true &&  reverseForPolygonEdge === true ) { // surveyLine 이동 방향 lower --> upper, Edge 방향: reverse
                        intersection = false;
                } else if ( reverseForSL === true &&  reverseForPolygonEdge === false ) { // surveyLine 이동 방향 lower --> upper, Edge 방향: reverse
                        intersection = true;
                        intersectionInfo.yCoordiOfSurveyLine = intersectionInfo.yCoordiOfSurveyLine - this.fov;
                        reverseForSL = false;
                }
                    //**add
                    if( polygonEdgeList[i].getPolygonEdgeID() === polygonEdgeList.length-1) {// 마지막 edge, surveyLine 남았는데 for 문 종료되면 안되니까.
                        intersection = false;
                        i--;
                    }

                    if( intersectionInfo.yCoordiOfSurveyLine > this.upperBound ) {
                        //reverse 방향의 surveyLine도 더 이상 존재 하지 않으므로 waypoint 계산 종료.
                        break;
                    }//**
            }
        }
        console.log('complete constructWP');
    }

    var constructWayPointPathOrder = function ()
    {
        var tempWP;
            
        //*** 1. y-sort: decrese ***//
        for ( i = 0; i < wayPointList.length-1; i++ ) {
            for ( j = i+1; j < wayPointList.length; j++ ) {
                if ( wayPointList[i].getPointY() < wayPointList[j].getPointY() ) {
                    tempWP = wayPointList[j];
                    wayPointList[j] = wayPointList[i];
                    wayPointList[i] = tempWP;
                } 
            }
        }
        
        //*** 2. x-sort: increse ***//
        for ( i = 0; i < wayPointList.length-1; i++ ) {
            for ( j = i+1; j < wayPointList.length; j++ ) {
                if ( wayPointList[i].getPointY() !== wayPointList[j].getPointY() ) {
                    break;
                }
                
                if ( wayPointList[i].getPointX() > wayPointList[j].getPointX() ) {
                    tempWP = wayPointList[j];
                    wayPointList[j] = wayPointList[i];
                    wayPointList[i] = tempWP;
                } 
            }
        }
        console.log(wayPointList);
        //*** 3. Decide WP order: start ID = 1 ***//
        //*** 3-1. SurveyLine 위의 양 끝 점에 WP order 부여 ***// 
        var wpIndex = 1;
        wayPointList[0].setPointID(wpIndex); //Start WP
        wpIndex++;
        for ( i = 1; i < wayPointList.length-1; i++ ) {
            if ( wayPointList[i].getPointY() !== wayPointList[i+1].getPointY() ) {
                wayPointList[i].setPointID(wpIndex);
                wpIndex++;
                wayPointList[i+1].setPointID(wpIndex);
                wpIndex++;
                i++;
            } else { // surveyLine 의 내부의 점은 ID = 0으로 설정
                wayPointList[i].setPointID(0);
            }
        }
        wayPointList[wayPointList.length-1].setPointID(wpIndex); //End WP
        console.log(wayPointList);
        
        //*** 3-2. Delete WP: id = 0 ***//
        var tempList = [];
        var tempWpId = 0;
        for ( i = 0; i < wayPointList.length; i++ ) {
            if ( wayPointList[i].getPointID(i) === 0 ) {
                continue;
            } else {
                tempList[tempWpId] = wayPointList[i];
                tempWpId++;
            }
        }
        wayPointList = tempList;
        
        //*** 3-3. SurveyLine 에 따라 WP order 엇갈리게 설정 1-2, 4-3, 5-6, 8-7... ***//
        var directionForSurvey = true;
        var tempId;
        for ( i = 0; i < wayPointList.length-1; i++ ) {
            if ( directionForSurvey === true ) {
                i++;
                directionForSurvey = false;
            } else {
                tempId = wayPointList[i].getPointID();
                wayPointList[i].setPointID(wayPointList[i+1].getPointID());
                wayPointList[i+1].setPointID(tempId);
                i++;
                directionForSurvey = true;
            }
        }
        
        //*** 3-4. WP list에 order 순서대로 담기. ***//
        var wpList = [];
        for ( i = 0; i < wayPointList.length; i++ ) {   
            wpList[wayPointList[i].getPointID()-1] = wayPointList[i];
        }
        wayPointList = wpList;

        console.log('complete path Order');     
    }

    var rotateAxis = function ()
    {
        var movedPointList = [];  
        
 //        if( this.rotationAngle > 0 ) {
 //           console.log('rotationAngle', rotationAngle); 
  //          continue;
  //      } else {
   //         break;
  //      }
            
        for ( i = 0; i < pointList.length; i++ ) {
            movedPointList[i] = new Point2D();

            var originX = pointList[i].getPointX();
		    var originY = pointList[i].getPointY();
            
            var movedX =  originX*Math.cos(this.rotationAngle)  + originY*Math.sin(this.rotationAngle);
		    var movedY = -originX*Math.sin(this.rotationAngle)  + originY*Math.cos(this.rotationAngle);
            
            movedPointList[i].setPointX( movedX );
            movedPointList[i].setPointY( movedY );
            movedPointList[i].setPointID(i);
        }
        pointList = movedPointList;
        console.log('pointList', pointList);
        
    }
    
    
    var returnAxis = function ()
    {
        var movedWPointList = [];    
            
        for ( i = 0; i < wayPointList.length; i++ ) {
            movedWPointList[i] = new Point2D();

            var originX = wayPointList[i].getPointX();
		    var originY = wayPointList[i].getPointY();
            
            var movedX =  originX*Math.cos(this.rotationAngle)  - originY*Math.sin(this.rotationAngle);
		    var movedY =  originX*Math.sin(this.rotationAngle)  + originY*Math.cos(this.rotationAngle);
            
            movedWPointList[i].setPointX( movedX );
            movedWPointList[i].setPointY( movedY );
            movedWPointList[i].setPointID(wayPointList[i].getPointID());
        }
        wayPointList = movedWPointList;
        
    }
    
    var solveSurveyGrid = function (points)
    {
        setFov( 100 );
        setRotationAngle( 10 );
        console.log('fov', fov); 
        console.log('rotationAngle', this.rotationAngle); 
        readPolygonData( points );
        
        rotateAxis();


        sortPointsByCoordiY();     
        constructEdgeDataStructure();
        //constructWayPointList();
        constructWayPointListCoveredConcave();
        constructWayPointPathOrder();
        

            returnAxis();
      
    }

    
    var saveWpPathForSurvey = function () 
    {
        //var features = pathLayer.getSource().getFeatures();
        var wpArry = [];
        for (var i = 0; i < wayPointList.length; i++) {
            //wayPointList[i].setPointID(i+1);
            var wp = {
                        way_pont_ord_no: wayPointList[i].getPointID(),
                        lttd_db: wayPointList[i].getPointY(),
                        lgte_db: wayPointList[i].getPointX()
                        //attd_no: properties.altitude,
                        //sped_no: properties.speed,
                        //wait_time_no: properties.wait,
                        //actn_str: properties.action
            };
            wpArry.push(wp);
        }

        var path = {
                        way_pont_path_name: 'pathName',
//                        pathInfo: {
//                            
//                        },
                        way_ponts: wpArry,
                        inpt_user_id: 1,
                        inpt_dt: '2016-04-27 11:10:24+09',
                    };
        //var jsonPath = JSON.stringify(path);
        console.log("save!!!!!!");
        //console.log(path);
        //console.log(jsonPath);
        //return jsonPath;
        return path;
    }
    
    

    
            
    
    return {
        
        setUpperBound:                          setUpperBound,
        setLowerBound:                          setLowerBound,
        setFov:                                 setFov,
        setRotationAngle:                       setRotationAngle,
        addPointForPolygon:                     addPointForPolygon,
        addPolygonEdge:                         addPolygonEdge,
        addWayPoint:                            addWayPoint,
        readPolygonData:                        readPolygonData,
        sortPointsByCoordiY:                    sortPointsByCoordiY,
        constructEdgeDataStructure:             constructEdgeDataStructure,
        constructWayPointList:                  constructWayPointList,
        computeIntersectionPoint:               computeIntersectionPoint,
        constructWayPointListCoveredConcave:    constructWayPointListCoveredConcave,
        constructWayPointPathOrder:             constructWayPointPathOrder,
        rotateAxis:                             rotateAxis,
        returnAxis:                             returnAxis,
        solveSurveyGrid:                        solveSurveyGrid,
        saveWpPathForSurvey:                    saveWpPathForSurvey

        

    }
}


kindFramework.factory('OptimizeService', SurveyGridSolver);

