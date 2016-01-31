"use strict";

module.exports = function(entity, data) {

    var cloud = data.instantiatePrefab("cloud");
    var image = data.entities.get(cloud, "image");
    var pos = {
        "x": Math.floor(Math.random() * ((data.canvas.width - 200) - 1)) + 1,
        "y": 25
    };
    data.entities.set(cloud, "position", pos);

    var black_cloud = Math.floor(Math.random() * (9 - 1)) + 1;
    var cloud_num, cloud_name;

    if( black_cloud > 3 ) {
        cloud_num = Math.floor(Math.random() * (3 - 1)) + 1;
        cloud_name = "dark_clouds" + cloud_num.toString();
        switch(cloud_num) {
            case 3:
                data.entities.set(cloud, "size", {"width": 200, "height": 95});
                break;
            case 2:
                data.entities.set(cloud, "size", {"width": 200, "height": 89});
                break;
            case 1:
                data.entities.set(cloud, "size", {"width": 200, "height": 91});
                break;
            default:
                data.entities.set(cloud, "size", {"width": 0, "height": 0});
                break;
        }
        data.entities.set(cloud, "z-index", {"z-index": 0});
    } else {
        cloud_num = Math.floor(Math.random() * (5 - 1)) + 1;
        cloud_name = "clouds" + cloud_num.toString();
        switch(cloud_num) {
            case 5:
                data.entities.set(cloud, "size", {"width": 200, "height": 79});
                break;
            case 4:
                data.entities.set(cloud, "size", {"width": 200, "height": 62});
                break;
            case 3:
                data.entities.set(cloud, "size", {"width": 200, "height": 71});
                break;
            case 2:
                data.entities.set(cloud, "size", {"width": 200, "height": 102});
                break;
            case 1:
                data.entities.set(cloud, "size", {"width": 200, "height": 86});
                break;
            default:
                data.entities.set(cloud, "size", {"width": 0, "height": 0});
                break;
        }
        data.entities.set(cloud, "z-index", {"z-index": 1});
    }

    image.name = cloud_name;
    data.entities.set(cloud, "image", image);
    var mod = Math.random() * (0.08 + 0.08) - 0.08;
    data.entities.set(cloud, "velocity", {"x": mod, "y": 0});

    var timers = data.entities.get(entity, "timers");
    timers.spawn_clouds.time = 0;
    timers.spawn_clouds.max = 2000;
    timers.spawn_clouds.running = true;

}
