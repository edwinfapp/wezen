var $SPEED = new Howl({
	src : [ 'sound/speed.mp3' ],
	volume : 1
});

var $DEFENSA = new Howl({
	src : [ 'sound/defensa.mp3' ],
	volume : 0.5
});

// -----

var $ALTURA_NAVE = 2.8;

var IDCAR = 0;
var USER_NAME = $("#user_name").val();

var IFCONTROL = $("#if_control").get(0).contentWindow;

var PIXELRATIO = 0.8;

// ---

var AG = $("#area_game");

console.log(AG.width() + ", " + AG.height());

var SCENE = new THREE.Scene();

var CAMERA_DIS = 6.5;
var CAMERA = new THREE.PerspectiveCamera(75, AG.width() / AG.height(), 0.1, 2000);
CAMERA.up = new THREE.Vector3(0, 0, 1);

var RENDERER = new THREE.WebGLRenderer();
RENDERER.setSize(AG.width(), AG.height());
RENDERER.setPixelRatio(window.devicePixelRatio * PIXELRATIO);
RENDERER.setClearColor(0x111111, 1);

RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap; // default
													// THREE.PCFShadowMap

var CAMERA_LOOKAT = new THREE.Vector3(0, 0, 0);

AG.get(0).appendChild(RENDERER.domElement);

// -----------------------------------------------------------

SCENE.add(new THREE.AmbientLight(0xCCCCCC));
{
	// SpotLight( color, intensity, distance, angle, penumbra, decay )
	sunLight = new THREE.SpotLight(0xffffff, 0.8, 2000, 2, 0, 0);
	sunLight.position.set(0, 0, 600);

	sunLight.castShadow = true;

	var ms = 512 * 2 * 2;
	
	sunLight.shadow.mapSize.width = ms;
	sunLight.shadow.mapSize.height = ms;

	sunLight.shadow.camera.castShadow = true;
	sunLight.shadow.camera.near = 1;
	sunLight.shadow.camera.far = 5000;
	sunLight.shadow.camera.fov = 1;

	SCENE.add(sunLight);
}


var spotLight = null;

{
	// SpotLight( color, intensity, distance, angle, penumbra, decay )
	spotLight = new THREE.SpotLight(0xffffff, 0.9, 100, 2, 0, 0);
	spotLight.position.set(0, 0, 20);

	spotLight.castShadow = true;

	var ms = 512;
	
	spotLight.shadow.mapSize.width = ms;
	spotLight.shadow.mapSize.height = ms;

	spotLight.shadow.camera.castShadow = true;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 5000;
	spotLight.shadow.camera.fov = 1;

	SCENE.add(spotLight);
}

// SCENE.add(new THREE.SpotLightHelper(spotLight));

SCENE.fog = new THREE.Fog(new THREE.Color(0x000000), 0.0025, 1200);


// ----------------------------------------------

var DIM_PISO = 1024;

var piso = null;

{
	var geometry = new THREE.BoxGeometry(DIM_PISO, DIM_PISO, 6);

	var texture = new THREE.TextureLoader().load('images/car.png');

	var ds = 6;
	texture.repeat.set(1024 / ds, 1024 / ds);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	var material = new THREE.MeshStandardMaterial({
		map : texture,
		color : 0xFFFFFF
	});

	piso = new THREE.Mesh(geometry, material);

	piso.position.z = -2;

	piso.castShadow = true;
	piso.receiveShadow = true;

	SCENE.add(piso);
}

var lava = null;

{
	var geometry = new THREE.PlaneGeometry( DIM_PISO*2, DIM_PISO*2, 100, 100 ); // new
																				// THREE.BoxGeometry(DIM_PISO*2,
																				// DIM_PISO*2,
																				// 100);

	var texture = new THREE.TextureLoader().load('images/lava.png');

	geometry.vertices.forEach(function(v) {
		v.z = Math.random() * 10;
	});
	
	var ds = 6;
	texture.repeat.set(1024 / ds, 1024 / ds);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	var material = new THREE.MeshStandardMaterial({
		map : texture,
		color : 0xFFFFFF
	});

	lava = new THREE.Mesh(geometry, material);

	lava.position.z = -20;

	lava.castShadow = false;
	lava.receiveShadow = true;

	SCENE.add(lava);
}

