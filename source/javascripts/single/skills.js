import ProgressBar from "./../ProgressBar.js";

export default {

	init: function(ctx){
		this.ctx = ctx;
		this.ctx.bg.clipCanvas.displayArrow("bottom");
		var els = document.querySelectorAll(".progress");
		var progresses = [];
		for(var i=0; i<els.length; i++){
			progresses.push(new ProgressBar(els[i]));
		}
	}
}