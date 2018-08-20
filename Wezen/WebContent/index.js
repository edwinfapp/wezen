
function preload(url) {
	$.ajax({
		async : false,
		type : "GET",
		url : url
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

location.href = "/Wezen/game.jsp?name=Edwin"

