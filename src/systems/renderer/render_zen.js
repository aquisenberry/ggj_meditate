"use strict";

module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
	
	ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
		var position = data.entities.get(entity, "position");
		var size = data.entities.get(entity, "size");
		var om_progress = data.entities.get(entity,"om_progress");
		context.strokeStyle = "#82d1e1"
		context.lineWidth = size.width*0.05;
		context.globalAlpha = 1;
		context.beginPath();
		context.arc(position.x+size.width/2,position.y+size.height/2,size.width/2- size.width*0.02,0,Math.PI*2*om_progress.value/om_progress.max);
		context.stroke();
		context.globalAlpha = 1;
	}, "om");
};
