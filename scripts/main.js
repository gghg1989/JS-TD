window.onload = init;

const 	CANVAS_WIDTH = 500,
		CANVAS_HEIGHT = 400,
		CANVAS_BACKGROUNDS = 'rgba(0, 44, 55, 0.5)';
var canvas, ctx, ball;

function init() {
	canvas = document.getElementById('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvas.style.backgroundColor = CANVAS_BACKGROUNDS;
	
	ctx = canvas.getContext('2d');

	ball = new Ball();

	animate();
}

function animate() {
	requestAnimationFrame(animate);
	cleanBackground()
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