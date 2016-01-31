"use strict";

module.exports = function(entity, data) {
   var timers = data.entities.get(entity, "timers");
   var velocity = data.entities.get(entity, "velocity");
   velocity.x = -velocity.x/2;
   velocity.y = -velocity.y/2;
}
