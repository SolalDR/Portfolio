
class Wave {



	constructor(cursor){
		this.config = {
			speed: 15,
			strength: 6,
			strengthStep: 0.15,
			weight: 100
		}

		this.coords = [0, 0]
		this.scaledCoords = [0, 0];
		this.radius = 0;
		this.strength = 0; 
		this.start = 0;
		this.cursor = cursor;
	}

	manageCoords(){
		this.coords = [this.cursor.position.x, this.cursor.position.y - window.innerHeight];
		this.scaledCoords = this.cursor.scaledPosition;
	}


	run(current){
		if( current - this.start > 700 ) {
			this.manageCoords();
			this.radius = 0;
			this.strength = this.config.strength;
			this.start = current;
			return true;
		} 
		return false;
	}

	update(){
		this.strength = Math.max(0, this.strength-this.config.strengthStep); 
		this.radius += this.config.speed;
	}
}

export default Wave;