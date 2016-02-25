"use strict";

module.exports = function(data) { // eslint-disable-line no-unused-vars

	var camera = 0;
	var camera_timers = data.entities.get(camera, "timers");
	var level = parseInt(data.arguments.level) - 1;

	var levels = [
		{
			"background": "background",
		},
		{
			"background": "background2",
		},
		{
			"background": "background3",
		}
	]

	if(level == 0) {
		camera_timers.spawn_clouds.running = true;
	}

	data.entities.set(camera, "image", { "name": levels[level]["background"] });
	
};
