"use strict";

module.exports = function(data) { // eslint-disable-line no-unused-vars

	var camera = 0;
	var camera_timers = data.entities.get(camera, "timers");
	var level = parseInt(data.arguments.level) % 3;

	var levels = [
		{
			"background": "background3",
		},
		{
			"background": "background",
		},
		{
			"background": "background2",
		}
	]
	
	if(level > levels.length - 1) {
		level = levels.length - 1;
	}

	if(level == 0) {
		camera_timers.spawn_clouds.running = true;
	}

	data.entities.set(camera, "image", { "name": levels[level]["background"] });
	
};
