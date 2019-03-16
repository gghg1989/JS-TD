window.onload = init;

const 	CANVAS_WIDTH = 500,
		CANVAS_HEIGHT = 400,
		GRID_SIZE = TILE_SIZE = 32,
		AUTOTILE_SIZE = TILE_SIZE / 2,
		CANVAS_BACKGROUNDS = 'rgba(0, 44, 55, 0.5)';

var hn = Math.floor(CANVAS_WIDTH / GRID_SIZE);
var vn = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
var xStart = (CANVAS_WIDTH - (GRID_SIZE * hn)) / 2;
var yStart = (CANVAS_HEIGHT - (GRID_SIZE * vn)) / 2;
var canvas, ctx, ball;

var imageAsset = {
	autoTiles: "assets/auto-tiles.png"
};

var sprites = {
	// 
	1 : {
		source: "autoTiles",
		sx: 0,
		sy: 0,
		w: 32,
		h: 32,
		frames: 0
	},
	2 : {
		source: "autoTiles",
		sx: 192,
		sy: 0,
		w: 64,
		h: 96,
		frames: 0
	},
	3 : {
		source: "autoTiles",
		sx: 0,
		sy: 96,
		w: 32,
		h: 32,
		frames: 0
	},
	4 : {
		source: "autoTiles",
		sx: 128,
		sy: 96,
		w: 64,
		h: 96,
		frames: 0
	},
	6 : {
		source: "autoTiles",
		sx: 256,
		sy: 0,
		w: 64,
		h: 96,
		frames: 0
	} 
};

var autoTileSet = {
	tileSetSource: "",
	tileSet: {
		'left-top-convex': 8,
		'right-top-convex': 11,
		'left-bottom-convex': 20,
		'right-bottom-convex': 23,
		'left-top-concave': 2,
		'right-top-concave': 3,
		'left-bottom-concave': 6,
		'right-bottom-concave': 7,
		'up-left-side': 9,
		'up-right-side': 10,
		'right-up-side': 15,
		'right-down-side': 19,
		'down-left-side': 21,
		'down-right-side': 22,
		'left-up-side': 12,
		'left-down-side': 16
	}
}

var tileMaps = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
			   1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			   0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 6, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
loadTileMap(tileMaps);
console.log(tileMaps);
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
	paintTile();
	for (var layer = 0; layer < tileMaps.length; layer++) {
		var tileMap = tileMaps[layer];
		var tileMapSize = tileMap.length;
		for (var i = 0; i < tileMapSize; i++) {
			currentTileX = xStart + (TILE_SIZE * (i % hn));
			currentTileY = yStart + (TILE_SIZE * Math.floor(i / hn));
			if (tileMap[i] % 2 == 0) {
				var tileNeighbours = [tileMap[i - hn -1], tileMap[i - hn], tileMap[i - hn + 1], 
									tileMap[i - 1], tileMap[i], tileMap[i + 1],
									tileMap[i + hn - 1], tileMap[i + hn], tileMap[i + hn + 1]];

				var subTiles = getSubTiles(tileNeighbours);
				for (var j = 0; j < 4; j++) {

					SpriteSheet.drawAutoTile(ctx, tileMap[i], 
											currentTileX + AUTOTILE_SIZE * (j % 2), 
											currentTileY + AUTOTILE_SIZE * Math.floor(j / 2), 
											subTiles[j], 0);
					// Draw subtiles mtx
					var subTilesText = '(' + subTiles[0] + ',' + subTiles[1] + ',' 
										+ subTiles[2] + ',' + subTiles[3] + ')';
					var textWidth = ctx.measureText(subTilesText).width;
					ctx.font = 'normal bold 8pt courier';
					// ctx.fillText(subTilesText, xStart + currentTileX, yStart + currentTileY - 10);
				}
			}
			else {
				SpriteSheet.draw(ctx, tileMap[i], currentTileX, currentTileY, 0);
			}
		}
	}

	// SpriteSheet.draw(ctx, 2, xStart + TILE_SIZE * 0, yStart + TILE_SIZE * 0, 0);
	
	if (showGrid) {
		// drawGrid(GRID_SIZE, true);
		// drawGrid(AUTOTILE_SIZE, false);
		// Draw tile grid
		Debugger.drawGrid(ctx, GRID_SIZE, xStart, yStart, hn, vn, 0.5, true);
		// Draw auto tile grid
		Debugger.drawGrid(ctx, AUTOTILE_SIZE, xStart, yStart, hn * 2, vn * 2, 0.3, false);
		getCurrentTileID();
	}
	if (showFPS) {
		Debugger.drawFPS(ctx, time);
	}
}

function cleanBackground() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.fillStyle = CANVAS_BACKGROUNDS;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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

		drawTileID(cursorX, cursorY);
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

