"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
        var half_bob_range = 7;
        var time_incriment = 0.009;

        var image = data.entities.get(entity, "image");
        var time = data.entities.get(entity,"time");
        
        image.destinationY = Math.sin(time)*half_bob_range;
        data.entities.set(entity, "time", time + time_incriment);
    }, "player");
}
