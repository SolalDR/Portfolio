
export default {

	init: function(ctx){
		this.ctx = ctx;
		this.ctx.bg.clipCanvas.displayArrow("bottom");


		if( window.innerWidth > 500 ) {
			this.ctx.bg.clipCanvas.addRessource({
				width: window.innerHeight*0.7,
				height: window.innerHeight*0.7,
				type: "img",
				source: '/images/question.png',
				name: "question",
				translate:  [window.innerWidth/3 , window.innerHeight/2], 
				onload: () => {
					this.ctx.bg.launchAnimation();
					this.ctx.bg.updateUntil(5000);
					this.ctx.bg.clipCanvas.draw();
				}
			})
		}
	},


	leave(){
		this.ctx.bg.clipCanvas.removeRessource("question");
	}

}