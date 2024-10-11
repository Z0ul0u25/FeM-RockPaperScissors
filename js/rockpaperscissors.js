"use strict";
let gameData = null;

let board = null;
let scores = null;
let rules = null;
let rulesCheck = null;
let main = null;
let modeSpan = null;

/**
 * Update de gamedata to localStorage
 */
function updateGameData(){
	localStorage.setItem('gameData', JSON.stringify(gameData));
}

/**
 * TODO gameLoop
 */
function play(e){
	console.log(e.currentTarget.data);
}

/**
 * Add an item to the screen
 * @param {String} itemName Name of the item to add
 */
function addItem(itemName){
	let item = document.createElement("div");
	item.classList.add("item");
	item.classList.add(itemName);
	item.data=itemName;
	item.appendChild(document.createElement("div"));
	item.addEventListener("click", play, false);
	board.appendChild(item);
}

/**
 * Remove an item from the screen
 * @param {String} itemName Name of the item to remove
 */
function removeItem(itemName){
	board.getElementsByClassName(itemName)[0].remove();
}

/**
 *
 */
function swapMode(){
	main.classList.remove("mode"+gameData.mode);

	gameData.mode = ++gameData.mode%2;

	if (gameData.mode == 0) {
		removeItem("spock");
		removeItem("lizard");
		modeSpan.innerHTML = "Normal";
	} else {
		addItem("spock");
		addItem("lizard");
		modeSpan.innerHTML = "Special";
	}

	main.classList.add("mode"+gameData.mode);
	updateGameData();
}

/**
 * TODO Show a rule board according to current mode
 */
function showRules(){
	console.log("RULES");
	console.log(rulesCheck.checked);
}

/**
 * Reset scoreboard to 0-0
 */
function resetScore(){
	for (let i = 0; i < scores.children.length; i++) {
		scores.children[i].innerHTML = "0";
	}
}

/**
 * Called to initialise components when page has finish loaded
 */
function init(){
	gameData = JSON.parse(localStorage.getItem('gameData'));
	board = document.getElementById("board");
	scores = document.getElementById("score");
	rules = document.getElementById("rules");
	rulesCheck = document.getElementById("showRules");
	main = document.getElementsByTagName("main")[0];
	modeSpan = document.getElementById("mode");

	addItem("rock");
	addItem("paper");
	addItem("scissors");

	if (gameData == null){
		gameData = {};
		console.log("setting gameDate");
		gameData.mode = 0;
		gameData.score = [0,0];
		updateGameData();
	} else if(gameData.mode == 1) {
		addItem("lizard");
		addItem("spock");
		modeSpan.innerHTML="Special";
		main.classList.remove("mode0");
		main.classList.add("mode1");
	}

	let control = document.getElementById("control");
	control.children[0].addEventListener("click", swapMode, false);
	rulesCheck.addEventListener("change", showRules, false);
	control.children[2].addEventListener("click", resetScore, false);

	document.getElementsByClassName('nojs')[0].classList.remove("nojs");
}

window.addEventListener("DOMContentLoaded", init, false);