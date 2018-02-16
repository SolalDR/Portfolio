
class Object2D {
	constructor(args){
		this.type = args.type;
		this.source = args.source;
		this.onLoad = args.onload ? args.onload : null;
		this.name = args.name ? args.name : null;
		this.scale = args.scale ? args.scale : [1, 1];
		this.rotation = args.rotation ? args.rotation : 0; 
		this.origin = args.origin ? args.origin : [0.5, 0.5];
		this.translate =  args.translate ? args.translate : [0, 0];

		this.width = args.width; 
		this.height = args.height ? args.height : null; 
		
		if (this.type == "img") {
			this.load(this.source);
		}
	}

	updateMatrix(translate, rotate, origin, scale){
		if(translate !== undefined){ this.translate = translate }
		if(rotate !== undefined){ this.rotate = rotate }
		if(origin !== undefined){ this.origin = origin }
		if(scale !== undefined){ this.scale = scale }
	}

	load(src){
		this.source = new Image(this.width, this.height);
		this.source.src = src;
		this.source.addEventListener("load", () => { 
			this.onLoad();
		})
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.translate[0], this.translate[1]);
		ctx.rotate(this.rotate);
		ctx.scale(this.scale, this.scale);
		console.log(`${this.width}px sans-serif`);
		switch(this.type){
			case "img": ctx.drawImage(this.source, - this.width*this.origin[0], - this.height*this.origin[1], this.width, this.height); break;
			case "text": ctx.font = `${this.width}px sans-serif`; ctx.fillText(this.source,  - this.width*this.origin[0], - this.height*this.origin[1]); break;
		}
		
		ctx.restore();
	}
}

export default Object2D;