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
	this.drawGrid = function(ctx, gridSize, xOffset, yOffset, vn, hn, bTileID) {
		var gridFontSize = 10;
		for (var i = 0; i <= vn; i++) {
			var xOfLine = xOffset + (gridSize * i);
			ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
			ctx.beginPath();
			ctx.moveTo(xOfLine, 0);
			ctx.lineTo(xOfLine, CANVAS_HEIGHT);
			ctx.stroke();
		}
		for (var i = 0; i <= hn; i++) {
			var yOfLine = yOffset + (gridSize * i);
			ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
			ctx.beginPath();
			ctx.moveTo(0, yOfLine);
			ctx.lineTo(CANVAS_WIDTH, yOfLine);
			ctx.stroke();
		}

		if (bTileID) {
			for (var i = 0; i < vn; i++) {
				for (var j = 0; j < hn; j++) {
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