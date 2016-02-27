"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
        var entity_collisions = data.entities.get(entity, "collisions");
		for(var i = 0; i < entity_collisions.length; ++i) {
			if(data.entities.get(entity_collisions[i], "projectile")) {
				data.entities.destroy(entity_collisions[i--]);
			}
		}

	}, "clear_halo");
};
