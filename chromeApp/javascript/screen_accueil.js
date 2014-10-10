'use strict';

var ScreenSasAccueil = ScreenSasAccueil || function(){

	function paintSkiffAccueil(){

		AppSAS.gameModel.indexSprite = 'R0'+AppSAS.getSuffix();
		// Affichage du bateau
		ScreenSasAction.paintBoat();


		// Affichage du logo
		var logo = AppSAS.ui.resources.images['logo'];
		var finalHeight = logo.height * AppSAS.ui.ratio,
			finalWidth = logo.width * AppSAS.ui.ratio;
		AppSAS.ui.context.drawImage(logo
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, logo.width // swidth clipping de l'image originale
			, logo.height // sheight clipping de l'image originale
			, (AppSAS.ui.canvas.width / 2) - ((logo.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessing du canvas
			, AppSAS.isPortrait() ? 100 : 10 // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);


		var btnStart = AppSAS.ui.resources.images['btn_start'];
		finalHeight = btnStart.height * AppSAS.ui.ratio;
		finalWidth = btnStart.width * AppSAS.ui.ratio;
		AppSAS.ui.context.drawImage(btnStart
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, btnStart.width // swidth clipping de l'image originale
			, btnStart.height // sheight clipping de l'image originale
			, (AppSAS.ui.canvas.width / 2) - ((btnStart.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessing du canvas
			, AppSAS.ui.canvas.height - finalHeight - (AppSAS.isPortrait() ? 100 : 50) // y Coordonnées dans le dessing du canvas
			, finalWidth // width taille du dessin
			, finalHeight // height taille du dessin			
			);

		
	}

	return {
		paintSkiffAccueil : paintSkiffAccueil
	}

}();