// 'left-top-convex': 8,
// 'right-top-convex': 11,
// 'left-bottom-convex': 20,
// 'right-bottom-convex': 23,
// 'left-top-concave': 2,
// 'right-top-concave': 3,
// 'left-bottom-concave': 6,
// 'right-bottom-concave': 7,
// 'up-left-side': 9,
// 'up-right-side': 10,
// 'right-up-side': 15,
// 'right-down-side': 19,
// 'down-left-side': 21,
// 'down-right-side': 22,
// 'left-up-side': 12,
// 'left-down-side': 16

function getSubTiles(tileNeighbours) {
	var tileMainID = tileNeighbours[4];
	var subTiles = [tileMainID, tileMainID, tileMainID, tileMainID];
	// left top subtile
	if (tileNeighbours[3] == tileMainID) {
		if (tileNeighbours[1] == tileMainID) {
			if (tileNeighbours[0] == tileMainID) {
				subTiles[0] = 13;
			}
			else {
				subTiles[0] = 2;
			}
		}
		else {
			subTiles[0] = 9;
		}
	}
	else {
		if (tileNeighbours[1] == tileMainID) {
			subTiles[0] = 16;
		}
		else {
			subTiles[0] = 8;
		}
	}
	
	// right top subtile
	if (tileNeighbours[5] == tileMainID) {
		if (tileNeighbours[1] == tileMainID) {
			if (tileNeighbours[2] == tileMainID) {
				subTiles[1] = 14;
			}
			else {
				subTiles[1] = 3;
			}
		}
		else {
			subTiles[1] = 10;
		}
	}
	else {
		if (tileNeighbours[1] == tileMainID) {
			subTiles[1] = 15;
		}
		else {
			subTiles[1] = 11;
		}
	}

	// left bottom subtile
	if (tileNeighbours[7] == tileMainID) {
		if (tileNeighbours[3] == tileMainID) {
			if (tileNeighbours[6] == tileMainID) {
				subTiles[2] = 17;
			}
			else {
				subTiles[2] = 6;
			}
		}
		else {
			subTiles[2] = 16;
		}
	}
	else {
		if (tileNeighbours[3] == tileMainID) {
			subTiles[2] = 21;
		}
		else {
			subTiles[2] = 20;
		}
	}

	// right bottom subtile
	if (tileNeighbours[5] == tileMainID) {
		if (tileNeighbours[7] == tileMainID) {
			if (tileNeighbours[8] == tileMainID) {
				subTiles[3] = 18;
			}
			else {
				subTiles[3] = 7;
			}
		}
		else {
			subTiles[3] = 22;
		}
	}
	else {
		if (tileNeighbours[7] == tileMainID) {
			subTiles[3] = 19;
		}
		else {
			subTiles[3] = 23;
		}
	}

	return subTiles;
}


function paintTile() {
	var isDown = false;
	var isPainting = false;
	
	// console.log(canvasBoundary);
	canvas.addEventListener('mousedown', function(e) {
		isDown = true;
		isPainting = true;
		if (isPainting) {
			updateTileMap(e);
		}
	})

	canvas.addEventListener('mousemove', function(e) {
		if (isDown) {
			isPainting = true;
		}
		if (isPainting) {
			updateTileMap(e);
		}
	})

	canvas.addEventListener('mouseup', function(e) {
		isDown = false;
		isPainting = false;
	})
}

function updateTileMap(e) {
	var canvasBoundary = canvas.getBoundingClientRect();
	var clientX = e.clientX;
	var clientY = e.clientY;
	cursorX = clientX - canvasBoundary.x;
	cursorY = clientY - canvasBoundary.y;
	if (typeof(cursorX) != 'undefined' || typeof(cursorY) != 'undefined') {
		var tileID = getTileID(cursorX, cursorY);
		tileMaps[0][tileID[1] * hn + tileID[0]] = 2;
	}
}

function loadTileMap(mapDataSource) {
	var mapData = JSON.parse(JSON.stringify(mapDataSource));
	for (var layer = 0; layer < mapData.length; layer++) {
		var tileMap = mapData[layer];
		var tileMapSize = tileMap.length;
		for (var i = 0; i < tileMapSize; i++) {
			if (tileMap[i] > 1) {
				var tileNeighbours = [tileMap[i - hn -1], tileMap[i - hn], tileMap[i - hn + 1], 
									tileMap[i - 1], tileMap[i], tileMap[i + 1],
									tileMap[i + hn - 1], tileMap[i + hn], tileMap[i + hn + 1]];

				var subTiles = getSubTiles(tileNeighbours);
				subTiles.unshift(tileMap[i]);
				tileMap[i] = subTiles;
			}
			else {
				tileMap[i] = [tileMap[i]];
			}
		}
	}
	console.log(mapData);
	return mapData;
}