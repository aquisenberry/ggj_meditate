"use strict";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var Splat = require("splat-ecs");

// This is some webpack magic to ensure the dynamically required scripts are loaded

var splatSystemPath = "splat-ecs/lib/systems";
// WARNING: can't use splatSystemPath variable here, or webpack won't pick it up
var splatSystemRequire = require.context("splat-ecs/lib/systems", true, /\.js$/);

var localSystemPath = "./systems";
var localSystemRequire = require.context("./systems", true, /\.js$/);

var localScriptPath = "./scripts";
var localScriptRequire = require.context("./scripts", true, /\.js$/);

var localDataPath = "./data";
var localDataRequire = require.context("./data", true, /\.json$/);

function customRequire(path) {
	if (path.indexOf(splatSystemPath) === 0) {
		var splatName = "./" + path.substr(splatSystemPath.length + 1) + ".js";
		return splatSystemRequire(splatName);
	}
	if (path.indexOf(localSystemPath) === 0) {
		var localName = "./" + path.substr(localSystemPath.length + 1) + ".js";
		return localSystemRequire(localName);
	}
	if (path.indexOf(localScriptPath) === 0) {
		var scriptName = "./" + path.substr(localScriptPath.length + 1) + ".js";
		return localScriptRequire(scriptName);
	}
	if (path.indexOf(localDataPath) === 0) {
		var dataName = "./" + path.substr(localDataPath.length + 1) + ".json";
		return localDataRequire(dataName);
	}
	console.error("Unable to load module: \"", path, "\"");
	return undefined;
}
require("./index.html");
require.context("./images", true, /\.(jpe?g|png|gif|svg)$/i);
require.context("./sounds", true, /\.(mp3|ogg|wav)$/i);

var game = new Splat.Game(canvas, customRequire);

function percentLoaded() {
	if (game.images.totalImages + game.sounds.totalSounds === 0) {
		return 1;
	}
	return (game.images.loadedImages + game.sounds.loadedSounds) / (game.images.totalImages + game.sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, game.scene);
loading.start(context);
