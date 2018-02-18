
import Background from "./background.js";
import BemElement from "./helpers/Bem.js";
import Navigation from "./navigation.js";
import Asap from "asap-js";
import config from "./config.js";

// Premier chargement 
window.addEventListener("load", function(){
	
	// Chargement de asap sur le sélecteur body
	Asap.start({
		targetSelector: "#body",
		sourceSelector: "#body"
	});
	
	// Chargement du background 
	window.bg = new Background();
	window.nav = new Navigation(bg);

	nav.displayMenu();
	nav.fade(false);
})


// Avant chaque chargement
document.addEventListener("asap:before-load", function (e) {
	e.preventDefault();
	nav.visit = e.detail; 			// Prepare le chargement de la visite

	setTimeout(function(){
		e.detail.load();			// Charge la visite
	}, config.anim.load.before)
})

// Après chaque chargement 
document.addEventListener("asap:load", function (e)  {
	nav.load();
})
