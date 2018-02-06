
class Cursor {
	constructor() {
		this.el = document.getElementById("cursor");
		this.position =  { x: 0, y: 0 }; 
		this.targetPosition = { x: 0, y: 0 };
		this.scaledPosition = [0, 0];
	}

	update(){
		this.position = {
			x: this.position.x  + (this.targetPosition.x - this.position.x) * 0.1,
			y: this.position.y  + (this.targetPosition.y - this.position.y) * 0.1
		}

		this.scaledPosition = [
			this.position.x / window.innerWidth * 2 - 1,
			(window.innerHeight - this.position.y) / window.innerHeight * 2 - 1 
		]

		this.el.style = `transform: translate3d(${this.position.x - 10}px, ${this.position.y - 10}px, 0) scale(1)`;
	}

	move(coords){
		this.targetPosition = coords;
	}
}


export default Cursor;