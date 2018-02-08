
// class ClipCanvas {
// 	constructor(regl) {
// 		var canvas = document.createElement("canvas")
// 		canvas.width = window.innerWidth;
// 		canvas.height = window.innerHeight;
// 		var ctx = canvas.getContext('2d')
// 		ctx.fillStyle = "white";
// 		ctx.fillRect(0, 0, canvas.width, canvas.height)
// 	    ctx.fillStyle = "black";
// 	    ctx.beginPath();
// 	    ctx.moveTo(100, 50);
// 	    ctx.lineTo(350, 250);
// 	    ctx.lineTo(350, 50);
// 	    ctx.fill();
// 		this.texture = regl.texture(canvas)

// 		// document.body.appendChild(canvas);
// 	}

// 	draw(){

// 	}

// 	render() {

// 	}
// }

// export default ClipCanvas;



class ClipCanvas {
	constructor(regl) {
		this.regl = regl;
		this.canvas = document.createElement("canvas")
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext('2d')
		this.draw();
		// this.texture = regl.texture(this.ctx)
		this.decal = 0;

		
		document.body.appendChild(this.canvas);
	}

	draw(){
		this.ctx.restore();
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
	    this.ctx.fillStyle = "black";
	    this.ctx.beginPath();
	    this.ctx.moveTo(this.decal + 100, 50);
	    this.ctx.lineTo(this.decal + 350, 250);
	    this.ctx.lineTo(this.decal + 350, 50);
	    this.ctx.fill();
	    this.texture = this.regl.texture(this.canvas)
	}

	render() {
		this.decal += 5;
		this.decal = this.decal % window.innerWidth;
		this.draw();
	}
}
export default ClipCanvas;