"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
        var progress_meter = 7;
        var progress = data.entities.get(progress_meter,"progress");
        var om_progress = data.entities.get(entity,"om_progress");
        if(progress.value === progress.max){
        	om_progress.value += om_progress.increment;
        	console.log(om_progress.value)
        }
        if(om_progress.value == om_progress.max){
        	console.log("ZEN!!")
        	om_progress.zen = true;
        }
    }, "om");
}
