
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


	get animate(){
		for(i in this.animation){
			if( this.animation[i] !== null ){
				return true; 
			}
		}
		return false;
	}


	rotate(value, duration) {
		if( duration ){

		}
	}

	compute(){
		
	}

	update(){

	}



	render(ctx){

		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.scale(this.scale, this.scale);

		ctx.moveTo(this.geometry.points[0].x, this.geometry.points[0].y);
		for(var i=1; i<this.geometry.points.length; i++){
			ctx.lineTo(this.geometry.points[i].x, this.geometry.points[i].y); 
		}
		ctx.restore();

	}
 
}

export default Object2D