'use strict';

var ScreenSasAction = ScreenSasAction || function(){

	var mappingPositonRameurFront = [];
	var mappingPositonRameurBack = [];
	for (var i = 0; i <5 ;i++){
		mappingPositonRameurBack.push({
			min : ConstSAS.DISTANCE_MAX * (i / 5),
			max : ConstSAS.DISTANCE_MAX * ((i+1) / 5),
			indexSprite : 'R'+(i+1)
		});
		mappingPositonRameurFront.push({
			min : ConstSAS.DISTANCE_MAX * (i / 5),
			max : ConstSAS.DISTANCE_MAX * ((i+1) / 5),
			indexSprite : 'A'+(5-i)
		});
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


	// Gère l'état du sprite à afficher
	function checkSprite(){

		var copyDistance = AppSAS.gameModel.distanceArduino;
		var copyDirection = AppSAS.gameModel.direction;
		var copySpeed = AppSAS.gameModel.speed;
		if (AppSAS.gameModel.direction != 0 
			&& copyDistance > 0
			&& copyDistance <= ConstSAS.DISTANCE_MAX){
			var arrayToUse = copyDirection >= 0 ? mappingPositonRameurFront : mappingPositonRameurBack;
			for (var i = 0;i <arrayToUse.length; i++){
				var minMax = arrayToUse[i];
				if (copyDistance > minMax.min && copyDistance <= minMax.max){
					AppSAS.gameModel.indexSprite = minMax.indexSprite+AppSAS.getSuffix();
					break;
				}
			}
		}

		if (new Date().getTime() - AppSAS.gameModel.time > 30 * 1000){
			AppSAS.gameModel.stateGame = AppSAS.constState.STATE_END;
			return;
		}

		// Bouchon pour les tests à virer ! 
		/*var timeBis = new Date().getTime();
		var delta = timeBis - time;
		if (delta > 2000){
			time = timeBis;
		}else{
			AppSAS.gameModel.indexSprite = 'R'+(Math.min(Math.round((delta/2000) * 10), 9)+1)+AppSAS.getSuffix();
		}
		
		var timeMoveRive = new Date().getTime();
		var deltaRive = timeMoveRive - timeRive;
		if (deltaRive > 4000){
			timeRive = timeMoveRive;
			AppSAS.gameModel.percent = 0;
		}else{
			AppSAS.gameModel.percent = deltaRive / 4000;
		}*/
	}

	// Affiche le bon sprire du bateau
	function paintBoat(){
		console.log('Sprite : '+AppSAS.gameModel.indexSprite);
		var image = AppSAS.ui.resources.images[AppSAS.gameModel.indexSprite];		
		//var ratio = 0.05;
		AppSAS.ui.context.shadowOffsetX = 0;
		AppSAS.ui.context.shadowOffsetY = 0;
		AppSAS.ui.context.shadowBlur = 0;
		AppSAS.ui.context.drawImage(image
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, image.width // swidth clipping de l'image originale
			, image.height // sheight clipping de l'image originale
			, (AppSAS.ui.canvas.width / 2) - ((image.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessing du AppSAS.ui.canvas
			, (AppSAS.ui.canvas.height / 2) - ((image.height * AppSAS.ui.ratio) / 2)  + 100// y Coordonnées dans le dessing du AppSAS.ui.canvas
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
      	AppSAS.ui.context.fillText('750 M', xDistance, yDistance);

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
		paintSkiffAction : paintSkiffAction,
		paintBoat : paintBoat
	}

}();