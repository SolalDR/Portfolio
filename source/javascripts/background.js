
import config from "./config";
import Polygon from "./polygon";
import Object2D from "./object2D";
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

import * as REGL from "regl"
import Cursor from "./background/Cursor.js"

const LIGHT_MODE = false; 

class Background {


	constructor() {
		this.canvas = document.querySelector("#bg-canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.ratio = this.canvas.width/this.canvas.height;
		this.cursor = new Cursor();

		this.scrollPercent = 0;
		var canvas = this.canvas;
		// Initialize the GL context
		
		this.drawTriangle = null;
		this.time = 0;
		this.endRaf = Date.now() + 1000;

		this.regl = REGL({
		  canvas: canvas, 
		  pixelRatio: window.innerHeight/window.innerHeight
		});

		this.wave = { coords: [this.cursor.position.x, this.cursor.position.y], radius: 0, speed: 20, strength: 0, needsUpdate: false, start: 0 };


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
		this.imageTexture = this.regl.texture(canvas)

		document.body.appendChild(canvas);

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
		
		var wParticule = 1/window.innerWidth*2
		var hParticule = 1/window.innerHeight*2
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
				precision mediump float;

				varying vec2 uv;
				uniform sampler2D texture;
				// uniform vec2 boundaries;

				void main() {
					vec2 trueUV = vec2(0.);
					
					trueUV.x = (uv.x + 1.) / 2.;
					trueUV.y =  (uv.y + 1.) / 2. * -1. + .5;

					vec4 textureLocal = texture2D(texture, trueUV);
					if(textureLocal.xy == vec2(0., 0.)) {
						gl_FragColor = vec4(1.0, 0., 0., 1);
					} else {
						gl_FragColor = vec4(0.5, 0.5, 0.5, 1);
					}
				}`,

			vert: `
				uniform vec2 mouse;
				
				uniform vec2 waveCoords;
				uniform float waveRadius;
				uniform float waveStrength;
	
				uniform float ratio;
	
				uniform vec2 scroll; 
				uniform vec2 offset;

				uniform vec2 boundaries;

				attribute vec2 position;
				attribute vec2 localPosition;
				attribute vec2 sPosition;
				
				varying vec2 uv;

				void main() {
						
					vec2 newPosition = position + offset;

					newPosition.y = mod(position.y + scroll.y, 2.) - 1.;
					newPosition.x = mod(position.x + scroll.x, 2.) - 1.;

					uv = position;

					float intensityMouse = 1. - min(1., distance(mouse, newPosition)/0.2);
					
					float distanceX = abs(distance(waveCoords, newPosition) - waveRadius);
					float distanceY = abs(distance(waveCoords, newPosition) - waveRadius*ratio);

					vec2 intensityWave = vec2(
						waveStrength * 2. * (1. - min(1., distanceX / 0.3)),
						waveStrength * 2. * (1. - min(1., distanceY / 0.3))
					);
					

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
		  	mouse: () => { return this.cursor.scaledPosition },
		  	waveCoords: () => { return this.wave.coords },
		  	waveRadius: () => { return this.wave.radius },
		  	waveStrength: () => { return this.wave.strength },
		  	scroll: () => { return [this.scrollPercent-= 0.01, this.scrollPercent] },
		  	ratio: () => { return this.ratio },
		  	offset: () => { return [this.meshInfo.offsetX, this.meshInfo.offsetY] },
		  	texture: () => { return this.imageTexture},
		  	boundaries: () => { return [window.innerWidth, window.innerHeight] } ,
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
		this.cursor.move({ x: e.clientX, y: e.clientY });

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
				coords: this.toShaderScale({ x: this.cursor.position.x,  y: window.innerHeight - this.cursor.position.y }),
				radius: 0,
				speed: 0.04,
				strength: 3,
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

			this.cursor.update();
		} 
	}


	initEvents(){
		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.ratio = this.canvas.width/this.canvas.height;
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