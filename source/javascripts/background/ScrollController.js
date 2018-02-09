import Easing from "./Easing.js";


class ScrollController {

	constructor(){

		this.start = null;
		this.end = null; 
		this.target = null;
		this.duration = 1000;
		this.animate = false;
		this.coords = [0, 0];
		this.startCoord = this.coords;

	}

	scroll(vector, args){

		this.startCoord = this.coords;
		this.start = args && args.start ? args.start : Date.now();
		this.duration = args && args.duration ? args.duration : 1000; 
		this.end = this.start + this.duration;
		this.animate = true; 
		this.target = vector;

	}


	render(current){

		if( this.animate && current < this.end ){
			
			var advancement = Easing.easeInOutCubic( 1 - (this.end - current) / this.duration );
			
			this.coords = [
				this.startCoord[0] + (this.target[0] - this.startCoord[0]) * advancement,
				this.startCoord[1] + (this.target[1] - this.startCoord[1]) * advancement
			];

			return this.coords; 
		}

		this.animate = false;
	}
}

export default ScrollController;