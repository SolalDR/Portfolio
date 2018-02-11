
export default {

	init: function(ctx){
		this.ctx = ctx;
		this.ctx.bg.clipCanvas.displayArrow("bottom");



		this.ctx.bg.clipCanvas.addRessource({
			width: window.innerHeight*0.7,
			height: window.innerHeight*0.7,
			type: "img",
			source: '/images/question.png',
			name: "question",
			translate:  [window.innerWidth/3 , window.innerHeight/2]
		})

		this.ctx.clipCanvas.draw();
	},


	leave(){
		this.ctx.bg.clipCanvas.removeRessource("question");
	}

}