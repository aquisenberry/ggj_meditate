"use strict";

module.exports = function(entity, data) {
	var progress = data.entities.get(entity,"progress");
	var timers = data.entities.get(entity,"timers");
	var decrement = -1;


	progress.value += decrement;
	timers.decrement_progress.running = true;
	timers.decrement_progress.time= 0;
}
