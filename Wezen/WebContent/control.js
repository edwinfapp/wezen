// inicia musica de fondo

var $SOUND = new Howl({
	src : [ 'sound/music.mp3' ],
	loop : true,
	volume : 0.2
});

$SOUND.play();

// -----------------------
// inicia musica de fondo

var $LASER = new Howl({
	src : [ 'sound/laser.mp3' ],
	volume : 1
});

var $STAR = new Howl({
	src : [ 'sound/star.mp3' ],
	volume : 1
});

var $DIE_SOUND = new Howl({
	src : [ 'sound/die.mp3' ],
	volume : 1
});

var $DANGER = new Howl({
	src : [ 'sound/danger.mp3' ],
	volume : 0.1,
	loop : true
});

// -----------------------

var $CONTROLES_ACTIVOS = true;

var DIM_PISO = 1024;
var DIM_NAVE = 4;
var $ALTURA_NAVE = 3.5;
var $ENERGIA_DISPARO = 5;

var $w = null;

function receiveMessage(event) {
	$w = event.source;

	CONTROL = event.data;
}

window.addEventListener("message", receiveMessage, false);

// --------------------

var $frm = $("#frm");
var $pcar = $("#pcar");

var TIEMPOEXE = 16;

function cron() {

	var ini = Date.now();
	exe();

	var pausa = TIEMPOEXE - (Date.now() - ini);

	window.setTimeout(cron, pausa);
}

$(cron);

// --------------------

var DATA = {
	me : null,
	cr : [],
	bl : []
}

var CONTROL = {
	a : 0, // acelerenado
	d : 0, // direccion
	p : false
}

var MAX_VELOCIDAD = 18;

var ltime = Date.now();

