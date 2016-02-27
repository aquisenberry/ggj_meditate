"use strict";

module.exports = function(entity, data) {

    var size = data.entities.get(entity, "size");
    var pos = data.entities.get(entity, "position");
    var step = data.entities.get(entity, "size_step");
    var new_size = {
        "width": size.width + step,
        "height": size.height + step
    };
    data.entities.set(entity, "size", new_size);
    var new_pos = {
        "x": pos.x - step / 2,
        "y": pos.y - step / 2
    };
    data.entities.set(entity, "position", new_pos);

    var timers = data.entities.get(entity, "timers");
    timers.clear_screen.time = 0;
    timers.clear_screen.running = true;

};
