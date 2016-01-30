var browserify = require("browserify");
var fs = require("fs");
var mkdirp = require("mkdirp");
var ncp = require("ncp").ncp;
var path = require("path");

var b = browserify();
b.add("./src/game.js");

function srcPath(gamePath) {
	// return gamePath;
	return "." + path.sep + path.join("src", gamePath);
}

var scripts = require("./src/data/scripts");
scripts.forEach(function(script) {
	b.require(srcPath(script), { expose: script });
});

var systems = require("./src/data/systems");
systems.simulation.forEach(function(system) {
	if (system.name.indexOf("splatjs:") === 0) {
		return;
	}
	b.require(srcPath(system.name), { expose: system.name });
});
systems.renderer.forEach(function(system) {
	if (system.name.indexOf("splatjs:") === 0) {
		return;
	}
	b.require(srcPath(system.name), { expose: system.name });
});

mkdirp.sync("build");
var out = fs.createWriteStream("./build/index.js");
b.bundle().pipe(out);

ncp("src/index.html", "build/index.html");
ncp("src/images", "build/images");
ncp("src/sounds", "build/sounds");
