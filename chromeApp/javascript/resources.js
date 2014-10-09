function Resources() {
	this.images = [];
}

Resources.prototype.loadSprite = function(sprite) {

	var p = new Promise(function(resolve, reject) {
		var image = new Image();
		image.src = sprite.url;
		image.onload = function() {
			this.images[sprite.title] = image;
			resolve(sprite);
		}.bind(this);
		image.onerror = function() { 
			reject(sprite);
		};
	}.bind(this));
	
	return p;
};
  
Resources.prototype.loadSprites = function(spriteList) { 

	var promises = [];
	spriteList.forEach(function(element) {
		promises.push(this.loadSprite(element));
	}.bind(this));
	return Promise.all(promises);
};