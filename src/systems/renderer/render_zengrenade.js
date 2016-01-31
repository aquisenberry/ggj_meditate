"use strict";

module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
        var position = data.entities.get(entity, "position");
		var size = data.entities.get(entity, "size");
		context.fillStyle = "red"; 
		context.fillRect(position.x, position.y, size.width, size.height);
    }, "zengrenade");
}
