"use strict";

module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
        var position = data.entities.get(entity, "position");
		var size = data.entities.get(entity, "size");
        context.globalAlpha = 0.6;
		context.fillStyle = "red"; 
        context.beginPath();
		context.arc(position.x + size.width/2, position.y+size.height/2, size.width/2, 0, Math.PI*2);
        context.closePath();
        context.fill();
        context.globalAlpha = 1;
    }, "zengrenade");
}
