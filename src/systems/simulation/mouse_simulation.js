"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
        var progress_meter = 7;
        var increment_progress =1;
        var progress = data.entities.get(progress_meter,"progress");

        var entity_size = data.entities.get(entity, "size");
        var entity_position = data.entities.get(entity, "position");
        var image = data.entities.get(entity, "image");
        var timers = data.entities.get(entity, "timers");
        var click_image = data.entities.get(entity, "click_image");
        var cursor_position = {
            "x": data.input.mouse.x - entity_size.width / 2,
            "y": data.input.mouse.y - entity_size.height / 2
        };
        data.entities.set(entity, "position", cursor_position);

        var timers = data.entities.get(entity, "timers");
        var entity_collisions = data.entities.get(entity, "collisions");
        if(data.input.mouse.consumePressed(0)) {
            for(var i = 0; i < entity_collisions.length; ++i) {
                if(data.entities.get(entity_collisions[i], "projectile") && data.entities.get(entity_collisions[i], "negative_effect")) {
                    data.entities.destroy(entity_collisions[i--]);
                }
            }
            image.name = click_image;
            timers.cursor_click.time = 0;
            timers.cursor_click.running = true;
        }

        var grenade, grenade_timers;

        if(data.input.button("zengrenade")) {
            // Show reticle
            console.log(timers.zen_cooldown.running);
            if(!timers.zen_cooldown.running) {
                image.name = "zengrenade_reticle";
                image.destinationWidth = entity_size.width * 6;
                image.destinationHeight = entity_size.height * 6;
                image.destinationX = -image.destinationWidth / 2 + entity_size.width / 2;
                image.destinationY = -image.destinationHeight / 2 + entity_size.height / 2;
            }
        }
        if(data.input.buttonReleased("zengrenade")) {
            if(!timers.zen_cooldown.running) {
                grenade = data.instantiatePrefab("zengrenade");
                data.entities.set(entity, "image", {"name": "cursor"});
                data.entities.set(grenade, "position", { "x": cursor_position.x - entity_size.width / 2, "y": cursor_position.y - entity_size.height / 2});
                data.entities.set(grenade, "size", {"width": entity_size.width * 2, "height": entity_size.height * 2});
                timers.zen_cooldown.time = 0;
                timers.zen_cooldown.running = true;
            }
        }

    }, "cursor");
}
