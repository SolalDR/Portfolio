window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


import Project from "./project.js"
import c from "./../config.js"

function offset(elem) {
    if(!elem) elem = this;

    var x = elem.offsetLeft;
    var y = elem.offsetTop;

    while (elem = elem.offsetParent) {
        x += elem.offsetLeft;
        y += elem.offsetTop;
    }

    return { left: x, top: y };
}


export default {

	init(ctx){

		this.ctx = ctx;
		this.ctx.bg.clipCanvas.displayArrow("left");

		this.projectsFrame = document.querySelectorAll(".projects__item-perspective");
		this.projects = document.querySelectorAll(".projects__item");
		this.projectsContainer = document.querySelectorAll(".projects__item-container");
		
		for(var i=0; i<this.projects.length; i++){	
			this.initProject(this.projects[i], this.projectsFrame[i], this.projectsContainer[i]);
		}

	},


	isProjectDisplay(el){
		if( el.className.match("projects__item-container--full") ){
			return true; 
		}
		return false;
	},

	displayProject(el, block){
		// Si miniature, on ajoute 
		if( !el.className.match("projects__item-container--full")){
			el.className += " projects__item-container--full"
			el.setAttribute("style", `top: ${window.scrollTop}px;`);
			setTimeout(() => {
				c.matrixForce = 100000
			}, 1000)
		}
		this.ctx.bg.cursor.bem.addMod("light");
	},

	hideProject(el, block){
		var position = offset(block)
		
		setTimeout(function(){
			console.log(c.matrixForce);
			c.matrixForce = 3000;
		}, 1000)
		
		el.setAttribute("style", `left: ${position.left}px; top: ${position.top}px;`);
		
		if( el.className.match("projects__item-container--full")){
			el.className = el.className.replace("projects__item-container--full", "projects__item-container--leaving");
			setTimeout(function(){
				el.className = el.className.replace("projects__item-container--leaving", "");
			}, 2000)
		}

		this.ctx.bg.cursor.bem.removeMod("light");
	},

	initProject(block, blockPerspective, blockContainer){
		this.moverEvent(block, blockPerspective);



		this.hideProject(blockContainer, block);

		var project = new Project(block, this);


		window.addEventListener("resize", () => {
			this.hideProject(blockContainer, block);
		})

		window.addEventListener("scroll", () =>{
			this.hideProject(blockContainer, block);
		})

		if( blockContainer.hasAttribute("data-current")){
			if( !this.isProjectDisplay(blockContainer)) {
				this.displayProject(blockContainer, block);
			}
		}

		block.addEventListener("click", () => {
			var slug = block.getAttribute("data-slug");
			window.history.pushState({}, "Block "+slug, "/works/"+slug+"/");
			if( !this.isProjectDisplay(blockContainer)) {
				this.displayProject(blockContainer, block);
			}
		})

		project.close.addEventListener("click", (e) => {
			window.history.pushState({}, "Works", "/works/");
			this.hideProject(blockContainer, block);
			e.stopPropagation();
			e.preventDefault();
		})

	},

	moverEvent(el, elFrame){

		var x = 0; 
		var y = 0;
		var raf;

		var render = function(){
			var xClauth = false, yClauth = false, speed = 0.05, dist = 0.05;

			if ( Math.abs(x) > dist ){
				x = x < 0 ? x + speed : x - speed;
			} else {
				xClauth = true
			}

			if ( Math.abs(y) > dist ){
				y = y < 0 ? y + speed : y - speed;
			} else {
				yClauth = true
			}


			if( xClauth && yClauth ){
				cancelAnimationFrame(raf);
				return; 
			} 

			elFrame.setAttribute("style", `transform: matrix3d(1,0,0.00, ${x/c.matrixForce},0.00,1, 0.00, ${y*2/c.matrixForce},0,0,1,0,0,0,0,1)`) 
			raf = requestAnimationFrame(render);
		}
		
		el.addEventListener("mouseleave", function(e) {
			raf = requestAnimationFrame(render);
		})

		elFrame.addEventListener("mousemove", function(e) {
			var w = elFrame.offsetWidth;
			var h = elFrame.offsetHeight;
			
			var w2 = w / 2;
			var h2 = h / 2;
			
		    x = e.layerX - elFrame.offsetLeft; 
		    y = e.layerY - elFrame.offsetTop;

			x = (x < w2) ? -1*(1 - (x / w2)) : (x - w2)/w2;
			y = (y < h2) ? -1*(1 - (y / h2)) : (y - h2)/h2;
				
			elFrame.setAttribute("style", `transform: matrix3d(1,0,0.00, ${x/c.matrixForce},0.00,1, 0.00, ${y/c.matrixForce},0,0,1,0,0,0,0,1)`) 
		});
	}

}