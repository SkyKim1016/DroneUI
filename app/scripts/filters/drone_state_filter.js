'use strict';

kindFramework.filter('droneStateFilter', function(){
	return function(custom_mode, base_mode){
		
		if(custom_mode === undefined || base_mode === undefined){
			return '';
		}

		if((base_mode % 2) == 0){
			return 'NONE';
		}

		var out = 'NONE';

		/* 
		* 2016.05.26 sayong.hong 
		* droneState는 추후 정책에 따라 재정의 가능성이 있으므로 현재는 값 그대로를 출력하도록 한다.
		*/

		switch(custom_mode){
			case 0:
			out = 'STABILIZE';
			break;

			case 1:
			out = 'ACRO';
			break;

			case 2:
			out = 'ALT_HOLD';
			break;

			case 3:
			out = 'AUTO';
			break;

			case 4:
			out = 'GUIDED';
			break;

			case 5:
			out = 'LOITER';
			break;

			case 6:
			out = 'RTL';
			break;

			case 7:
			out = 'CIRCLE';
			break;

			case 8:
			out = 'POSITION';
			break;

			case 9:
			out = 'LAND';
			break;

			case 10:
			out = 'OF_LOITER';
			break;

			case 11:
			out = 'DRIFT';
			break;

			case 12:
			out = 'RESERVED';
			break;

			case 13:
			out = 'SPORT';
			break;

			case 14:
			out = 'FLIP';
			break;

			case 15:
			out = 'AUTOTUNE';
			break;

			case 16:
			out = 'POS_HOLD';
			break;

			case 17:
			out = 'BRAKE';
			break;

			default:
			out = 'NONE';
			break;
		}

		return out;
	};
});