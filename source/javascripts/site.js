
import Background from "./background";
import BemElement from "./Bem.js";
import Animall from "./Animall.js";
import Asap from "asap-js";



function getDirection(asapVisit){
	var direction = asapVisit.detail.link.link.getAttribute("data-animate");
	return direction;
}

function scrollFromDirection(direction){
	var base = bg.scrollController.coords.slice(0, 2);
	var pas = 1;

	switch(direction){
		case "left"   : base[0] -= pas; break;
		case "right"  : base[0] += pas; break;
		case "top"    : base[1] += pas; break;
		case "bottom" : base[1] -= pas; break;
	}

	return base;
}


// Premier chargement 
window.addEventListener("load", function(){
	// Chargement du background 
	window.bg = new Background();

	// Chargement de asap sur le sélecteur body
	Asap.start({
		targetSelector: "#body",
		sourceSelector: "#body"
	});
	
	// Affiche le menu an supprimant le modifier hide des items
	document.querySelectorAllBEM(".menu__item", "menu").removeMod("hide");
})


// Avant chaque chargement
document.addEventListener("asap:before-load", (e) => {
	e.preventDefault();

	// Récupère la direction passer en paramètre du lien cliqué
	var direction = getDirection(e); 

	bg.smoothScroll(scrollFromDirection(direction));

	/* Modifie le html à rajouter en ajoutant un modifier correspondant 
	à la direction à tout les éléments animable */
	var els = e.detail.target.querySelectorAllBEM(".animate", "animate").addMod("fade")
	document.querySelectorAllBEM(".animate", "animate").addMod("fade");
	
	// Cache les items du menu (si ils existe) attend 1200ms et charge la requête
	document.querySelectorAllBEM(".menu__item", "menu").addMod("hide");

	setTimeout(function(){
		e.detail.load();
		// bg.clipCanvas.displayArrow(direction);
	}, 1200)
})


// Après chaque chargement 
document.addEventListener("asap:load", (e) => {

	// Récupère les élément à animé
	var menuItems = document.querySelectorAllBEM(".menu__item", "menu")
	var animates = document.querySelectorAllBEM(".animate", "animate")	
	
	setTimeout(function(){
		// Affiche les menu 
		menuItems.removeMod("hide");
		// Affiche tout les élément animable
		animates.removeAllMod();
	}, 20)
})


window.addEventListener("scroll", function(e){
	console.log("Scroll", e);
})