// ------------------------------

var IREADY = false;


var GEONAVE = null;
var GEOTOWER = null;
var GEOSTATION = null

$(function() {

	new THREE.ObjectLoader().load('model/ship.json', function(geo) {

		GEONAVE = geo;

		new THREE.ObjectLoader().load('model/tower.json', function(geo) {

			GEOTOWER = geo;

			GEOTOWER.scale.set(25, 25, 25);

			GEOTOWER.rotation.x += Math.PI / 2;

			GEOTOWER.position.z = -20;

			new THREE.ObjectLoader().load('model/station.json', function(geo) {

				GEOSTATION = geo;

				GEOSTATION.scale.set(3, 3, 3);

				GEOSTATION.position.z = 60;

				// --

				GEONAVE.scale.set(140, 140, 140);

				// GEONAVE.scale.set(1,1,1);

				GEONAVE.rotation.x += Math.PI / 2;
				GEONAVE.rotation.y -= Math.PI / 2;

				$.getScript("game_load.js?v1");

			});

		});

	});

});