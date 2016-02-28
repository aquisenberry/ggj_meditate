"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
        var progress_meter = 7;
        var increment_progress =1;
        var progress = data.entities.get(progress_meter,"progress");

		var player = 1;
		var om_meter = 3;
		var clear_halo = 10;
		var clear_timers = data.entities.get(clear_halo, "timers");
		var player_timers = data.entities.get(player, "timers");
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
        var om_progress = data.entities.get(om_meter, "om_progress");
        if(data.input.mouse.isPressed(0)) {
            for(var i = 0; i < entity_collisions.length; ++i) {
                if(data.entities.get(entity_collisions[i], "name") == "play_button") {
                    data.entities.set(entity_collisions[i], "image", {"name": "play_pressed"}); 
                    data.switchScene("main", {"level": 1});
                }
				if(data.entities.get(entity_collisions[i], "name") == "om" && om_progress.zen) {
					data.entities.set(clear_halo, "image", {"name": "halo"});
					clear_timers.clear_screen.running = true;
					player_timers.dat_outro.running = true;
				}
                if(data.entities.get(entity_collisions[i], "projectile")) {
                    data.entities.destroy(entity_collisions[i--]);
                }
            }
            image.name = click_image;
        } else {
			image.name = "cursor";
		}

        var grenade, grenade_timers;

        if(data.input.button("zengrenade")) {
            // Show reticle
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
