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
		ctx.fillStyle = 'rgba(155, 100, 20, 0.8)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 2*Math.PI, 0, false);
		// ctx.stroke();
		ctx.fill();
	}
}

function cleanBackground() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.fillStyle = CANVAS_BACKGROUNDS;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGrid() {
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
			var gridFontSize = 10;
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
var previousFrameTime;
function drawFPS(time) {
	var FPS = Math.floor(1000 / (time - previousFrameTime));
	previousFrameTime = time;
	ctx.fillStyle = 'rgba(255, 0, 0, 1)';
	ctx.font = 'normal bold 1.5em courier';
	ctx.fillText(FPS, 10, 20);
}