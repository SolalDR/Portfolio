
class Object2D {
	
	constructor(args){

		this.geometry = args.geometry; 

		this.rotation = args.rotation ? args.rotation : 0 ; 
		this.scale = args.scale ? args.scale : 1;
		this.position = args.position ? args.position : {x: 0, y:0};
		this.animation = {
			rotation: null,
			scale: null,
			translation: null
		}

	}

 
}

export default Object2D