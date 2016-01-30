"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	game.entities.registerSearch("sampleRendererSystem", ["camera", "position", "size"]);
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
		var position = game.entities.get(entity, "position");
		var size = game.entities.get(entity, "size");
		var color = game.entities.get(entity, "fillStyle");
		context.fillStyle = color; 
		context.fillRect(position.x, position.y, size.width, size.height);
	}, "sampleRendererSystem");
	game.entities.registerSearch("playerSearch", ["fillStyle", "position", "size"]);
    ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
		var position = game.entities.get(entity, "position");
		var size = game.entities.get(entity, "size");
		var color = game.entities.get(entity, "fillStyle");
		context.fillStyle = color; 
		context.fillRect(position.x, position.y, size.width, size.height);
	}, "playerSearch");
};
