import Object2D from "./Object2D.js";

class ClipCanvas {
	constructor(regl) {
		this.regl = regl;
		this.canvas = document.createElement("canvas")
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.texture = this.regl.texture(this.canvas)
		this.ctx = this.canvas.getContext('2d')
		this.ressource = [];

		this.decal = 0;

		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.draw();
		});


		this.loadResource();
		this.draw();
		
	}

	loadResource(){
		this.arrow = new Object2D({
			width: 140*1.19,
			height: 140,
			source: '/images/arrow-left.png',
			type: "img",
			name: "arrow"
		})
	}

	cleanCanvas(){
		this.ressource = [];
		this.canvas.width = this.canvas.width+1;
		this.draw();
		this.canvas.width = this.canvas.width-1;
	}

	displayArrow(direction){

		this.cleanCanvas();

		var w = window.innerWidth;
		var h = window.innerHeight;
		this.arrow.scale = 1;

		switch(direction) {
			case "left" : this.arrow.updateMatrix([30, h/2], 	0, 			[0, 0.5]); break;
			case "top" : this.arrow.updateMatrix([w/2, 30], 		Math.PI/2, 	[0, 0.5]); break;
			case "bottom" : this.arrow.updateMatrix([w/2, h - 30], 	-Math.PI/2, [0, 0.5]); break;
			case "right" : this.arrow.updateMatrix([w - 30, h/2], 	Math.PI, 	[0, 0.5]); break;
			case "none" : this.arrow.updateMatrix([w, h], 		Math.PI, 	[1, 0.5]); break;
		}

		this.ressource.push(this.arrow);
		this.draw();
	}



	draw(){
		this.ctx.restore();
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.fillStyle = "black";
		for(var i=0; i<this.ressource.length; i++){
			this.ressource[i].draw(this.ctx);
		}
	    this.texture = this.regl.texture(this.canvas)
	}

	render() {
		// this.decal += 5;
		// this.decal = this.decal % window.innerWidth;
		// this.draw();
	}
}
export default ClipCanvas;