"use strict";

module.exports = function(entity, data) {

	var timers = data.entities.get(entity, "timers");
	if(timers.spawn_projectile.max > 150) {
		timers.spawn_projectile.max -= 10;
		timers.ramp_speed.time = 0;
		timers.ramp_speed.running = true;
	}

}
