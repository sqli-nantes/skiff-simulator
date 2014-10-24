'use strict';

var ConstSAS = ConstSAS || function(){
		return  {
		// Constante du paramétrage Arduino
		DELAY : 50,
		// Facteur de multiplication de la vitesse pour déterminer les centimetres parcourus
		FACTOR_DISTANCE : 0.4, 
		// Facteur de soustraction de la vitesse pour gérer les arrêts de rameur avec glisse du rameur
		FACTOR_SPEED : 0.005,
		// Delta en centimetre entre 2 mesures en dessous duquel on considère qu'on ne bouge plus
		MIN_DELTA_CM : 2,
		// Constantes de jeux
		DISTANCE_MAX : 54,
		DISTANCE_MIN : 10,
		DISTANCE_PARCOURUE : 44,
		TIME_GAME : 30 * 1000,
		// Constantes Graphiques
		NB_HIGHSCORES_PASYAGE : 10,
		NB_HIGHSCORES_PORTRAIT : 5
	}
}();