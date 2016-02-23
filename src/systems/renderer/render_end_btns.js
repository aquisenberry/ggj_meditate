"use strict";

module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
	data.entities.registerSearch("search", ["btn"]);
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
		var position = data.entities.get(entity, "position");
		var size = data.entities.get(entity, "size");
		context.globalAlpha = 1;
		var image = data.entities.get(entity,"image");
		console.log(size);
		context.drawImage(data.images.get(image.name),position.x,position.y,size.width,size.height);

	}, "search");
};
