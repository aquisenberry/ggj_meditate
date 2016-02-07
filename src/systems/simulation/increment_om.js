"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
        var player = 1;
        var player_image = data.entities.get(player,"image");
        var progress_meter = 7;
        var progress = data.entities.get(progress_meter,"progress");
        var om_progress = data.entities.get(entity,"om_progress");
		var zen_animation = {
				"time": 0,
				"frame": 0,
				"loop": false,
				"speed": 10,
				"name": ""
		};

        if(progress.value === progress.max && om_progress.value < om_progress.max){
        	om_progress.value += om_progress.increment;
        	player_image.name = "monkzenmode";
        } else if(progress.value <= 30) {
            player_image.name = "pissedface";
        } else {
			if(om_progress.value >= om_progress.max){
				om_progress.zen = true;
				data.entities.set(player, "animation", zen_animation);
			} else {
				player_image.name = player_image.name == "monkzenmode"?"player":player_image.name;
			}
        }
        
    }, "om");
}
