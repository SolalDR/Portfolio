
class BemElement extends Node {
	
	constructor(el, block) {
		this.el = el;
		this.block = block;
		this.element = null; 
		this.modifier = [];
		this.analyse();
	}

	analyse() {
		var classList = this.el.className.split(/\s/);
		var reg = new RegExp("^"+this.block+"__(.+?)(?:\-\-(.+?))?$");
		for(var i=0; i<classList.length; i++){
			var match = classList[i].match(reg);
			if( match ){
				this.element = match[1];
				this.modifier.push(match[2]);
			}
		}
	}
}


if( !Node.prototype.querySelectorBem ){
	var bemQuery = function(selector, block){
		var el = this.querySelector(selector);
		return new BemElement(el, block);
	}

	Node.prototype.querySelectorBem = bemQuery;
}

export default BemElement;