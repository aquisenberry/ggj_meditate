"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function resolveCollisions(entity, elapse) {
        var score = data.entities.get(entity, "score");
        var entity_collisions = data.entities.get(entity, "collisions");
        for( var i = 0; i < entity_collisions.length; ++i) {
             if(data.entities.get(entity_collisions[i], "projectile")) {
                if(data.entities.get(entity_collisions[i], "negative_effect")) {
                    data.entities.set(entity, "score", --score);
                } else {
                    data.entities.set(entity, "score", ++score);
                }
                data.entities.destroy(entity_collisions[i]);
              }
        }
    }, "player");
}
