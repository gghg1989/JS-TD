window.onload = init;

const 	CANVAS_WIDTH = 500,
		CANVAS_HEIGHT = 400,
		GRID_SIZE = TILE_SIZE = 32,
		AUTOTILE_SIZE = TILE_SIZE / 2,
		CANVAS_BACKGROUNDS = 'rgba(0, 44, 55, 0.5)';

var vn = Math.floor(CANVAS_WIDTH / GRID_SIZE);
var hn = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
var xStart = (CANVAS_WIDTH - (GRID_SIZE * vn)) / 2;
var yStart = (CANVAS_HEIGHT - (GRID_SIZE * hn)) / 2;
var canvas, ctx, ball;

var imageAsset = {
	autoTiles: "assets/auto-tiles.png"
};

var sprites = {
	'tile-set' : {
		source: "autoTiles",
		sx: 64,
		sy: 0,
		w: 64,
		h: 96,
		frames: 0
	},
	2 : {
		source: "autoTiles",
		sx: 80,
		sy: 48,
		w: 32,
		h: 32,
		frames: 0
	}
};
// Debug switch
var showFPS = true;
var showGrid = true;

function init() {
	canvas = document.getElementById('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvas.style.backgroundColor = CANVAS_BACKGROUNDS;
	
	ctx = canvas.getContext('2d');

	SpriteSheet.load(imageAsset, sprites, function(){
		console.log("Images loaded.");
		render();
	});
	// SpriteSheet.load(imageAsset.res, )
}

function render(time) {
	requestAnimationFrame(render);
	cleanBackground();
	// Render tile map
	// var tileMap = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
	// 			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	// 			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
	// var tileMapSize = tileMap.length;
	// for (var i = 0; i < tileMapSize; i++) {
	// 	currentTileX = xStart + (TILE_SIZE * (i % vn));
	// 	currentTileY = yStart + (TILE_SIZE * Math.floor(i / vn));
	// 	SpriteSheet.draw(ctx, tileMap[i], currentTileX, currentTileY, 0);
	// }
	SpriteSheet.draw(ctx, 'tile-set', xStart + TILE_SIZE * 2, yStart + TILE_SIZE * 2, 0);
	
	if (showGrid) {
		drawGrid(GRID_SIZE, true);
		drawGrid(AUTOTILE_SIZE, false);
		getCurrentTileID();
	}
	if (showFPS) {
		drawFPS(time);
	}
}

function cleanBackground() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.fillStyle = CANVAS_BACKGROUNDS;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGrid(gridSize, bTileID) {
	var gridFontSize = 10;
	for (var i = 0; i <= vn; i++) {
		var xOfLine = xStart + (gridSize * i);
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.beginPath();
		ctx.moveTo(xOfLine, 0);
		ctx.lineTo(xOfLine, CANVAS_HEIGHT);
		ctx.stroke();
	}
	for (var i = 0; i <= hn; i++) {
		var yOfLine = yStart + (gridSize * i);
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
				var xOfText = xStart + (gridSize * i) + (gridSize / 2) - (textWidth / 2);
				var yOfText = yStart + (gridSize * j) + (gridSize / 2) + (textHeight / 2);
				
				ctx.fillText(gridCoord, xOfText, yOfText);
			}
		}
	}
}

// FPS Renderer
var previousFrameTime;
function drawFPS(time) {
	var FPS = Math.floor(1000 / (time - previousFrameTime));
	previousFrameTime = time;
	ctx.fillStyle = 'rgba(255, 0, 0, 1)';
	ctx.font = 'normal bold 1.5em courier';
	ctx.fillText('FPS:' + FPS, 10, 20);
}

// Draw tile ID on its position
function drawTileID(x, y) {
	var currentTileId = getTileID(x, y);
	var tileIDText = '('+currentTileId[0]+', '+currentTileId[1]+')';
	var textWidth = ctx.measureText(tileIDText).width;
	ctx.fillStyle = 'rgba(0, 0, 255, 1)';
	ctx.font = 'normal bold 1em courier';
	ctx.fillText(tileIDText, xStart + x - (textWidth / 2), yStart + y);
}

function getCurrentTileID() {
	var canvasBoundary = canvas.getBoundingClientRect();
	// console.log(canvasBoundary);
	canvas.addEventListener('mousemove', function(e) {
		var clientX = e.clientX;
		var clientY = e.clientY;
		cursorX = clientX - canvasBoundary.x;
		cursorY = clientY - canvasBoundary.y;
	})
	// console.log('('+cursorX+', '+cursorY+')');
	if (typeof(cursorX) != 'undefined' || typeof(cursorY) != 'undefined') {
		var tileID = getTileID(cursorX, cursorY);
		ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		// ctx.font = 'normal bold 1.5em courier';
		// ctx.fillText('('+tileID[0]+', '+tileID[1]+')', 10, 40);
		highlightTile(tileID[0], tileID[1]);

		// drawTileID(cursorX, cursorY);
	}

}

function getTileID(x, y) {
	// var canvasBoundary = canvas.getBoundingClientRect();
	// console.log('('+cursorX+', '+cursorY+')');
	if (typeof(x) != 'undefined' || typeof(y) != 'undefined') {
		var tileX = Math.floor((x - xStart) / GRID_SIZE);
		var tileY = Math.floor((y - yStart) / GRID_SIZE);
		return [tileX, tileY]; 
	}
	return [0, 0]
}

function highlightTile(tileX, tileY, highlightColor) {
	ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
	var highlightTileX = xStart + (tileX * GRID_SIZE);
	var highlightTileY = yStart + (tileY * GRID_SIZE);
	ctx.fillRect(highlightTileX, highlightTileY, GRID_SIZE, GRID_SIZE);
}