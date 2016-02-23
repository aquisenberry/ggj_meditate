"use strict";

module.exports = function(data) { // eslint-disable-line no-unused-vars

    var play = 4;
    var play_position = data.entities.get(play, "position");
    var play_size = data.entities.get(play, "size");

    play_position.x = data.canvas.width / 2 - play_size.width / 2;
    play_position.y = data.canvas.height * 0.4 - play_size.height / 2;

};
