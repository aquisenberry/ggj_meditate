"use strict";

module.exports = function(data) { // eslint-disable-line no-unused-vars

	var camera = 0;
	var camera_timers = data.entities.get(camera, "timers");
	var level = data.arguments.level;

	if(level == 1) {
		camera_timers.spawn_clouds.running = true;
	}
	
};
