'use strict';

var StorageSAS = StorageSAS || function(){

	var nbUsers = 0;

	function isChromeApp(){
		return window['chrome'] != undefined
		&& window.chrome['storage'] != undefined;
	}

	// FallBack pour un fonctionnement en dehors de Chrome
	function set(key, value){
		var json = {};
		json[key] = value;
		if (isChromeApp()){
			chrome.storage.local.set(json);
		}else{
			localStorage[key] = JSON.stringify(json);
		}
	}

	// FallBack pour un fonctionnement en dehors de Chrome
	function get(keys, callBack){
		if (isChromeApp()){
			chrome.storage.local.get(keys, callBack);			
		}else{
			if (Array.isArray(keys)){
				var result = {};
				for (var i = 0; i < keys.length; i++){
					var key = keys[i];
					result[key] = JSON.parse(localStorage[key]);
				}
				callBack(result);
			}else{
				callBack({key : JSON.parse(localStorage[key])});
			}
		}
	}

	// Gère le login du user et le tri sur les users
	function manageChangeStateUser(){
		if (AppSAS.gameModel.stateGame === AppSAS.constState.STATE_RUNNING){
			if (!nbUsers){
				nbUsers = 0;
			}
			nbUsers  = 1 + nbUsers;
			set('nbUsers',nbUsers);
			var userLogin = AppSAS.ui.input.value;
			var user = {
				login : userLogin,
				distance : 0
			};
			set('user'+nbUsers, user);
		}else if (AppSAS.gameModel.stateGame === AppSAS.constState.STATE_END){

			var keyUsers = [];
			for (var i = 1 ; i <= nbUsers; i++){
				keyUsers.push('user'+i);
			}
			// On récupère tous les utilisateurs dans le but de les trier
			get(keyUsers, function callBackUsers(usersKeyValue){		
				// On commence par mettre à jour l'utilisateur courant
				// Dans tous les cas,  l'utilisateur n'est pas encore classé, il est donc en dernière position
				var user = usersKeyValue['user'+nbUsers];
				user.distance = AppSAS.gameModel.distanceSkiff;
				set('user'+nbUsers, user);

				// On gère maintenant l'ordre : facile à gérer car on tri à chaque fin de partie =>
				// on a en permanance l'ordre dans le localStorage qui est bon => on doit juste remonter 
				// et intervertir le user actuel à la recherche de sa place
				var i = nbUsers - 1;
				var placeFound = false;
				if (i > 0){					
					do{
						var userTmp = usersKeyValue['user'+i];
						placeFound = userTmp.distance > user.distance;
						if (!placeFound){
							usersKeyValue['user'+(i+1)] = userTmp;
							set('user'+(i+1), userTmp);
							usersKeyValue['user'+i] = user;
							set('user'+i, user);
						}
						i--;

					}while(!placeFound && i > 0);
				}
				// On stocke en mémoire le nouvel Highscore
				var highScores = [];
				var limit = Math.min(Object.keys(usersKeyValue).length, ConstSAS.NB_HIGHSCORES_PASYAGE);
				for (var i = 0; i <limit; i ++){
					highScores[i] = usersKeyValue['user'+(i+1)];
				}

				AppSAS.gameModel.highScores = highScores;				
			});			

		}
	}

	// On récupère direct le nombre d'utilisateurs pour éviter de se trainer ce calcul
	// aysnchrone après.
	get('nbUsers', function(data){
		nbUsers = data['nbUsers'];
	});

	return{
		manageChangeStateUser : manageChangeStateUser
	}

}();