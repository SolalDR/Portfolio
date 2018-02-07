
class Wave {

	constructor(cursor){
		this.coords = [0, 0]
		this.radius = 0;
		this.speed = 0.04;
		this.strength = 0; 
		this.needsUpdate = false;
		this.start = 0;
		this.cursor = cursor;
	}


	run(current){
		if( current - this.start > 700 ) {
			this.coords = this.cursor.scaledPosition;
			this.radius = 0;
			this.strength = 3;
			this.needsUpdate = true;
			this.start = current;
			return true;
		} 
		return false;
	}

	update(){
		this.strength = Math.max(0, this.strength-0.04); 
		this.radius += this.speed;
	}
}

export default Wave;