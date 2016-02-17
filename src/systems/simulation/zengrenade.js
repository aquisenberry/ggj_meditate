"use strict";

function distance( pos1, pos2 ) {
    return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y)); 
}

module.exports = function(ecs, data) {
    ecs.addEach(function zengrenade(entity, elapsed) {
        
        var player_pos = data.entities.get(entity, "position");
        var player_radius = data.entities.get(entity, "size").width / 2;
        var player_center = {
            "x": player_pos.x + player_radius,
            "y": player_pos.y + player_radius
        };
        var entity_collisions = data.entities.get(entity, "collisions");
        for(var i = 0; i < entity_collisions.length; i++) {
            if(data.entities.get(entity_collisions[i], "projectile")) {
                var proj_pos = data.entities.get(entity_collisions[i], "position");
                var proj_radius = data.entities.get(entity_collisions[i], "size").width / 2;
                var proj_center = {
                    "x": proj_pos.x + proj_radius,
                    "y": proj_pos.y + proj_radius
                };
                if( distance(player_center, proj_center) <= (player_radius + proj_radius) ) {
                    data.entities.destroy(entity_collisions[i--]);
                } 
            }
        }
                     
    }, "zengrenade");
}
