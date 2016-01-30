"use strict";

module.exports = function(entity, data) {
    var constants = data.entities.get(entity, "constants");
    constants.center = {
        "x": (data.canvas.width / 2),
        "y": (data.canvas.height / 2)
    }
}
