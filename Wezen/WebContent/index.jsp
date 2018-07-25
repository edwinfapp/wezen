<html>
<head>
<title>Wezen</title>
<meta name='viewport'
	content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
	<link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="main.css">
    
    <script src="js/three.min.js"></script>
	<script src="js/jquery-3.3.1.min.js"></script>
	<script src="js/angular.min.js"></script>
	<script src="index.js"></script>

</head>
<body ng-app="app" ng-controller="mainController">

	<input type="hidden" id="user_name" value="<%= request.getParameter("name") %>"/>

	<iframe id="if_control" onload="IREADY = true;" src="control.jsp"></iframe>

	<div id="area_game"></div>
	
	<div id="energia">{{energia}}%</div>
	
	<div id="resultados">
	
		<div ng-repeat="reg in cr" class="registro_res" ng-class="{registro_sel: reg.me}">
			<h2>{{ reg.n }}</h2>
			<h3>{{ reg.p }}</h3> 
		</div>
	
	</div>
	
	<!-- - - - - - - - - - - - - - - - - - - - -->

	<script src="app.js"></script>
	
</body>
</html>