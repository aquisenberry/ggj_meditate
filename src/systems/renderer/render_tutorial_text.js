"use strict";

module.exports = function(ecs, data) {
    ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars

        var pos_txt = "This is Positive Energy. It will bring your monk to zen";
        var neg_txt = "This is Negative Energy. It will ruin your monk's concentration.";
        var zengrenade_txt = "Press space to drop a zen grenade.";

        // Positive Projectile Position: {"x": data.canvas.width * 0.25, "y": data.canvas.height * 0.1}
        context.font = "20px Arial";
        context.fillStyle = "black";
        context.fillText(pos_txt, data.canvas.width * 0.25 - (context.measureText(pos_txt).width / 2), data.canvas.height * 0.2);
        context.fillText(neg_txt, data.canvas.width * 0.75 - (context.measureText(neg_txt).width / 2), data.canvas.height * 0.2);
        context.fillText(zengrenade_txt, data.canvas.width * 0.5 - (context.measureText(zengrenade_txt).width / 2), data.canvas.height * 0.85);

    }, "camera");
}
