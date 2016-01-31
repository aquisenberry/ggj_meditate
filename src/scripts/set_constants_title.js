"use strict";

module.exports = function(entity, data) {

    data.sounds.play("title", true);

    var play_button = 4;
    var play_pos = data.entities.get(play_button, "position");
    var play_size = data.entities.get(play_button, "size");
    var zenmode_button = 5;
    var zenmode_pos = data.entities.get(zenmode_button, "position");
    var zenmode_size = data.entities.get(zenmode_button, "size");
    var credits_button = 6;
    var credits_pos = data.entities.get(credits_button, "position");
    var credits_size = data.entities.get(credits_button, "size");

    play_pos.x = data.canvas.width - (play_size.width + 25);
    zenmode_pos.x = data.canvas.width - (zenmode_size.width + 25);
    zenmode_pos.y = play_size.height + 25;
    credits_pos.x = data.canvas.width - (credits_size.width + 25);
    credits_pos.y = play_size.height + 25 + zenmode_size.height + 25;

}
