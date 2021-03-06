<%@page import="org.apache.commons.lang3.StringUtils"%>
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
	<script src="js/howler.min.js"></script>
	<script src="game.js?v1"></script>

</head>
<body ng-app="app" ng-controller="mainController">

	<div class="ini_load"></div>
	<div id="logo_game"></div>

	<% String user_name = StringUtils.trimToNull(request.getParameter("name"));
	
		if(user_name == null){
			user_name = "guest " + (Math.round(Math.random() * 90d) + 10);
		}
	%>

	<input type="hidden" id="user_name" value="<%= user_name %>"/>

	<iframe id="if_control" onload="IREADY = true;" src="control.jsp?v1"></iframe>

	<div id="area_game"></div>
	
	<div id="energia">{{energia}}%</div>
	
	<div id="poderes">
		<button class="btn_impulso"></button>
		<button class="btn_disparo"></button>
		<button class="btn_defensa"></button>
	</div>
	
	<div id="resultados">
	
		<div ng-repeat="reg in cr" class="registro_res" ng-class="{registro_sel: reg.me}">
			<h2>{{ reg.n }}</h2>
			<h3 class="e_E" ng-class="{e_E3: reg.e > 75, e_E2: reg.e <= 75 && reg.e > 50, e_E1: reg.e <= 50 && reg.e > 25, e_E0: reg.e <= 25}">{{ reg.p }}</h3> 
		</div>
	
	</div>
	
	<div ng-repeat="reg in cr" class="c_titulo" style="top: {{ titop }}px; left: {{ reg.ang }}px" ng-if="reg.pt != null">
		{{ reg.n }}<br>{{ reg.ang }}
	</div>
	
	
	<!-- - - - - - - - - - - - - - - - - - - - -->

	<script src="app.js"></script>
	
</body>
</html>