function exe() {

	var time = Date.now();

	var pp = time - ltime;

	var deltha = (pp) / 200;

	ltime = time;

	// --

	if (DATA.me == null) {
		return;
	}

	// identifica el carro

	var car = DATA.cr[DATA.me];

	if (car === undefined) {
		return;
	}

	// cuando acelera

	if (!$CONTROLES_ACTIVOS) {
		CONTROL.a = 0;
		CONTROL.d = 0;
		CONTROL.p = false;
	}

	// -- mira si disparo

	if (CONTROL.p) {

		$LASER.play();

		var bb = {
			x : car.x,
			y : car.y,
			z : car.z,
			r : car.r,
			v : MAX_VELOCIDAD * 4,
			c : DATA.me,
			a : true
		}

		DATA.bl.push(bb);

		console.log("disparo");

		sendMessage("DDD" + JSON.stringify(bb));

		CONTROL.p = false;
	}

	// -- Aumenta la posicion de las balas

	for ( var d in DATA.bl) {
		var e = DATA.bl[d];
		e.v -= 0.07;
		e.y_ = e.y;
		e.x_ = e.x;
		e.z_ = e.z;
		
		e.y += deltha * e.v * Math.cos(-e.r);
		e.x += deltha * e.v * Math.sin(-e.r);
	}

	// -- si esta ya muy lejos la bala se elimina..!!

	while (DATA.bl.length > 0 && DATA.bl[0].v < MAX_VELOCIDAD * 3.5) {
		DATA.bl.shift();
	}

	// -- si una bala mia dio en el blanco.. notifica la baja

	var dme = DATA.cr[DATA.me];
	dme.n = CONTROL.n;
	
	for ( var d in DATA.bl) {
		var e = DATA.bl[d];

		if (e.c == DATA.me) {

			for ( var cd in DATA.cr) {

				var dcd = DATA.cr[cd];

				if (dcd != null && dcd.e >= 0 && dcd.c == 0) {

					// distancia con el punto anterior
					var da = distancia(e.x, e.y, e.x_, e.y_);

					// distancia con el punto target
					var dp1 = distancia(e.x, e.y, dcd.x, dcd.y);
					var dp2 = distancia(e.x_, e.y_, dcd.x, dcd.y);

					if (da > dp1 && da > dp2 ) {

						var dx = m_distancia(dcd.x, dcd.y, e.x, e.y, e.x_, e.y_);

						if (dx < DIM_NAVE + 2) {
							console.log("Le di..! " + da + "," + dp1 + ", " + dp2 + " " + dx);

							sendMessage("DDM" + JSON.stringify({
								c : cd,
								o : DATA.me,
								d: Math.ceil(5 * (1 - dx / (DIM_NAVE + 2))) // puntos otorgados
							}));

						}
					}
				}

			}

		}

	}

	// -- desaceleracion..!!

	if (CONTROL.a == 1) {
		car.v += 0.04 * (1 - car.v / MAX_VELOCIDAD);
	}

	if (CONTROL.a == -1 && car.v > 1) {
		car.v -= 0.08;
	}

	if (CONTROL.a == 0 && car.v > 1) {
		car.v -= 0.01;
	}

	if (CONTROL.d == 1 && car.i < 0.5) {
		car.i += deltha * 0.2;
		if (car.i < 0) {
			car.i -= car.i * deltha * 0.5;
		}
	}

	if (CONTROL.d == -1 && car.i > -0.5) {
		car.i -= deltha * 0.2;
		if (car.i > 0) {
			car.i -= car.i * deltha * 0.5;
		}
	}

	if (CONTROL.d == 0) {
		car.i -= car.i * deltha * 0.5;
	}

	car.r -= deltha * car.i / 2;

	// --

	angu = -car.r;

	car.y += deltha * car.v * Math.cos(angu);
	car.x += deltha * car.v * Math.sin(angu);

	if (car.z == $ALTURA_NAVE) {

		var d = (DIM_PISO + DIM_NAVE) / 2;

		if (car.x < -d || car.y < -d || car.x > d || car.y > d) {
			car.z -= 0.2;
			// $CONTROLES_ACTIVOS = false;
		}
	}

	if (car.z < $ALTURA_NAVE || car.e < 0) {
		car.z -= deltha * 2;
	}

	// si se cae se muere
	if (car.e > 0 && car.z < -15) {
		car.e = 0;
		car.p -= 25;
		if(car.p < 0){
			car.p = 0;
		}
		
		$CONTROLES_ACTIVOS = false;
		$DIE_SOUND.play();
	}

	if (car.e <= 0) {
		car.e -= deltha;
		console.log(car.e);
		car.c += 1;
	}

	// si esta muerto reinicia
	if (car.e <= -10) {
		car.e = 100;
		car.z = $ALTURA_NAVE + 30;
		car.x = 0;
		car.y = 0;
		car.v = 1;
		car.c = 5;
		$CONTROLES_ACTIVOS = true;
		$DANGER.stop();
	}

	if (car.z > $ALTURA_NAVE) {
		car.z -= 0.2;
		if (car.z < $ALTURA_NAVE) {
			car.z = $ALTURA_NAVE;
		}
	}

	if (car.c > 0) {
		car.c -= deltha / 10;
		if (car.c < 0) {
			car.c = 0;
		}
	}

	// ------------------------------

	var w = window.innerWidth;
	var h = window.innerHeight;

	var wc = $pcar.width() / 2;

	$pcar.css("bottom", parseInt(w * (car.y + 512) / 1024 - wc) + "px");
	$pcar.css("left", parseInt(h * (car.x + 512) / 1024 - wc) + "px");
	$pcar.css("transform", "rotate(" + Math.round(-car.r * 180 / Math.PI)
			+ "deg)");

	if ($w) {
		$w.postMessage(DATA, "*");
	}

}

// ------------------------------

var ws = null;

function connect() {

	var URL = 'ws://edwinfapp.com/Wezen/srv';

	if (window.location.hostname == "127.0.0.1") {
		URL = 'ws://127.0.0.1:8080/Wezen/srv';
	}

	console.log("Server: " + URL);

	if ('WebSocket' in window) {
		ws = new WebSocket(URL);
	} else if ('MozWebSocket' in window) {
		ws = new MozWebSocket(URL);
	} else {
		alert('Tu navegador no soporta WebSockets');
		return;
	}
	ws.onopen = function() {
		console.log('Conectado!');
		enviarDATA();
	};
	ws.onmessage = function(event) {
		var message = event.data;

		// -- Un nuevo disparo..

		if (message != null && message.indexOf("DDD") == 0) {
			console.log(message.substring(3) + " disparo..!");

			var bb = JSON.parse(message.substring(3));
			bb.a = true;
			DATA.bl.push(bb);

			return;
		}

		if (message != null && message.indexOf("DDE") == 0) {
			console.log(message.substring(3) + " gana estrella..!");

			var bb = JSON.parse(message.substring(3));

			if (bb.c == DATA.me) {
				
				DATA.cr[DATA.me].p += 2;
				
				if(bb.f){
					
					DATA.cr[DATA.me].p += 50;
					
					window.setTimeout(function() {
						$STAR.play();
					}, 2000);
					$DIE_SOUND.play();
				}
			}

			return;
		}

		// -- Me dieron

		if (message != null && message.indexOf("DDM") == 0) {
			console.log(message.substring(3) + " me dieron..!");

			var bb = JSON.parse(message.substring(3));

			if (bb.c == DATA.me) {

				console.log("me dio");
				var dme = DATA.cr[DATA.me];

				if(dme.p > 0){
					dme.p -= 1;
				}
				
				dme.e -= bb.d;
				dme.z += 1;

				var ft = (dme.e <= 0);
				if (ft) {
					$DIE_SOUND.play();
					dme.z -= 1;
					if(dme.p > 25){
						dme.p -= 25;
					}else{
						dme.p = 0;
					}
				}
				
				sendMessage("DDE" + JSON.stringify({
					c : bb.o,
					d : bb.d,
					f : ft
				}));

				if (dme.e <= 40) {
					if (!$DANGER.playing()) {
						$DANGER.play();
					}
				}

			}

			return;
		}

		// --

		actualizarData(JSON.parse(message));

		var t = Date.now() - ORITIME;

		var tm = 16;

		window.setTimeout(enviarDATA, ((t > tm) ? 1 : tm - t))

	};
	ws.onclose = function() {
		alert('Desconectado!');
		ws = null;
	};
	ws.onerror = function(event) {
		console.log('Se produjo un error! ');
		ws = null;
	};
}

