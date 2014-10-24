'use strict';

var AppSAS = AppSAS || function(){

	// Différents états du jeux
	var constState = {
		STATE_ACCUEIL : 0,
		STATE_RUNNING : 1,
		STATE_END : 2
	};

	var constScreen = {
		SCREEN_PORTRAIT : 1,
		SCREEN_LANDSCAPE : 2
	};

	// Variables à utiliser

	var ui = {
		input : null,
		canvas : null,
		context : null,
		resources : new Resources(),
		modeScreen : constScreen.SCREEN_LANDSCAPE,
		ratio : 1
	}

	var gameModel = {
		stateGame : constState.STATE_ACCUEIL,
		indexSprite : 'R0',
		time : 0,
		percent : 0,
		distanceSkiff : 0,
		distanceArduino : 0, 
		direction : 0,
		speed : 0,
		highScores : []
	};

	
	function pageLoad(){
		// On se connecte à l'arduino
		try{
			skiffSimulatorChrome.initArduino();
		}catch(err){
			console.error("Error  : %s \n %s",err.message, err.stack);
		}

		// On initialise le canvas
		ui.input = document.getElementById('user');
		ui.canvas = document.getElementById('skiff');
		ui.canvas.width  = window.innerWidth;
		ui.canvas.height = window.innerHeight;
		ui.context = ui.canvas.getContext('2d');
		ui.canvas.addEventListener('click', checkClick, false);

		// On précharge toutes les ressources nécessaires
		ui.resources.loadSprites([	{title: 'logo', url: 'assets/images/logo.png'},
								{title: 'game_over', url: 'assets/images/gameover.png'},
								{title: 'rive_gauche_portrait', url: 'assets/images/riviere_gauche_portrait.png'},
								{title: 'rive_gauche_paysage', url: 'assets/images/riviere_gauche_paysage.png'},
								{title: 'rive_droite_portrait', url: 'assets/images/riviere_droite_portrait.png'},
								{title: 'rive_droite_paysage', url: 'assets/images/riviere_droite_paysage.png'},
								{title: 'btn_start', url: 'assets/images/start.png'},
								{title: 'btn_reset', url: 'assets/images/replay.png'},
								{title: 'R0_portrait', url: 'assets/images/rameur_accueil_portrait.png'},
								{title: 'R0_paysage', url: 'assets/images/rameur_accueil_paysage.png'},
								{title: 'R3_portrait', url: 'assets/images/R3_portrait.png'},
								{title: 'R3_paysage', url: 'assets/images/R3_paysage.png'},
								{title: 'R4_portrait', url: 'assets/images/R4_portrait.png'},
								{title: 'R4_paysage', url: 'assets/images/R4_paysage.png'},
								{title: 'R5_portrait', url: 'assets/images/R5_portrait.png'},
								{title: 'R5_paysage', url: 'assets/images/R5_paysage.png'},
								{title: 'A1_portrait', url: 'assets/images/A1_portrait.png'},
								{title: 'A1_paysage', url: 'assets/images/A1_paysage.png'},
								{title: 'A2_portrait', url: 'assets/images/A2_portrait.png'},
								{title: 'A2_paysage', url: 'assets/images/A2_paysage.png'},
								{title: 'A3_portrait', url: 'assets/images/A3_portrait.png'},
								{title: 'A3_paysage', url: 'assets/images/A3_paysage.png'},
								{title: 'A4_portrait', url: 'assets/images/A4_portrait.png'},
								{title: 'A4_paysage', url: 'assets/images/A4_paysage.png'},
								{title: 'A5_portrait', url: 'assets/images/A5_portrait.png'},
								{title: 'A5_paysage', url: 'assets/images/A5_paysage.png'},
								{title: 'R1_portrait', url: 'assets/images/R1_portrait.png'},
								{title: 'R1_paysage', url: 'assets/images/R1_paysage.png'},
								{title: 'R2_portrait', url: 'assets/images/R2_portrait.png'},
								{title: 'R2_paysage', url: 'assets/images/R2_paysage.png'}
							])
		.then(function(value) {			
			paintSkiff();		
		}).catch(function(err){
			console.error("Error  : %s \n %s",err.message, err.stack);
		});

	}

	

	// Gère l'affichage de l'écran
	function paintSkiff() {
		try{
			// Initialisation des variables pour gérer les redimentionements
			ui.modeScreen = window.innerWidth > window.innerHeight ? constScreen.SCREEN_LANDSCAPE : constScreen.SCREEN_PORTRAIT;
			ui.ratio = ui.canvas.height / ui.resources.images['rive_gauche'+getSuffix()].height;
			ui.canvas.width  = window.innerWidth;
			ui.canvas.height = window.innerHeight;

			// Affichage des décors
			paintBackground();		

			if (gameModel.stateGame === constState.STATE_ACCUEIL){				
				ScreenSasAccueil.paintSkiffAccueil();
			}else if (gameModel.stateGame === constState.STATE_RUNNING){
				ScreenSasAction.paintSkiffAction();
			}if (gameModel.stateGame === constState.STATE_END){
				ScreenSasEnd.paintSkiffEnd();
			}

			window.requestAnimationFrame(paintSkiff);
		}catch(err){
			console.error("Error  : %s \n %s",err.message, err.stack);
		}
	}


	// Affiche le fond d'écran et le rivage
	function paintBackground(){
		ui.context.clearRect(0,0, ui.canvas.width, ui.canvas.height);
		ui.context.beginPath();
		ui.context.rect(0,0, ui.canvas.width, ui.canvas.height);
		ui.context.fillStyle = '#1abae8';
		ui.context.fill();
		paintRive(false);
		paintRive(true);
	}

	// Affiche le rivage en fonction de la rive souhaitée et de la progression du rameur
	function paintRive(riveDroite){
		var rive = ui.resources.images[(riveDroite ? 'rive_droite' : 'rive_gauche')+getSuffix()];
		var finalHeight = rive.height * ui.ratio,
			finalWidth = rive.width * ui.ratio;

		ui.context.drawImage(rive
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, rive.width // swidth clipping de l'image originale
			, rive.height // sheight clipping de l'image originale
			, riveDroite ? ui.canvas.width - finalWidth : 0 // x Coordonnées dans le dessing du canvas
			, 0 - (finalHeight * gameModel.percent) // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);
		ui.context.drawImage(rive
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, rive.width // swidth clipping de l'image originale
			, rive.height // sheight clipping de l'image originale
			, riveDroite ? ui.canvas.width - finalWidth : 0 // x Coordonnées dans le dessing du ui.canvas
			, finalHeight - (finalHeight * gameModel.percent) // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);

	}


	// Gère les clicks en fonction de l'état du jeux
	function checkClick(event){
		if (gameModel.stateGame != constState.STATE_RUNNING){
			var btnStart = ui.resources.images['btn_start'];
			var finalHeight = btnStart.height * ui.ratio,
				finalWidth = btnStart.width * ui.ratio;
			var x = (ui.canvas.width / 2) - ((btnStart.width * ui.ratio) / 2),
				y = ui.canvas.height - finalHeight - (isPortrait() ? 100 : 50);
			var xClick = event.pageX,
				yClick = event.pageY;
			if (yClick > y && yClick < (y + finalHeight)
				&& xClick > x && xClick < (x + finalWidth)){
				// On change l'état du jeux
				gameModel.stateGame = gameModel.stateGame === constState.STATE_ACCUEIL ? constState.STATE_RUNNING : constState.STATE_ACCUEIL;
				if (gameModel.stateGame === constState.STATE_RUNNING){
					// On démare la musique
					SasAudio.stop();
					SasAudio.playGame();
					// On initialise le timer
					gameModel.time = new Date().getTime();			
					// On cache le champ d'input
					ui.input.style.display = 'none';
					// On initialise bien le champ login avec au moins anonymous
					ui.input.value = ui.input.value && ui.input.value.trim().length > 0 ? ui.input.value : 'ANONYMOUS';	
				}else{
					// On démare la musique
					SasAudio.stop();
					SasAudio.playTitle();
					// On vide bien le champ du user
					// On réiinitialise
					gameModel.distanceSkiff = 0;
					ui.input.value = '';
					ui.input.style.display = '';
				}
				StorageSAS.manageChangeStateUser();
			}
		}
	}

	function engineSkiff(){
		if (gameModel.speed > 0 && gameModel.stateGame === constState.STATE_RUNNING){
			var distanceSpeed = gameModel.speed * ConstSAS.DELAY;
			gameModel.distanceSkiff += (distanceSpeed * ConstSAS.FACTOR_DISTANCE);
			gameModel.percent  = (gameModel.distanceSkiff % 100) / 100;
		}
	}
   
	//API


	function init(){
		 window.addEventListener('load', pageLoad);
	}


	// Calcul 
	function setDistance(distance){
		if (gameModel.distanceArduino === distance){
			gameModel.direction = 0;
		}else if (gameModel.distanceArduino > distance){
			gameModel.direction = 1;
		}else{
			gameModel.direction = -1;
		}
		// Vitesse en cm / ms
		var deltaCM = Math.abs(gameModel.distanceArduino - distance);		
		if (deltaCM > ConstSAS.MIN_DELTA_CM){
			gameModel.speed = deltaCM / ConstSAS.DELAY;
		}else{
			gameModel.speed = Math.max(gameModel.speed - ConstSAS.FACTOR_SPEED, 0);
		}
		gameModel.distanceArduino = distance;

		engineSkiff();
	}

	function isPortrait(){
		return ui.modeScreen === constScreen.SCREEN_PORTRAIT;
	}

	function getSuffix(){
		return isPortrait() ? '_portrait' : '_paysage';
	}
	
	return  {
		init : init,
		ui : ui,
		constState : constState,
		constScreen : constScreen,
		gameModel : gameModel,
		setDistance : setDistance,
		getSuffix : getSuffix,
		isPortrait : isPortrait

	}
}();

AppSAS.init();

