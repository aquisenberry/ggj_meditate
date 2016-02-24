"use strict";

module.exports = function(entity, data) {

    var timers = data.entities.get(entity, "timers");
    timers.boom.running = true;

}
