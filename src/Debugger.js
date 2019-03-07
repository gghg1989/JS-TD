var Debugger = new function() {
	/**
	* Draw Grid Guideline
	* @function
	* @param {Context} ctx - Context of canvas.
	* @param {string} sprite - Sprite name in the sprite data sheet.
	* @param {number} x - Horizontal position that you want to draw sprite, in pixels.
	* @param {number} y - Vertical position that you want to draw sprite, in pixels.
	* @param {number} frame - Frame numbers for animation.
	*/
	this.drawGrid = function(ctx, gridSize, xOffset, yOffset, hn, vn, alpha, bTileID) {
		if (alpha >= 1) {
			alpha = 1;
		}
		else if (alpha <=0 ) {
			alpha = 0.1;
		}

		var gridFontSize = 10;

		ctx.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')';
		ctx.beginPath();
		for (var i = 0; i <= hn; i++) {
			var xOfLine = xOffset + (gridSize * i);
			ctx.moveTo(xOfLine, 0);
			ctx.lineTo(xOfLine, CANVAS_HEIGHT);
		}
		
		for (var i = 0; i <= vn; i++) {
			var yOfLine = yOffset + (gridSize * i);
			ctx.moveTo(0, yOfLine);
			ctx.lineTo(CANVAS_WIDTH, yOfLine);
		}
		ctx.stroke();

		if (bTileID) {
			for (var i = 0; i < hn; i++) {
				for (var j = 0; j < vn; j++) {
					var gridCoord = i+", "+j;
					ctx.font = gridFontSize + "px Arial";
					var textWidth = ctx.measureText(gridCoord).width;
					var textHeight = gridFontSize;
					var xOfText = xOffset + (gridSize * i) + (gridSize / 2) - (textWidth / 2);
					var yOfText = yOffset + (gridSize * j) + (gridSize / 2) + (textHeight / 2);
					
					ctx.fillText(gridCoord, xOfText, yOfText);
				}
			}
		}
	}

	var previousFrameTime;
	/**
	* Draw Frame per Second Rate
	* @function
	* @param {Context} ctx - Context of canvas.
	* @param {string} sprite - Sprite name in the sprite data sheet.
	* @param {number} x - Horizontal position that you want to draw sprite, in pixels.
	* @param {number} y - Vertical position that you want to draw sprite, in pixels.
	* @param {number} frame - Frame numbers for animation.
	*/
	this.drawFPS = function(ctx, time) {
		var FPS = Math.floor(1000 / (time - previousFrameTime));
		previousFrameTime = time;
		ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		ctx.font = 'normal bold 1.5em courier';
		ctx.fillText('FPS:' + FPS, 10, 20);
	}
}