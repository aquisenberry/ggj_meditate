"use strict";

module.exports = function(entity, data) {

    var pos_projectile = data.instantiatePrefab("projectile");
    data.entities.set(pos_projectile, "position", {"x": data.canvas.width * 0.25, "y": data.canvas.height * 0.1});
    data.entities.set(pos_projectile, "size", {"width": 40, "height": 40});
    data.entities.set(pos_projectile, "image", {"name": "positive_projectile"});
    var neg_projectile = data.instantiatePrefab("projectile");
    data.entities.set(neg_projectile, "position", {"x": data.canvas.width * 0.75, "y": data.canvas.height * 0.1});
    data.entities.set(neg_projectile, "size", {"width": 40, "height": 40});
    data.entities.set(neg_projectile, "image", {"name": "negative_projectile"});

}
