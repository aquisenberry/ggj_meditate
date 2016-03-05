"use strict";

function normalize(x, y, pos) {

    var d = Math.sqrt((pos.x - x) * (pos.x - x) + (pos.y - y) * (pos.y - y)); 

    return {
        "x": (x-pos.x)/d,
        "y": (y-pos.y)/d
    };

}

function cast_to_edge(size,x, y, pos, data) {

    var uv = normalize(x, y, pos);

    do {
        x+=uv.x;
        y-=Math.abs(uv.y);
    } while( x + size.width >= 0 && x <= data.canvas.width && y+size.height >= 0 );

    return {"x": x, "y": y}

}

module.exports = function(entity, data) {

	var level = parseInt(data.arguments.level);
	var big_mod_max = 0.04 + (level * 0.02)
	var big_mod_min = (level * 0.02)
	var small_mod_max = 0.07 + (level * 0.02)
	var small_mod_min = 0.03 + (level * 0.02)

    var constants = data.entities.get(entity, "constants"); 
    var x = Math.floor(Math.random() * data.canvas.width);
    var y = Math.floor(Math.random() * data.canvas.height);

    var projectile = data.instantiatePrefab("projectile");
    var projectile_size = data.entities.get(projectile,"size");

    var new_pos = cast_to_edge(projectile_size,x, y, constants.center, data);
    new_pos.x = new_pos.x + projectile_size.width/2;
    new_pos.y = new_pos.y + projectile_size.height/2;
    data.entities.set(projectile, "position", new_pos);

    var uv = normalize(new_pos.x, new_pos.y, constants.center);
    var negative = Math.floor(Math.random() * (9 - 1)) + 1;
    var big = Math.floor(Math.random() * 9) % 2;
	var big_mod = Math.random() * (big_mod_max - big_mod_min) + big_mod_min;
	var small_mod = Math.random() * (small_mod_max - small_mod_min) + small_mod_min;
    if(data.arguments.mode == "zen") {
        negative = 0;
    }
    data.entities.set(projectile, "negative_effect", negative > 2);
    if(negative > 2){
        data.entities.set(projectile, "image", {"name": "negative_projectile"});
    } else {
        data.entities.set(projectile, "image", {"name": "positive_projectile"});
    }
    if(big) {
        data.entities.set(projectile, "size", {"width": data.canvas.width * 0.04, "height": data.canvas.width * 0.04});
        data.entities.set(projectile, "mod", 0.01);
        if(negative > 2) {
            data.entities.set(projectile, "effect", -20);
        } else {
            data.entities.set(projectile, "effect", 10);
        }
        data.entities.set(projectile, "velocity", {"x": -uv.x * big_mod, "y": -uv.y * big_mod});
    } else {
        data.entities.set(projectile, "size", {"width": data.canvas.width * 0.025, "height": data.canvas.width * 0.025});
        if(negative > 2) {
            data.entities.set(projectile, "effect", -10);
			data.entities.set(projectile, "mod", 0.02);
        } else {
            data.entities.set(projectile, "effect", 5);
			data.entities.set(projectile, "mod", 0.04);
        }
        data.entities.set(projectile, "velocity", {"x": -uv.x * small_mod, "y": -uv.y * small_mod});
    }

    var timers = data.entities.get(entity, "timers");
    timers.spawn_projectile.time = 0;
    timers.spawn_projectile.running = true;

}
