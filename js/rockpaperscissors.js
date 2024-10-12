"use strict";
let gameData = null;

let board = null;
let scores = null;
let rules = null;
let ruleSprite = null;
let rulesCheck = null;
let btnCloseRules = null;
let main = null;
let modeSpan = null;

const ruleSet = {
	0: [
		[0, 1, -1],
		[-1, 0, 1],
		[1, -1, 0]
	],
	1: [
		[0, 1, -1, -1, 1],
		[-1, 0, 1, 1, -1],
		[1, -1, 0, -1, 1],
		[1, -1, 1, 0, -1],
		[-1, 1, -1, 1, 0]
	]
};

/**
 * Update de gamedata to localStorage
 */
function updateGameData() {
	localStorage.setItem('gameData', JSON.stringify(gameData));
}

/**
 * TODO gameLoop
 */
function play(e) {
	console.log(e.currentTarget.data);
}

/**
 * Add an item to the screen
 * @param {String} itemName Name of the item to add
 */
function addItem(itemName) {
	let item = document.createElement("div");
	item.classList.add("item");
	item.classList.add(itemName);
	item.data = itemName;
	item.appendChild(document.createElement("div"));
	item.addEventListener("click", play, false);
	board.appendChild(item);
}

/**
 * Remove an item from the screen
 * @param {String} itemName Name of the item to remove
 */
function removeItem(itemName) {
	board.getElementsByClassName(itemName)[0].remove();
}

/**
 * Swap between game mode
 */
function swapMode() {
	main.classList.remove("mode" + gameData.mode);

	gameData.mode = ++gameData.mode % 2;

	if (gameData.mode == 0) {
		removeItem("spock");
		removeItem("lizard");
		modeSpan.innerHTML = "Normal";

		ruleSprite.setAttribute("viewBox", "0 0 304 270");
		ruleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode0");
	} else {
		addItem("spock");
		addItem("lizard");
		modeSpan.innerHTML = "Special";

		ruleSprite.setAttribute("viewBox", "0 0 340 330");
		ruleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode1");
	}

	main.classList.add("mode" + gameData.mode);
	updateGameData();
}

/**
 * show/hide rule page
 */
function showRules() {
	rules.classList = (rulesCheck.checked) ? "open" : "closed";
}

/**
 * uncheck hidden box to close rules
 */
function closeRules() {
	console.log("close rules")
	rulesCheck.checked = false;
	showRules();
}


/**
 * Reset scoreboard to 0-0
 */
function resetScore() {
	for (let i = 0; i < scores.children.length; i++) {
		scores.children[i].innerHTML = "0";
	}
}

/**
 * Called to initialise components when page has finish loaded
 */
function init() {
	gameData = JSON.parse(localStorage.getItem('gameData'));
	board = document.getElementById("board");
	scores = document.getElementById("score");
	rules = document.getElementById("rules");
	ruleSprite = document.getElementById("ruleSprite");
	rulesCheck = document.getElementById("showRules");
	btnCloseRules = document.getElementById("closeRules");
	main = document.getElementsByTagName("main")[0];
	modeSpan = document.getElementById("mode");

	addItem("rock");
	addItem("paper");
	addItem("scissors");

	if (gameData == null) {
		gameData = {};
		gameData.mode = 0;
		gameData.score = [0, 0];
		updateGameData();
	} else if (gameData.mode == 1) {
		addItem("lizard");
		addItem("spock");

		ruleSprite.setAttribute("viewBox", "0 0 340 330");
		ruleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode1");

		modeSpan.innerHTML = "Special";
		main.classList.remove("mode0");
		main.classList.add("mode1");
	}

	let control = document.getElementById("control");
	control.children[0].addEventListener("click", swapMode, false);
	rulesCheck.addEventListener("change", showRules, false);
	btnCloseRules.addEventListener("click", closeRules, false);
	control.children[2].addEventListener("click", resetScore, false);

	document.getElementsByClassName('nojs')[0].classList.remove("nojs");
}

window.addEventListener("DOMContentLoaded", init, false);