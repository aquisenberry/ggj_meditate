"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
        var entity_size = data.entities.get(entity, "size");
        var entity_position = data.entities.get(entity, "position");
        var image = data.entities.get(entity, "image");
        var click_image = data.entities.get(entity, "click_image");
        
		var mod = data.entities.get(entity, "move_mod");
		var x = gamepad.axes(0, "left stick x") * mod;
		var y = gamepad.axes(0, "left stick y") * mod;
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
        if(data.input.mouse.consumePressed(0)) {
            for(var i = 0; i < entity_collisions.length; ++i) {
                if(data.entities.get(entity_collisions[i], "name") == "back_title") {
                    data.entities.set(entity_collisions[i], "image", {"name": "back_to_title_pressed"}); 
                    data.sounds.stop("title");
                    data.switchScene("title");
                }
				if(data.entities.get(entity_collisions[i], "target_url").length > 0) {
					window.location = data.entities.get(entity_collisions[i], "target_url");
				}
            }
            image.name = click_image;
            timers.cursor_click.time = 0;
            timers.cursor_click.running = true;
        }

    }, "cursor");
}
