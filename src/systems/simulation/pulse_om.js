module.exports = function(ecs, data) {
    ecs.addEach(function(entity, elapsed) {
    	if(data.entities.get(entity,"image")){
    		var half_bob_range = 1;
	        var time_incriment = 0.009;

	        var size = data.entities.get(entity, "size");
	        var base_size = data.entities.get(entity, "base_size");
	        var time = data.entities.get(entity,"time");
	        var position = data.entities.get(entity, "position");

	        size.width = (Math.sin(time.scale_time)*(1/12)+ 1) *base_size.width ;
	        size.height = (Math.sin(time.scale_time)*(1/12)+ 1) *base_size.height;
    		console.log(size);
	        time.scale_time += time_incriment; 
    	}
        
    }, "halo");
    ecs.addEach(function(entity, elapsed) {
    	if(data.entities.get(9,"image")){

    		var half_bob_range = 1;
	        var time_incriment = 0.009;

	        var size = data.entities.get(entity, "size");
	        var base_size = data.entities.get(entity, "base_size");
	        var time = data.entities.get(entity,"time");
	        var position = data.entities.get(entity, "position");

	        if(time.scale_time == 0){
	        	data.sounds.play("smallgong");
	        }
	        size.width = (Math.sin(time.scale_time)*(1/12)+ 1) *base_size.width ;
	        size.height = (Math.sin(time.scale_time)*(1/12)+ 1) *base_size.height;
    		console.log(size);
	        time.scale_time += time_incriment; 
    	}
        
    }, "om");
}