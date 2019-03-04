/**
* Image resource controller
* @class
*/
var SpriteSheet = new function() {
	var _spriteSheet = this;
	this.images = {};
	this.map = {};

	/**
	* Load image resources
	* @function
	* @param {object} sources - Image source sheet.
	* @param {object} spriteData - Sprites information sheet.
	* @param {function} callback - Callback function which invoke after all images loaded.
	*/
	this.load = function(sources, spriteData, callback) {
		this.map = spriteData;
		var count = 0;
		var imgNum = 0;
		for (src in sources) {
			imgNum++;
		}
		for (src in sources) {
			_spriteSheet.images[src] = new Image();
			_spriteSheet.images[src].onload = function() {
				if (++count >= imgNum) {
					callback(_spriteSheet.images);
				} 
			}
			_spriteSheet.images[src].src = sources[src];
		} 
	}

	/**
	* Draw sprite
	* @function
	* @param {Context} ctx - Context of canvas.
	* @param {string} sprite - Sprite name in the sprite data sheet.
	* @param {number} x - Horizontal position that you want to draw sprite, in pixels.
	* @param {number} y - Vertical position that you want to draw sprite, in pixels.
	* @param {number} frame - Frame numbers for animation.
	*/
	this.draw =function(ctx, sprite, x, y, frame) {
		var s = this.map[sprite];
		if(!frame) {
			frame = 0;
		}
		ctx.drawImage(_spriteSheet.images[s.source],
			s.sx + frame * s.w,
			s.sy,
			s.w, s.h,
			x, y,
			s.w, s.h);
	};
};