{
	SCENE.add(GEOSTATION);
	
	var ds = DIM_PISO / 2 + 50;

	var t1 = GEOTOWER.clone();
	var t2 = GEOTOWER.clone();
	var t3 = GEOTOWER.clone();
	var t4 = GEOTOWER.clone();
	
	t1.position.x = ds;
	t1.position.y = ds;
	
	t2.position.x = -ds;
	t2.position.y = ds;
	
	t3.position.x = -ds;
	t3.position.y = -ds;
	
	t4.position.x = ds;
	t4.position.y = -ds;
	
	SCENE.add(t1);
	SCENE.add(t2);
	SCENE.add(t3);
	SCENE.add(t4);
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
	var cf = null;
	var df = null;

	var angu = 0;

	{
		// --
		
		ff = new THREE.Object3D();
		
		ff.add(GEONAVE.clone());
		
		cube.add(ff);
	}
		// --
	
	{
		var geometry = new THREE.SphereGeometry(6, 32, 32);

		var texture = new THREE.TextureLoader().load('images/energia.jpg');
		
		var material = new THREE.MeshLambertMaterial({
			map: texture,
			opacity: 0.35,
			transparent: true
		});

		cf = new THREE.Mesh(geometry, material);
		cf.rotation.z += Math.PI / 2;

		cube.add(cf);
		
	}
	
	{
		// --
		
		var geometry = new THREE.SphereGeometry(6, 32, 32);

		var texture = new THREE.TextureLoader().load('images/fuego.jpg');
		
		var material = new THREE.MeshLambertMaterial({
			map: texture,
			opacity: 0.35,
			transparent: true
		});

		df = new THREE.Mesh(geometry, material);
		df.rotation.z += Math.PI / 2;

		cube.add(df);
		
	}

	cube.position.z = 2;

	SCENE.add(cube);

	cars[index] = {
		cube : cube,
		ff : ff,
		cf : cf,
		df : df
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
	
		for(var IDS in cars){
		
			try {
				
				var ccar = cars[IDS];
				
				var cc = CDATA.cr[IDS].c;
				var ee = CDATA.cr[IDS].e;
				
				ccar.df.scale.set(0,0,0);
				ccar.cf.scale.set(0,0,0);

				if(cc > 0 && ee > 0){
					ccar.cf.scale.set(1,1,1);
					if(cc < 0.5){
						ccar.cf.scale.set(cc * 2,cc * 2,cc * 2);
					}
					ccar.cf.rotation.z += 1;
				}
				
				if(cc > 0 && ee <= 0){
					var sd = -ee;
					if(sd> 2.5){ sd = 2.5; }
					ccar.df.scale.set(sd * 2, sd * 2,sd * 2);
					ccar.df.rotation.z += 1;
				}

			} catch (e) {
			}
			
		}
		
		
		var dis = 6.5;
		if (CDATA) {
			dis = CDATA.cr[IDCAR].v / 2 + 6;
		}
		
		if(CAMERA_DIS + 0.1 < dis) CAMERA_DIS += 0.1;
		if(CAMERA_DIS - 0.1 > dis) CAMERA_DIS -= 0.1;
	
		var destino = { y: cube.position.y - CAMERA_DIS * Math.cos(angu), x : cube.position.x - CAMERA_DIS * Math.sin(angu) };
		
		var dsc = distancia(destino.x, destino.y, CAMERA.position.x, CAMERA.position.y);
		
		CAMERA.position.y = destino.y;
		CAMERA.position.x = destino.x;
		
		CAMERA.position.z = 10;
	
		CAMERA_LOOKAT.x = cube.position.x + 15 * Math.sin(angu);
		CAMERA_LOOKAT.y = cube.position.y + 15 * Math.cos(angu);
		CAMERA_LOOKAT.z = cube.position.z;
	
		CAMERA.lookAt(CAMERA_LOOKAT);
	
		spotLight.target.position.set(cube.position.x, cube.position.y, cube.position.z);
		
		spotLight.target.updateMatrixWorld();
		
		spotLight.position.x = cube.position.x;
		spotLight.position.y = cube.position.y;

	}
	
	RENDERER.render(SCENE, CAMERA);
};

animate();

// ----------

$(window).resize(function() {
	RENDERER.setSize(AG.width(), AG.height());
	RENDERER.setPixelRatio(window.devicePixelRatio * PIXELRATIO);
	CAMERA.aspect = AG.width() / AG.height();
	CAMERA.updateProjectionMatrix();
	RENDERER.setSize(AG.width(), AG.height());
});

// ------ CONTROLES

var PRESSKEY = {
	"C37" : false, // flecha izquierda
	"C38" : false, // flecha arriba
	"C39" : false, // flecha derecha
	"C40" : false, // flecha atras
	"C90" : false, // tecla Z
	"C88" : false, // tecla X
	"C67" : false, // tecla C
	"C65" : false, // tecla A
	"C83" : false, // tecla S
	"C68" : false, // tecla D
	"C70" : false, // tecla F
};

var GAME_VELOCIDAD = 0; // velocidad del carro
var GAME_ACELERANDO = 0; // determina si esta acelerando ( 0 / 1)
var GAME_DIRECCION = 0; // determina la direccion a la cual se dirige
var GAME_DISPARO = 0; // determina si esta disparando.
var GAME_IMPULSO = 0; // determina si hace impulso.
var GAME_DEFENSA = 0; // determina si hace defensa.
var GAME_ROTACION = 0; // determina si hace rotacion.
var GAME_INVISIBLE = 0; // determina si se hace invisible.

var ULTIMO_DISPARO = 0;
var ULTIMO_DEFENSA = 0;
var ULTIMO_IMPULSO = 0;

var TIEMPO_REPETIR_IMPULSO = 20000;
var TIEMPO_REPETIR_DEFENSA = 30000;

