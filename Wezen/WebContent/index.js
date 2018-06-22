var $ALTURA_NAVE = 2.8;

var IDCAR = 0;

var IFCONTROL = $("#if_control").get(0).contentWindow;

var VELOCIMETRO_HT = $("#vel_in");

// ---

var AG = $("#area_game");

console.log(AG.width() + ", " + AG.height());

var SCENE = new THREE.Scene();

var CAMERA = new THREE.PerspectiveCamera(75, AG.width() / AG.height(), 0.1, 1000);
CAMERA.up = new THREE.Vector3(0, 0, 1);

var RENDERER = new THREE.WebGLRenderer();
RENDERER.setSize(AG.width(), AG.height());
RENDERER.setPixelRatio(window.devicePixelRatio * 0.9);
RENDERER.setClearColor(0x000000, 1);

RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

var CAMERA_LOOKAT = new THREE.Vector3(0, 0, 0);

AG.get(0).appendChild(RENDERER.domElement);

// -----------------------------------------------------------

// SCENE.add(new THREE.AmbientLight(0xCCCCCC));

var spotLight = null;

{
	// SpotLight( color, intensity, distance, angle, penumbra, decay )
	spotLight = new THREE.SpotLight(0xffffff, 4, 300, 4, 0.5, 1);
	spotLight.position.set(0, 0, 30);

	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 512;
	spotLight.shadow.mapSize.height = 512;

	spotLight.shadow.camera.castShadow = true;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 1;

	SCENE.add(spotLight);
}

// SCENE.add(new THREE.SpotLightHelper(spotLight));

// ----------------------------------------------

var DIM_PISO = 1024;

var piso = null;

{
	var geometry = new THREE.BoxGeometry(DIM_PISO, DIM_PISO, 2);

	var texture = new THREE.TextureLoader().load('images/car.png');

	var ds = 6;
	texture.repeat.set(574 / ds, 1000 / ds);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	var material = new THREE.MeshStandardMaterial({
		map : texture,
		color : 0xFFFFFF
	});

	piso = new THREE.Mesh(geometry, material);

	piso.position.z *= 1.1;

	piso.castShadow = true;
	piso.receiveShadow = true;

	SCENE.add(piso);
}

// ---------------------------------------------------------------

var balas = [];

function eliminarBala(){
	
	console.log("eliminarBala");
	
	if(balas.length > 0){
		SCENE.remove(balas[0].cube);
		balas.shift();
	}
}

function adicionarBala() {
	
	var index = balas.length;
	
	console.log("adicionarBala");
	
	var geometry = new THREE.SphereGeometry(1, 12, 12);

	var material = new THREE.MeshBasicMaterial({
		color : 0xFF0000
	});

	var cube = new THREE.Mesh(geometry, material);
	
	cube.position.z = 2;
	cube.position.x = 0;
	cube.position.y = 0;

	SCENE.add(cube);

	balas[index] = {
		cube : cube,
	};
	
}

// ---------------------------------------------------------------


var cars = [];

function eliminarCarro(index){
	if(cars[index] != null){
		SCENE.remove(cars[index].cube);
		cars[index] = null;
	}
}

function adicionarCarro(index) {
	
	console.log("adicionarCarro");

	var cube = new THREE.Object3D();

	var ff = null;

	var angu = 0;

	{

		var geometry = new THREE.SphereGeometry(2, 4, 4);

		var material = new THREE.MeshLambertMaterial({
			color : 0x00FF00
		});

		ff = new THREE.Mesh(geometry, material);

		geometry.vertices.forEach(function(v) {

			v.z = v.z / 2;

			if (v.y > 0) {
				v.y = 2 - Math.abs(v.x);
				v.z = v.z / 4;
				v.y = v.y * 3;
			}

			v.x = v.x * 2;

		});

		ff.castShadow = true;
		ff.receiveShadow = true;

		ff.position.z = 1.5;

		ff.position.x = 0;
		ff.position.y = 0;
		ff.position.z = 0;

		cube.add(ff);
	}

	cube.position.z = 2;

	SCENE.add(cube);

	cars[index] = {
		cube : cube,
		ff : ff
	};

}

// ---------------

var VELOCIDAD = 0;

var ltime = Date.now();

