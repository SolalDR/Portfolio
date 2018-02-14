
import config from "./config";
import Polygon from "./helpers/polygon";
import Object2D from "./helpers/object2D";
import Cursor from "./background/Cursor.js"
import Wave from "./background/Wave.js"
import ClipCanvas from "./background/ClipCanvas.js";
import ScrollController from "./background/ScrollController.js";
import bgVertex from "./../shaders/background.vert";
import bgFragment from "./../shaders/background.frag";
import * as REGL from "regl"


class Background {

	constructor() {
		// Animation datas
		this.elapsedTime = 0;
		this.now = Date.now();
		this.scrollController = new ScrollController();
		this.endRaf = Date.now() + 1000;

		this.animationStart = 0;
		
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

		// Loop and compute each point position
		for(var i=0; i<nW; i++)
		for(var j=0; j<nH; j++)
			this.points.push([ 
				i*config.bg.precision/calcW * 2 - 1, 
				j*config.bg.precision/calcH * 2 - 1 
			]);


		// The buffers
		var bufferLocalPosition = [];
		var bufferPosition = [];
		var animationDelay = [];
		var animationDuration = [];
		var weights = [];

		var delay, weight, duration; 

		// Loop in each point and compute buffers
		for(var i=0; i<this.points.length; i++){
			// The position of each vertex in instance geometry
			bufferLocalPosition.push(
				[geometry[0].x, geometry[0].y],
				[geometry[1].x, geometry[1].y],
				[geometry[2].x, geometry[2].y]
			);

			delay = Math.random()*500 + 400;
			animationDelay.push( delay, delay, delay)
		
			duration = Math.random()*300 + 200;
			animationDuration.push(duration, duration, duration)

			weight =  Math.random()*6+3;
			weights.push(weight, weight, weight)

			// The position of instance
			bufferPosition.push( this.points[i], this.points[i], this.points[i] );
		}

		// Store mesh info
		this.meshInfo = {
			position: bufferPosition,
			localPosition: bufferLocalPosition,
			delays: animationDelay,
			durations: animationDuration,
			weights : weights
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

	smoothScroll(vector){
		this.scrollController.scroll(vector, {
			duration: config.anim.scroll
		});

		this.updateUntil( config.anim.scroll);
	}


	/************************* UPDATES *******************/


	// Create a new drawCommand 
	updateDrawCommand(){
		setTimeout(() => {
			this.computeMesh();
			this.drawTriangle = this.regl({
				frag: bgFragment, vert: bgVertex,
				attributes: { 	position: this.meshInfo.position, 
								localPosition: this.meshInfo.localPosition,
								delay: this.meshInfo.delays,
								duration: this.meshInfo.durations,
								weight: this.meshInfo.weights },
				uniforms: {
					time: () => { return this.elapsedTime },
					start: () => { return this.animationStart },
					mouse: () => {  return this.cursor.vertexPosition },
					waveCoords: () => { return this.wave.coords },
					waveRadius: () => { return this.wave.radius },
					waveWeight: () => { return this.wave.config.weight },
					waveStrength: () => { return this.wave.strength },
					scroll: () => { return this.scrollController.coords },
					ratio: () => { return this.ratio },
					texture: () => { return this.clipCanvas.texture},
					boundaries: () => { return [window.innerWidth, window.innerHeight] } ,
				},
				count: this.meshInfo.position.length
			})
		}, 100)
	}

	launchAnimation(){
		this.animationStart = this.elapsedTime;
	}

	render(){
		var now = Date.now();

		this.elapsedTime += now - this.now;
		this.now = now;
		if( this.needUpdate && this.drawTriangle ){
			this.regl.clear({color: [0.04, 0.04, 0.04, 1.]})

			this.clipCanvas.render();
			this.drawTriangle();

			this.wave.update();
			this.cursor.update();
		} 

		this.scrollController.render(now);
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
		this.clipCanvas = new ClipCanvas(this.regl);
		this.updateDrawCommand();
		
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