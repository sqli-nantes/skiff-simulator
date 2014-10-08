var skiffSimulatorApp = skiffSimulatorApp || function(){

	
	
	function pageLoad(){
		skiffSimulatorChrome.initArduino();
	}
   
	//API
	function init(){
		 window.addEventListener('load', pageLoad);
	}

	return  {
		init : init
	}
}();

skiffSimulatorApp.init();

