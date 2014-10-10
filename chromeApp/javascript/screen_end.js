'use strict';

var ScreenSasEnd = ScreenSasEnd || function(){


	function paintSkiffEnd(){

		// Affichage du gameover
		var gameover = AppSAS.ui.resources.images['game_over'];
		var xGameOver = AppSAS.isPortrait() ? (AppSAS.ui.canvas.width / 2) - ((gameover.width * AppSAS.ui.ratio) / 2) 
			: (AppSAS.ui.canvas.width / 4) - ((gameover.width * AppSAS.ui.ratio) / 2) ;
		var yGameOver = AppSAS.isPortrait() ? 100 : 50;
		var finalHeight = gameover.height * AppSAS.ui.ratio,
			finalWidth = gameover.width * AppSAS.ui.ratio;
		AppSAS.ui.context.drawImage(gameover
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, gameover.width // swidth clipping de l'image originale
			, gameover.height // sheight clipping de l'image originale
			, xGameOver // x Coordonnées dans le dessing du canvas
			, yGameOver // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);


	var btnReset = AppSAS.ui.resources.images['btn_reset'];
		finalHeight = btnReset.height * AppSAS.ui.ratio;
		finalWidth = btnReset.width * AppSAS.ui.ratio;
		AppSAS.ui.context.drawImage(btnReset
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, btnReset.width // swidth clipping de l'image originale
			, btnReset.height // sheight clipping de l'image originale
			, (AppSAS.ui.canvas.width / 2) - ((btnReset.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessing du canvas
			, AppSAS.ui.canvas.height - finalHeight - (AppSAS.isPortrait() ? 100 : 50) // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);

		paintTextLastScreen();
	}


	// Affiche les scores et le temps 
	function paintTextLastScreen(){
		
		var gameover = AppSAS.ui.resources.images['game_over'];
		var finalHeightGameOver = gameover.height * AppSAS.ui.ratio;
		var xDistance = AppSAS.isPortrait() ? AppSAS.ui.canvas.width / 2 : AppSAS.ui.canvas.width / 4;
		var topDistanceLbl =  100 + finalHeightGameOver + (AppSAS.isPortrait() ?  175 : 140);
		AppSAS.ui.context.font = '50pt Minecraftia';
		AppSAS.ui.context.textAlign = 'center';
		AppSAS.ui.context.fillStyle = '#0d5d74';
		AppSAS.ui.context.shadowOffsetX = 0;
		AppSAS.ui.context.shadowOffsetY = 0;
		AppSAS.ui.context.shadowBlur = 0;
      	AppSAS.ui.context.fillText('DISTANCE', xDistance, topDistanceLbl);

		var topDistance = topDistanceLbl + 75;
		AppSAS.ui.context.font = '70pt MineCrafter_3';
		AppSAS.ui.context.textAlign = 'center';
		AppSAS.ui.context.fillStyle = 'white';
		AppSAS.ui.context.shadowColor = '#0d5d74';
		AppSAS.ui.context.shadowOffsetX = 0;
		AppSAS.ui.context.shadowOffsetY = 10;
		AppSAS.ui.context.shadowBlur = 4;
      	AppSAS.ui.context.fillText('750 M', xDistance, topDistance);      	

      	var topHighScore = AppSAS.isPortrait() ?  topDistance + 225 : 150;
      	var xHighScore = AppSAS.isPortrait() ? AppSAS.ui.canvas.width / 2 : (AppSAS.ui.canvas.width * 3) / 4
		AppSAS.ui.context.font = '50pt Minecraftia';
		AppSAS.ui.context.textAlign = 'center';
		AppSAS.ui.context.fillStyle = '#0d5d74';
		AppSAS.ui.context.shadowOffsetX = 0;
		AppSAS.ui.context.shadowOffsetY = 0;
		AppSAS.ui.context.shadowBlur = 0;
      	AppSAS.ui.context.fillText('HIGH SCORES', xHighScore, topHighScore);

      	var limit = AppSAS.isPortrait() ? 5 : 10;
      	for (var i =1 ; i <= limit;i++){
      		var topHighScoreRow = topHighScore + (i-1) * 70 + (AppSAS.isPortrait() ? 150 : 100);
      		var xHighScoreRow = AppSAS.isPortrait() ? 150 : (AppSAS.ui.canvas.width / 2)+50;
      		var xHighScoreRowUser = xHighScoreRow + 100;
			AppSAS.ui.context.font = '30pt Minecraftia';
			AppSAS.ui.context.textAlign = 'right';
			AppSAS.ui.context.fillStyle = '#0d5d74';
			AppSAS.ui.context.shadowColor = 'white';
			AppSAS.ui.context.shadowOffsetX = 0;
			AppSAS.ui.context.shadowOffsetY = 5;
			AppSAS.ui.context.shadowBlur = 2;
			AppSAS.ui.context.fillText(''+i, xHighScoreRow, topHighScoreRow);
			AppSAS.ui.context.textAlign = 'left';
			AppSAS.ui.context.fillStyle = 'white';
			AppSAS.ui.context.shadowOffsetX = 0;
			AppSAS.ui.context.shadowOffsetY = 0;
			AppSAS.ui.context.shadowBlur = 0;
			AppSAS.ui.context.fillText('user '+i, xHighScoreRowUser, topHighScoreRow);
			AppSAS.ui.context.textAlign = 'right';
			AppSAS.ui.context.fillText('1 100 M ', AppSAS.ui.canvas.width - 150, topHighScoreRow);
      	}
	}



	return {
		paintSkiffEnd : paintSkiffEnd
	}

}();