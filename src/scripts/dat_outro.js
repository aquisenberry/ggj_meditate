"use strict";

module.exports = function(entity, data) {

	var player_pos = data.entities.get(entity, "position");
	var player_size = data.entities.get(entity, "size");
	var timers = data.entities.get(entity, "timers");
	var level = data.arguments.level;

	if(player_pos.y > -player_size.height) {
		player_pos.y -= 5;
		timers.dat_outro.time = 0;
		timers.dat_outro.running = true;
	} else {
		level++;
		data.switchScene("main", {"level": level, "mode": data.arguments.mode});
	}

}
