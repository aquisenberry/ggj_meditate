"use strict";

module.exports = function(entity, data) {
   data.entities.set(entity, "is_hit", false); 
   var time = data.entities.get(entity, "time");
   time.jitter_time = 0;
   data.entities.set(entity, "rotation", {"angle": 0});
}
