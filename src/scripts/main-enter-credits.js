"use strict";

function place_entity(data, id, width_mod, height_mod, x_mod, y_mod, centered) {
    var entity_size = data.entities.get(id, "size");
    var entity_pos = data.entities.get(id, "position");
    entity_size.width = data.canvas.width * width_mod;
    entity_size.height = data.canvas.width * height_mod;
    if(centered) {
        entity_pos.x = (data.canvas.width * x_mod) - (entity_size.width / 2);
    } else {
        entity_pos.x = data.canvas.width * x_mod;
    }
    entity_pos.y = data.canvas.height * y_mod;
}

module.exports = function(data) { // eslint-disable-line no-unused-vars
    console.log("meh");
    //data.sounds.play("title", true);

    var title = 3;
    place_entity(data, title, 0.5, 0.109, 0.5, 0.11, true);

    var back_title = 4;
    place_entity(data, back_title, 0.25, 0.05, 0.5, 0.001, true);

    var dev = 5;
    place_entity(data, dev, 0.37, 0.058, 0.06, 0.35, false);

    var anthony = 6;
    place_entity(data, anthony, 0.375, 0.058, 0.06, 0.48, false);

    var matthew = 7;
    place_entity(data, matthew, 0.35, 0.041, 0.07, 0.6, false);

    var artwork = 8;
    place_entity(data, artwork, 0.256, 0.058, 0.57, 0.35, false);

    var ryan = 9;
    place_entity(data, ryan, 0.306, 0.041, 0.55, 0.5, false);

    var music = 10;
    place_entity(data, music, 0.189, 0.058, 0.61, 0.6, false);

    var zoe = 11;
    place_entity(data, zoe, 0.229, 0.041, 0.59, 0.73, false);


};
