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

const itemOptions = ["rock", "paper", "scissors", "lizard", "spock"];
/**
 * Rule set representation:
 * [playerChoice][cpuChoice]
 * [0] => rock
 * [1] => paper
 * [2] => scissors
 * [3] => lizard
 * [4] => spock
 *
 * So the value at [2][4] is the result of the player choosing 'scissors' and the
 * cpu choosing 'spock'. spock beats scissors, cpu win, output is -1
 *
 * Value:
 * 1 => player win
 * 0 => tie
 * -1 => cpu win
 */
const ruleSet = [
	[0, -1, 1, 1, -1],
	[1, 0, -1, -1, 1],
	[-1, 1, 0, 1, -1],
	[-1, 1, -1, 0, 1],
	[1, -1, 1, -1, 0]
];

/**
 * Update de gamedata to localStorage
 */
function updateGameData() {
	localStorage.setItem('gameData', JSON.stringify(gameData));
}

/**
 * Update score display
 */
function updateScoreboard() {
	updateGameData();
	for (let i = 0; i < gameData.score.length; i++) {
		scores.children[i].innerHTML = gameData.score[i];
	}
}

/**
 * Add an item to the screen
 * @param {String} itemName Name of the item to add
 * @param {Boolean} canClick If item can is clickable to play
 */
function addItem(itemName, canClick) {
	let item = document.createElement("div");
	item.classList.add("item");
	item.classList.add(itemName);
	item.data = itemName;

	if (canClick) {
		item.addEventListener("click", play, false);
		item.addEventListener("keypress", play, false);
		item.classList.add("playable");
		item.tabIndex = board.children.length + 1;
	}

	item.appendChild(document.createElement("div"));
	board.appendChild(item);
}

/**
 * Reset the board after a play
 */
function resetBoard() {

	while(board.children.length > 0){
		board.children[0].remove();
	}

	board.classList="select";

	addItem("rock", true);
	addItem("paper", true);
	addItem("scissors", true);

	if (gameData.mode == 1) {
		addItem("spock", true);
		addItem("lizard", true);

		ruleSprite.setAttribute("viewBox", "0 0 340 330");
		ruleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode1");

		modeSpan.innerHTML = "Special";
		main.classList.remove("mode0");
		main.classList.add("mode1");
	}
}

/**
 * Game Loop Logic
 * @param {Event} e Event
 * @returns null when keyboard event is not valid
 */
function play(e) {
	if (e.type == "keypress" && e.code != "Enter") {
		return null;
	}

	let playerChoice = itemOptions.indexOf(e.currentTarget.data);
	let cpuChoice = Math.floor(Math.random() * ((gameData.mode == 0) ? 3 : 5));
	let result = ruleSet[playerChoice][cpuChoice];

	e.currentTarget.removeEventListener("click", play);
	e.currentTarget.classList.remove("playable");

	let boardItems = board.children;
	while (boardItems.length != 1) {
		/*
		* TODO: Find a proper fix to this bug
		* "Why does it need a while loop" you may ask
		* Well you see, without it, some item are left on display.
		*/
		for (const item of boardItems) {
			if (item != e.currentTarget) {
				item.remove();
			}
		}
	}

	board.classList = "result";

	addItem(itemOptions[cpuChoice], false);

	if (result == 1) {
		gameData.score[0]++;
	} else if (result == -1) {
		gameData.score[1]++;
	}

	updateScoreboard();



	setTimeout(resetBoard, 1000);
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
	if (board.classList.contains("select")) {
		main.classList.remove("mode" + gameData.mode);

		// Loop gamemode to 0 if was at 1
		gameData.mode = ++gameData.mode % 2;

		if (gameData.mode == 0) {
			removeItem("spock");
			removeItem("lizard");
			modeSpan.innerHTML = "Normal";

			ruleSprite.setAttribute("viewBox", "0 0 304 270");
			ruleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode0");
		} else {
			addItem("spock", true);
			addItem("lizard", true);
			modeSpan.innerHTML = "Special";

			ruleSprite.setAttribute("viewBox", "0 0 340 330");
			ruleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode1");
		}

		main.classList.add("mode" + gameData.mode);
		updateGameData();
	}
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
	rulesCheck.checked = false;
	showRules();
}


/**
 * Reset scoreboard to 0-0
 */
function resetScore() {
	for (let i = 0; i < scores.children.length; i++) {
		scores.children[i].innerHTML = "0";
		gameData.score[i] = 0;
	}
	updateGameData();
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

	if (gameData == null) {
		gameData = {};
		gameData.mode = 0;
		gameData.score = [0, 0];
		updateGameData();
	} else {
		resetBoard();
		updateScoreboard();
	}

	let control = document.getElementById("control");
	control.children[0].addEventListener("click", swapMode, false);
	rulesCheck.addEventListener("change", showRules, false);
	btnCloseRules.addEventListener("click", closeRules, false);
	control.children[3].addEventListener("click", resetScore, false);

	document.getElementsByClassName('nojs')[0].classList.remove("nojs");
}

window.addEventListener("DOMContentLoaded", init, false);