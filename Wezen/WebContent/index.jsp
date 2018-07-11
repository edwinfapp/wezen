<html>
<head>
<title>Wezen</title>
<meta name='viewport'
	content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
<link rel="stylesheet" type="text/css" href="main.css">
<script type="text/javascript">
		var IREADY = false;
	</script>
</head>
<body>

	<iframe id="if_control" onload="IREADY = true;" src="control.jsp"></iframe>

	<div id="vel_in">0</div>

	<div id="area_game"></div>

	<script src="js/three.min.js"></script>
	<script src="js/jquery-3.3.1.min.js"></script>

	<script type="text/javascript">
	
	var GEONAVE = null;
	var GEOTOWER = null;
	var GEOSTATION = null
	
	new THREE.ObjectLoader().load( 'model/ship.json', function ( geo ) {
			
			GEONAVE = geo;
			
			new THREE.ObjectLoader().load( 'model/tower.json', function ( geo ) {
			
				GEOTOWER = geo;
				
				GEOTOWER.scale.set(25,25,25);
				
				GEOTOWER.rotation.x += Math.PI/2;
				
				GEOTOWER.position.z = -20;
				
				new THREE.ObjectLoader().load( 'model/station.json', function ( geo ) {
					
					GEOSTATION = geo;
					
					GEOSTATION.scale.set(3,3,3);
					
					GEOSTATION.position.z = 60;
					
					// --
				
					GEONAVE.scale.set(140,140,140);
					
					// GEONAVE.scale.set(1,1,1);
					
					GEONAVE.rotation.x += Math.PI/2;
					GEONAVE.rotation.y -= Math.PI/2;
					
					$.getScript( "index.js" );
				
				});
				
			});
			
		}
	);
	
	
	</script>


</body>
</html>