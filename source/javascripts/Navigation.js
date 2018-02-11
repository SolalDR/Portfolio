import home from "./single/home.js"
import skills from "./single/skills.js"
import contact from "./single/contact.js"
import works from "./single/works.js"
import about from "./single/about.js"
import config from "./config.js";


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

		this.beforeLeave();

		// Update current visit
		this._visit = visit; 

		// Define the default animation 
		this._visit.direction = this.visit.link.link.getAttribute("data-animate");
		
		// get the current page
		this.currentPage = this._visit.target.getAttribute("data-slug");

		this.leave();
	}

	
	get visit(){
		return this._visit;
	}

	// Return the script of the current page 
	get currentScript(){
		switch( this.currentPage ) {
			case "home": return home;
			case "project": return project;
			case "skills": return skills;
			case "works": return works;
			case "about": return about;
			case "contact": return contact;
		}
	} 



	/*************** GLOBAL ACTIONS *****************/

	// Before update the new visit 
	beforeLeave(){
		// If custom scripts implement a leave function, execute it
		if( this.currentScript.leave ) {
			this.currentScript.leave();
		}
	}

	// At the end of preparing new visit
	leave() {
		this.scrollTo(this._visit.direction);
		this.hideMenu();
		this.fade(true);

		if( this.currentPage == "home" ){
			this.bg.clipCanvas.displayArrow("none");
		}
	}


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
	
	},20)}


	/*************** CUSTOM ACTION *****************/

	// Execute the personal scripts of each pages
	execute(){
		setTimeout(()=>{
			this.currentScript.init(this);
			this.bg.updateUntil();
		}, config.anim.load.after)
	}
}

export default Navigation;