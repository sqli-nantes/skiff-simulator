var skiffSimulatorChrome = skiffSimulatorChrome || function(){

    /**************************
    ***************************
		Arduino Part
    */

    var connectionId = -1
    	,lastArduinoTime = new Date().getTime()
    	,delay = 100
    	,compt = 0
    	,regExp = /D(.*)/
    	,value = ""
    	,distance = 0;

    function initArduino(){
    	chrome.serial.getDevices(function(ports) {
    		if (ports && ports.length == 1){
				chrome.serial.connect(ports[0].path, onOpenArduino);
    		}
		});
    }

    function onOpenArduino(openInfo){
    	connectionId = openInfo.connectionId;
		console.log("connectionId: " + connectionId);
		if (connectionId == -1) {
			console.log('Could not open');
			return;
		}
		console.log('Connected');
		chrome.serial.onReceive.addListener(onReadArduino);
    }

    function convertArrayBufferToString(buf) {
	  return String.fromCharCode.apply(null, new Uint8Array(buf));
	}    

	function onReadArduino(readInfo) {
		if (readInfo.connectionId == connectionId && readInfo.data) {
	      	var str = convertArrayBufferToString(readInfo.data);
	      	
	      	if (str.charAt(str.length-1) === '\n') {
		        value += str.substring(0, str.length-1);
				if (regExp.test(value)) // Light on and off
				{
					var distanceTmp = +regExp.exec(value)[1];
					if (distanceTmp < ConstSAS.DISTANCE_MAX 
						&& Math.abs(distance - distanceTmp) < (ConstSAS.DISTANCE_MAX * 1.5) ){
						AppSAS.setDistance(distanceTmp);
					}
					distance = distanceTmp;
					//console.log(regExp.exec(value)[1]);
					/*var curentTime = new Date().getTime();
					if (curentTime - lastArduinoTime > delay){
						lastArduinoTime = curentTime;
						console.log("Aimant ! ");
						compt++;
						if (compt > 10){
							socket.send(JSON.stringify({
								"type" : "nextStep"
							}))
							//nextStep();
							compt = 0;
						}
					}*/
				}
				value = "";
		    } else {
		        value += str;
		    }


		}
	}

	//API
	
	return  {
		initArduino : initArduino
	}
}();

