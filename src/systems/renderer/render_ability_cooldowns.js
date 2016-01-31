"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars

        var cursor = 2;
        var name = data.entities.get(entity, "name");
        var timers = data.entities.get(cursor, "timers");
        var position = data.entities.get(entity, "position");
        var size = data.entities.get(entity, "size");
        
        if(name == "zengrenade") {
            if(timers.zen_cooldown.running) {
                var zen_percent = timers.zen_cooldown.time / timers.zen_cooldown.max;
                context.globalAlpha = 0.25;
                context.fillStyle = "black";
                context.fillRect(position.x + size.width * 0.15, position.y + size.height * 0.15, (size.width * 0.7) - ((size.width * 0.7) * zen_percent), size.height * 0.7);
                context.globalAlpha = 1;
            }
        }

        if(name == "lazer") {
            if(timers.laser_cooldown.running) {
                var laser_percent = timers.laser_cooldown.time / timers.laser_cooldown.max;
                context.globalAlpha = 0.25;
                context.fillStyle = "black";
                context.fillRect(position.x + size.width * 0.15, position.y + size.height * 0.15, (size.width * 0.7) - ((size.width * 0.7) * laser_percent), size.height * 0.7);
                context.globalAlpha = 1;
            }
        }

        if(name == "cone") {
            if(timers.cone_cooldown.running) {
                var cone_percent = timers.cone_cooldown.time / timers.cone_cooldown.max;
                context.globalAlpha = 0.25;
                context.fillStyle = "black";
                context.fillRect(position.x + size.width * 0.15, position.y + size.height * 0.15, (size.width * 0.7) - ((size.width * 0.7) * cone_percent), size.height * 0.7);
                context.globalAlpha = 1;
            }
        }

    }, "ability_icon");
}
