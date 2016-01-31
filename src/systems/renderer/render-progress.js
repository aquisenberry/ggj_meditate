"use strict";

module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
		var position = data.entities.get(entity, "position");
		var size = data.entities.get(entity, "size");
		var progress = data.entities.get(entity, "progress");
		context.globalAlpha = 0.65;
		var prog= progress.value/progress.max > 1? 1:progress.value/progress.max ;
		for(var i = 0;i < progress.blocks.length;i++){
			var match =data.entities.get(progress.blocks[i],"match");
			var block_size = data.entities.get(progress.blocks[i],"size");

			context.fillStyle = "#f04f50";

			context.fillRect(position.x, position.y + match.offsetY, block_size.width, block_size.height);

		}
        context.globalAlpha = 1;

	}, "progress");
};
