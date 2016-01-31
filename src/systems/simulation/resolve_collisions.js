"use strict";

function distance( pos1, pos2 ) {
    return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y)); 
}

module.exports = function(ecs, data) {
    ecs.addEach(function resolveCollisions(entity, elapse) {
        var score = data.entities.get(entity, "score");
        var entity_collisions = data.entities.get(entity, "collisions");
        var ouch_image = data.entities.get(entity, "ouch_image");
        var zen_image = data.entities.get(entity, "zen_image");
        var player_image = data.entities.get(entity, "image");
        var player_pos = data.entities.get(entity, "position");
        var player_radius = data.entities.get(entity, "size").width / 2;
        var player_center = {
            "x": player_pos.x + player_radius,
            "y": player_pos.y + player_radius
        };
        var progress_meter = 7;
        var progress = data.entities.get(progress_meter,"progress");

        var timers = data.entities.get(entity, "timers");

        var rotation = data.entities.get(entity, "rotation");

        var half_bob_range = 0.075;
        var time_incriment = 3;

        var time = data.entities.get(entity,"time");

        for( var i = 0; i < entity_collisions.length; ++i) {
            if(data.entities.get(entity_collisions[i], "projectile")) {
                var proj_pos = data.entities.get(entity_collisions[i], "position");
                var proj_radius = data.entities.get(entity_collisions[i], "size").width / 2;
                var proj_center = {
                    "x": proj_pos.x + proj_radius,
                    "y": proj_pos.y + proj_radius
                };
                if( distance(player_center, proj_center) <= (player_radius + proj_radius) ) {
                    progress.value += data.entities.get(entity_collisions[i],"effect");
                    if(data.entities.get(entity_collisions[i], "negative_effect")) {
                        timers.ouch_pain.running = true;
                        timers.ouch_pain.time = 0;
                        data.entities.set(entity, "is_hit", true); 
                    } else {
                        data.entities.set(entity, "score", ++score);
                    }
                    data.entities.destroy(entity_collisions[i]);
                }

            }
        }
        if (progress.value > progress.max){
            progress.value = progress.max;
        }
        if (progress.value < 0){
            data.switchScene("end");
        }

        if(data.entities.get(entity, "is_hit")) {
            var mod = Math.cos(time.jitter_time)*half_bob_range;
            data.entities.set(entity, "rotation", {"angle": (rotation.angle + mod)});
            time.jitter_time += time_incriment;
            player_image.name = ouch_image;
        } else {
            player_image.name = zen_image;
        }

    }, "player");
}
