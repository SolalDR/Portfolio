class BemCollection {
	constructor(collections, block){
		this.list = [];
		for(var i=0; i < collections.length; i++){

			this.list.push(new BemElement(collections[i], block));

		} 
	}

	addMod(mod) {
		this.list.map(function(e){ e.addMod(mod); })
		return this.list;
	}

	removeMod(mod) {
		this.list.map(function(e){ e.removeMod(mod); })
		return this.list;
	}

	removeAllMod(){
		for(var i=0; i<this.list.length; i++){
			this.list[i].removeAllMod();
		}
		return this.list;
	}
}


class Bem {
	static all(selector){
		return new BemCollection(document.query)
	}
}


class BemElement {
	
	constructor(el, block) {

		this.el = el;
		this.block = block;
		this.element = null; 
		this.modifier = [];
		this.analyse();
		return this;
	}



	get formatElement() {
		return this.element ? "__"+this.element : "";
	}

	getClassList(){
		this.classList = this.el.className.split(/\s/);
	}

	analyse() {
		this.element = null;
		this.modifier = [];

		this.getClassList();
		
		var reg = new RegExp("^"+this.block+"(?:__(.+?)|)(?:\-\-(.+?))?$");
		
		for(var i=0; i<this.classList.length; i++){
			
			var match = this.classList[i].match(reg);
			
			if( match ){
				this.element = match[1];
				if( match[2] !== undefined ){
					this.modifier.push(match[2]);
				}
			}
		}
	}


	addMod(mod){
		if( mod && mod !== "") {
			var className = this.block + this.formatElement + "--" + mod;	
			if( this.el.className.match(className) ){
				return; 
			}
			this.el.className += " "+className;
		}
		this.analyse();
		return this; 
	}

	removeAllMod(){
		while(this.modifier.length > 0) {
			this.removeMod(this.modifier[0]);
		}
	}

	removeMod(mod){
		var className = this.block + this.formatElement + "--" + mod;	
		this.el.className = this.el.className.replace(className, "");
		this.analyse();
		return this;
	}

	querySelectorBEM(selector, block){
		return this.el.querySelectorBEM(selector, block);
	}

	querySelectorAllBEM(selector, block){
		return this.el.querySelectorAllBEM(selector, block);
	}
}


if( !Node.prototype.querySelectorBEM ){
	var bemQuery = function(selector, block){
		var el = this.querySelector(selector);
		return new BemElement(el, block);
	}

	Node.prototype.querySelectorBEM = bemQuery;
}


if( !Node.prototype.querySelectorBEM ){
	var bemQuery = function(selector, block){
		var el = this.querySelector(selector);
		return new BemElement(el, block);
	}

	Node.prototype.querySelectorBEM = bemQuery;
}


if( !Node.prototype.querySelectorAllBEM ){
	var bemQueryAll = function(selector, block){
		var els = this.querySelectorAll(selector);
		return new BemCollection(els, block);
	}

	Node.prototype.querySelectorAllBEM = bemQueryAll;
}


export default BemElement;