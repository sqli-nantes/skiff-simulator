'use strict';

var skiffSimulatorApp = skiffSimulatorApp || function(){

	// Différents états du jeux
	var STATE_ACCUEIL = 0,
		STATE_RUNNING = 1,
		STATE_END = 2;

	// Variables à utiliser
	var canvas = null,
		context = null,
		distanceArduino = 0,
		percent = 0,
		percentRive = 0,
		resources = new Resources(),
		rectCanvas = null,
		ratio = 1;


	var game = {
		stateGame : STATE_ACCUEIL,
		indexSprite : 'R0',
		time : 0,
		distanceSkiff : 0
	};

	
	function pageLoad(){
		// On se connecte à l'arduino
		try{
			skiffSimulatorChrome.initArduino();
		}catch(err){
			console.error("Error  : %s \n %s",err.message, err.stack);
		}

		// On initialise le canvas
		canvas = document.getElementById('skiff');
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		rectCanvas = canvas.getBoundingClientRect();
		context = canvas.getContext('2d');
		canvas.addEventListener('click', checkClick, false);

		// On précharge toutes les ressources nécessaires
		resources.loadSprites([	{title: 'logo', url: 'assets/images/logo.png'},
								{title: 'game_over', url: 'assets/images/gameover.png'},
								{title: 'rive_gauche', url: 'assets/images/riviere_gauche.png'},
								{title: 'rive_droite', url: 'assets/images/riviere_droite.png'},
								{title: 'btn_start', url: 'assets/images/start.png'},
								{title: 'btn_reset', url: 'assets/images/replay.png'},
								{title: 'R0', url: 'assets/images/rameur_accueil.png'},
								{title: 'R1', url: 'assets/images/R3.png'},
								{title: 'R2', url: 'assets/images/R4.png'},
								{title: 'R3', url: 'assets/images/R5.png'},
								{title: 'R4', url: 'assets/images/A1.png'},
								{title: 'R5', url: 'assets/images/A2.png'},
								{title: 'R6', url: 'assets/images/A3.png'},
								{title: 'R7', url: 'assets/images/A4.png'},
								{title: 'R8', url: 'assets/images/A5.png'},
								{title: 'R9', url: 'assets/images/R1.png'},
								{title: 'R10', url: 'assets/images/R2.png'}
							])
		.then(function(value) {
			ratio = rectCanvas.height / resources.images['rive_gauche'].height;
			paintSkiff();		
		}).catch(function(err){
			console.error("Error  : %s \n %s",err.message, err.stack);
		});

	}

	// Gère l'affichage de l'écran
	function paintSkiff() {
		// Affichage des décors
		paintBackground();		

		if (game.stateGame === STATE_ACCUEIL){
			paintSkiffAccueil();
		}else if (game.stateGame === STATE_RUNNING){
			paintSkiffAction();
		}if (game.stateGame === STATE_END){
			paintSkiffEnd();
		}

		window.requestAnimationFrame(paintSkiff);
	}


	function paintSkiffAction(){
		// Gestion de l'état Arduino
		checkSprite();
		// Affichage du bateau
		paintBoat();
		// Affichage des texts
		paintText();
		// Engine
	}

	function paintSkiffAccueil(){

		game.indexSprite = 'R0';
		// Affichage du bateau
		paintBoat();


		// Affichage du logo
		var logo = resources.images['logo'];
		var finalHeight = logo.height * ratio,
			finalWidth = logo.width * ratio;
		context.drawImage(logo
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, logo.width // swidth clipping de l'image originale
			, logo.height // sheight clipping de l'image originale
			, (rectCanvas.width / 2) - ((logo.width * ratio) / 2) // x Coordonnées dans le dessing du canvas
			, 100 // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);


		var btnStart = resources.images['btn_start'];
		finalHeight = btnStart.height * ratio;
		finalWidth = btnStart.width * ratio;
		context.drawImage(btnStart
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, btnStart.width // swidth clipping de l'image originale
			, btnStart.height // sheight clipping de l'image originale
			, (rectCanvas.width / 2) - ((btnStart.width * ratio) / 2) // x Coordonnées dans le dessing du canvas
			, rectCanvas.height - 200 // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);

		
	}

	function paintSkiffEnd(){

	}


	// Affiche le fond d'écran et le rivage
	function paintBackground(){
		context.clearRect(0,0, rectCanvas.width, rectCanvas.height);
		context.beginPath();
		context.rect(0,0, rectCanvas.width, rectCanvas.height);
		context.fillStyle = '#1abae8';
		context.fill();
		paintRive(false);
		paintRive(true);
	}

	// Affiche le rivage en fonction de la rive souhaitée et de la progression du rameur
	function paintRive(riveDroite){
		var rive = resources.images[riveDroite ? 'rive_droite' : 'rive_gauche'];
		var finalHeight = rive.height * ratio,
			finalWidth = rive.width * ratio;

		context.drawImage(rive
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, rive.width // swidth clipping de l'image originale
			, rive.height // sheight clipping de l'image originale
			, riveDroite ? rectCanvas.width - finalWidth : 0 // x Coordonnées dans le dessing du canvas
			, 0 - (finalHeight * percent) // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);
		context.drawImage(rive
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, rive.width // swidth clipping de l'image originale
			, rive.height // sheight clipping de l'image originale
			, riveDroite ? rectCanvas.width - finalWidth : 0 // x Coordonnées dans le dessing du canvas
			, finalHeight - (finalHeight * percent) // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);

	}


	var time = new Date().getTime();
	var timeRive = new Date().getTime();

	// Gère l'état du sprite à afficher
	function checkSprite(){

		if (new Date().getTime() - game.time > 30 * 1000){
			game.stateGame = STATE_END;
			return;
		}

		// Bouchon pour les tests à virer ! 
		var timeBis = new Date().getTime();
		var delta = timeBis - time;
		if (delta > 2000){
			time = timeBis;
		}else{
			game.indexSprite = 'R'+(Math.min(Math.round((delta/2000) * 10), 9)+1);
		}
		
		var timeMoveRive = new Date().getTime();
		var deltaRive = timeMoveRive - timeRive;
		if (deltaRive > 4000){
			timeRive = timeMoveRive;
			percent = 0;
		}else{
			percent = deltaRive / 4000;
		}
	}

	// Affiche le bon sprire du bateau
	function paintBoat(){
		var image = resources.images[game.indexSprite];
		//var ratio = 0.05;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.drawImage(image
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, image.width // swidth clipping de l'image originale
			, image.height // sheight clipping de l'image originale
			, (rectCanvas.width / 2) - ((image.width * ratio) / 2) // x Coordonnées dans le dessing du canvas
			, (rectCanvas.height / 2) - ((image.height * ratio) / 2)  + 100// y Coordonnées dans le dessing du canvas
			, image.width * ratio // width taille du dessin
			, image.height * ratio // height taille du dessin			
			)
	}


	// Affiche les scores et le temps 
	function paintText(){
		context.font = '40pt MineCrafter_3';
		context.textAlign = 'center';
		context.fillStyle = 'white';
		context.shadowColor = 'black';
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 10;
		context.shadowBlur = 4;
      	context.fillText('750 M', rectCanvas.width / 2, 100);
      	var time = new Date().getTime();
      	var secondes = Math.round((time - game.time) / 1000);
      	if (secondes < 10){
      		secondes = '0'+secondes;
      	}
      	context.fillText('00 : '+secondes, rectCanvas.width / 2, rectCanvas.height - 50);
	}

	// Gère les clicks en fonction de l'état du jeux
	function checkClick(event){
		if (game.stateGame != STATE_RUNNING){
			var btnStart = resources.images['btn_start'];
			var finalHeight = btnStart.height * ratio,
				finalWidth = btnStart.width * ratio;
			var x = (rectCanvas.width / 2) - ((btnStart.width * ratio) / 2),
				y = rectCanvas.height - 200;
			var xClick = event.pageX,
				yClick = event.pageY;
			if (yClick > y && yClick < (y + finalHeight)
				&& xClick > x && xClick < (x + finalWidth)){
				game.stateGame = game.stateGame === STATE_ACCUEIL ? STATE_RUNNING : STATE_ACCUEIL;
				game.time = new Date().getTime();
			}
		}

	}
   
	//API


	function init(){
		 window.addEventListener('load', pageLoad);
	}


	function setDistance(distance){
		distanceArduino = distance;
	}

	return  {
		init : init,
		setDistance : setDistance
	}
}();

skiffSimulatorApp.init();

