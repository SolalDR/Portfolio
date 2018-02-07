
import Background from "./background";
import BemElement from "./Bem.js";
import Animall from "./Animall.js";
import Asap from "asap-js";



function getDirection(asapVisit){
	var direction = asapVisit.detail.link.link.getAttribute("data-animate");
	if( !direction ) direction = "fade"
	return direction;
}




window.addEventListener("load", function(){
	var bg = new Background();
	Asap.start({
		targetSelector: "#body",
		sourceSelector: "#body"
	});



	// document.querySelectorAllBEM(".animate", "animate").removeMod("fade-bottom");
	
	// Affiche le menu 
	document.querySelectorAllBEM(".menu__item", "menu").removeMod("hide");
})


document.addEventListener("asap:before-load", (e) => {
	e.preventDefault();

	
	var els = e.detail.target.querySelectorAllBEM(".animate", "animate").addMod(getDirection(e))
	document.querySelectorAllBEM(".animate", "animate").addMod(getDirection(e));
	

	document.querySelectorAllBEM(".menu__item", "menu").addMod("hide");
	setTimeout(function(){
		e.detail.load();
	}, 1200)
})

document.addEventListener("asap:load", (e) => {
	var menuItems = document.querySelectorAllBEM(".menu__item", "menu")
	var animates = document.querySelectorAllBEM(".animate", "animate")	



	
	

	
	setTimeout(function(){
		menuItems.removeMod("hide");
		animates.removeAllMod();
		console.log(animates);
	}, 20)
})



