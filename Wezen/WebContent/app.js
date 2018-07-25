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