'use strict';

kindFramework.filter('droneArmStateFilter', function(){
	return function(base_mode){

		if(base_mode === undefined){
			return '';
		}

		var out = 'NONE';

		if((base_mode % 2) > 0){
			base_mode -= 1;
		}

		switch(base_mode){
			case 0:  		// MAV_MODE_PREFLIGHT
			out = 'NOT READY';
			break;

			case 192:  		// MAV_MODE_MANUAL_ARMED
			case 194: 		// MAV_MODE_TEST_ARMED
			case 208:  		// MAV_MODE_STABILIZE_ARMED
			case 216:  		// MAV_MODE_GUIDED_ARMED
			case 220:  		// MAV_MODE_AUTO_ARMED
			out = 'ARMED';
			break;

			case 64:  		// MAV_MODE_MANUAL_DISARMED
			case 66: 		// MAV_MODE_TEST_DISARMED
			case 80: 		// MAV_MODE_STABILIZE_DISARMED
			case 88: 		// MAV_MODE_GUIDED_DISARMED
			case 92:  		// MAV_MODE_AUTO_DISARMED
			out = 'DISARMED';
			break;

			default:
			out = 'NONE';
			break;
		}

		return out;
	};
});