function enviarComandoDemo() {

	var cmd = KEYAR.join('');
	var disparo = !PRESSKEY.C88 && GAME_DISPARO == 1;
	var invisible = !PRESSKEY.C90 && GAME_INVISIBLE == 1;
	
	var comando_impulso = cmd.endsWith("</C38>[F]<C38>[F]</C38>[F]<C38>") || PRESSKEY.C90;
	var comando_defensa = cmd.endsWith("[F]<C40>[F]</C40>[F]<C40>") || PRESSKEY.C67;
	var comando_rotacion_der = false; // cmd.endsWith("[S]<C39>[F]</C39>[F]<C39>[F]</C39>");
	var comando_rotacion_izq = false; // cmd.endsWith("[S]<C37>[F]</C37>[F]<C37>[F]</C37>");
	
	var impulso = comando_impulso && GAME_IMPULSO == 0;
	var defensa = comando_defensa && GAME_DEFENSA == 0;
	var rotacion_der = comando_rotacion_der && GAME_ROTACION == 0;
	var rotacion_izq = comando_rotacion_izq && GAME_ROTACION == 0;
	
	var ya = Date.now();
	
	if(disparo){
		$(".btn_disparo").fadeTo(100, 0.2);
		
		window.setTimeout(function(){
			$(".btn_disparo").fadeTo(10, 1);
		}, 100 );
	}
	
	// valida y anima que pueda hacer impulso
	if(impulso && ya - TIEMPO_REPETIR_IMPULSO > ULTIMO_IMPULSO){
		ULTIMO_IMPULSO = ya;
		$(".btn_impulso").fadeTo(400, 0.2);
		
		$SPEED.play();
		
		window.setTimeout(function(){
			$(".btn_impulso").fadeTo(800, 1);
		}, TIEMPO_REPETIR_IMPULSO - 800 );
		
	}else{
		impulso = false;
	}
	
	// valida y anima que pueda hacer defensa
	if(defensa && ya - TIEMPO_REPETIR_DEFENSA > ULTIMO_DEFENSA){
		ULTIMO_DEFENSA = ya;
		$(".btn_defensa").fadeTo(400, 0.2);

		$DEFENSA.play();
		
		window.setTimeout(function(){
			$(".btn_defensa").fadeTo(800, 1);
		}, TIEMPO_REPETIR_DEFENSA - 800 );
		
	}else{
		defensa = false;
	}
	
	GAME_ACELERANDO = 0;
	GAME_DIRECCION = 0;
	GAME_DISPARO = 0;
	GAME_IMPULSO = 0;
	GAME_DEFENSA = 0;
	GAME_INVISIBLE = 0;
	GAME_ROTACION = 0;

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
	
	if (PRESSKEY.C90) {
		GAME_INVISIBLE = 1;
	}
	
	if(comando_impulso){
		GAME_IMPULSO = 1;
	}
	
	if(comando_defensa){
		GAME_DEFENSA = 1;
	}
	
	var msg = {
		a : GAME_ACELERANDO,
		d : GAME_DIRECCION,
		p : disparo,
		n : USER_NAME,
		imp : impulso,
		inv : invisible,
		def : defensa,
		rot : 0, // se desactiva
	}

	IFCONTROL.postMessage(msg, "*");
}

var KEYAR = [];
var PRESSKEYTIME = {};

$(document).keydown(function(event) {

	var k = "C" + event.which;
	
	if (PRESSKEY[k] !== undefined) {
		
		if(KEYAR.length > 0 && KEYAR[KEYAR.length - 1] == ("<" + k + ">") ){
			return;
		}
		
		if(PRESSKEYTIME[k] !== undefined){
			KEYAR.push("[" + ((Date.now() - PRESSKEYTIME[k])>300?"S":"F")  + "]");
		}

		KEYAR.push("<" + k + ">");
		
		while(KEYAR.length > 8){
			KEYAR.shift();
		}
		
		PRESSKEYTIME[k] = Date.now();
		PRESSKEY[k] = true;
		enviarComandoDemo();
		
		// console.log( KEYAR.join('') );
	}

});

$(document).keyup(function(event) {
	
	var k = "C" + event.which;
	
	if (PRESSKEY[k] !== undefined) {
		
		KEYAR.push("[" + ((Date.now() - PRESSKEYTIME[k])>300?"S":"F")  + "]");
		KEYAR.push("</" + k + ">");
		
		while(KEYAR.length > 8){
			KEYAR.shift();
		}
		
		PRESSKEYTIME[k] = Date.now();
		
		PRESSKEY[k] = false;
		enviarComandoDemo();
		
		// console.log( KEYAR.join('') );
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
	CDATA.cr[IDCAR].me = true;

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
				
				CDATA.cr[index].p = data.cr[index].p;
				CDATA.cr[index].c = data.cr[index].c;
				CDATA.cr[index].e = data.cr[index].e;
				
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

function distancia(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

// --

window.setTimeout(function(){
	$(".ini_load").fadeOut(800);
}, 800);