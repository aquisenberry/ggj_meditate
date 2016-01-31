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
    data.entities.set(projectile, "negative_effect", negative);
    if(negative > 2){
        data.entities.set(projectile, "image", {"name": "negative_projectile"});
    } else {
        data.entities.set(projectile, "image", {"name": "positive_projectile"});
    }
    if(big) {
        data.entities.set(projectile, "size", {"width": 40, "height": 40});
        data.entities.set(projectile, "mod", 0.01);
        data.entities.set(projectile, "velocity", {"x": -uv.x * 0.03, "y": -uv.y * 0.03});
    } else {
        data.entities.set(projectile, "size", {"width": 25, "height": 25});
        data.entities.set(projectile, "mod", 0.04);
        data.entities.set(projectile, "velocity", {"x": -uv.x * 0.05, "y": -uv.y * 0.05});
    }

    var timers = data.entities.get(entity, "timers");
    timers.spawn_projectile.time = 0;
    timers.spawn_projectile.running = true;
    

}
