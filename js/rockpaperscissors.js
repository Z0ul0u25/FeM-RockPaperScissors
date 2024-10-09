"use strict";
let gameData = null;

let board = null;
let main = null;

/**
 * Update de gamedata to localStorage
 */
function updateGameData(){
	localStorage.setItem('gameData', JSON.stringify(gameData));
}

/**
 * Add an item to the screen
 * @param {String} itemName Name of the item to add
 */
function addItem(itemName){
	let item = document.createElement("div");
	item.classList.add("item");
	item.classList.add(itemName);
	item.appendChild(document.createElement("div"));
	board.appendChild(item);
}

/**
 * Remove an item from the screen
 * @param {String} itemName Name of the item to remove
 */
function removeItem(itemName){
	console.log(board.getElementsByClassName(itemName));
	board.getElementsByClassName(itemName)[0].remove();
}

/**
 *
 */
function swapMode(){
	main.classList.remove("mode"+gameData.mode);

	gameData.mode = ++gameData.mode%2;
	console.log(gameData.mode);
	if (gameData.mode == 0) {
		removeItem("spock");
		removeItem("lizard");
	} else {
		addItem("spock");
		addItem("lizard");
	}

	main.classList.add("mode"+gameData.mode);
	updateGameData();
}

/**
 * Called to initialise components when page has finish loaded
 */
function init(){
	gameData = JSON.parse(localStorage.getItem('gameData'));
	board = document.getElementById("board");
	main = document.getElementsByTagName("main")[0];

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
	}

	let control = document.getElementById("control");
	control.children[0].addEventListener("click", swapMode, false);

	document.getElementsByClassName('nojs')[0].classList.remove("nojs");
}

window.addEventListener("DOMContentLoaded", init, false);