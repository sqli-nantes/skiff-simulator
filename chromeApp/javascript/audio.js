'use strict';

var SasAudio = SasAudio || function(){

	var context = null,
		TITLE = 1,
		GAME = 2,
		HIGH_SCORE = 3,
		titleBuffer = null,
		gameBuffer = null,
		highscoreBuffer = null,
		currentSource = null;

	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	}catch(e){
		console.log("No WebAPI dectect");
	}

	function loadSound(url, bufferToUse){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
				if (bufferToUse === TITLE){
			  		titleBuffer = buffer;
			  		playTitle();
				}else if (bufferToUse === GAME){
			  		gameBuffer = buffer;
				}else if (bufferToUse === HIGH_SCORE){
			  		highscoreBuffer = buffer;
				}
			}, function(e){
				console.log('Error decoding file', e);
			});
		}
		request.send();
	}

	function loadTitleSound(){
		loadSound("assets/songs/intro.mp3", TITLE);
	}

	function loadGameSound(){
		loadSound("assets/songs/play_cut.mp3", GAME);
	}

	function loadHighScporeSound(){
		loadSound("assets/songs/highscore_cut.mp3", HIGH_SCORE);
	}

	function playSound(buffer){
		var source = context.createBufferSource(); // creates a sound source
		source.buffer = buffer;                    // tell the source which sound to play
		source.connect(context.destination);       // connect the source to the context's destination (the speakers)
		source.start(0);                           // play the source now
		return source;
	}

	loadTitleSound();
	loadGameSound();
	loadHighScporeSound();

	/*****************************
	******************************
	* Apis exposed
	******************************
	******************************
	*/
	
	function playTitle(){
		currentSource = playSound(titleBuffer);
	}

	function playGame(){
		currentSource = playSound(gameBuffer);
	}

	function playHighScore(){
		currentSource = playSound(highscoreBuffer);
	}

	function stop(){
		if (currentSource && currentSource.stop){
			currentSource.stop(0);
		}
	}





	return {
		playTitle : playTitle,
		playGame : playGame,
		playHighScore : playHighScore,
		stop : stop
	}

}();