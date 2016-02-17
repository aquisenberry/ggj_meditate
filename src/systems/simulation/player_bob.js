"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
        var half_bob_range = 7;
        var time_incriment = 0.009;

        var image = data.entities.get(entity, "image");
        var time = data.entities.get(entity,"time");
        
        image.destinationY = Math.sin(time.bob_time)*half_bob_range;
        time.bob_time += time_incriment; 
    }, "player");
}
