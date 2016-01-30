"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {

        var entity_size = data.entities.get(entity, "size");
        var cursor_position = {
            "x": data.input.mouse.x - entity_size.width / 2,
            "y": data.input.mouse.y - entity_size.height / 2
        };
        data.entities.set(entity, "position", cursor_position);

        var entity_collisions = data.entities.get(entity, "collisions");
        if(data.input.mouse.consumePressed(0)) {
            for(var i = 0; i < entity_collisions.length; ++i) {
                if(data.entities.get(entity_collisions[i], "projectile") && data.entities.get(entity_collisions[i], "negative_effect")) {
                    data.entities.destroy(entity_collisions[i]);
                }
            }
        }

    }, "cursor");
}
