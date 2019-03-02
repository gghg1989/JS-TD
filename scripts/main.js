window.onload = init;

const 	CANVAS_WIDTH = 500,
		CANVAS_HEIGHT = 400,
		GRID_SIZE = 32,
		CANVAS_BACKGROUNDS = 'rgba(0, 44, 55, 0.5)';

var vn = Math.floor(CANVAS_WIDTH / GRID_SIZE);
var hn = Math.floor(CANVAS_HEIGHT / GRID_SIZE);
var xStart = (CANVAS_WIDTH - (GRID_SIZE * vn)) / 2;
var yStart = (CANVAS_HEIGHT - (GRID_SIZE * hn)) / 2;
var canvas, ctx, ball;

// Debug switch
var showFPS = true;
var showGrid = true;

function init() {
	canvas = document.getElementById('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvas.style.backgroundColor = CANVAS_BACKGROUNDS;
	
	ctx = canvas.getContext('2d');

	ball = new Ball();

	animate();
}

function animate(time) {
	requestAnimationFrame(animate);
	cleanBackground();
	if (showGrid) {
		drawGrid();
		getCurrentTileID();
	}
	if (showFPS) {
		drawFPS(time);
	}
	ball.update();
}

function Ball() {
	this.x = Math.random()*CANVAS_WIDTH;
	this.y = Math.random()*CANVAS_HEIGHT;
	
	this.r = Math.random()*10 + 15;

	this.update = function() {
		this.dx = Math.random()*6 - 3;
		this.dy = Math.random()*6 - 3;
		this.x += this.dx;
		this.y += this.dy;
		this.render();
	}

	this.render = function() {
		// ctx.strokeStyle = 'rgba(155, 100, 20, 0.8)';
		ctx.fillStyle = 'rgba(155, 100, 20, 0.5)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 2*Math.PI, 0, false);
		// ctx.stroke();
		ctx.fill();

		// Draw tile id
		drawTileID(this.x, this.y);
		// ctx.fillStyle = 'rgba(0, 0, 255, 1)';
		// ctx.font = 'normal bold 1em courier';
		// ctx.fillText('('+ballTileId[0]+', '+ballTileId[1]+')', this.x, this.y);
	}

}

function cleanBackground() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.fillStyle = CANVAS_BACKGROUNDS;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGrid() {
	var gridFontSize = 10;
	for (var i = 0; i <= vn; i++) {
		var xOfLine = xStart + (GRID_SIZE * i);
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.beginPath();
		ctx.moveTo(xOfLine, 0);
		ctx.lineTo(xOfLine, CANVAS_HEIGHT);
		ctx.stroke();
	}
	for (var i = 0; i <= hn; i++) {
		var yOfLine = yStart + (GRID_SIZE * i);
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.beginPath();
		ctx.moveTo(0, yOfLine);
		ctx.lineTo(CANVAS_WIDTH, yOfLine);
		ctx.stroke();
	}

	for (var i = 0; i < vn; i++) {
		for (var j = 0; j < hn; j++) {
			var gridCoord = i+", "+j;
			ctx.font = gridFontSize + "px Arial";
			var textWidth = ctx.measureText(gridCoord).width;
			var textHeight = gridFontSize;
			var xOfText = xStart + (GRID_SIZE * i) + (GRID_SIZE / 2) - (textWidth / 2);
			var yOfText = yStart + (GRID_SIZE * j) + (GRID_SIZE / 2) + (textHeight / 2);
			ctx.fillText(gridCoord, xOfText, yOfText);
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
		ctx.font = 'normal bold 1.5em courier';
		ctx.fillText('('+tileID[0]+', '+tileID[1]+')', 10, 40);
		highlightTile(tileID[0], tileID[1]);
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