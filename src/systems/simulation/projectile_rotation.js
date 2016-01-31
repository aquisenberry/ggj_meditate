"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function rotate_projectiles(entity, elapsed) {
        var rotation = data.entities.get(entity, "rotation");
        var image = data.entities.get(entity, "image");
        var dx = data.entities.get(entity, "velocity").x;
        var mod = data.entities.get(entity, "mod");
        if(dx > 0) {
            data.entities.set(entity, "rotation", {"angle": (rotation.angle + mod)});
        } else {
            data.entities.set(entity, "rotation", {"angle": (rotation.angle - mod)});
        }
    }, "projectile");
}
