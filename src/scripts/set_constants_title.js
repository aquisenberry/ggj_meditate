"use strict";

function place_entity(data, id, width_mod, height_mod, x_mod, y_mod, left) {
    var entity_size = data.entities.get(id, "size");
    var entity_pos = data.entities.get(id, "position");
    entity_size.width = data.canvas.width * width_mod;
    entity_size.height = data.canvas.width * height_mod;
    if(left) {
        entity_pos.x = (data.canvas.width * x_mod) - (entity_size.width);
    } else {
        entity_pos.x = data.canvas.width * x_mod;
    }
    entity_pos.y = data.canvas.height * y_mod;
}

module.exports = function(entity, data) {

    data.sounds.play("title", true);

    var title = 3;
    place_entity(data, title, 0.6, 0.303, 0, 0, false);

    var play_button = 4;
    place_entity(data, play_button, 0.139, 0.08, 0.98, 0, true);

    var zenmode_button = 5;
    place_entity(data, zenmode_button, 0.324, 0.08, 0.98, 0.15, true);

    var credits_button = 6;
    place_entity(data, credits_button, 0.238, 0.08, 0.98, 0.30, true);


}
