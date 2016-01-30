"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function resolveCollisions(entity, elapse) {
        var entity_collisions = data.entities.get(entity, "collisions");
        for( var i = 0; i < entity_collisions.length; ++i) {
            data.entities.destroy(entity_collisions[i]);
        }
    }, "player");
}
