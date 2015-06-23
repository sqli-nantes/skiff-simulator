'use strict';

var ScreenSasAction = ScreenSasAction || function(){

	var mappingPositonRameurFront = [];
	var mappingPositonRameurBack = [];
	for (var i = 0; i <5 ;i++){
		mappingPositonRameurBack.push({
			min : ConstSAS.DISTANCE_MIN + (ConstSAS.DISTANCE_PARCOURUE * (i / 5)),
			max : ConstSAS.DISTANCE_MIN + (ConstSAS.DISTANCE_PARCOURUE * ((i+1) / 5)),
			indexSprite : 'R'+(i+1)
		});
		mappingPositonRameurFront.push({
			min : ConstSAS.DISTANCE_MIN + (ConstSAS.DISTANCE_PARCOURUE * (i / 5)),
			max : ConstSAS.DISTANCE_MIN + (ConstSAS.DISTANCE_PARCOURUE * ((i+1) / 5)),
			indexSprite : 'A'+(5-i)
		});
	}

	function paintSkiffGhost(){		
		if (AppSAS.gameModel.ghost.length === 0 
			|| AppSAS.gameModel.ghost.length <= AppSAS.gameModel.step){
			return;
		}
		// Gestion de l'état Arduino du ghost
		checkGhost();
		// Affichage du bateau ghost
		paintGhost();		
	}

	function paintSkiffAction(){
		// Gestion de l'état Arduino
		checkSprite();
		// Affichage du bateau
		paintBoat();
		// Affichage des texts
		paintDistanceAndTime();
		// Engine
	}

	var time = new Date().getTime();
	var timeRive = new Date().getTime();


	function indexToUse(direction, distance){
		var arrayToUse = direction >= 0 ? mappingPositonRameurFront : mappingPositonRameurBack;
		for (var i = 0;i <arrayToUse.length; i++){
			var minMax = arrayToUse[i];
			if (distance > minMax.min && distance <= minMax.max){
				return minMax.indexSprite+AppSAS.getSuffix();
			}
		}
		return mappingPositonRameurBack[0].indexSprite+AppSAS.getSuffix();
	}

	// Gère l'état du GHOST à afficher
	function checkGhost(){

		var stateGhost = AppSAS.gameModel.ghost[AppSAS.gameModel.step];
		var copyDistance = stateGhost.distanceArduino;
		var copyDirection = stateGhost.direction;		
		if (copyDirection != 0 
			&& copyDistance > 0
			&& copyDistance <= ConstSAS.DISTANCE_MAX){
			AppSAS.gameModel.indexSpriteGhost = indexToUse(copyDirection, copyDistance);	
			
		}		
	}

	// Gère l'état du sprite à afficher
	function checkSprite(){

		var copyDistance = AppSAS.gameModel.distanceArduino;
		var copyDirection = AppSAS.gameModel.direction;
		var copySpeed = AppSAS.gameModel.speed;
		if (AppSAS.gameModel.direction != 0 
			&& copyDistance > 0
			&& copyDistance <= ConstSAS.DISTANCE_MAX){
			AppSAS.gameModel.indexSprite = indexToUse(copyDirection, copyDistance);						
		}

		if (new Date().getTime() - AppSAS.gameModel.time > ConstSAS.TIME_GAME){			
			if (AppSAS.gameModel.stateGame != AppSAS.constState.STATE_END){
				//On gère le changement de musique
				SasAudio.stop();
				SasAudio.playHighScore();
			}
			AppSAS.gameModel.stateGame = AppSAS.constState.STATE_END;
			// On doit mettre à jour les données
			StorageSAS.manageChangeStateUser();
			return;
		}
	}

	// Affiche le bon sprire du bateau du mode Ghost
	function paintGhost(){
		//var ratio = 0.05;
		var image = AppSAS.ui.resources.images[AppSAS.gameModel.indexSpriteGhost];		

		if (!image){
			return;
		}

		AppSAS.ui.context.shadowOffsetX = 0;
		AppSAS.ui.context.shadowOffsetY = 0;
		AppSAS.ui.context.shadowBlur = 0;
		// On change l'opacité du fantome
		AppSAS.ui.context.globalAlpha = 0.2;
		// Le fantome doit etre dessiné là où il est au niveau de sa distance globale par rapport au bateau actuel 
		// => On l'affiche là où est son delta en distance par rapport à bateau actuel
		var stateGhost = AppSAS.gameModel.ghost[AppSAS.gameModel.step];
		var deltaGhost = AppSAS.gameModel.distanceSkiff - stateGhost.distanceSkiff;
		// On doit tronquer le ghost s'il dépasse de l'écran		
		var yGhost = (AppSAS.ui.canvas.height / 2) - ((image.height * AppSAS.ui.ratio) / 2)  + 100 + (deltaGhost * ConstSAS.FACTOR_GHOST);
		var heightSpriteGhost = image.height;
		if (yGhost < 0){
			heightSpriteGhost = image.height + yGhost;
			yGhost = 0;
		}
		AppSAS.ui.context.drawImage(image
			, 0 //sx clipping de l'image originale
			, image.height - heightSpriteGhost //sy clipping de l'image originale
			, image.width // swidth clipping de l'image originale
			, heightSpriteGhost // sheight clipping de l'image originale
			, (AppSAS.ui.canvas.width / 2) - ((image.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessin du AppSAS.ui.canvas
			, yGhost // y Coordonnées dans le dessin du AppSAS.ui.canvas
			, image.width * AppSAS.ui.ratio // width taille du dessin
			, heightSpriteGhost * AppSAS.ui.ratio // height taille du dessin			
			);
		// On remet l'opacité du canvas à 1 pour dessiner l'animation
		AppSAS.ui.context.globalAlpha = 1;
	}

	// Affiche le bon sprire du bateau
	function paintBoat(){
		//var ratio = 0.05;
		var image = AppSAS.ui.resources.images[AppSAS.gameModel.indexSprite];		
		AppSAS.ui.context.shadowOffsetX = 0;
		AppSAS.ui.context.shadowOffsetY = 0;
		AppSAS.ui.context.shadowBlur = 0;
		AppSAS.ui.context.drawImage(image
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, image.width // swidth clipping de l'image originale
			, image.height // sheight clipping de l'image originale
			, (AppSAS.ui.canvas.width / 2) - ((image.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessin du AppSAS.ui.canvas
			, (AppSAS.ui.canvas.height / 2) - ((image.height * AppSAS.ui.ratio) / 2)  + 100// y Coordonnées dans le dessin du AppSAS.ui.canvas
			, image.width * AppSAS.ui.ratio // width taille du dessin
			, image.height * AppSAS.ui.ratio // height taille du dessin			
			)
	}



	// Affiche les scores et le temps 
	function paintDistanceAndTime(){

		var xTime = AppSAS.isPortrait() ? AppSAS.ui.canvas.width / 2 :  AppSAS.ui.canvas.width / 4;
		var yTime = AppSAS.isPortrait() ? AppSAS.ui.canvas.height - 50 :  150;		
		var xDistance = AppSAS.isPortrait() ? AppSAS.ui.canvas.width / 2 :  (AppSAS.ui.canvas.width *3) / 4;
		var yDistance = 150;		
		var sizeFont = AppSAS.isPortrait() ? 40 : 70;

		// On écrit la distance
		AppSAS.ui.context.font = sizeFont+'pt MineCrafter_3';
		AppSAS.ui.context.textAlign = 'center';
		AppSAS.ui.context.fillStyle = 'white';
		AppSAS.ui.context.shadowColor = '#0d5d74';
		AppSAS.ui.context.shadowOffsetX = 0;
		AppSAS.ui.context.shadowOffsetY = 10;
		AppSAS.ui.context.shadowBlur = 4;
      	AppSAS.ui.context.fillText(Math.floor(AppSAS.gameModel.distanceSkiff)+' M', xDistance, yDistance);

      	//Maintenant on écrit l'heure
      	var time = new Date().getTime();
      	var secondes = Math.round((time - AppSAS.gameModel.time) / 1000);
      	AppSAS.ui.context.textAlign = 'center';
      	AppSAS.ui.context.fillStyle = 'white';
      	if (secondes < 10){
      		secondes = '0'+secondes;
      	}else if (secondes > 20 && secondes <= 25){
      		AppSAS.ui.context.fillStyle = '#ff9600';
      	}else if(secondes > 25){
      		AppSAS.ui.context.fillStyle = '#ff0000'; 
      	}
      	
      	AppSAS.ui.context.fillText('00 : '+secondes, xTime, yTime);
	}

	return {
		paintSkiffGhost : paintSkiffGhost,
		paintSkiffAction : paintSkiffAction,
		paintBoat : paintBoat
	}

}();