"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		entity.velocity.x = 0;
		entity.velocity.y = 0;
		if (data.input.button("left")) {
			entity.velocity.x = -0.5;
		}
		if (data.input.button("right")) {
			entity.velocity.x = 0.5;
		}
		if (data.input.button("up")) {
			entity.velocity.y = -0.5;
		}
		if (data.input.button("down")) {
			entity.velocity.y = 0.5;
		}
	}, ["player"]);
};
