"use strict";
let gameData = null;

let imgHead = null;
let divBoard = null;
let divScores = null;
let divResult = null;
let divRules = null;
let svgRuleSprite = null;
let rulesCheck = null;
let btnCloseRules = null;
let main = null;
let modeSpan = null;

const ITEM_OPTIONS = ["rock", "paper", "scissors", "lizard", "spock"];
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
const RULE_SET = [
	[0, -1, 1, 1, -1],
	[1, 0, -1, -1, 1],
	[-1, 1, 0, 1, -1],
	[-1, 1, -1, 0, 1],
	[1, -1, 1, -1, 0]
];

const RESULT_FEEDBACK = {
	"-1":"YOU LOSE",
	"0":"TIE",
	"1":"YOU WIN"
};

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
		divScores.children[i].innerHTML = gameData.score[i];
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
		item.tabIndex = divBoard.children.length + 1;
	}

	item.appendChild(document.createElement("div"));
	divBoard.appendChild(item);
}

/**
 * Reset the board after a play
 * @param {Event} e Event trigegr
 * @returns null if trigger is invalid
 */
function resetBoard(e = null) {
	if (e != null && e.type == "keypress" && e.code != "Enter") {
		return null;
	}

	while(divBoard.children.length > 0){
		divBoard.children[0].remove();
	}

	divBoard.classList="select";
	divResult.classList.add("hidden");

	addItem("rock", true);
	addItem("paper", true);
	addItem("scissors", true);

	if (gameData.mode == 1) {
		addItem("spock", true);
		addItem("lizard", true);

		svgRuleSprite.setAttribute("viewBox", "0 0 340 330");
		svgRuleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode1");

		modeSpan.innerHTML = "Special";
		main.classList.remove("mode0");
		main.classList.add("mode1");
	}

	// divBoard.getElementsByClassName("rock")[0].focus();
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

	let playerChoice = ITEM_OPTIONS.indexOf(e.currentTarget.data);
	let cpuChoice = Math.floor(Math.random() * ((gameData.mode == 0) ? 3 : 5));
	let result = RULE_SET[playerChoice][cpuChoice];

	e.currentTarget.removeEventListener("click", play);
	e.currentTarget.removeAttribute("tabindex");
	e.currentTarget.classList.remove("playable");

	divResult.children[1].tabIndex = 1;
	divResult.children[1].focus();

	let boardItems = divBoard.children;
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

	divBoard.classList = "result";

	addItem(ITEM_OPTIONS[cpuChoice], false);

	if (result == 1) {
		gameData.score[0]++;
	} else if (result == -1) {
		gameData.score[1]++;
	}

	updateScoreboard();

	divResult.classList.remove("hidden");
	divResult.children[0].innerHTML = RESULT_FEEDBACK[result];

	// setTimeout(resetBoard, 1000);
}

/**
 * Remove an item from the screen
 * @param {String} itemName Name of the item to remove
 */
function removeItem(itemName) {
	divBoard.getElementsByClassName(itemName)[0].remove();
}

/**
 * Swap between game mode
 */
function swapMode() {
	if (divBoard.classList.contains("select")) {
		main.classList.remove("mode" + gameData.mode);

		// Loop gamemode to 0 if was at 1
		gameData.mode = ++gameData.mode % 2;

		if (gameData.mode == 0) {
			removeItem("spock");
			removeItem("lizard");
			modeSpan.innerHTML = "Normal";

			svgRuleSprite.setAttribute("viewBox", "0 0 304 270");
			svgRuleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode0");
			imgHead.src = "./images/logo.svg";
		} else {
			addItem("spock", true);
			addItem("lizard", true);
			modeSpan.innerHTML = "Special";

			svgRuleSprite.setAttribute("viewBox", "0 0 340 330");
			svgRuleSprite.children[0].setAttribute("href", "./images/rules-sprites.svg#mode1");
			imgHead.src = "./images/logo-bonus.svg";
		}

		main.classList.add("mode" + gameData.mode);
		updateGameData();
	}
}

/**
 * show/hide rule page
 */
function showRules() {
	divRules.classList = (rulesCheck.checked) ? "open" : "closed";
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
	for (let i = 0; i < divScores.children.length; i++) {
		divScores.children[i].innerHTML = "0";
		gameData.score[i] = 0;
	}
	updateGameData();
}

/**
 * Called to initialise components when page has finish loaded
 */
function init() {
	gameData = JSON.parse(localStorage.getItem('gameData'));

	imgHead = document.querySelector("header>img");
	divBoard = document.getElementById("board");
	divResult = document.getElementById("result");
	divScores = document.getElementById("score");
	divRules = document.getElementById("rules");
	svgRuleSprite = document.getElementById("ruleSprite");
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
		if (gameData.mode == 1) {
			imgHead.src = "./images/logo-bonus.svg";
		}
		updateScoreboard();
	}
	resetBoard();

	let control = document.getElementById("control");
	control.children[0].addEventListener("click", swapMode, false);
	rulesCheck.addEventListener("change", showRules, false);
	btnCloseRules.addEventListener("click", closeRules, false);
	control.children[3].addEventListener("click", resetScore, false);
	divResult.children[1].addEventListener("click", resetBoard, false);
	divResult.children[1].addEventListener("keypress", resetBoard, false);

	document.getElementsByClassName('nojs')[0].classList.remove("nojs");
}

window.addEventListener("DOMContentLoaded", init, false);