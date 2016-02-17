"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
        
        var timers = data.entities.get(entity, "timers");
        if(timers.bring_in_film.running === true){

            context.fillStyle = "white";
            context.globalAlpha = 0.7;
            context.fillRect(0,0,data.canvas.width, data.canvas.height*(timers.bring_in_film.time/timers.bring_in_film.max));
            context.globalAlpha = 1;
        }else{
             context.fillStyle = "white";
            context.globalAlpha = 0.7;
            context.fillRect(0,0,data.canvas.width, data.canvas.height);
            context.globalAlpha = 1;
        }
        
       
    }, "camera");
}
