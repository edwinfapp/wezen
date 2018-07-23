<html>
<head>
<title>Wezen</title>
<meta name='viewport'
	content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
	<link rel="stylesheet" type="text/css" href="main.css">
    
    <script src="js/three.min.js"></script>
	<script src="js/jquery-3.3.1.min.js"></script>
	<script src="js/angular.min.js"></script>
	<script src="index.js"></script>

</head>
<body ng-app="app" ng-controller="mainController">

	<iframe id="if_control" onload="IREADY = true;" src="control.jsp"></iframe>

	<div style="color:red; position: absolute; z-index: 20; height: 500px; width: 200px; background: black; overflow: auto;"><pre>{{ data.cr | json }}</pre></div>
	
	<pre id="vel_in"></pre>
	<div id="area_game"></div>
	
	<!-- - - - - - - - - - - - - - - - - - - - -->

	<script src="app.js"></script>
	
</body>
</html>