
import Background from "./background";
import BemElement from "./Bem.js";
import Navigation from "./Navigation.js";
import Asap from "asap-js";



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
document.addEventListener("asap:before-load", (e) => {
	e.preventDefault();
	nav.visit = e.detail; 	// Prepare le chargement de la visite

	setTimeout(function(){
		e.detail.load();	// Charge la visite
	}, 1200)
})


// Après chaque chargement 
document.addEventListener("asap:load", (e) => {
	nav.load();
})


window.addEventListener("scroll", function(e){
	console.log("Scroll", e);
})