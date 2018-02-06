
import config from "./config";
import Polygon from "./polygon";
import Object2D from "./object2D";
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

import * as REGL from "regl"

const LIGHT_MODE = false; 

class Background {


	constructor() {
		this.canvas = document.querySelector("#bg-canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		// this.mouseCoord = [-1000, -1000];

		this.cursor = document.getElementById("cursor");
		// this.cursor = {
		// 	el: document.getElementById("cursor"),
		// 	position: [window.innerWidth/2, window.innerHeight/2]
		// }
		this.scrollPercent = 0;
		this.cursorPosition = [window.innerWidth/2, window.innerHeight/2]; 
		var canvas = this.canvas;
		// Initialize the GL context
		
		this.drawTriangle = null;
		this.time = 0;
		this.endRaf = Date.now() + 1000;

		this.regl = REGL({
		  canvas: canvas, 
		  pixelRatio: window.innerHeight/window.innerHeight
		});

		this.cursorPosition = { x: 0, y: 0 }
		this.cursorExpectedPosition = { x: 0, y: 0 }

		this.cursorPositionScaled = [0, 0]
		this.wave = { coords: [this.cursorPosition.x, this.cursorPosition.y], radius: 0, speed: 20, strength: 0, needsUpdate: false, start: 0 };

		this.updateDrawCommand(0);
		this.regl.frame(this.render.bind(this));

		this.initEvents();
	}


	compute(){
		let nW = Math.floor(window.innerWidth / config.bg.precision) + 1;
		let nH = Math.floor(window.innerHeight / config.bg.precision) + 1;

		let calcW = nW * config.bg.precision; 
		let calcH = nH * config.bg.precision; 


		this.points = [];
		
		var wParticule = 1.5/window.innerWidth*2
		var hParticule = 1.5/window.innerHeight*2
		var geometry =  new Polygon(3, wParticule, hParticule).points;
		
		var offsetX = 1 - (nW - 1) * config.bg.precision/calcW
		var offsetY = 1 - (nH - 1) * config.bg.precision/calcH

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


		var bufferLocalPosition = [];
		var bufferPosition = [];
		var clientPosition = [];
		var x, y; 
		for(var i=0; i<this.points.length; i++){
			x = this.points[i].position.x; 
			y = this.points[i].position.y; 
			
			bufferLocalPosition.push(
				[geometry[0].x, geometry[0].y],
				[geometry[1].x, geometry[1].y],
				[geometry[2].x, geometry[2].y]
			);
			bufferPosition.push( [x, y], [x, y], [x, y] );
			
			clientPosition.push(
				[ (x+geometry[0].x+1)/2*calcW, (y+geometry[0].y+1)/2*calcH ], 
				[ (x+geometry[1].x+1)/2*calcW, (y+geometry[1].y+1)/2*calcH ], 
				[ (x+geometry[2].x+1)/2*calcW, (y+geometry[2].y+1)/2*calcH ] 
			);

		}

		this.meshInfo = {
			position: bufferPosition,
			localPosition: bufferLocalPosition,
			sPosition: clientPosition,
			offsetX: offsetX,
			offsetY: offsetY
		}
	
	}

	updateDrawCommand(){
		setTimeout(() => {
		this.compute();
		this.drawTriangle = this.regl({
			frag: `
				void main() {
					gl_FragColor = vec4(0.5, 0.5, 0.5, 1);
				}`,

			vert: `
				uniform vec2 mouse;
				
				uniform vec2 waveCoords;
				uniform float waveRadius;
				uniform float waveStrength;
	
				uniform vec2 scroll; 
				uniform vec2 offset;

				uniform vec2 boundaries;

				attribute vec2 position;
				attribute vec2 localPosition;
				attribute vec2 sPosition;
				
				void main() {
					
					vec2 newPosition = position + offset;

					newPosition.y = mod(position.y + scroll.y, 2.) - 1.;


					float intensityMouse = 1. - min(1., distance(mouse, newPosition)/0.2);
					float intensityWave = waveStrength * 2. * (1. - min(1., abs(distance(waveCoords, newPosition) - waveRadius) / 0.3)) ;
					
					newPosition += localPosition * (1. + intensityMouse*1.5 + intensityWave);
					newPosition += localPosition;

					gl_Position = vec4(newPosition, 0, 1);	
				}
				`,

		  attributes: {
		    position: this.meshInfo.position,
		    localPosition: this.meshInfo.localPosition,
		    sPosition: this.meshInfo.sPosition
		  },

		  uniforms: {
		  	time: () => { return this.time },
		  	mouse: () => { return this.cursorPositionScaled },
		  	waveCoords: () => { return this.wave.coords },
		  	waveRadius: () => { return this.wave.radius },
		  	waveStrength: () => { return this.wave.strength },
		  	scroll: () => { return [0, this.scrollPercent] },
		  	offset: () => { return [this.meshInfo.offsetX, this.meshInfo.offsetY] }
		  },

		  count: this.meshInfo.position.length
		})
		}, 100)
	
	}


	updateUntil(duration){
		if( !duration ){
			var duration = 100;
		}
		this.now = Date.now();
		if( this.now + duration > this.endRaf ){
			this.endRaf = this.now + duration; 
		}
	}

	onMouseMove(e) {
		// this.mouseCoord[0] = e.clientX;
		// this.mouseCoord[1] = window.innerHeight - e.clientY;

		this.cursorExpectedPosition = {
			x: e.clientX,
			y: e.clientY
		}

		this.updateUntil(1500);
	}

	toShaderScale(coord){
		return [
			coord.x / window.innerWidth * 2 - 1,
			coord.y / window.innerHeight * 2 - 1 
		];
	}

	runWave(current){
		if( current - this.wave.start > 700 ) {
			this.wave = {
				coords: this.toShaderScale({ x: this.cursorPosition.x,  y: window.innerHeight - this.cursorPosition.y }),
				radius: 0,
				speed: 0.05,
				strength: 1,
				needsUpdate: true,
				start: current
			};
		} 
		this.updateUntil(500);
	}

	runCursorBounce(){
		this.cursor.className += " clicked"
		setTimeout(() => {
			this.cursor.className = this.cursor.className.replace("clicked", "");
		}, 1000)
		this.updateUntil(300);
	}


	render(){
		this.now = Date.now();

		if( this.now < this.endRaf || !this.drawTriangle ){
			this.time += 0.05;
			this.drawTriangle();

			this.wave.radius += this.wave.speed;
			this.wave.strength = Math.max(0, this.wave.strength-0.04);

			this.cursorPosition = {
				x: this.cursorPosition.x  + (this.cursorExpectedPosition.x - this.cursorPosition.x) * 0.1,
				y: this.cursorPosition.y  + (this.cursorExpectedPosition.y - this.cursorPosition.y) * 0.1
			}

			this.cursorPositionScaled = this.toShaderScale({
				x: this.cursorPosition.x,
				y: window.innerHeight - this.cursorPosition.y
			});

			this.cursor.style = `transform: translate3d(${this.cursorPosition.x - 10}px, ${this.cursorPosition.y - 10}px, 0) scale(1)`
		} 
	}


	initEvents(){
		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.updateDrawCommand()		
		} );
		window.addEventListener("mousemove", this.onMouseMove.bind(this));

		window.addEventListener("click", (e) => {
			var current = Date.now();
			this.runWave(current);
			this.runCursorBounce();
		})
	}
}

export default Background;