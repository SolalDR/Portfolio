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

		this.el = document.getElementById("cursor");
		this.position =  { x: 0, y: 0 }; 
		this.targetPosition = { x: 0, y: 0 };
		this.vertexPosition = [0, 0];
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