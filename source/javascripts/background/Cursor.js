Object.defineProperties(window, {
    scrollTop: {
        get: function() {
            return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        },
        set: function(value) {
            var scrollTop = ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);
            scrollTop = value;
        }
    }
});

class Cursor {

	constructor() {
		this.config = {
			speed: 0.2
		}

		this.bem = document.querySelectorBEM("#cursor", "cursor");
		this.el = this.bem.el;

		this.mode = "classic"; 

		this.position =  { x: 0, y: 0 }; 
		this.targetPosition = { x: 0, y: 0 };
		this.vertexPosition = [0, 0];

		this.reactiveLinks = [];
		this.addTargetLinks(document.body);
	}

	addTargetLinks(el){
		var links = el.querySelectorAll("a");
		for(var i=0; i<links.length; i++){
			this.reactiveLinks.push(links[i]);
			((rank) => {

				links[rank].addEventListener("mouseenter", (e) =>{
					if(e.target.getAttribute("data-cursor")){
						this.mode = e.target.getAttribute("data-cursor")
					} else {
						this.mode = "link"
					}
					
				}, false);

				links[rank].addEventListener("mouseleave", () =>{
					this.mode = "classic"
				}, false);

			})(i);
		}
	}

	set mode(cursor){
		this.bem.removeMod(this._mode);
		this.bem.addMod(cursor);
		this._mode = cursor;
	}

	update(){
		this.position = {
			x: this.position.x  + (this.targetPosition.x - this.position.x) * this.config.speed,
			y: this.position.y  + (this.targetPosition.y - this.position.y) * this.config.speed
		}

		this.vertexPosition = [ this.position.x, (window.innerHeight - this.position.y) * -1 ]

		this.el.style = `transform: translate3d(${this.position.x - 10}px, ${this.position.y - 10 + window.scrollTop}px, 0) scale(1)`;
	}

	move(coords){
		this.targetPosition = coords;
	}


	
}


export default Cursor;