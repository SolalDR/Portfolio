class Circle {
	constructor(n, radius){
		
		this.n = n; 
		this.radius = radius;

		this.computeVertice();
		this.computeFace();

	}

	computeVertice(){
		this.vertices = [{ x: 0, y: 0 }]
		var stepAngle = Math.PI*2 / this.n;
		var angle = 0; 
		for(var i=0; i<this.n; i++){
			angle = i * stepAngle; 
			this.vertices.push({
				x: Math.cos(angle)*this.radius,
				y: Math.sin(angle)*this.radius
			});
		}
	}


	computeFace(){
		this.faces = [];
		var thirdVertice;
		for(var i=1; i<this.vertices.length; i++){
			thirdVertice = !this.vertices[i+1] ? this.vertices[1] : this.vertices[i+1]
			this.faces.push([0, i, thirdVertice]);
		}
	}

}