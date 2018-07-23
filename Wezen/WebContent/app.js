var app = angular.module('app', []);

app.controller('mainController', function mainController($scope, $interval) {

	$scope.data = "";
	
	$interval(function(){
		$scope.data = CDATA;
	}, 1000);

});