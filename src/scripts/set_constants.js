"use strict";

module.exports = function(entity, data) {
    
    var player = 1;
    var player_position = data.entities.get(player, "position");
    var player_size = data.entities.get(player, "size");
    var constants = data.entities.get(entity, "constants");
    constants.center = {
        "x": (data.canvas.width / 2),
        "y": (data.canvas.height / 2)
    }
    var new_pos = {
        "x": constants.center.x - player_size.width / 2,
        "y": constants.center.y - player_size.height / 2,
    }
    data.entities.set(player, "position", new_pos);
}
