"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {

        var image = data.entities.get(entity, "image");
        var time = data.entities.get(entity,"time");
        image.destinationY = Math.sin(time)*7;
        data.entities.set(entity, "time", time + .009);
    }, "player");
}
