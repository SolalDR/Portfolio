class Polygon {

	/**
	* @param {integer} n : Number of polygons side
	* @param {float} radius : radius of polygon
	*/
	constructor(n, rX, rY){

		var stepAngle = Math.PI*2 / n; 
		

		this.points = [];
		for (var i = 0; i < n; i++) {
			this.points.push({
				x: Math.cos(Math.PI/2 + i*stepAngle)*rX,
				y: Math.sin(Math.PI/2 + i*stepAngle)*rY
			})
		}
	}
}

export default Polygon;