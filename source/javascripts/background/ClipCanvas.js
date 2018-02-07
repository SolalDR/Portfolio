
class ClipCanvas {
	constructor(regl) {
		var canvas = document.createElement("canvas")
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		var ctx = canvas.getContext('2d')
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height)
	    ctx.fillStyle = "black";
	    ctx.beginPath();
	    ctx.moveTo(100, 50);
	    ctx.lineTo(350, 250);
	    ctx.lineTo(350, 50);
	    ctx.fill();
		this.texture = regl.texture(canvas)

		// document.body.appendChild(canvas);
	}
}

export default ClipCanvas;