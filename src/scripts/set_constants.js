"use strict";

module.exports = function(entity, data) {
    
    var player = 1;
    var om = 3;

    var player_size = data.entities.get(player, "size");
    var om_size = data.entities.get(om,"size");

    var constants = data.entities.get(entity, "constants");
    constants.center = {
        "x": (data.canvas.width / 2),
        "y": (data.canvas.height / 2)
    }
    var new_pos = {
        "x": constants.center.x - player_size.width / 2,
        "y": constants.center.y - player_size.height / 2,
    }
    var om_pos = {
        "x": data.canvas.width*0.8 -om_size.width/2,
        "y": data.canvas.height*0.9 -om_size.height
    }
    data.entities.set(player, "position", new_pos);
    data.entities.set(om,"position",om_pos);
}
