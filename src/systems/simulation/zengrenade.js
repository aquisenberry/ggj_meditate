"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function zengrenade(entity, elapsed) {

        var entity_collisions = data.entities.get(entity, "collisions");
        for(var i = 0; i < entity_collisions.length; i++) {
            if(data.entities.get(entity_collisions[i], "projectile")) {
                data.entities.destroy(entity_collisions[i--]);
            } 
        }
                     
    }, "zengrenade");
}