function disconnect() {
	if (ws != null) {
		ws.close();
		ws = null;
	}
}

function sendMessage(message) {
	if (ws != null) {
		ws.send(message);
	}
}

var ORITIME = 0;

function enviarDATA() {
	ORITIME = Date.now();

	if (DATA.me == null) {
		sendMessage("");
		return;
	}

	// console.log(DATA.me + ", " + JSON.stringify(DATA));

	sendMessage(JSON.stringify(DATA.cr[DATA.me]));
}

var PROMEDIOTIEMPO = 100;
var ULTIMOTIEMPO = Date.now();

function actualizarData(mdata) {

	// console.log(JSON.stringify(mdata));

	PROMEDIOTIEMPO = parseInt(((PROMEDIOTIEMPO * 5) + (Date.now() - ULTIMOTIEMPO)) / 6);

	// console.log(Math.round(5 * (200 - PROMEDIOTIEMPO) / 150));

	ULTIMOTIEMPO = Date.now();

	DATA.me = mdata.me;

	for (var i = 0; i < mdata.cr.length; i++) {

		if (i == DATA.me && DATA.cr[DATA.me] === undefined) {
			DATA.cr[DATA.me] = {
				x : 0,
				y : 0,
				z : $ALTURA_NAVE,
				v : 1,
				r : 0,
				i : 0,
				e : 100,
				c : 5,
				p : 0
			};
		}

		if (i == DATA.me) {
			continue;
		}

		if (mdata.cr[i] == null) {
			DATA.cr[i] = null;
			continue;
		}

		if (DATA.cr[i] == null || DATA.cr[i] === undefined) {

			DATA.cr[i] = {
				x : 0,
				y : 0,
				z : $ALTURA_NAVE,
				v : 1,
				r : 0,
				i : 0,
				e : 0,
				c : 0,
				p : 0,
				n : "?",
			};

		}

		var npos = {
			x : mdata.cr[i].x,
			y : mdata.cr[i].y,
			z : mdata.cr[i].z,
			v : mdata.cr[i].v,
			r : mdata.cr[i].r,
			i : mdata.cr[i].i,
			c : mdata.cr[i].c,
		};

		var deltha = (PROMEDIOTIEMPO) / 80;

		var angu = -npos.r;

		npos.y += deltha * npos.v * Math.cos(angu);
		npos.x += deltha * npos.v * Math.sin(angu);

		$(DATA.cr[i]).stop().animate(npos, PROMEDIOTIEMPO * 1.2, "linear");
		
		DATA.cr[i].n = mdata.cr[i].n;
		DATA.cr[i].e = mdata.cr[i].e;
		DATA.cr[i].p = mdata.cr[i].p;
		
	}

}

// distancia entre doa puntos

function distancia(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

// distancia entre un punto y una recta
function m_distancia(px, py, dx1, dy1, dx2, dy2) {

	if (dx2 == dx1) {
		dx2 += 0.00001;
	}

	var a = (dy2 - dy1) / (dx2 - dx1);
	var b = -1;
	var c = dy1 - a * dx1;

	var dis = Math.abs((a * px + b * py + c) / Math.sqrt(a * a + b * b));

	return dis;

}

$(function() {

	connect();
})
