function whichAnimationEvent(){
  var t,
      el = document.createElement("fakeelement");

  var animations = {
    "animation"      : "animationend",
    "OAnimation"     : "oAnimationEnd",
    "MozAnimation"   : "animationend",
    "WebkitAnimation": "webkitAnimationEnd"
  }

  for (t in animations){
    if (el.style[t] !== undefined){
      return animations[t];
    }
  }
}

var animationEvent = whichAnimationEvent();


class Animall {
	constructor(source, animation, args){

		this.limit = (args.duration) ? args.duration : 10000;
		this.animationEvent = animationEvent;
		this.selector = "animall-"+animation; 
		this.els = source.querySelectorAll("."+this.selector);
		this.count = this.els.length; 
		
		this.events = { end: [] };


	}

	listenEnd(el){
		var end = false;
		el.addEventListener(this.animationEvent, () => {
			this.count--;
			console.log("Animation-end")
			el.className = el.className.replace(this.selector+"--play", "");
			if( this.count === 0 ){
				this.dispatch("end");
			}
		});
	}

	launch(){
		for(var i=0; i<this.els.length; i++ ){
			this.els[i].className += " "+this.selector+"--play";
		}
		setTimeout(() => {
			if( this.count > 0 ){
				this.dispatch("end");
			}
		}, this.limit);

		if( this.count < 1 ){

			this.dispatch("end");
		}
	}

	dispatch(event){
		for(var i=0; i<this.events[event].length; i++){
			var call = this.events[event][i];
			call.apply(this);
		}
	}

	on(event, callback){
		if( this.events[event] ){
			this.events[event].push(callback);
		}
		console.log("ON");
	}
}

export default Animall;