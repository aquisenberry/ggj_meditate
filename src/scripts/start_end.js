"use strict";

module.exports = function(entity, data) {
   var title_btn = data.instantiatePrefab("end_btn_title");
   var try_again_btn = data.instantiatePrefab("end_btn_try_again");

   var btn_size = {
    "width":data.canvas.width*0.3,
    "height": data.canvas.height* 0.1
   }

   var title_position = data.entities.get(title_btn,"position");
   var try_position = data.entities.get(try_again_btn,"position");

   data.entities.set(title_btn,"size",btn_size);
   data.entities.set(try_position,"size",btn_size);

   title_position.x = data.canvas.width/2 - data.entities.get(title_btn,"size").width/2;
   try_position.x = data.canvas.width/2 - data.entities.get(try_again_btn,"size").width/2;

   title_position.x = data.canvas.height/3;
   title_position.x = data.canvas.height/2;
}
