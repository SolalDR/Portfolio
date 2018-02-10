window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;



export default {

	init: function(ctx){
		this.ctx = ctx;
		this.ctx.bg.clipCanvas.displayArrow("left");

		this.projectsFrame = document.querySelectorAll(".projects__item-frame");
		this.projects = document.querySelectorAll(".projects__item");
		for(var i=0; i<this.projects.length; i++){
			this.moverEvent(this.projects[i], this.projectsFrame[i]);
		}
	},

	moverEvent: function(el, elFrame){

		var wrap = elFrame; 
		var x = 0; 
		var y = 0;
		var raf;
		var intensity = 3000;

		var render = function(){
			var xClauth = false;
			var yClauth = false;
			var speed = 0.05;
			var dist = 0.05;

			if ( Math.abs(x) > dist ){
				if( x < 0 ){
					x += speed;
				} else {
					x -= speed
				}
			} else {
				xClauth = true
			}

			if ( Math.abs(y) > dist ){
				if( y < 0 ){
					y += speed;
				} else {
					y -= speed
				}
			} else {
				yClauth = true
			}

			if( xClauth && yClauth ){
				cancelAnimationFrame(raf);
				return; 
			} 


			elFrame.setAttribute("style", `transform: matrix3d(1,0,0.00, ${x/intensity},0.00,1, 0.00, ${y/intensity},0,0,1,0,0,0,0,1)`) 
			raf = requestAnimationFrame(render);
		}
		

		
		el.addEventListener("mouseleave", function(e) {
			
			raf = requestAnimationFrame(render);
		})


		el.addEventListener("mousemove", function(e) {
			var w = el.offsetWidth;
			var h = el.offsetHeight;
			var center = w / 2;
			var middle = h / 2;
			
		    x = e.clientX - el.offsetLeft; 
		    y = e.clientY - el.offsetTop;

			var gradientX = 1 - (x / w);
			var gradientY = 1 - (y / h);
			
			if(x < center) {
				x = 1 - (x / center);
				x = -x;
			}else {
				x = (x - center)/center; 
			}
			
			if(y < middle) {
				y = 1 - (y / middle);
				y = -y;
			}else {
				y = (y - middle)/middle; 
			}

				
			elFrame.setAttribute("style", `transform: matrix3d(1,0,0.00, ${x/intensity},0.00,1, 0.00, ${y/intensity},0,0,1,0,0,0,0,1)`) 
		});

	
	}

		// });	
		// el.addEventListener("mouseenter", (e) => {
		// 	// console.log('Mouseenter')
		// 	this.raf = requestAnimationFrame(this.render.bind(this));
		// 	var reg = /rotate3d\((\d)\,(\d)\,(\d)\,.+?\)/
		// 	var style = el.getAttribute("style") ? el.getAttribute("style") : "";

		// 	this.current = style.match(reg);
		// 	if(this.current === null) {
		// 		this.current = [0, 0, 0];
		// 	}
		// 	this.targetEl = el;
		// 	this.target = {
		// 		x: e.layerX/el.offsetWidth * 2 - 1,
		// 		y: e.layerX/el.offsetHeight * 4 - 2
		// 	}

		// 	if( !el.className.match("projects__item--hover")){
		// 		el.className += " projects__item--hover";	
		// 	}
		// });

		// // var target = 
		// el.addEventListener("mousemove", (e) => {
		// 	// console.log('Mousemove')
		// 	this.target = {
		// 		x: (e.layerX/el.offsetWidth * 2 - 1) * 30,
		// 		y: -1 * (e.layerY/el.offsetHeight * 2 - 1) * 30
		// 	}
		// })


		// el.addEventListener("mouseleave", (e) => {
		// 	// console.log('Mouseleave')
		// 	cancelAnimationFrame(this.raf)
		// 	this.targetEl = null;
		// 	this.target = null;
		// 	if( el.className.match("projects__item--hover")){
		// 		el.className = el.className.replace("projects__item--hover");	
		// 	}
		// 	el.style = `transform: rotate3d(0,0,0,10deg)`
		// })

	// render: function(){
	// 	// console.log("render")
	// 	if( this.targetEl ){
	// 		// this.current[0] += (this.target.x - this.current[0]) * 0.1; 
	// 		// this.current[1] += (this.target.y - this.current[1]) * 0.1;
	// 		// this.current[0] = this.target.x
	// 		// this.current[1] = this.target.y
	// 		this.targetEl.style = `transform: rotateX(${this.target.y}deg) rotateY(${this.target.x}deg)`
	// 		// console.log(this.current)
	// 	}
	// 	this.raf = requestAnimationFrame(this.render.bind(this));
	// }
}