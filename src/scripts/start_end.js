"use strict";

module.exports = function(entity, data) {
   var title_btn = data.instantiatePrefab("end_btn_title");
   var try_again_btn = data.instantiatePrefab("end_btn_try_again");

   var btn_size = {
    "width":data.canvas.width*0.3,
    "height": data.canvas.height* 0.2
   }

   var title_position = data.entities.get(title_btn,"position");
   var try_position = data.entities.get(try_again_btn,"position");
   var title_size = data.entities.get(title_btn,"size");
   title_size.width = btn_size.width;
   title_size.height = btn_size.height;
   var try_size = data.entities.get(try_again_btn,"size");
   try_size.height = btn_size.height;
   try_size.width = btn_size.width;

   title_position.x = data.canvas.width/2 - title_size.width/2;
   try_position.x = data.canvas.width/2 - try_size.width/2;

   title_position.y = data.canvas.height/3;
   try_position.y = data.canvas.height/2;
}
