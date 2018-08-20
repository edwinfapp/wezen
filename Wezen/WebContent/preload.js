var PRELOAD_FINAL = 0;
var PRELOAD = 0;

function preload(url) {
	
	PRELOAD_FINAL++;
	
	$.ajax({
		async : true,
		type : "GET",
		url : url
	}).done(function() {
		PRELOAD++;
		
		if(PRELOAD_FINAL == PRELOAD){
			
			$(".loader").fadeOut(600, function(){
				$("#area_usuario").fadeIn(600, function(){
					$("#username").focus();
				});
			});
		}
	});
}


// -------------

preload("/Wezen/model/ship.json");
preload("/Wezen/model/station.json");
preload("/Wezen/model/tower.json");

preload("/Wezen/model/ship.jpg");
preload("/Wezen/model/station.jpg");
preload("/Wezen/model/tower.jpg");

preload("/Wezen/images/car.png");
preload("/Wezen/images/energia.jpg");
preload("/Wezen/images/fuego.jpg");
preload("/Wezen/images/logo.png");
preload("/Wezen/images/flecha.png");
preload("/Wezen/images/flecha2.png");
preload("/Wezen/images/lava.png");
