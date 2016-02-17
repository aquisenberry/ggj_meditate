"use strict";

module.exports = function(ecs, data) {
	if(data.arguments.mode == "tutorial") {
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars

			// Positive Projectile Position: {"x": data.canvas.width * 0.25, "y": data.canvas.height * 0.1}
			context.font = "20px Arial";
			context.fillStyle = "black";
			context.fillText("This is Positive Energy. Let it make it to your monk.", data.canvas.width * 0.1, data.canvas.height * 0.2);

		}, "camera");
	}
}
