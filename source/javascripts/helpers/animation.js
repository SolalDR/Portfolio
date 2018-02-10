const PLAYING = 1; 
const START = 2;
const END = 3; 


class Animation {
	
	constructor(args) {

		this.start = args.start ? args.start : Date.now();
		this.duration = args.duration ? args.duration : 1000;
		this.end = this.start + this.duration; 
		this.timingFunction = null;
		
		this.advancement = 0;
		this.status = START; 
	
	}

	update(time) {
		if( !time ) time = Date.now();
		if( time - this.start < 0 || this.status === END ) return null;

		this.advancement = Math.min(1, (time - this.start)/this.duration);

		if(this.advancement === 1)
			this.status = END; 

		return this.advancement; 
	}


}

export default Animation;