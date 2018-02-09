import home from "./single/home.js"
import skills from "./single/skills.js"
import contact from "./single/contact.js"
import works from "./single/works.js"
import about from "./single/about.js"

class Navigation {

	constructor(bg) {
		this.bg = bg; 

		this._visit = null;
		this.direction = null;

		this.currentPage = document.querySelector("#body").getAttribute("data-slug");
		this.execute();
	}



	/*************** GETTER / SETTERS *****************/

	set visit(visit){
		this._visit = visit; 
		this._visit.direction = this.visit.link.link.getAttribute("data-animate");
		this.scrollTo(this._visit.direction);
		this.hideMenu();
		this.fade(true);

		this.currentPage = this._visit.target.getAttribute("data-slug");
	}

	get visit(){
		return this._visit;
	}

	get pageLoaded() {

	}


	/*************** GLOBAL ACTIONS *****************/


	// Affiche le menu an supprimant le modifier hide des items
	displayMenu() {
		document.querySelectorAllBEM(".menu__item", "menu").removeMod("hide");
	}

	// Cache le menu an ajoutant le modifier hide des items
	hideMenu() {
		document.querySelectorAllBEM(".menu__item", "menu").addMod("hide");
	}

	fade(active){
		if( active ){
			var els = this.visit.target.querySelectorAllBEM(".animate", "animate").addMod("fade")
			document.querySelectorAllBEM(".animate", "animate").addMod("fade");
		} else if( active === false ){
			var animates = document.querySelectorAllBEM(".animate", "animate").removeMod("fade");
		}
	}

	scrollTo(direction){
		// Compute scroll value from direction
		var scroll = this.bg.scrollController.coords.slice(0, 2);
		var pas = 1;

		switch(direction){
			case "left"   : scroll[0] -= pas; break;
			case "right"  : scroll[0] += pas; break;
			case "top"    : scroll[1] += pas; break;
			case "bottom" : scroll[1] -= pas; break;
		}

		this.bg.smoothScroll( scroll );
	}

	load(){setTimeout(() => {
		
		this.displayMenu();
		this.fade(false);

		this.execute();
	
	},1)}


	/*************** CUSTOM ACTION *****************/

	execute(){
		switch( this.currentPage ) {
			case "home": home.init(this); break;
			case "project": project.init(this); break;
			case "skills": skills.init(this); break;
			case "works": works.init(this); break;
			case "about": about.init(this); break;
			case "contact": contact.init(this); break;
		}
	}
}

export default Navigation;