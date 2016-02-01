"use strict";

module.exports = function(entity, data) {
   var timers =data.entities.get(entity, "timers"); 
   timers.start_end.running = true;
}
