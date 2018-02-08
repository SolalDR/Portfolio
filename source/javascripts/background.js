
import config from "./config";
import Polygon from "./polygon";
import Object2D from "./object2D";
import Cursor from "./background/Cursor.js"
import Wave from "./background/Wave.js"
import ClipCanvas from "./background/ClipCanvas.js";
import bgVertex from "./../shaders/background.vert";
import bgFragment from "./../shaders/background.frag";
import * as REGL from "regl"


class Background {

	constructor() {
		// Animation datas
		this.time = 0;
		this.scrollPercent = 0;
		this.endRaf = Date.now() + 1000;
		
		// Some features
		this.cursor = new Cursor();
		this.wave = new Wave(this.cursor);
		
		// Init WebGL context and launch frame
		this.initRegl();
		this.regl.frame(this.render.bind(this));

		// Init Events
		this.initEvents();
	}


	get needUpdate(){
		this.now = Date.now();
		return this.now < this.endRaf;
	}


	/************************* HELPERS *******************/

	// Set boundaries (window.innerWidth, window.innerHeight, ratio)
	computeSize(){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ratio = 1/(this.canvas.width/this.canvas.height);	
	}

	// Compute vertex / face, define attributes
	computeMesh(){

		// Number of point in width and height
		let nW = Math.floor(window.innerWidth / config.bg.precision) + 1;
		let nH = Math.floor(window.innerHeight / config.bg.precision) + 1;

		// Total width and height for faces
		let calcW = nW * config.bg.precision; 
		let calcH = nH * config.bg.precision; 


		this.points = [];
			
		// Compute the scaled size of a particule and create geometry
		let wParticule = 1/window.innerWidth*2
		let hParticule = 1/window.innerHeight*2
		let geometry =  new Polygon(3, wParticule, hParticule).points;
		
		// Offset
		let offsetX = 1 - (nW - 1) * config.bg.precision/calcW
		let offsetY = 1 - (nH - 1) * config.bg.precision/calcH

		// Loop and compute each point position
		for(var i=0; i<nW; i++) {
			for(var j=0; j<nH; j++) {
				this.points.push(new Object2D({
					geometry: geometry,
					position: { 
						x: i*config.bg.precision/calcW * 2 - 1, 
						y: j*config.bg.precision/calcH * 2 - 1
					},
					rotation: -Math.PI/2
				}));
			}
		}

		// The buffers
		var bufferLocalPosition = [];
		var bufferPosition = [];

		// Loop in each point and compute buffers
		var x, y; 
		for(var i=0; i<this.points.length; i++){
			x = this.points[i].position.x; y = this.points[i].position.y; 
			
			// The position of each vertex in instance geometry
			bufferLocalPosition.push(
				[geometry[0].x, geometry[0].y],
				[geometry[1].x, geometry[1].y],
				[geometry[2].x, geometry[2].y]
			);

			// The position of instance
			bufferPosition.push( [x, y], [x, y], [x, y] );
		}

		// Store mesh info
		this.meshInfo = {
			position: bufferPosition,
			localPosition: bufferLocalPosition,
			offsetX: offsetX,
			offsetY: offsetY
		}
	
	}


	// Enable raf for a duration
	updateUntil(duration){
		if( !duration ){
			var duration = 100;
		}
		this.now = Date.now();
		if( this.now + duration > this.endRaf ){
			this.endRaf = this.now + duration; 
		}
	}


	/************************* UPDATES *******************/


	// Create a new drawCommand 
	updateDrawCommand(){
		setTimeout(() => {
			this.computeMesh();
			this.drawTriangle = this.regl({
				frag: bgFragment, vert: bgVertex,
				attributes: { 	position: this.meshInfo.position, 
								localPosition: this.meshInfo.localPosition },
				uniforms: {
					time: () => { return this.time },
					mouse: () => { return this.cursor.scaledPosition },
					waveCoords: () => { return this.wave.coords },
					waveRadius: () => { return this.wave.radius },
					waveStrength: () => { return this.wave.strength },
					scroll: () => { return [this.scrollPercent, this.scrollPercent] },
					ratio: () => { return this.ratio },
					offset: () => { return [this.meshInfo.offsetX, this.meshInfo.offsetY] },
					texture: () => { return this.clipCanvas.texture},
					boundaries: () => { return [window.innerWidth, window.innerHeight] } ,
				},
				count: this.meshInfo.position.length
			})
		}, 100)
	}


	render(){
		if( this.needUpdate && this.drawTriangle ){
			this.time += 0.05;

			this.clipCanvas.render();
			this.drawTriangle();

			this.wave.update();
			this.cursor.update();
		} 
	}

	/************************* INITIALISATION *******************/

	// Init the WebGL context and the background canvas
	initRegl(){
		this.canvas = document.querySelector("#bg-canvas");
		this.computeSize();
		this.regl = REGL({
		  canvas: this.canvas, 
		  pixelRatio: window.innerHeight/window.innerHeight
		});
		
		this.updateDrawCommand();
		this.clipCanvas = new ClipCanvas(this.regl);
	}

	// Init Dom events
	initEvents(){
		window.addEventListener("resize", () => {
			this.computeSize();
			this.updateDrawCommand()		
		});

		window.addEventListener("mousemove", (e) => {
			this.cursor.move({ x: e.clientX, y: e.clientY });
			this.updateUntil(1500);
		});

		window.addEventListener("click", (e) => {
			var current = Date.now();
			var isRunning = this.wave.run(current);
			if( isRunning ){
				this.updateUntil(500);
			}
		});
	}
}

export default Background;