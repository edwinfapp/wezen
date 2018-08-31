var WINW = 0;
var WINH = 0;

function reziseWN(){
	WINW = $(window).width();
	WINH = $(window).height();
}

$(window).resize(function() {
	reziseWN();
});

reziseWN();

var CDATA = null;
var app = angular.module('app', []);

app.controller('mainController', function mainController($scope, $interval) {

	$scope.data = "";
	$scope.cr = [ ];

	$scope.energia = 100;

	$interval(function() {

		if (CDATA != null) {
			
			$scope.data = CDATA;
			
			$scope.cr = cleanArray(CDATA.cr);
			
			var cube = cars[IDCAR].cube;
			var angu = cube.rotation.z;
			
			var x0 = cube.position.x;
			var y0 = cube.position.y;
			
			$scope.cr.forEach(function(elem){
				
				var x1 = x0 + Math.cos(angu);
				var y1 = y0 + Math.sin(angu);
				
				var x2 = elem.x;
				var y2 = elem.y;
				
				elem.pt = null;
				
				if(x0 != x2 && y0 != y2){
					
					elem.pt = ajustarAngulo(angulo2P(x0, y0, x2,y2, x1,y1) + Math.PI/2);
					elem.ang = parseInt((WINW/4) * WINW/WINH * elem.pt + WINW/2 -100);
				}
				
			});
			
			var energia = Math.round(CDATA.cr[CDATA.me].e);
			
			if (energia < 0) {
				energia = 0;
			}
			
			if($scope.energia != energia){
			
				if($scope.energia < energia)
				$scope.energia += 5;
	
				if($scope.energia > energia){
					$scope.energia += -1;
					
					if(energia == 0 && $scope.energia > 30){
						$scope.energia += -10;
					}
					
				}
			
				$("#energia").css("background-color", "rgba(" + Math.round( 255 * (100 - $scope.energia)/100 ) + ",0,0,0.8)");
			}
		}
	}, 50);

});

// ----

function angulo(x,y){
	
	if(x==0){
		return y>=0?Math.PI/2:-Math.PI/2;
	}
	
	var a = Math.atan(y/x);
	
	if(x >= 0){
		return ajustarAngulo(a);
	}
	
	if( y > 0){
		return ajustarAngulo(Math.PI + a);
	}else{
		return ajustarAngulo(Math.PI + a);
	}
	
}

function angulo2(x1,y1, x2,y2){
	return ajustarAngulo(angulo(x2, y2) - angulo(x1, y1));
}

function angulo2P(x0, y0, x1,y1, x2,y2){
	return angulo2(x1 - x0, y1 - y0, x2 - x0 , y2 - y0);
}

function ajustarAngulo(a){
	while(a < -Math.PI){
		a += 2*Math.PI;
	}
	
	while(a > Math.PI){
		a -= 2*Math.PI;
	}
	
	return a;
}

function cleanArray(r) {
	 var rs = [];
	 
	 r.forEach(function(a){
		 if(a != null){
			 rs.push(a);
		 }
	 });
	 
	 rs.sort(function(a,b){
		 return b.p - a.p;
	 });
	 
	 return rs;
};