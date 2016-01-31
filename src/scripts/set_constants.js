"use strict";

module.exports = function(entity, data) {
    
    var player = 1;
    var om = 3;

    var player_size = data.entities.get(player, "size");
    var om_size = data.entities.get(om,"size");

    var constants = data.entities.get(entity, "constants");
    constants.center = {
        "x": (data.canvas.width / 2),
        "y": (data.canvas.height * 0.6)
    }
    var new_pos = {
        "x": constants.center.x - player_size.width / 2,
        "y": constants.center.y - player_size.height / 2,
    }
    var om_pos = {
        "x": data.canvas.width*0.95 -om_size.width,
        "y": data.canvas.height*0.95 -om_size.height
    }
    data.entities.set(player, "position", new_pos);

    var cone_id = 4;
    var cone_icon_size = data.entities.get(cone_id, "size");
    var cone_icon_position = {
        "x": (data.canvas.width / 2) - cone_icon_size.width * 1.5,
        "y": (data.canvas.height * 0.95) - cone_icon_size.height,
    }
    data.entities.set(cone_id, "position", cone_icon_position);

    var bomb_id = 5;
    var bomb_icon_size = data.entities.get(bomb_id, "size");
    var bomb_icon_position = {
        "x": (data.canvas.width / 2) - bomb_icon_size.width * 0.5,
        "y": (data.canvas.height * 0.95) - bomb_icon_size.height,
    }
    data.entities.set(bomb_id, "position", bomb_icon_position);

    var laser_id = 6;
    var laser_icon_size = data.entities.get(bomb_id, "size");
    var laser_icon_position = {
        "x": (data.canvas.width / 2) + laser_icon_size.width * 0.5,
        "y": (data.canvas.height * 0.95) - laser_icon_size.height,
    }
    data.entities.set(laser_id, "position", laser_icon_position);
    data.entities.set(om,"position",om_pos);

    var progress_meter = 7;
    var progress_meter_size = data.entities.get(progress_meter,"size");
    var progress_meter_position = data.entities.get(progress_meter,"position");

    progress_meter_size.height = data.canvas.height * 0.9;
    progress_meter_size.width = data.canvas.width *0.05;
    progress_meter_position.x = data.canvas.width*0.05;
    progress_meter_position.y = data.canvas.height*0.05;

}