var animate = function() {

	requestAnimationFrame(animate);

	var time = Date.now();

	var deltha = (time - ltime) / 200;

	ltime = time;

	// --

	if(cars[IDCAR] !== undefined){
	
		var cube = cars[IDCAR].cube;
		var angu = -cube.rotation.z;
	
		var dis = 6.5;
		if (CDATA) {
			dis = CDATA.cr[IDCAR].v / 2 + 6;
		}
	
		CAMERA.position.y = cube.position.y - dis * Math.cos(angu);
		CAMERA.position.x = cube.position.x - dis * Math.sin(angu);
		CAMERA.position.z = 10;
	
		CAMERA_LOOKAT.x = cube.position.x + 15 * Math.sin(angu);
		CAMERA_LOOKAT.y = cube.position.y + 15 * Math.cos(angu);
		CAMERA_LOOKAT.z = cube.position.z;
	
		CAMERA.lookAt(CAMERA_LOOKAT);
	
		spotLight.target.position.set(cube.position.x, cube.position.y, cube.position.z);
	
		spotLight.target.updateMatrixWorld();
	
		spotLight.position.x = cube.position.x;
		spotLight.position.y = cube.position.y;
		spotLight.position.z = 45;

	}
	
	RENDERER.render(SCENE, CAMERA);
};

animate();

// ----------

$(window).resize(function() {
	RENDERER.setSize(AG.width(), AG.height());
	RENDERER.setPixelRatio(window.devicePixelRatio * 0.9);
	CAMERA.aspect = AG.width() / AG.height();
	CAMERA.updateProjectionMatrix();
	RENDERER.setSize(AG.width(), AG.height());
});

// ------ CONTROLES

var PRESSKEY = {
	"C37" : false,
	"C38" : false,
	"C39" : false,
	"C40" : false,
	"C88" : false,
};

var GAME_VELOCIDAD = 0; // velocidad del carro
var GAME_ACELERANDO = 0; // determina si esta acelerando ( 0 / 1)
var GAME_DIRECCION = 0; // determina la direccion a la cual se dirige
var GAME_DISPARO = 0; // determina si esta disparando.

function enviarComandoDemo() {

	var disparo = !PRESSKEY.C88 && GAME_DISPARO == 1;
	
	GAME_ACELERANDO = 0;
	GAME_DIRECCION = 0;
	GAME_DISPARO = 0;

	if (PRESSKEY.C38) {
		GAME_ACELERANDO = 1;
	}

	if (PRESSKEY.C40) {
		GAME_ACELERANDO = -1;
	}

	if (PRESSKEY.C37) {
		GAME_DIRECCION = -1;
	}

	if (PRESSKEY.C39) {
		GAME_DIRECCION = 1;
	}

	if (PRESSKEY.C88) {
		GAME_DISPARO = 1;
	}
	
	var msg = {
		a : GAME_ACELERANDO,
		d : GAME_DIRECCION,
		p : disparo
	}

	IFCONTROL.postMessage(msg, "*");
}

var ULTIMO_COMANDO = "";

$(document).keydown(function(event) {

	if (PRESSKEY["C" + event.which] !== undefined) {
		PRESSKEY["C" + event.which] = true;
		enviarComandoDemo();
	}

});

$(document).keyup(function(event) {
	
	if (PRESSKEY["C" + event.which] !== undefined) {
		PRESSKEY["C" + event.which] = false;
		enviarComandoDemo();
	}
});

// ---

function iniciaMensaje() {
	if (IREADY) {
		enviarComandoDemo();
	} else {
		window.setTimeout(iniciaMensaje, 10)
	}
}

iniciaMensaje();

// -----------------------------------

var CDATA = null;

function receiveMessage(event) {
	$w = event.source;

	var data = event.data;

	if (data.cr === undefined) {
		return;
	}

	IDCAR = data.me;
	CDATA = data;

	// ajusta la velocidad
	VELOCIMETRO_HT.text(parseInt(data.cr[IDCAR].v * 100));

	// ajusta las posiciones de cada carro

	for ( var index in data.cr) {

		var dt = data.cr[index];

		if(dt == null){
			eliminarCarro(index);
		}else{

			if(cars[index] === undefined){
				adicionarCarro(index);
			}
			
			var car = cars[index];

			if(car != null){
				car.cube.position.x = dt.x;
				car.cube.position.y = dt.y;
				car.cube.position.z = dt.z;
				car.ff.rotation.y = dt.i;
				car.cube.rotation.z = dt.r;
			}
		}
	}
	
	// ajusta las balas
	
	while(data.bl.length < balas.length){
		eliminarBala();
	}
	
	for ( var index in data.bl) {
		
		var dt = data.bl[index];

		if(balas[index] === undefined){
			adicionarBala(index);
		}
		
		var bala = balas[index];

		if(bala != null){
			bala.cube.position.x = dt.x;
			bala.cube.position.y = dt.y;
			bala.cube.position.z = dt.z - 0.5;
			bala.cube.rotation.z = dt.r;
		}
	}

}

window.addEventListener("message", receiveMessage, false);
