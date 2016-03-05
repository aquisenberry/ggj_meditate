"use strict";

var Gamepad = require("html5-gamepad");

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
		var gamepad = new Gamepad();
		gamepad.update();
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

		var mod = data.entities.get(entity, "move_mod");
		var x = gamepad.axis(1, "left stick x") * mod;
		var y = gamepad.axis(1, "left stick y") * mod;
        var cursor_position = {
            "x": entity_position.x + x,
            "y": entity_position.y + y
        };
		if(cursor_position.x <= 0) {
			cursor_position.x = 0;
		}
		if(cursor_position.y <= 0) {
			cursor_position.y = 0;
		}
		if(cursor_position.x >= data.canvas.width - entity_size.width) {
			cursor_position.x = data.canvas.width - entity_size.width;
		}
		if(cursor_position.y >= data.canvas.height - entity_size.height) {
			cursor_position.y = data.canvas.height - entity_size.height;
		}
        data.entities.set(entity, "position", cursor_position);

        var timers = data.entities.get(entity, "timers");
        var entity_collisions = data.entities.get(entity, "collisions");
        var om_progress = data.entities.get(om_meter, "om_progress");
        if(gamepad.button(1, "a")) {
			data.entities.set(entity, "move_mod", 2);
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
			data.entities.set(entity, "move_mod", 4);
		}

		if(gamepad.button(1, "left stick") && om_progress.zen) {
			data.entities.set(clear_halo, "image", {"name": "halo"});
			clear_timers.clear_screen.running = true;
			player_timers.dat_outro.running = true;
		}

        var grenade, grenade_timers;

        if(gamepad.button(1, "right shoulder")) {
            // Show reticle
			data.entities.set(entity, "was_pressed", true);
            if(!timers.zen_cooldown.running) {
                image.name = "zengrenade_reticle";
                image.destinationWidth = entity_size.width * 6;
                image.destinationHeight = entity_size.height * 6;
                image.destinationX = -image.destinationWidth / 2 + entity_size.width / 2;
                image.destinationY = -image.destinationHeight / 2 + entity_size.height / 2;
            }
        } else {
			if(data.entities.get(entity, "was_pressed")) {
				if(!timers.zen_cooldown.running) {
					grenade = data.instantiatePrefab("zengrenade");
					data.entities.set(entity, "image", {"name": "cursor"});
					data.entities.set(grenade, "position", { "x": cursor_position.x - entity_size.width / 2, "y": cursor_position.y - entity_size.height / 2});
					data.entities.set(grenade, "size", {"width": entity_size.width * 2, "height": entity_size.height * 2});
					timers.zen_cooldown.time = 0;
					timers.zen_cooldown.running = true;
				}
				data.entities.set(entity, "was_pressed", false);
			}
        }

    }, "cursor");
}
