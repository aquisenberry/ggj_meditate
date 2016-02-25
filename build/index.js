/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var Splat = __webpack_require__(1);

	// This is some webpack magic to ensure the dynamically required scripts are loaded

	var splatSystemPath = "splat-ecs/lib/systems";
	// WARNING: can't use splatSystemPath variable here, or webpack won't pick it up
	var splatSystemRequire = __webpack_require__(42);

	var localSystemPath = "./systems";
	var localSystemRequire = __webpack_require__(76);

	var localScriptPath = "./scripts";
	var localScriptRequire = __webpack_require__(95);

	var localDataPath = "./data";
	var localDataRequire = __webpack_require__(119);

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
	__webpack_require__(128);
	__webpack_require__(129);
	__webpack_require__(193);

	var game = new Splat.Game(canvas, customRequire);

	function percentLoaded() {
		if (game.images.totalImages + game.sounds.totalSounds === 0) {
			return 1;
		}
		return (game.images.loadedImages + game.sounds.loadedSounds) / (game.images.totalImages + game.sounds.totalSounds);
	}
	var loading = Splat.loadingScene(canvas, percentLoaded, game.scene);
	loading.start(context);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var buffer = __webpack_require__(2);

	/**
	 * @namespace Splat
	 */
	module.exports = {
		makeBuffer: buffer.makeBuffer,
		flipBufferHorizontally: buffer.flipBufferHorizontally,
		flipBufferVertically: buffer.flipBufferVertically,

		ads: __webpack_require__(4),
		AStar: __webpack_require__(5),
		BinaryHeap: __webpack_require__(6),
		Game: __webpack_require__(7),
		iap: __webpack_require__(22),
		ImageLoader: __webpack_require__(8),
		Input: __webpack_require__(9),
		leaderboards: __webpack_require__(23),
		loadingScene: __webpack_require__(24),
		math: __webpack_require__(25),
		openUrl: __webpack_require__(27),
		NinePatch: __webpack_require__(28),
		Particles: __webpack_require__(29),
		saveData: __webpack_require__(30),
		Scene: __webpack_require__(13),
		SoundLoader: __webpack_require__(21),

		components: {
			animation: __webpack_require__(31),
			camera: __webpack_require__(32),
			friction: __webpack_require__(33),
			image: __webpack_require__(34),
			movement2d: __webpack_require__(35),
			playableArea: __webpack_require__(36),
			playerController2d: __webpack_require__(37),
			position: __webpack_require__(38),
			size: __webpack_require__(39),
			timers: __webpack_require__(40),
			velocity: __webpack_require__(41)
		}
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/** @module buffer */

	var platform = __webpack_require__(3);

	/**
	 * Make an invisible {@link canvas}.
	 * @param {number} width The width of the canvas
	 * @param {number} height The height of the canvas
	 * @returns {external:canvas} A canvas DOM element
	 * @private
	 */
	function makeCanvas(width, height) {
		var c = document.createElement("canvas");
		c.width = width;
		c.height = height;
		// when retina support is enabled, context.getImageData() reads from the wrong pixel causing NinePatch to break
		if (platform.isEjecta()) {
			c.retinaResolutionEnabled = false;
		}
		return c;
	}

	/**
	 * Make an invisible canvas buffer, and draw on it.
	 * @param {number} width The width of the buffer
	 * @param {number} height The height of the buffer
	 * @param {drawCallback} drawFun The callback that draws on the buffer
	 * @returns {external:canvas} The drawn buffer
	 */
	function makeBuffer(width, height, drawFun) {
		var canvas = makeCanvas(width, height);
		var ctx = canvas.getContext("2d");
		// when image smoothing is enabled, the image gets blurred and the pixel data isn't correct even when the image shouldn't be scaled which breaks NinePatch
		if (platform.isEjecta()) {
			ctx.imageSmoothingEnabled = false;
		}
		drawFun(ctx);
		return canvas;
	}

	/**
	 * Make a horizonally-flipped copy of a buffer or image.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The flipped buffer
	 */
	function flipBufferHorizontally(buffer) {
		return makeBuffer(buffer.width, buffer.height, function(context) {
			context.scale(-1, 1);
			context.drawImage(buffer, -buffer.width, 0);
		});
	}

	/**
	 * Make a vertically-flipped copy of a buffer or image.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The flipped buffer
	 */
	function flipBufferVertically(buffer) {
		return makeBuffer(buffer.width, buffer.height, function(context) {
			context.scale(1, -1);
			context.drawImage(buffer, 0, -buffer.height);
		});
	}
	/**
	 * Make a copy of a buffer that is rotated 90 degrees clockwise.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The rotated buffer
	 */
	function rotateClockwise(buffer) {
		var w = buffer.height;
		var h = buffer.width;
		var w2 = Math.floor(w / 2);
		var h2 = Math.floor(h / 2);
		return makeBuffer(w, h, function(context) {
			context.translate(w2, h2);
			context.rotate(Math.PI / 2);
			context.drawImage(buffer, -h2, -w2);
		});
	}
	/**
	 * Make a copy of a buffer that is rotated 90 degrees counterclockwise.
	 * @param {external:canvas|external:image} buffer The original image
	 * @return {external:canvas} The rotated buffer
	 */
	function rotateCounterclockwise(buffer) {
		var w = buffer.height;
		var h = buffer.width;
		var w2 = Math.floor(w / 2);
		var h2 = Math.floor(h / 2);
		return makeBuffer(w, h, function(context) {
			context.translate(w2, h2);
			context.rotate(-Math.PI / 2);
			context.drawImage(buffer, -h2, -w2);
		});
	}

	module.exports = {
		makeBuffer: makeBuffer,
		flipBufferHorizontally: flipBufferHorizontally,
		flipBufferVertically: flipBufferVertically,
		rotateClockwise: rotateClockwise,
		rotateCounterclockwise: rotateCounterclockwise
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		isChromeApp: function() {
			return window.chrome && window.chrome.app && window.chrome.app.runtime;
		},
		isEjecta: function() {
			return window.ejecta;
		}
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * @namespace Splat.ads
	 */

	var platform = __webpack_require__(3);

	if (platform.isEjecta()) {
		var adBanner = new window.Ejecta.AdBanner();

		var isLandscape = window.innerWidth > window.innerHeight;

		var sizes = {
			"iPhone": {
				"portrait": {
					"width": 320,
					"height": 50
				},
				"landscape": {
					"width": 480,
					"height": 32
				}
			},
			"iPad": {
				"portrait": {
					"width": 768,
					"height": 66
				},
				"landscape": {
					"width": 1024,
					"height": 66
				}
			}
		};

		var device = window.navigator.userAgent.indexOf("iPad") >= 0 ? "iPad" : "iPhone";
		var size = sizes[device][isLandscape ? "landscape" : "portrait"];

		module.exports = {
			/**
			 * Show an advertisement.
			 * @alias Splat.ads.show
			 * @param {boolean} isAtBottom true if the ad should be shown at the bottom of the screen. false if it should be shown at the top.
			 */
			"show": function(isAtBottom) {
				adBanner.isAtBottom = isAtBottom;
				adBanner.show();
			},
			/**
			 * Hide the current advertisement.
			 * @alias Splat.ads.hide
			 */
			"hide": function() {
				adBanner.hide();
			},
			/**
			 * The width of the ad that will show.
			 * @alias Splat.ads#width
			 */
			"width": size.width,
			/**
			 * The height of the ad that will show.
			 * @alias Splat.ads#height
			 */
			"height": size.height
		};
	} else {
		module.exports = {
			"show": function() {},
			"hide": function() {},
			"width": 0,
			"height": 0
		};
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var BinaryHeap = __webpack_require__(6);

	/**
	 * Implements the [A* pathfinding algorithm]{@link http://en.wikipedia.org/wiki/A*_search_algorithm} on a 2-dimensional grid. You can use this to find a path between a source and destination coordinate while avoiding obstacles.
	 * @constructor
	 * @alias Splat.AStar
	 * @param {isWalkable} isWalkable A function to test if a coordinate is walkable by the entity you're performing the pathfinding for.
	 */
	function AStar(isWalkable) {
		this.destX = 0;
		this.destY = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.openNodes = {};
		this.closedNodes = {};
		this.openHeap = new BinaryHeap(function(a, b) {
			return a.f - b.f;
		});
		this.isWalkable = isWalkable;
	}
	/**
	 * The [A* heuristic]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html}, commonly referred to as h(x), that estimates how far a location is from the destination. This implementation is the [Manhattan method]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#manhattan-distance}, which is good for situations when the entity can travel in four directions. Feel free to replace this with a different heuristic implementation.
	 * @param {number} x The x coordinate to estimate the distance to the destination.
	 * @param {number} y The y coordinate to estimate the distance to the destination.
	 */
	AStar.prototype.heuristic = function(x, y) {
		// manhattan method
		var dx = Math.abs(x - this.destX) / this.scaleX;
		var dy = Math.abs(y - this.destY) / this.scaleY;
		return dx + dy;
	};
	/**
	 * Make a node to track a given coordinate
	 * @param {number} x The x coordinate of the node
	 * @param {number} y The y coordinate of the node
	 * @param {object} parent The parent node for the current node. This chain of parents eventually points back at the starting node.
	 * @param {number} g The g(x) travel cost from the parent node to this node.
	 * @private
	 */
	AStar.prototype.makeNode = function(x, y, parent, g) {
		g += parent.g;
		var h = this.heuristic(x, y);

		return {
			x: x,
			y: y,
			parent: parent,
			f: g + h,
			g: parent.g + g,
			h: h
		};
	};
	/**
	 * Update the g(x) travel cost to a node if a new lower-cost path is found.
	 * @param {string} key The key of the node on the open list.
	 * @param {object} parent A parent node that may have a shorter path for the node specified in key.
	 * @param {number} g The g(x) travel cost from parent to the node specified in key.
	 * @private
	 */
	AStar.prototype.updateOpenNode = function(key, parent, g) {
		var node = this.openNodes[key];
		if (!node) {
			return false;
		}

		var newG = parent.g + g;

		if (newG >= node.g) {
			return true;
		}

		node.parent = parent;
		node.g = newG;
		node.f = node.g + node.h;

		var pos = this.openHeap.indexOf(node);
		this.openHeap.bubbleUp(pos);

		return true;
	};
	/**
	 * Create a neighbor node to a parent node, and add it to the open list for consideration.
	 * @param {string} key The key of the new neighbor node.
	 * @param {number} x The x coordinate of the new neighbor node.
	 * @param {number} y The y coordinate of the new neighbor node.
	 * @param {object} parent The parent node of the new neighbor node.
	 * @param {number} g The travel cost from the parent to the new parent node.
	 * @private
	 */
	AStar.prototype.insertNeighbor = function(key, x, y, parent, g) {
		var node = this.makeNode(x, y, parent, g);
		this.openNodes[key] = node;
		this.openHeap.insert(node);
	};
	AStar.prototype.tryNeighbor = function(x, y, parent, g) {
		var key = makeKey(x, y);
		if (this.closedNodes[key]) {
			return;
		}
		if (!this.isWalkable(x, y)) {
			return;
		}
		if (!this.updateOpenNode(key, parent, g)) {
			this.insertNeighbor(key, x, y, parent, g);
		}
	};
	AStar.prototype.getNeighbors = function getNeighbors(parent) {
		var diagonalCost = 1.4;
		var straightCost = 1;
		this.tryNeighbor(parent.x - this.scaleX, parent.y - this.scaleY, parent, diagonalCost);
		this.tryNeighbor(parent.x, parent.y - this.scaleY, parent, straightCost);
		this.tryNeighbor(parent.x + this.scaleX, parent.y - this.scaleY, parent, diagonalCost);

		this.tryNeighbor(parent.x - this.scaleX, parent.y, parent, straightCost);
		this.tryNeighbor(parent.x + this.scaleX, parent.y, parent, straightCost);

		this.tryNeighbor(parent.x - this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
		this.tryNeighbor(parent.x, parent.y + this.scaleY, parent, straightCost);
		this.tryNeighbor(parent.x + this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
	};

	function generatePath(node) {
		var path = [];
		while (node.parent) {
			var ix = node.x;
			var iy = node.y;
			while (ix !== node.parent.x || iy !== node.parent.y) {
				path.unshift({ x: ix, y: iy });

				var dx = node.parent.x - ix;
				if (dx > 0) {
					ix++;
				} else if (dx < 0) {
					ix--;
				}
				var dy = node.parent.y - iy;
				if (dy > 0) {
					iy++;
				} else if (dy < 0) {
					iy--;
				}
			}
			node = node.parent;
		}
		return path;
	}

	function makeKey(x, y) {
		return x + "," + y;
	}

	/**
	 * Search for an optimal path between srcX, srcY and destX, destY, while avoiding obstacles.
	 * @param {number} srcX The starting x coordinate
	 * @param {number} srcY The starting y coordinate
	 * @param {number} destX The destination x coordinate
	 * @param {number} destY The destination y coordinate
	 * @returns {Array} The optimal path, in the form of an array of objects that each have an x and y property.
	 */
	AStar.prototype.search = function aStar(srcX, srcY, destX, destY) {
		function scale(c, s) {
			var downscaled = Math.floor(c / s);
			return downscaled * s;
		}
		srcX = scale(srcX, this.scaleX);
		srcY = scale(srcY, this.scaleY);
		this.destX = scale(destX, this.scaleX);
		this.destY = scale(destY, this.scaleY);

		if (!this.isWalkable(this.destX, this.destY)) {
			return [];
		}

		var srcKey = makeKey(srcX, srcY);
		var srcNode = {
			x: srcX,
			y: srcY,
			g: 0,
			h: this.heuristic(srcX, srcY)
		};
		srcNode.f = srcNode.h;
		this.openNodes = {};
		this.openNodes[srcKey]  = srcNode;
		this.openHeap = new BinaryHeap(function(a, b) {
			return a.f - b.f;
		});
		this.openHeap.insert(srcNode);
		this.closedNodes = {};

		var node = this.openHeap.deleteRoot();
		while (node) {
			var key = makeKey(node.x, node.y);
			delete this.openNodes[key];
			this.closedNodes[key] = node;
			if (node.x === this.destX && node.y === this.destY) {
				return generatePath(node);
			}
			this.getNeighbors(node);
			node = this.openHeap.deleteRoot();
		}
		return [];
	};

	module.exports = AStar;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * An implementation of the [Binary Heap]{@link https://en.wikipedia.org/wiki/Binary_heap} data structure suitable for priority queues.
	 * @constructor
	 * @alias Splat.BinaryHeap
	 * @param {compareFunction} cmp A comparison function that determines how the heap is sorted.
	 */
	function BinaryHeap(cmp) {
		/**
		 * The comparison function for sorting the heap.
		 * @member {compareFunction}
		 * @private
		 */
		this.cmp = cmp;
		/**
		 * The list of elements in the heap.
		 * @member {Array}
		 * @private
		 */
		this.array = [];
		/**
		 * The number of elements in the heap.
		 * @member {number}
		 * @readonly
		 */
		this.length = 0;
	}
	/**
	 * Calculate the index of a node's parent.
	 * @param {number} i The index of the child node
	 * @returns {number}
	 * @private
	 */
	BinaryHeap.prototype.parentIndex = function(i) {
		return Math.floor((i - 1) / 2);
	};
	/**
	 * Calculate the index of a parent's first child node.
	 * @param {number} i The index of the parent node
	 * @returns {number}
	 * @private
	 */
	BinaryHeap.prototype.firstChildIndex = function(i) {
		return (2 * i) + 1;
	};
	/**
	 * Bubble a node up the heap, stopping when it's value should not be sorted before its parent's value.
	 * @param {number} pos The index of the node to bubble up.
	 * @private
	 */
	BinaryHeap.prototype.bubbleUp = function(pos) {
		if (pos === 0) {
			return;
		}

		var data = this.array[pos];
		var parentIndex = this.parentIndex(pos);
		var parent = this.array[parentIndex];
		if (this.cmp(data, parent) < 0) {
			this.array[parentIndex] = data;
			this.array[pos] = parent;
			this.bubbleUp(parentIndex);
		}
	};
	/**
	 * Store a new node in the heap.
	 * @param {object} data The data to store
	 */
	BinaryHeap.prototype.insert = function(data) {
		this.array.push(data);
		this.length = this.array.length;
		var pos = this.array.length - 1;
		this.bubbleUp(pos);
	};
	/**
	 * Bubble a node down the heap, stopping when it's value should not be sorted after its parent's value.
	 * @param {number} pos The index of the node to bubble down.
	 * @private
	 */
	BinaryHeap.prototype.bubbleDown = function(pos) {
		var left = this.firstChildIndex(pos);
		var right = left + 1;
		var largest = pos;
		if (left < this.array.length && this.cmp(this.array[left], this.array[largest]) < 0) {
			largest = left;
		}
		if (right < this.array.length && this.cmp(this.array[right], this.array[largest]) < 0) {
			largest = right;
		}
		if (largest !== pos) {
			var tmp = this.array[pos];
			this.array[pos] = this.array[largest];
			this.array[largest] = tmp;
			this.bubbleDown(largest);
		}
	};
	/**
	 * Remove the heap's root node, and return it. The root node is whatever comes first as determined by the {@link compareFunction}.
	 * @returns {data} The root node's data.
	 */
	BinaryHeap.prototype.deleteRoot = function() {
		var root = this.array[0];
		if (this.array.length <= 1) {
			this.array = [];
			this.length = 0;
			return root;
		}
		this.array[0] = this.array.pop();
		this.length = this.array.length;
		this.bubbleDown(0);
		return root;
	};
	/**
	 * Search for a node in the heap.
	 * @param {object} data The data to search for.
	 * @returns {number} The index of the data in the heap, or -1 if it is not found.
	 */
	BinaryHeap.prototype.indexOf = function(data) {
		for (var i = 0; i < this.array.length; i++) {
			if (this.array[i] === data) {
				return i;
			}
		}
		return -1;
	};

	module.exports = BinaryHeap;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ImageLoader = __webpack_require__(8);
	var Input = __webpack_require__(9);
	var Scene = __webpack_require__(13);
	var SoundLoader = __webpack_require__(21);

	function clone(obj) {
		if (obj === undefined) {
			return undefined;
		}
		return JSON.parse(JSON.stringify(obj));
	}
	function splitFilmStripAnimations(animations) {
		Object.keys(animations).forEach(function(key) {
			var firstFrame = animations[key][0];
			if (firstFrame.filmstripFrames) {
				splitFilmStripAnimation(animations, key);
			}
		});
	}
	function splitFilmStripAnimation(animations, key) {
		var firstFrame = animations[key][0];
		if (firstFrame.properties.image.sourceWidth % firstFrame.filmstripFrames != 0) {
			console.warn("The \"" + key + "\" animation is " + firstFrame.properties.image.sourceWidth + " pixels wide and that is is not evenly divisible by " + firstFrame.filmstripFrames + " frames.");
		}
		for (var i = 0; i < firstFrame.filmstripFrames; i++) {
			var frameWidth = firstFrame.properties.image.sourceWidth / firstFrame.filmstripFrames;
			var newFrame = clone(firstFrame);
			newFrame.properties.image.sourceX = frameWidth * i;
			newFrame.properties.image.sourceWidth = frameWidth;
			animations[key].push(newFrame);
		}
		animations[key].splice(0,1);
	}

	function Game(canvas, customRequire) {
		this.animations = customRequire("./data/animations");
		splitFilmStripAnimations(this.animations);
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.entities = customRequire("./data/entities");
		this.images = new ImageLoader();
		this.images.loadFromManifest(customRequire("./data/images"));
		this.input = new Input(customRequire("./data/inputs"), canvas);
		this.require = customRequire;
		this.scenes = customRequire("./data/scenes");
		this.sounds = new SoundLoader();
		this.sounds.loadFromManifest(customRequire("./data/sounds"));
		this.systems = customRequire("./data/systems");
		this.prefabs = customRequire("./data/prefabs");

		this.scaleCanvasToCssSize();
		window.addEventListener("resize", this.onCanvasResize.bind(this));

		this.makeScenes(this.scenes);
	}
	Game.prototype.makeScenes = function(sceneList) {
		Object.keys(sceneList).forEach(function(scene) {
			if (sceneList[scene].first) {
				this.scene = this.makeScene(scene, sceneList[scene], {});
			}
		}.bind(this));
	};
	Game.prototype.makeScene = function(name, sceneData, sceneArgs) {
		var scene = new Scene();

		var data = this.makeSceneData(scene.entities, sceneArgs);
		scene.simulation.add(function() {
			data.input.processUpdates();
		});
		this.installSystems(name, this.systems.simulation, scene.simulation, data);
		this.installSystems(name, this.systems.renderer, scene.renderer, data);
		scene.entities.load(clone(this.entities[name]));

		if (typeof sceneData.onEnter === "string") {
			var enterScript = this.require(sceneData.onEnter);
			if (typeof enterScript === "function") {
				enterScript = enterScript.bind(scene, data);
			}
			scene.onEnter = enterScript;
		}
		if (typeof sceneData.onExit === "string") {
			var exitScript = this.require(sceneData.onExit);
			if (typeof exitScript === "function") {
				exitScript = exitScript.bind(scene, data);
			}
			scene.onExit = exitScript;
		}

		return scene;
	};
	Game.prototype.makeSceneData = function(entities, sceneArgs) {
		return {
			animations: this.animations,
			arguments: sceneArgs || {},
			canvas: this.canvas,
			context: this.context,
			entities: entities,
			images: this.images,
			input: this.input,
			require: this.require,
			scaleCanvasToCssSize: this.scaleCanvasToCssSize.bind(this),
			scaleCanvasToFitRectangle: this.scaleCanvasToFitRectangle.bind(this),
			sounds: this.sounds,
			switchScene: this.switchScene.bind(this),
			instantiatePrefab: this.instantiatePrefab.bind(this)
		};
	};
	Game.prototype.installSystems = function(scene, systems, ecs, data) {
		systems.forEach(function(system) {
			if (system.scenes.indexOf(scene) === -1) {
				return;
			}
			var script = this.require(system.name);
			if (script === undefined) {
				console.error("failed to load script", system.name);
			}
			script(ecs, data);
		}.bind(this));
	};
	Game.prototype.switchScene = function(name, sceneArgs) {
		if (this.scene !== undefined) {
			this.scene.stop();
		}
		this.scene = this.makeScene(name, this.scenes[name], sceneArgs);
		this.scene.start(this.context);
	};
	Game.prototype.onCanvasResize = function() {
		this.resizer();
	};
	Game.prototype.scaleCanvasToCssSize = function() {
		this.resizer = function() {
			var canvasStyle = window.getComputedStyle(this.canvas);
			var width = parseInt(canvasStyle.width);
			var height = parseInt(canvasStyle.height);
			this.canvas.width = width;
			this.canvas.height = height;
		}.bind(this);
		this.resizer();
	};
	Game.prototype.scaleCanvasToFitRectangle = function(width, height) {
		this.resizer = function() {
			var canvasStyle = window.getComputedStyle(this.canvas);
			var cssWidth = parseInt(canvasStyle.width);
			var cssHeight = parseInt(canvasStyle.height);
			var cssAspectRatio = cssWidth / cssHeight;

			var desiredWidth = width;
			var desiredHeight = height;
			var desiredAspectRatio = width / height;
			if (desiredAspectRatio > cssAspectRatio) {
				desiredHeight = Math.floor(width / cssAspectRatio);
			} else if (desiredAspectRatio < cssAspectRatio) {
				desiredWidth = Math.floor(height * cssAspectRatio);
			}

			this.canvas.width = desiredWidth;
			this.canvas.height = desiredHeight;
		}.bind(this);
		this.resizer();
	};
	Game.prototype.instantiatePrefab = function(name) {
		var id = this.scene.entities.create();
		var prefab = this.prefabs[name];
		Object.keys(prefab).forEach(function(key) {
			if (key === "id") {
				return;
			}
			this.scene.entities.set(id, key, clone(prefab[key]));
		}.bind(this));
		return id;
	};

	module.exports = Game;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Loads {@link external:image}s and lets you know when they're all available. An instance of ImageLoader is available as {@link Splat.Game#images}.
	 * @constructor
	 */
	function ImageLoader(onLoad) {
		/**
		 * The key-value object that stores named {@link external:image}s
		 * @member {object}
		 * @private
		 */
		this.images = {};
		/**
		 * The total number of images to be loaded.
		 * @member {number}
		 * @private
		 */
		this.totalImages = 0;
		/**
		 * The number of images that have loaded completely.
		 * @member {number}
		 * @private
		 */
		this.loadedImages = 0;
		/**
		 * The names of all the images that were requested to be loaded.
		 * @member {Array}
		 * @private
		 */
		this.names = [];
		/**
		 * A callback to be called once all images are loaded.
		 * @member {Array}
		 * @private
		 */
		this.onLoad = onLoad;
	}
	/**
	 * Load an {@link external:image}.
	 * @param {string} name The name you want to use when you {@link ImageLoader#get} the {@link external:image}
	 * @param {string} path The path of the {@link external:image}.
	 */
	ImageLoader.prototype.load = function(name, path) {
		// only load an image once
		if (this.names.indexOf(name) > -1) {
			return;
		}
		this.names.push(name);

		this.totalImages++;

		var img = new Image();
		var self = this;
		img.addEventListener("load", function() {
			self.loadedImages++;
			self.images[name] = img;
			if (self.allLoaded() && self.onLoad) {
				self.onLoad();
			}
		});
		img.addEventListener("error", function() {
			console.error("Error loading image " + path);
		});
		img.src = path;
	};
	ImageLoader.prototype.loadFromManifest = function(manifest) {
		var keys = Object.keys(manifest);
		var self = this;
		keys.forEach(function(key) {
			self.load(key, manifest[key]);
		});
	};

	/**
	 * Test if all {@link external:image}s have loaded.
	 * @returns {boolean}
	 */
	ImageLoader.prototype.allLoaded = function() {
		return this.totalImages === this.loadedImages;
	};
	/**
	 * Retrieve a loaded {@link external:image}.
	 * @param {string} name The name given to the image during {@link ImageLoader#load}.
	 * @returns {external:image}
	 */
	ImageLoader.prototype.get = function(name) {
		return this.images[name];
	};

	module.exports = ImageLoader;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Keyboard = __webpack_require__(10);
	var keyMap = __webpack_require__(11).US;
	var keyboard = new Keyboard(keyMap);
	var Mouse = __webpack_require__(12);

	function Input(config, canvas) {
		this.config = config;
		this.mouse = new Mouse(canvas);
		this.lastButtonState = {};
		this.delayedButtonUpdates = {};
	}
	Input.prototype.button = function(name) {
		var input = this.config[name];
		if (input === undefined) {
			console.error("No such button: " + name);
			return false;
		}
		if (input.type !== "button") {
			console.error("\"" + name + "\" is not a button");
			return false;
		}
		for (var i = 0; i < input.inputs.length; i++) {
			var physicalInput = input.inputs[i];
			var device = physicalInput.device;
			if (device === "keyboard") {
				var key = physicalInput.key;
				if (keyboard.isPressed(key)) {
					return true;
				}
			}
			if (device === "touch") {
				for (var j = 0; j < this.mouse.touches.length; j++) {
					var t = this.mouse.touches[j];
					if (t.x >= physicalInput.x && t.x < physicalInput.x + physicalInput.width && t.y >= physicalInput.y && t.y < physicalInput.y + physicalInput.height) {
						return true;
					}
				}
			}
		}
		return false;
	};
	Input.prototype.buttonPressed = function(name) {
		var current = this.button(name);
		var last = this.lastButtonState[name];
		if (last === undefined) {
			last = true;
		}
		this.delayedButtonUpdates[name] = current;
		return current && !last;
	};
	Input.prototype.buttonReleased = function(name) {
		var current = this.button(name);
		var last = this.lastButtonState[name];
		if (last === undefined) {
			last = false;
		}
		this.delayedButtonUpdates[name] = current;
		return !current && last;
	};
	Input.prototype.processUpdates = function() {
		Object.keys(this.delayedButtonUpdates).forEach(function(name) {
			this.lastButtonState[name] = this.delayedButtonUpdates[name];
			delete this.delayedButtonUpdates[name];
		}.bind(this));
	};

	module.exports = Input;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Keyboard input handling.
	 * @constructor
	 * @param {module:KeyMap} keymap A map of keycodes to descriptive key names.
	 */
	function Keyboard(keyMap) {
		/**
		 * The current key states.
		 * @member {object}
		 * @private
		 */
		this.keys = {};

		var self = this;
		for (var kc in keyMap) {
			if (keyMap.hasOwnProperty(kc)) {
				this.keys[keyMap[kc]] = 0;
			}
		}
		window.addEventListener("keydown", function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				if (self.keys[keyMap[event.keyCode]] === 0) {
					self.keys[keyMap[event.keyCode]] = 2;
				}
				return false;
			}
		});
		window.addEventListener("keyup", function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				self.keys[keyMap[event.keyCode]] = 0;
				return false;
			}
		});
	}
	/**
	 * Test if a key is currently pressed.
	 * @param {string} name The name of the key to test
	 * @returns {boolean}
	 */
	Keyboard.prototype.isPressed = function(name) {
		return this.keys[name] >= 1;
	};
	/**
	 * Test if a key is currently pressed, also making it look like the key was unpressed.
	 * This makes is so multiple successive calls will not return true unless the key was repressed.
	 * @param {string} name The name of the key to test
	 * @returns {boolean}
	 */
	Keyboard.prototype.consumePressed = function(name) {
		var p = this.keys[name] === 2;
		if (p) {
			this.keys[name] = 1;
		}
		return p;
	};

	module.exports = Keyboard;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Keyboard code mappings that map keycodes to key names. A specific named map should be given to {@link Keyboard}.
	 * @module KeyMap
	 */
	module.exports = {
		"US": {
			8: "backspace",
			9: "tab",
			13: "enter",
			16: "shift",
			17: "ctrl",
			18: "alt",
			19: "pause/break",
			20: "capslock",
			27: "escape",
			32: "space",
			33: "pageup",
			34: "pagedown",
			35: "end",
			36: "home",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
			45: "insert",
			46: "delete",
			48: "0",
			49: "1",
			50: "2",
			51: "3",
			52: "4",
			53: "5",
			54: "6",
			55: "7",
			56: "8",
			57: "9",
			65: "a",
			66: "b",
			67: "c",
			68: "d",
			69: "e",
			70: "f",
			71: "g",
			72: "h",
			73: "i",
			74: "j",
			75: "k",
			76: "l",
			77: "m",
			78: "n",
			79: "o",
			80: "p",
			81: "q",
			82: "r",
			83: "s",
			84: "t",
			85: "u",
			86: "v",
			87: "w",
			88: "x",
			89: "y",
			90: "z",
			91: "leftwindow",
			92: "rightwindow",
			93: "select",
			96: "numpad-0",
			97: "numpad-1",
			98: "numpad-2",
			99: "numpad-3",
			100: "numpad-4",
			101: "numpad-5",
			102: "numpad-6",
			103: "numpad-7",
			104: "numpad-8",
			105: "numpad-9",
			106: "multiply",
			107: "add",
			109: "subtract",
			110: "decimalpoint",
			111: "divide",
			112: "f1",
			113: "f2",
			114: "f3",
			115: "f4",
			116: "f5",
			117: "f6",
			118: "f7",
			119: "f8",
			120: "f9",
			121: "f10",
			122: "f11",
			123: "f12",
			144: "numlock",
			145: "scrolllock",
			186: "semicolon",
			187: "equals",
			188: "comma",
			189: "dash",
			190: "period",
			191: "forwardslash",
			192: "graveaccent",
			219: "openbracket",
			220: "backslash",
			221: "closebraket",
			222: "singlequote"
		}
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var platform = __webpack_require__(3);

	// prevent springy scrolling on ios
	document.ontouchmove = function(e) {
		e.preventDefault();
	};

	// prevent right-click on desktop
	window.oncontextmenu = function() {
		return false;
	};

	var relMouseCoords = function(canvas, event) {
		var x = event.pageX - canvas.offsetLeft + document.body.scrollLeft;
		var y = event.pageY - canvas.offsetTop + document.body.scrollTop;

		// scale based on ratio of canvas internal dimentions to css dimensions
		var style = window.getComputedStyle(canvas);
		var cw = parseInt(style.width);
		var ch = parseInt(style.height);

		x *= canvas.width / cw;
		y *= canvas.height / ch;

		return {
			x: Math.floor(x),
			y: Math.floor(y)
		};
	};

	function relMouseCoordsEjecta(canvas, event) {
		var ratioX = canvas.width / window.innerWidth;
		var ratioY = canvas.height / window.innerHeight;
		var x = event.pageX * ratioX;
		var y = event.pageY * ratioY;
		return { x: x, y: y };
	}

	if (platform.isEjecta()) {
		relMouseCoords = relMouseCoordsEjecta;
	}

	/**
	 * Mouse and touch input handling. An instance of Mouse is available as {@link Splat.Game#mouse}.
	 *
	 * The first touch will emulates a mouse press with button 0.
	 * This means you can use the mouse ({@link Mouse#isPressed}/{@link Mouse#consumePressed}) APIs and your game will work on touch screens (as long as you only need the left button.
	 *
	 * A mouse press will emulate a touch if the device does not support touch.
	 * This means you can use {@link Mouse#touches}, and your game will still work on a PC with a mouse.
	 * Also, if you call {@link Mouse#consumePressed} with button 0, it will add a `consumed:true` field to all current touches. This will help you prevent processing a touch multiple times.
	 *
	 * @constructor
	 * @param {external:canvas} canvas The canvas to listen for events on.
	 */
	function Mouse(canvas) {
		/**
		 * The x coordinate of the cursor relative to the left side of the canvas.
		 * @member {number}
		 */
		this.x = 0;
		/**
		 * The y coordinate of the cursor relative to the top of the canvas.
		 * @member {number}
		 */
		this.y = 0;
		/**
		 * The current button states.
		 * @member {Array}
		 * @private
		 */
		this.buttons = [0, 0, 0];

		/**
		 * An array of the current touches on a touch screen device. Each touch has a `x`, `y`, and `id` field.
		 * @member {Array}
		 */
		this.touches = [];

		/**
		 * A function that is called when a mouse button or touch is released.
		 * @callback onmouseupHandler
		 * @param {number} x The x coordinate of the mouse or touch that was released.
		 * @param {number} y The y coordinate of the mouse or touch that was released.
		 */
		/**
		 * A function that will be called when a mouse button is released, or a touch has stopped.
		 * This is useful for opening a URL with {@link Splat.openUrl} to avoid popup blockers.
		 * @member {onmouseupHandler}
		 */
		this.onmouseup = undefined;

		var self = this;
		canvas.addEventListener("mousedown", function(event) {
			var m = relMouseCoords(canvas, event);
			self.x = m.x;
			self.y = m.y;
			self.buttons[event.button] = 2;
			updateTouchFromMouse();
		});
		canvas.addEventListener("mouseup", function(event) {
			var m = relMouseCoords(canvas, event);
			self.x = m.x;
			self.y = m.y;
			self.buttons[event.button] = 0;
			updateTouchFromMouse();
			if (self.onmouseup) {
				self.onmouseup(self.x, self.y);
			}
		});
		canvas.addEventListener("mousemove", function(event) {
			var m = relMouseCoords(canvas, event);
			self.x = m.x;
			self.y = m.y;
			updateTouchFromMouse();
		});

		function updateTouchFromMouse() {
			if (self.supportsTouch()) {
				return;
			}
			var idx = touchIndexById("mouse");
			if (self.isPressed(0)) {
				if (idx !== undefined) {
					var touch = self.touches[idx];
					touch.x = self.x;
					touch.y = self.y;
				} else {
					self.touches.push({
						id: "mouse",
						x: self.x,
						y: self.y
					});
				}
			} else if (idx !== undefined) {
				self.touches.splice(idx, 1);
			}
		}
		function updateMouseFromTouch(touch) {
			self.x = touch.x;
			self.y = touch.y;
			if (self.buttons[0] === 0) {
				self.buttons[0] = 2;
			}
		}
		function touchIndexById(id) {
			for (var i = 0; i < self.touches.length; i++) {
				if (self.touches[i].id === id) {
					return i;
				}
			}
			return undefined;
		}
		function eachChangedTouch(event, onChangeFunc) {
			var touches = event.changedTouches;
			for (var i = 0; i < touches.length; i++) {
				onChangeFunc(touches[i]);
			}
		}
		canvas.addEventListener("touchstart", function(event) {
			eachChangedTouch(event, function(touch) {
				var t = relMouseCoords(canvas, touch);
				t.id = touch.identifier;
				if (self.touches.length === 0) {
					t.isMouse = true;
					updateMouseFromTouch(t);
				}
				self.touches.push(t);
			});
		});
		canvas.addEventListener("touchmove", function(event) {
			eachChangedTouch(event, function(touch) {
				var idx = touchIndexById(touch.identifier);
				var t = self.touches[idx];
				var coords = relMouseCoords(canvas, touch);
				t.x = coords.x;
				t.y = coords.y;
				if (t.isMouse) {
					updateMouseFromTouch(t);
				}
			});
		});
		canvas.addEventListener("touchend", function(event) {
			eachChangedTouch(event, function(touch) {
				var idx = touchIndexById(touch.identifier);
				var t = self.touches.splice(idx, 1)[0];
				if (t.isMouse) {
					if (self.touches.length === 0) {
						self.buttons[0] = 0;
					} else {
						self.touches[0].isMouse = true;
						updateMouseFromTouch(self.touches[0]);
					}
				}
				if (self.onmouseup) {
					self.onmouseup(t.x, t.y);
				}
			});
		});
	}
	/**
	 * Test whether the device supports touch events. This is useful to customize messages to say either "click" or "tap".
	 * @returns {boolean}
	 */
	Mouse.prototype.supportsTouch = function() {
		return "ontouchstart" in window || navigator.msMaxTouchPoints;
	};
	/**
	 * Test if a mouse button is currently pressed.
	 * @param {number} button The button number to test. Button 0 is typically the left mouse button, as well as the first touch location.
	 * @param {number} [x] The left edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [y] The top edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [width] The width of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [height] The height of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @returns {boolean}
	 */
	Mouse.prototype.isPressed = function(button, x, y, width, height) {
		var b = this.buttons[button] >= 1;
		if (arguments.length > 1 && (this.x < x || this.x > x + width || this.y < y || this.y > y + height)) {
			b = false;
		}
		return b;
	};
	/**
	 * Test if a mouse button is currently pressed, and was newly pressed down since the last call to consumePressed.
	 * If you call this with button 0, it will add a `consumed:true` field to all current touches. This will help you prevent processing a touch multiple times.
	 * @param {number} button The button number to test.
	 * @param {number} [x] The left edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [y] The top edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [width] The width of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [height] The height of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @returns {boolean}
	 */
	Mouse.prototype.consumePressed = function(button, x, y, width, height) {
		var b = this.buttons[button] === 2;
		if (arguments.length > 1 && (this.x < x || this.x > x + width || this.y < y || this.y > y + height)) {
			b = false;
		}
		if (b) {
			this.buttons[button] = 1;
			if (button === 0) {
				for (var i = 0; i < this.touches.length; i++) {
					this.touches[i].consumed = true;
				}
			}
		}
		return b;
	};

	module.exports = Mouse;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var ECS = __webpack_require__(14).EntityComponentSystem;
	var EntityPool = __webpack_require__(14).EntityPool;
	var gameLoop = __webpack_require__(18);

	function Scene() {
		this.simulation = new ECS();
		this.renderer = new ECS();
		this.entities = new EntityPool();
		this.simulationStepTime = 5;
	}
	Scene.prototype.start = function(context) {
		if (this._stop) {
			return;
		}
		if (typeof this.onEnter === "function") {
			this.onEnter();
		}
		this._stop = gameLoop(this.entities, this.simulation, this.simulationStepTime, this.renderer, context);
	};
	Scene.prototype.stop = function() {
		if (!this._stop) {
			return;
		}
		this._stop();
		delete this._stop;

		if (typeof this.onExit === "function") {
			this.onExit();
		}
	};

	module.exports = Scene;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
		EntityComponentSystem: __webpack_require__(15),
		EntityPool: __webpack_require__(17)
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var present = __webpack_require__(16);

	function EntityComponentSystem() {
		this.systems = [];
		this.systemNames = [];
		this.systemTimes = [];
		this.runCount = 0;
	}
	EntityComponentSystem.prototype.add = function(code) {
		this.systems.push(code);
		this.systemNames.push(code.name);
		this.systemTimes.push(0);
	};
	EntityComponentSystem.prototype.addEach = function(code, search) {
		this.systems.push(function(entities) {
			var args = arguments;
			var keys = entities.find(search);
			for (var i = 0; i < keys.length; i++) {
				var entity = keys[i];
				args[0] = entity;
				code.apply(undefined, args);
			}
		});
		this.systemNames.push(code.name);
		this.systemTimes.push(0);
	};
	EntityComponentSystem.prototype.run = function() {
		var args = arguments;
		for (var i = 0; i < this.systems.length; i++) {
			var start = present();
			this.systems[i].apply(undefined, args);
			var end = present();
			this.systemTimes[i] += end - start;
		}
		this.runCount++;
	};
	EntityComponentSystem.prototype.runs = function() {
		return this.runCount;
	};
	EntityComponentSystem.prototype.timings = function() {
		return this.systemNames.map(function(name, i) {
			return {
				name: name,
				time: this.systemTimes[i]
			};
		}.bind(this));
	};
	EntityComponentSystem.prototype.resetTimings = function() {
		this.systemTimes = this.systemTimes.map(function() {
			return 0;
		});
	};

	module.exports = EntityComponentSystem;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {var performance = global.performance || {};

	var present = (function () {
	  var names = ['now', 'webkitNow', 'msNow', 'mozNow', 'oNow'];
	  while (names.length) {
	    var name = names.shift();
	    if (name in performance) {
	      return performance[name].bind(performance);
	    }
	  }

	  var dateNow = Date.now || function () { return new Date().getTime(); };
	  var navigationStart = (performance.timing || {}).navigationStart || dateNow();
	  return function () {
	    return dateNow() - navigationStart;
	  };
	}());

	present.performanceNow = performance.now;
	present.noConflict = function () {
	  performance.now = present.performanceNow;
	};
	present.conflict = function () {
	  performance.now = present;
	};
	present.conflict();

	module.exports = present;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	function EntityPool() {
		this.nextId = 0;
		this._entities = {};
		this.searchToComponents = {};
		this.componentToSearches = {};
		this.searchResults = {};
		this.callbacks = {};
	}
	EntityPool.prototype.create = function() {
		var id = this.nextId++;
		this._entities[id] = { id: id };
		return id;
	};
	EntityPool.prototype.destroy = function(id) {
		var entity = this._entities[id];
		Object.keys(entity).forEach(function(component) {
			if (component === "id") {
				return;
			}
			this.remove(id, component);
		}.bind(this));
		delete this._entities[id];
	};
	EntityPool.prototype.get = function(id, component) {
		return this._entities[id][component];
	};
	EntityPool.prototype.remove = function(id, component) {
		if (this._entities[id][component] === undefined) {
			return;
		}
		var oldValue = this._entities[id][component];
		delete this._entities[id][component];
		for (var i = 0; i < this.componentToSearches[component].length; i++) {
			var search = this.componentToSearches[component][i];
			removeFromArray(this.searchResults[search], id);
		}
		this.fireCallback("remove", id, component, oldValue);
	};
	EntityPool.prototype.set = function(id, component, value) {
		if (value === undefined) {
			return this.remove(id, component);
		}
		var wasUndefined = this._entities[id][component] === undefined;
		this._entities[id][component] = value;
		if (!wasUndefined) {
			return;
		}
		if (this.searchToComponents[component] === undefined) {
			this.mapSearch(component, [component]);
		}
		for (var i = 0; i < this.componentToSearches[component].length; i++) {
			var search = this.componentToSearches[component][i];
			if (objectHasProperties(this.searchToComponents[search], this._entities[id])) {
				this.searchResults[search].push(id);
			}
		}
		this.fireCallback("add", id, component, value);
	};
	// private
	EntityPool.prototype.addCallback = function(type, component, callback) {
		this.callbacks[type] = this.callbacks[type] || {};
		this.callbacks[type][component] = this.callbacks[type][component] || [];
		this.callbacks[type][component].push(callback);
	};
	// private
	EntityPool.prototype.fireCallback = function(type, id, component) {
		if (this.callbackQueue) {
			this.callbackQueue.push(Array.prototype.slice.call(arguments, 0));
			return;
		}
		var cbs = this.callbacks[type] || {};
		var ccbs = cbs[component] || [];
		var args = Array.prototype.slice.call(arguments, 3);
		for (var i = 0; i < ccbs.length; i++) {
			ccbs[i].apply(this, [id, component].concat(args));
		}
	};
	// private
	EntityPool.prototype.fireQueuedCallbacks = function() {
		var queue = this.callbackQueue || [];
		delete this.callbackQueue;
		for (var i = 0; i < queue.length; i++) {
			this.fireCallback.apply(this, queue[i]);
		}
	};

	EntityPool.prototype.onAddComponent = function(component, callback) {
		this.addCallback("add", component, callback);
	};
	EntityPool.prototype.onRemoveComponent = function(component, callback) {
		this.addCallback("remove", component, callback);
	};
	EntityPool.prototype.find = function(search) {
		return this.searchResults[search] || [];
	};
	// private
	EntityPool.prototype.mapSearch = function(search, components) {
		if (this.searchToComponents[search] !== undefined) {
			throw "the search \"" + search + "\" was already registered";
		}

		this.searchToComponents[search] = components.slice(0);

		for (var i = 0; i < components.length; i++) {
			var c = components[i];
			if (this.componentToSearches[c] === undefined) {
				this.componentToSearches[c] = [search];
			} else {
				this.componentToSearches[c].push(search);
			}
		}

		this.searchResults[search] = [];
	};
	EntityPool.prototype.registerSearch = function(search, components) {
		this.mapSearch(search, components);
		this.searchResults[search] = objectValues(this._entities)
			.filter(objectHasProperties.bind(undefined, components))
			.map(entityId);
	};

	EntityPool.prototype.load = function(entities) {
		this.callbackQueue = [];
		entities.forEach(function(entity) {
			var id = entity.id;
			this._entities[id] = { id: id };
			if (this.nextId <= id) {
				this.nextId = id + 1;
			}
			Object.keys(entity).forEach(function(component) {
				this.set(id, component, entity[component]);
			}.bind(this));
		}.bind(this));
		this.fireQueuedCallbacks();
	};

	EntityPool.prototype.save = function() {
		return objectValues(this._entities);
	};

	function removeFromArray(array, item) {
		var i = array.indexOf(item);
		if (i !== -1) {
			array.splice(i, 1);
		}
		return array;
	}

	function entityId(entity) {
		return entity.id;
	}
	function objectHasProperties(properties, obj) {
		return properties.every(Object.prototype.hasOwnProperty.bind(obj));
	}

	function objectValues(obj) {
		return Object.keys(obj).map(function(key) {
			return obj[key];
		});
	}

	module.exports = EntityPool;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var timeAccumulator = __webpack_require__(19);

	module.exports = function(entities, simulation, simulationStepTime, renderer, context) {
		var run = timeAccumulator(simulationStepTime);
		var timeDelta = __webpack_require__(20)();
		var running = true;

		// run simulation the first time, because not enough time will have elapsed
		simulation.run(entities, 0);

		var remainingDebugTime;
		window.timeSystems = function(total) {
			simulation.resetTimings();
			renderer.resetTimings();
			remainingDebugTime = total;
		};
		function trackDebugTiming(elapsed) {
			if (remainingDebugTime === undefined) {
				return;
			}
			remainingDebugTime -= elapsed;
			if (remainingDebugTime > 0) {
				return;
			}
			remainingDebugTime = undefined;

			var timings = simulation.timings().concat(renderer.timings());
			var total = timings.map(function(timing) {
				return timing.time;
			}).reduce(function(a, b) {
				return a + b;
			});
			timings.sort(function(a, b) {
				return b.time - a.time;
			}).forEach(function(timing) {
				timing.percent = timing.time / total;
			});
			console.table(timings);
		}

		function render(time) {
			if (!running) {
				return;
			}

			var elapsed = timeDelta(time);
			run(elapsed, function(elapsed) {
				simulation.run(entities, elapsed);
			});

			context.save();
			renderer.run(entities, context, elapsed);
			context.restore();

			trackDebugTiming(elapsed);

			if (running) {
				window.requestAnimationFrame(render);
			}
		}
		window.requestAnimationFrame(render);

		return function() {
			running = false;
		};
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(rate) {
		var accum = 0;
		return function(time, callback) {
			accum += time;
			while (accum >= rate) {
				accum -= rate;
				callback(rate);
			}
		};
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	// converts a changing absolute value into a value relative to the previous value
	module.exports = function() {
		var last = -1;
		return function(current) {
			if (last === -1) {
				last = current;
			}
			var delta = current - last;
			last = current;
			return delta;
		};
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	/**
	 * Loads sound files and lets you know when they're all available. An instance of SoundLoader is available as {@link Splat.Game#sounds}.
	 * This implementation uses the Web Audio API, and if that is not available it automatically falls back to the HTML5 &lt;audio&gt; tag.
	 * @constructor
	 */
	function SoundLoader(onLoad) {
		/**
		 * The key-value object that stores named sounds.
		 * @member {object}
		 * @private
		 */
		this.sounds = {};
		/**
		 * The total number of sounds to be loaded.
		 * @member {number}
		 * @private
		 */
		this.totalSounds = 0;
		/**
		 * The number of sounds that have loaded completely.
		 * @member {number}
		 * @private
		 */
		this.loadedSounds = 0;
		/**
		 * A flag signifying if sounds have been muted through {@link SoundLoader#mute}.
		 * @member {boolean}
		 * @private
		 */
		this.muted = false;
		/**
		 * A key-value object that stores named looping sounds.
		 * @member {object}
		 * @private
		 */
		this.looping = {};

		/**
		 * The Web Audio API AudioContext
		 * @member {external:AudioContext}
		 * @private
		 */
		this.context = new window.AudioContext();

		this.gainNode = this.context.createGain();
		this.gainNode.connect(this.context.destination);
		this.volume = this.gainNode.gain.value;
		this.onLoad = onLoad;
	}
	/**
	 * Load an audio file.
	 * @param {string} name The name you want to use when you {@link SoundLoader#play} the sound.
	 * @param {string} path The path of the sound file.
	 */
	SoundLoader.prototype.load = function(name, path) {
		var self = this;

		if (this.totalSounds === 0) {
			// safari on iOS mutes sounds until they're played in response to user input
			// play a dummy sound on first touch
			var firstTouchHandler = function() {
				window.removeEventListener("click", firstTouchHandler);
				window.removeEventListener("keydown", firstTouchHandler);
				window.removeEventListener("touchstart", firstTouchHandler);

				var source = self.context.createOscillator();
				source.connect(self.gainNode);
				source.start(0);
				source.stop(0);

				if (self.firstPlay) {
					self.play(self.firstPlay, self.firstPlayLoop);
				} else {
					self.firstPlay = "workaround";
				}
			};
			window.addEventListener("click", firstTouchHandler);
			window.addEventListener("keydown", firstTouchHandler);
			window.addEventListener("touchstart", firstTouchHandler);
		}

		this.totalSounds++;

		var request = new XMLHttpRequest();
		request.open("GET", path, true);
		request.responseType = "arraybuffer";
		request.addEventListener("readystatechange", function() {
			if (request.readyState !== 4) {
				return;
			}
			if (request.status !== 200 && request.status !== 0) {
				console.error("Error loading sound " + path);
				return;
			}
			self.context.decodeAudioData(request.response, function(buffer) {
				self.sounds[name] = buffer;
				self.loadedSounds++;
				if (self.allLoaded() && self.onLoad) {
					self.onLoad();
				}
			}, function(err) {
				console.error("Error decoding audio data for " + path + ": " + err);
			});
		});
		request.addEventListener("error", function() {
			console.error("Error loading sound " + path);
		});
		try {
			request.send();
		} catch (e) {
			console.error("Error loading sound", path, e);
		}
	};
	SoundLoader.prototype.loadFromManifest = function(manifest) {
		var keys = Object.keys(manifest);
		var self = this;
		keys.forEach(function(key) {
			self.load(key, manifest[key]);
		});
	};
	/**
	 * Test if all sounds have loaded.
	 * @returns {boolean}
	 */
	SoundLoader.prototype.allLoaded = function() {
		return this.totalSounds === this.loadedSounds;
	};
	/**
	 * Play a sound.
	 * @param {string} name The name given to the sound during {@link SoundLoader#load}
	 * @param {Object} [loop=undefined] A hash containing loopStart and loopEnd options. To stop a looped sound use {@link SoundLoader#stop}.
	 */
	SoundLoader.prototype.play = function(name, loop) {
		if (loop && this.looping[name]) {
			return;
		}
		if (!this.firstPlay) {
			// let the iOS user input workaround handle it
			this.firstPlay = name;
			this.firstPlayLoop = loop;
			return;
		}
		var snd = this.sounds[name];
		if (snd === undefined) {
			console.error("Unknown sound: " + name);
		}
		var source = this.context.createBufferSource();
		source.buffer = snd;
		source.connect(this.gainNode);
		if (loop) {
			source.loop = true;
			source.loopStart = loop.loopStart || 0;
			source.loopEnd = loop.loopEnd || 0;
			this.looping[name] = source;
		}
		source.start(0);
	};
	/**
	 * Stop playing a sound. This currently only stops playing a sound that was looped earlier, and doesn't stop a sound mid-play. Patches welcome.
	 * @param {string} name The name given to the sound during {@link SoundLoader#load}
	 */
	SoundLoader.prototype.stop = function(name) {
		if (!this.looping[name]) {
			return;
		}
		this.looping[name].stop(0);
		delete this.looping[name];
	};
	/**
	 * Silence all sounds. Sounds keep playing, but at zero volume. Call {@link SoundLoader#unmute} to restore the previous volume level.
	 */
	SoundLoader.prototype.mute = function() {
		this.gainNode.gain.value = 0;
		this.muted = true;
	};
	/**
	 * Restore volume to whatever value it was before {@link SoundLoader#mute} was called.
	 */
	SoundLoader.prototype.unmute = function() {
		this.gainNode.gain.value = this.volume;
		this.muted = false;
	};
	/**
	 * Set the volume of all sounds.
	 * @param {number} gain The desired volume level. A number between 0.0 and 1.0, with 0.0 being silent, and 1.0 being maximum volume.
	 */
	SoundLoader.prototype.setVolume = function(gain) {
		this.volume = gain;
		this.gainNode.gain  = gain;
		this.muted = false;
	};
	/**
	 * Test if the volume is currently muted.
	 * @return {boolean} True if the volume is currently muted.
	 */
	SoundLoader.prototype.isMuted = function() {
		return this.muted;
	};

	function AudioTagSoundLoader(onLoad) {
		this.sounds = {};
		this.totalSounds = 0;
		this.loadedSounds = 0;
		this.muted = false;
		this.looping = {};
		this.volume = new Audio().volume;
		this.onLoad = onLoad;
	}
	AudioTagSoundLoader.prototype.load = function(name, path) {
		this.totalSounds++;

		var audio = new Audio();
		var self = this;
		audio.addEventListener("error", function() {
			console.error("Error loading sound " + path);
		});
		audio.addEventListener("canplaythrough", function() {
			self.sounds[name] = audio;
			self.loadedSounds++;
			if (self.allLoaded() && self.onLoad) {
				self.onLoad();
			}
		});
		audio.volume = this.volume;
		audio.src = path;
		audio.load();
	};
	AudioTagSoundLoader.prototype.loadFromManifest = function(manifest) {
		var keys = Object.keys(manifest);
		var self = this;
		keys.forEach(function(key) {
			self.load(key, manifest[key]);
		});
	};
	AudioTagSoundLoader.prototype.allLoaded = function() {
		return this.totalSounds === this.loadedSounds;
	};
	AudioTagSoundLoader.prototype.play = function(name, loop) {
		if (loop && this.looping[name]) {
			return;
		}
		var snd = this.sounds[name];
		if (snd === undefined) {
			console.error("Unknown sound: " + name);
		}
		if (loop) {
			snd.loop = true;
			this.looping[name] = snd;
		}
		snd.play();
	};
	AudioTagSoundLoader.prototype.stop = function(name) {
		var snd = this.looping[name];
		if (!snd) {
			return;
		}
		snd.loop = false;
		snd.pause();
		snd.currentTime = 0;
		delete this.looping[name];
	};
	function setAudioTagVolume(sounds, gain) {
		for (var name in sounds) {
			if (sounds.hasOwnProperty(name)) {
				sounds[name].volume = gain;
			}
		}
	}
	AudioTagSoundLoader.prototype.mute = function() {
		setAudioTagVolume(this.sounds, 0);
		this.muted = true;
	};
	AudioTagSoundLoader.prototype.unmute = function() {
		setAudioTagVolume(this.sounds, this.volume);
		this.muted = false;
	};
	AudioTagSoundLoader.prototype.setVolume = function(gain) {
		this.volume = gain;
		setAudioTagVolume(this.sounds, gain);
		this.muted = false;
	};
	AudioTagSoundLoader.prototype.isMuted = function() {
		return this.muted;
	};


	function FakeSoundLoader(onLoad) {
		this.onLoad = onLoad;
	}
	FakeSoundLoader.prototype.load = function() {
		if (this.onLoad) {
			this.onLoad();
		}
	};
	FakeSoundLoader.prototype.loadFromManifest = function() {};
	FakeSoundLoader.prototype.allLoaded = function() { return true; };
	FakeSoundLoader.prototype.play = function() {};
	FakeSoundLoader.prototype.stop = function() {};
	FakeSoundLoader.prototype.mute = function() {};
	FakeSoundLoader.prototype.unmute = function() {};
	FakeSoundLoader.prototype.setVolume = function() {};
	FakeSoundLoader.prototype.isMuted = function() {
		return true;
	};

	if (window.AudioContext) {
		module.exports = SoundLoader;
	} else if (window.Audio) {
		module.exports = AudioTagSoundLoader;
	} else {
		console.log("This browser doesn't support the Web Audio API or the HTML5 audio tag.");
		module.exports = FakeSoundLoader;
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var platform = __webpack_require__(3);

	if (platform.isEjecta()) {
		var iap = new window.Ejecta.IAPManager();

		module.exports = {
			"get": function(sku, callback) {
				iap.getProducts([sku], function(err, products) {
					if (err) {
						callback(err);
						return;
					}
					callback(undefined, products[0]);
				});
			},
			"buy": function(product, quantity, callback) {
				product.purchase(quantity, callback);
			},
			"restore": function(callback) {
				iap.restoreTransactions(function(err, transactions) {
					if (err) {
						callback(err);
						return;
					}
					callback(undefined, transactions.map(function(transaction) {
						return transaction.productId;
					}));
				});
			}
		};
	} else if (platform.isChromeApp()) {
		// FIXME: needs google's buy.js included
		// https://developer.chrome.com/webstore/payments-iap
		module.exports = {
			"get": function(sku, callback) {
				window.google.payments.inapp.getSkuDetails({
					"parameters": {
						"env": "prod"
					},
					"sku": sku,
					"success": function(response) {
						callback(undefined, response.response.details.inAppProducts[0]);
					},
					"failure": function(response) {
						callback(response);
					}
				});
			},
			"buy": function(product, quantity, callback) {
				window.google.payments.inapp.buy({
					"parameters": {
						"env": "prod"
					},
					"sku": product.sku,
					"success": function(response) {
						callback(undefined, response);
					},
					"failure": function(response) {
						callback(response);
					}
				});
			},
			"restore": function(callback) {
				window.google.payments.inapp.getPurchases({
					"success": function(response) {
						callback(undefined, response.response.details.map(function(detail) {
							return detail.sku;
						}));
					},
					"failure": function(response) {
						callback(response);
					}
				});
			}
		};
	} else {
		module.exports = {
			"get": function(sku, callback) {
				callback(undefined, undefined);
			},
			"buy": function(product, quantity, callback) {
				callback(undefined);
			},
			"restore": function(callback) {
				callback(undefined, []);
			}
		};
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * @namespace Splat.leaderboards
	 */

	var platform = __webpack_require__(3);

	if (platform.isEjecta()) {
		var gameCenter = new window.Ejecta.GameCenter();
		gameCenter.softAuthenticate();

		var authFirst = function(action) {
			if (gameCenter.authed) {
				action();
			} else {
				gameCenter.authenticate(function(err) {
					if (err) {
						return;
					}
					action();
				});
			}
		};

		module.exports = {
			/**
			 * Report that an achievement was achieved.
			 * @alias Splat.leaderboards.reportAchievement
			 * @param {string} id The name of the achievement.
			 * @param {int} percent The percentage of the achievement that is completed in the range of 0-100.
			 */
			"reportAchievement": function(id, percent) {
				authFirst(function() {
					gameCenter.reportAchievement(id, percent);
				});
			},
			/**
			 * Report that a score was achieved on a leaderboard.
			 * @alias Splat.leaderboards.reportScore
			 * @param {string} leaderboard The name of the leaderboard the score is on.
			 * @param {int} score The score that was achieved.
			 */
			"reportScore": function(leaderboard, score) {
				authFirst(function() {
					gameCenter.reportScore(leaderboard, score);
				});
			},
			/**
			 * Show the achievements screen.
			 * @alias Splat.leaderboards.showAchievements
			 */
			"showAchievements": function() {
				authFirst(function() {
					gameCenter.showAchievements();
				});
			},
			/**
			 * Show a leaderboard screen.
			 * @alias Splat.leaderboards.showLeaderboard
			 * @param {string} name The name of the leaderboard to show.
			 */
			"showLeaderboard": function(name) {
				authFirst(function() {
					gameCenter.showLeaderboard(name);
				});
			}
		};
	} else {
		module.exports = {
			"reportAchievement": function() {},
			"reportScore": function() {},
			"showAchievements": function() {},
			"showLeaderboard": function() {}
		};
	}



/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Scene = __webpack_require__(13);

	module.exports = function(canvas, percentLoaded, nextScene) {
		var scene = new Scene();
		scene.renderer.add(function(entities, context) {
			context.fillStyle = "#000000";
			context.fillRect(0, 0, canvas.width, canvas.height);

			var quarterWidth = Math.floor(canvas.width / 4);
			var halfWidth = Math.floor(canvas.width / 2);
			var halfHeight = Math.floor(canvas.height / 2);

			context.fillStyle = "#ffffff";
			context.fillRect(quarterWidth, halfHeight - 15, halfWidth, 30);

			context.fillStyle = "#000000";
			context.fillRect(quarterWidth + 3, halfHeight - 12, halfWidth - 6, 24);

			context.fillStyle = "#ffffff";
			var barWidth = (halfWidth - 6) * percentLoaded();
			context.fillRect(quarterWidth + 3, halfHeight - 12, barWidth, 24);

			if (percentLoaded() === 1) {
				scene.stop();
				nextScene.start(context);
			}
		});
		return scene;
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Oscillate between -1 and 1 given a value and a period. This is basically a simplification on using Math.sin().
	 * @alias Splat.math.oscillate
	 * @param {number} current The current value of the number you want to oscillate.
	 * @param {number} period The period, or how often the number oscillates. The return value will oscillate between -1 and 1, depending on how close current is to a multiple of period.
	 * @returns {number} A number between -1 and 1.
	 * @example
	Splat.math.oscillate(0, 100); // returns 0
	Splat.math.oscillate(100, 100); // returns 0-ish
	Splat.math.oscillate(50, 100); // returns 1
	Splat.math.oscillate(150, 100); // returns -1
	Splat.math.oscillate(200, 100); // returns 0-ish
	 */
	function oscillate(current, period) {
		return Math.sin(current / period * Math.PI);
	}

	/**
	 * @namespace Splat.math
	 */
	module.exports = {
		oscillate: oscillate,
		/**
		 * A seedable pseudo-random number generator. Currently a Mersenne Twister PRNG.
		 * @constructor
		 * @alias Splat.math.Random
		 * @param {number} [seed] The seed for the PRNG.
		 * @see [mersenne-twister package at github]{@link https://github.com/boo1ean/mersenne-twister}
		 * @example
	var rand = new Splat.math.Random(123);
	var val = rand.random();
		 */
		Random: __webpack_require__(26)
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	/*
	  https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
	  so it's better encapsulated. Now you can have multiple random number generators
	  and they won't stomp all over eachother's state.
	  
	  If you want to use this as a substitute for Math.random(), use the random()
	  method like so:
	  
	  var m = new MersenneTwister();
	  var randomNumber = m.random();
	  
	  You can also call the other genrand_{foo}() methods on the instance.
	 
	  If you want to use a specific seed in order to get a repeatable random
	  sequence, pass an integer into the constructor:
	 
	  var m = new MersenneTwister(123);
	 
	  and that will always produce the same random sequence.
	 
	  Sean McCullough (banksean@gmail.com)
	*/
	 
	/* 
	   A C-program for MT19937, with initialization improved 2002/1/26.
	   Coded by Takuji Nishimura and Makoto Matsumoto.
	 
	   Before using, initialize the state by using init_seed(seed)  
	   or init_by_array(init_key, key_length).
	 
	   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
	   All rights reserved.                          
	 
	   Redistribution and use in source and binary forms, with or without
	   modification, are permitted provided that the following conditions
	   are met:
	 
	     1. Redistributions of source code must retain the above copyright
	        notice, this list of conditions and the following disclaimer.
	 
	     2. Redistributions in binary form must reproduce the above copyright
	        notice, this list of conditions and the following disclaimer in the
	        documentation and/or other materials provided with the distribution.
	 
	     3. The names of its contributors may not be used to endorse or promote 
	        products derived from this software without specific prior written 
	        permission.
	 
	   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 
	 
	   Any feedback is very welcome.
	   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
	   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
	*/
	 
	var MersenneTwister = function(seed) {
		if (seed == undefined) {
			seed = new Date().getTime();
		} 

		/* Period parameters */  
		this.N = 624;
		this.M = 397;
		this.MATRIX_A = 0x9908b0df;   /* constant vector a */
		this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
		this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

		this.mt = new Array(this.N); /* the array for the state vector */
		this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

		this.init_seed(seed);
	}  

	/* initializes mt[N] with a seed */
	/* origin name init_genrand */
	MersenneTwister.prototype.init_seed = function(s) {
		this.mt[0] = s >>> 0;
		for (this.mti=1; this.mti<this.N; this.mti++) {
			var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
			this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
			+ this.mti;
			/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
			/* In the previous versions, MSBs of the seed affect   */
			/* only MSBs of the array mt[].                        */
			/* 2002/01/09 modified by Makoto Matsumoto             */
			this.mt[this.mti] >>>= 0;
			/* for >32 bit machines */
		}
	}

	/* initialize by an array with array-length */
	/* init_key is the array for initializing keys */
	/* key_length is its length */
	/* slight change for C++, 2004/2/26 */
	MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
		var i, j, k;
		this.init_seed(19650218);
		i=1; j=0;
		k = (this.N>key_length ? this.N : key_length);
		for (; k; k--) {
			var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
			+ init_key[j] + j; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++; j++;
			if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
			if (j>=key_length) j=0;
		}
		for (k=this.N-1; k; k--) {
			var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
			- i; /* non linear */
			this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++;
			if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		}

		this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
	}

	/* generates a random number on [0,0xffffffff]-interval */
	/* origin name genrand_int32 */
	MersenneTwister.prototype.random_int = function() {
		var y;
		var mag01 = new Array(0x0, this.MATRIX_A);
		/* mag01[x] = x * MATRIX_A  for x=0,1 */

		if (this.mti >= this.N) { /* generate N words at one time */
			var kk;

			if (this.mti == this.N+1)  /* if init_seed() has not been called, */
				this.init_seed(5489);  /* a default initial seed is used */

			for (kk=0;kk<this.N-this.M;kk++) {
				y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
				this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for (;kk<this.N-1;kk++) {
				y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
				this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
			this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

			this.mti = 0;
		}

		y = this.mt[this.mti++];

		/* Tempering */
		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);

		return y >>> 0;
	}

	/* generates a random number on [0,0x7fffffff]-interval */
	/* origin name genrand_int31 */
	MersenneTwister.prototype.random_int31 = function() {
		return (this.random_int()>>>1);
	}

	/* generates a random number on [0,1]-real-interval */
	/* origin name genrand_real1 */
	MersenneTwister.prototype.random_incl = function() {
		return this.random_int()*(1.0/4294967295.0); 
		/* divided by 2^32-1 */ 
	}

	/* generates a random number on [0,1)-real-interval */
	MersenneTwister.prototype.random = function() {
		return this.random_int()*(1.0/4294967296.0); 
		/* divided by 2^32 */
	}

	/* generates a random number on (0,1)-real-interval */
	/* origin name genrand_real3 */
	MersenneTwister.prototype.random_excl = function() {
		return (this.random_int() + 0.5)*(1.0/4294967296.0); 
		/* divided by 2^32 */
	}

	/* generates a random number on [0,1) with 53-bit resolution*/
	/* origin name genrand_res53 */
	MersenneTwister.prototype.random_long = function() { 
		var a=this.random_int()>>>5, b=this.random_int()>>>6; 
		return(a*67108864.0+b)*(1.0/9007199254740992.0); 
	} 

	/* These real versions are due to Isaku Wada, 2002/01/09 added */

	module.exports = MersenneTwister;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var platform = __webpack_require__(3);

	/**
	 * Open a url in a new window.
	 * @alias Splat.openUrl
	 * @param {string} url The url to open in a new window.
	 */
	module.exports = function(url) {
		window.open(url);
	};

	if (platform.isEjecta()) {
		module.exports = function(url) {
			window.ejecta.openURL(url);
		};
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var buffer = __webpack_require__(2);

	function getContextForImage(image) {
		var ctx;
		buffer.makeBuffer(image.width, image.height, function(context) {
			context.drawImage(image, 0, 0, image.width, image.height);
			ctx = context;
		});
		return ctx;
	}

	/**
	 * A stretchable image that has borders.
	 * Similar to the [Android NinePatch]{@link https://developer.android.com/guide/topics/graphics/2d-graphics.html#nine-patch}, but it only has the lines on the bottom and right edges to denote the stretchable area.
	 * A NinePatch is a normal picture, but has an extra 1-pixel wide column on the right edge and bottom edge. The extra column contains a black line that denotes the tileable center portion of the image. The lines are used to divide the image into nine tiles that can be automatically repeated to stretch the picture to any size without distortion.
	 * @constructor
	 * @alias Splat.NinePatch
	 * @param {external:image} image The source image to make stretchable.
	 */
	function NinePatch(image) {
		this.img = image;
		var imgw = image.width - 1;
		var imgh = image.height - 1;

		var context = getContextForImage(image);
		var firstDiv = imgw;
		var secondDiv = imgw;
		var pixel;
		var alpha;
		for (var x = 0; x < imgw; x++) {
			pixel = context.getImageData(x, imgh, 1, 1).data;
			alpha = pixel[3];
			if (firstDiv === imgw && alpha > 0) {
				firstDiv = x;
			}
			if (firstDiv < imgw && alpha === 0) {
				secondDiv = x;
				break;
			}
		}
		this.w1 = firstDiv;
		this.w2 = secondDiv - firstDiv;
		this.w3 = imgw - secondDiv;

		firstDiv = secondDiv = imgh;
		for (var y = 0; y < imgh; y++) {
			pixel = context.getImageData(imgw, y, 1, 1).data;
			alpha = pixel[3];
			if (firstDiv === imgh && alpha > 0) {
				firstDiv = y;
			}
			if (firstDiv < imgh && alpha === 0) {
				secondDiv = y;
				break;
			}
		}
		this.h1 = firstDiv;
		this.h2 = secondDiv - firstDiv;
		this.h3 = imgh - secondDiv;
	}
	/**
	 * Draw the image stretched to a given rectangle.
	 * @param {external:CanvasRenderingContext2D} context The drawing context.
	 * @param {number} x The left side of the rectangle.
	 * @param {number} y The top of the rectangle.
	 * @param {number} width The width of the rectangle.
	 * @param {number} height The height of the rectangle.
	 */
	NinePatch.prototype.draw = function(context, x, y, width, height) {
		x = Math.floor(x);
		y = Math.floor(y);
		width = Math.floor(width);
		height = Math.floor(height);
		var cx, cy, w, h;

		for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
			for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
				w = Math.min(this.w2, x + width - this.w3 - cx);
				h = Math.min(this.h2, y + height - this.h3 - cy);
				context.drawImage(this.img, this.w1, this.h1, w, h, cx, cy, w, h);
			}
		}
		for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
			h = Math.min(this.h2, y + height - this.h3 - cy);
			if (this.w1 > 0) {
				context.drawImage(this.img, 0,                 this.h1, this.w1, h, x,                   cy, this.w1, h);
			}
			if (this.w3 > 0) {
				context.drawImage(this.img, this.w1 + this.w2, this.h1, this.w3, h, x + width - this.w3, cy, this.w3, h);
			}
		}
		for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
			w = Math.min(this.w2, x + width - this.w3 - cx);
			if (this.h1 > 0) {
				context.drawImage(this.img, this.w1, 0,                 w, this.h1, cx, y,                    w, this.h1);
			}
			if (this.h3 > 0) {
				context.drawImage(this.img, this.w1, this.w1 + this.w2, w, this.h3, cx, y + height - this.h3, w, this.h3);
			}
		}
		if (this.w1 > 0 && this.h1 > 0) {
			context.drawImage(this.img, 0, 0, this.w1, this.h1, x, y, this.w1, this.h1);
		}
		if (this.w3 > 0 && this.h1 > 0) {
			context.drawImage(this.img, this.w1 + this.w2, 0, this.w3, this.h1, x + width - this.w3, y, this.w3, this.h1);
		}
		if (this.w1 > 0 && this.h3 > 0) {
			context.drawImage(this.img, 0, this.h1 + this.h2, this.w1, this.h3, x, y + height - this.h3, this.w1, this.h3);
		}
		if (this.w3 > 0 && this.h3 > 0) {
			context.drawImage(this.img, this.w1 + this.w2, this.h1 + this.h2, this.w3, this.h3, x + width - this.w3, y + height - this.h3, this.w3, this.h3);
		}
	};

	module.exports = NinePatch;


/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";

	function Particles(max, setupParticle, drawParticle) {
		this.particles = [];
		this.setupParticle = setupParticle;
		this.drawParticle = drawParticle;
		for (var i = 0; i < max; i++) {
			var particle = {
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				enabled: false,
				age: 0
			};
			this.setupParticle(particle);
			this.particles.push(particle);
		}
		this.gravity = 0.1;
		this.maxAge = 1000;
	}
	Particles.prototype.move = function(elapsedMillis) {
		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			if (!particle.enabled) {
				continue;
			}
			particle.age += elapsedMillis;
			if (particle.age > this.maxAge) {
				particle.enabled = false;
				continue;
			}
			particle.x += particle.vx * elapsedMillis;
			particle.y += particle.vy * elapsedMillis;
			particle.vy += this.gravity;
		}
	};
	Particles.prototype.draw = function(context) {
		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			if (!particle.enabled) {
				continue;
			}
			this.drawParticle(context, particle);
		}
	};
	Particles.prototype.add = function(quantity, x, y, velocity, config) {
		var self = this;
		function setupParticle(particle) {
			particle.enabled = true;
			particle.age = 0;
			particle.x = x;
			particle.y = y;
			particle.vx = (Math.random() - 0.5) * velocity;
			particle.vy = (Math.random() - 0.5) * velocity;
			self.setupParticle(particle, config);
		}

		var particle;
		for (var i = 0; i < this.particles.length; i++) {
			particle = this.particles[i];
			if (particle.enabled) {
				continue;
			}
			if (quantity < 1) {
				return;
			}
			quantity--;
			setupParticle(particle);
		}

		// sort oldest first
		this.particles.sort(function(a, b) {
			return b.age - a.age;
		});

		for (i = 0; i < quantity; i++) {
			particle = this.particles[i];
			setupParticle(particle);
		}
	};
	Particles.prototype.reset = function() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].enabled = false;
		}
	};

	module.exports = Particles;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * @namespace Splat.saveData
	 */

	var platform = __webpack_require__(3);

	function cookieGet(name) {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length === 2) {
			return parts.pop().split(";").shift();
		} else {
			throw "cookie " + name + " was not found";
		}
	}

	function cookieSet(name, value) {
		var expire = new Date();
		expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 365);
		var cookie = name + "=" + value + "; expires=" + expire.toUTCString() + ";";
		document.cookie = cookie;
	}

	function getMultiple(getSingleFunc, keys, callback) {
		if (typeof keys === "string") {
			keys = [keys];
		}

		try {
			var data = keys.map(function(key) {
				return [key, getSingleFunc(key)];
			}).reduce(function(accum, pair) {
				accum[pair[0]] = pair[1];
				return accum;
			}, {});

			callback(undefined, data);
		} catch (e) {
			callback(e);
		}
	}

	function setMultiple(setSingleFunc, data, callback) {
		try {
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					setSingleFunc(key, data[key]);
				}
			}
			callback();
		} catch (e) {
			callback(e);
		}
	}

	var cookieSaveData = {
		"get": getMultiple.bind(undefined, cookieGet),
		"set": setMultiple.bind(undefined, cookieSet)
	};

	function localStorageGet(name) {
		return window.localStorage.getItem(name);
	}

	function localStorageSet(name, value) {
		window.localStorage.setItem(name, value.toString());
	}

	var localStorageSaveData = {
		"get": getMultiple.bind(undefined, localStorageGet),
		"set": setMultiple.bind(undefined, localStorageSet)
	};

	/**
	 * A function that is called when save data has finished being retrieved.
	 * @callback saveDataGetFinished
	 * @param {error} err If defined, err is the error that occurred when retrieving the data.
	 * @param {object} data The key-value pairs of data that were previously saved.
	 */
	/**
	 * Retrieve data previously stored with {@link Splat.saveData.set}.
	 * @alias Splat.saveData.get
	 * @param {string | Array} keys A single key or array of key names of data items to retrieve.
	 * @param {saveDataGetFinished} callback A callback that is called with the data when it has been retrieved.
	 */
	function chromeStorageGet(keys, callback) {
		window.chrome.storage.sync.get(keys, function(data) {
			if (window.chrome.runtime.lastError) {
				callback(window.chrome.runtime.lastError);
			} else {
				callback(undefined, data);
			}
		});
	}

	/**
	 * A function that is called when save data has finished being stored.
	 * @callback saveDataSetFinished
	 * @param {error} err If defined, err is the error that occurred when saving the data.
	 */
	/**
	 * Store data for later.
	 * @alias Splat.saveData.set
	 * @param {object} data An object containing key-value pairs of data to save.
	 * @param {saveDataSetFinished} callback A callback that is called when the data has finished saving.
	 */
	function chromeStorageSet(data, callback) {
		window.chrome.storage.sync.set(data, function() {
			callback(window.chrome.runtime.lastError);
		});
	}

	var chromeStorageSaveData = {
		"get": chromeStorageGet,
		"set": chromeStorageSet
	};

	if (platform.isChromeApp()) {
		module.exports = chromeStorageSaveData;
	} else if (window.localStorage) {
		module.exports = localStorageSaveData;
	} else {
		module.exports = cookieSaveData;
	}


/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function animation(name, loop) {
		return {
			name: name,
			time: 0,
			frame: 0,
			loop: loop,
			speed: 1
		};
	};


/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function position(x, y) {
		return { x: x, y: y };
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function friction(x, y) {
		return { x: x, y: y };
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function image(name, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight) {
		return {
			name: name,
			sourceX: sourceX,
			sourceY: sourceY,
			sourceWidth: sourceWidth,
			sourceHeight: sourceHeight,
			destinationX: destinationX,
			destinationY: destinationY,
			destinationWidth: destinationWidth,
			destinationHeight: destinationHeight
		};
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function movement2d(accel, max) {
		return {
			up: false,
			down: false,
			left: false,
			right: false,
			upAccel: -accel,
			downAccel: accel,
			leftAccel: -accel,
			rightAccel: accel,
			upMax: -max,
			downMax: max,
			leftMax: -max,
			rightMax: max
		};
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function playableArea(x, y, width, height) {
		return { x: x, y: y, width: width, height: height };
	};


/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function playerController2d(up, down, left, right) {
		return { up: up, down: down, left: left, right: right };
	};


/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function position(x, y) {
		return { x: x, y: y };
	};


/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function size(width, height) {
		return { width: width, height: height };
	};


/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function timers() {
		return {};
	};


/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function velocity(x, y) {
		return { x: x, y: y };
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./advance-animations.js": 43,
		"./advance-timers.js": 44,
		"./apply-friction.js": 45,
		"./apply-movement-2d.js": 46,
		"./apply-velocity.js": 47,
		"./box-collider.js": 48,
		"./center-position.js": 63,
		"./clear-screen.js": 64,
		"./constrain-to-playable-area.js": 65,
		"./control-player.js": 66,
		"./draw-frame-rate.js": 67,
		"./draw-image.js": 68,
		"./draw-rectangles.js": 69,
		"./follow-parent.js": 70,
		"./match-aspect-ratio.js": 71,
		"./match-canvas-size.js": 72,
		"./match-parent.js": 73,
		"./viewport-move-to-camera.js": 74,
		"./viewport-reset.js": 75
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 42;


/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";

	function setOwnPropertiesDeep(src, dest) {
		var props = Object.keys(src);
		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			var val = src[prop];
			if (typeof val === "object") {
				if (!dest[prop]) {
					dest[prop] = {};
				}
				setOwnPropertiesDeep(val, dest[prop]);
			} else {
				dest[prop] = val;
			}
		}
	}

	function applyAnimation(entity, a, animation, entities) {
		a.lastName = a.name; // track the old name so we can see if it changes
		Object.keys(animation[a.frame].properties).forEach(function(property) {
			var dest = entities.get(entity, property);
			var isNewProp = false;
			if (dest === undefined) {
				isNewProp = true;
				dest = {};
			}
			setOwnPropertiesDeep(animation[a.frame].properties[property], dest);
			if (isNewProp) {
				entities.set(entity, property, dest);
			}
		});
	}

	module.exports = function(ecs, game) {
		game.entities.onAddComponent("animation", function(entity, component, a) {
			var animation = game.animations[a.name];
			if (animation === undefined) {
				return;
			}
			applyAnimation(entity, a, animation, game.entities);
		});
		ecs.addEach(function advanceAnimations(entity, elapsed) {
			var a = game.entities.get(entity, "animation");
			var animation = game.animations[a.name];
			if (animation === undefined) {
				return;
			}
			if (a.name != a.lastName) {
				a.frame = 0;
				a.time = 0;
			}
			a.time += elapsed * a.speed;
			var lastFrame = a.frame;
			while (a.time > animation[a.frame].time) {
				a.time -= animation[a.frame].time;
				a.frame++;
				if (a.frame >= animation.length) {
					if (a.loop) {
						a.frame = 0;
					} else {
						a.frame--;
					}
				}
			}
			if (lastFrame != a.frame || a.name != a.lastName) {
				applyAnimation(entity, a, animation, game.entities);
			}
		}, "animation");
	};


/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		ecs.addEach(function advanceTimers(entity, elapsed) {
			var timers = game.entities.get(entity, "timers");
			var names = Object.keys(timers);

			names.forEach(function(name) {
				var timer = timers[name];
				if (!timer.running) {
					return;
				}

				timer.time += elapsed;

				if (timer.time > timer.max) {
					timer.running = false;
					timer.time = 0;

					if (timer.script !== undefined) {
						var script = game.require(timer.script);
						script(entity, game);
					}
				}
			});
		}, "timers");
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("applyFriction", ["velocity", "friction"]);
		ecs.addEach(function applyFriction(entity, elapsed) { // eslint-disable-line no-unused-vars
			var velocity = game.entities.get(entity, "velocity");
			var friction = game.entities.get(entity, "friction");
			velocity.x *= friction.x;
			velocity.y *= friction.y;
		}, "applyFriction");
	};


/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("applyMovement2d", ["velocity", "movement2d"]);
		ecs.addEach(function applyMovement2d(entity, elapsed) { // eslint-disable-line no-unused-vars
			var velocity = game.entities.get(entity, "velocity");
			var movement2d = game.entities.get(entity, "movement2d");
			if (movement2d.up && velocity.y > movement2d.upMax) {
				velocity.y += movement2d.upAccel;
			}
			if (movement2d.down && velocity.y < movement2d.downMax) {
				velocity.y += movement2d.downAccel;
			}
			if (movement2d.left && velocity.x > movement2d.leftMax) {
				velocity.x += movement2d.leftAccel;
			}
			if (movement2d.right && velocity.x < movement2d.rightMax) {
				velocity.x += movement2d.rightAccel;
			}
		}, "applyMovement2d");
	};


/***/ },
/* 47 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("applyVelocity", ["position", "velocity"]);
		ecs.addEach(function applyVelocity(entity, elapsed) {
			var position = game.entities.get(entity, "position");
			var velocity = game.entities.get(entity, "velocity");
			position.x += velocity.x * elapsed;
			position.y += velocity.y * elapsed;
		}, "applyVelocity");
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var boxIntersect = __webpack_require__(49);

	module.exports = function(ecs, game) {

		game.entities.registerSearch("boxCollider", ["position", "size", "collisions"]);

		game.entities.onRemoveComponent("collisions", function(entity, component, collisions) {
			for (var i = 0; i < collisions.length; i++) {
				var otherCollisions = game.entities.get(collisions[i], "collisions");
				var idx = otherCollisions.indexOf(entity);
				if (idx !== -1) {
					otherCollisions.splice(idx,1);
				}
			}
		});

		var boxPool = [];
		var boxPoolLength = 0;
		function growBoxPool(size) {
			boxPoolLength = size;
			while (boxPool.length < size) {
				for (var i = 0; i < 50; i++) {
					boxPool.push([0, 0, 0, 0]);
				}
			}
		}

		ecs.add(function boxCollider(entities, elapsed) { // eslint-disable-line no-unused-vars
			var ids = game.entities.find("boxCollider");

			growBoxPool(ids.length);
			ids.forEach(function(entity, i) {
				game.entities.get(entity, "collisions").length = 0;
				var position = game.entities.get(entity, "position");
				var size = game.entities.get(entity, "size");
				boxPool[i][0] = position.x;
				boxPool[i][1] = position.y;
				boxPool[i][2] = position.x + size.width;
				boxPool[i][3] = position.y + size.height;
			});
			boxIntersect(boxPool, function(a, b) {
				if (a >= boxPoolLength || b >= boxPoolLength) {
					return;
				}
				var idA = ids[a];
				var idB = ids[b];
				game.entities.get(idA, "collisions").push(idB);
				game.entities.get(idB, "collisions").push(idA);
			});
		});
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = boxIntersectWrapper

	var pool = __webpack_require__(50)
	var sweep = __webpack_require__(57)
	var boxIntersectIter = __webpack_require__(59)

	function boxEmpty(d, box) {
	  for(var j=0; j<d; ++j) {
	    if(!(box[j] <= box[j+d])) {
	      return true
	    }
	  }
	  return false
	}

	//Unpack boxes into a flat typed array, remove empty boxes
	function convertBoxes(boxes, d, data, ids) {
	  var ptr = 0
	  var count = 0
	  for(var i=0, n=boxes.length; i<n; ++i) {
	    var b = boxes[i]
	    if(boxEmpty(d, b)) {
	      continue
	    }
	    for(var j=0; j<2*d; ++j) {
	      data[ptr++] = b[j]
	    }
	    ids[count++] = i
	  }
	  return count
	}

	//Perform type conversions, check bounds
	function boxIntersect(red, blue, visit, full) {
	  var n = red.length
	  var m = blue.length

	  //If either array is empty, then we can skip this whole thing
	  if(n <= 0 || m <= 0) {
	    return
	  }

	  //Compute dimension, if it is 0 then we skip
	  var d = (red[0].length)>>>1
	  if(d <= 0) {
	    return
	  }

	  var retval

	  //Convert red boxes
	  var redList  = pool.mallocDouble(2*d*n)
	  var redIds   = pool.mallocInt32(n)
	  n = convertBoxes(red, d, redList, redIds)

	  if(n > 0) {
	    if(d === 1 && full) {
	      //Special case: 1d complete
	      sweep.init(n)
	      retval = sweep.sweepComplete(
	        d, visit, 
	        0, n, redList, redIds,
	        0, n, redList, redIds)
	    } else {

	      //Convert blue boxes
	      var blueList = pool.mallocDouble(2*d*m)
	      var blueIds  = pool.mallocInt32(m)
	      m = convertBoxes(blue, d, blueList, blueIds)

	      if(m > 0) {
	        sweep.init(n+m)

	        if(d === 1) {
	          //Special case: 1d bipartite
	          retval = sweep.sweepBipartite(
	            d, visit, 
	            0, n, redList,  redIds,
	            0, m, blueList, blueIds)
	        } else {
	          //General case:  d>1
	          retval = boxIntersectIter(
	            d, visit,    full,
	            n, redList,  redIds,
	            m, blueList, blueIds)
	        }

	        pool.free(blueList)
	        pool.free(blueIds)
	      }
	    }

	    pool.free(redList)
	    pool.free(redIds)
	  }

	  return retval
	}


	var RESULT

	function appendItem(i,j) {
	  RESULT.push([i,j])
	}

	function intersectFullArray(x) {
	  RESULT = []
	  boxIntersect(x, x, appendItem, true)
	  return RESULT
	}

	function intersectBipartiteArray(x, y) {
	  RESULT = []
	  boxIntersect(x, y, appendItem, false)
	  return RESULT
	}

	//User-friendly wrapper, handle full input and no-visitor cases
	function boxIntersectWrapper(arg0, arg1, arg2) {
	  var result
	  switch(arguments.length) {
	    case 1:
	      return intersectFullArray(arg0)
	    case 2:
	      if(typeof arg1 === 'function') {
	        return boxIntersect(arg0, arg0, arg1, true)
	      } else {
	        return intersectBipartiteArray(arg0, arg1)
	      }
	    case 3:
	      return boxIntersect(arg0, arg1, arg2, false)
	    default:
	      throw new Error('box-intersect: Invalid arguments')
	  }
	}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict'

	var bits = __webpack_require__(55)
	var dup = __webpack_require__(56)

	//Legacy pool support
	if(!global.__TYPEDARRAY_POOL) {
	  global.__TYPEDARRAY_POOL = {
	      UINT8   : dup([32, 0])
	    , UINT16  : dup([32, 0])
	    , UINT32  : dup([32, 0])
	    , INT8    : dup([32, 0])
	    , INT16   : dup([32, 0])
	    , INT32   : dup([32, 0])
	    , FLOAT   : dup([32, 0])
	    , DOUBLE  : dup([32, 0])
	    , DATA    : dup([32, 0])
	    , UINT8C  : dup([32, 0])
	    , BUFFER  : dup([32, 0])
	  }
	}

	var hasUint8C = (typeof Uint8ClampedArray) !== 'undefined'
	var POOL = global.__TYPEDARRAY_POOL

	//Upgrade pool
	if(!POOL.UINT8C) {
	  POOL.UINT8C = dup([32, 0])
	}
	if(!POOL.BUFFER) {
	  POOL.BUFFER = dup([32, 0])
	}

	//New technique: Only allocate from ArrayBufferView and Buffer
	var DATA    = POOL.DATA
	  , BUFFER  = POOL.BUFFER

	exports.free = function free(array) {
	  if(Buffer.isBuffer(array)) {
	    BUFFER[bits.log2(array.length)].push(array)
	  } else {
	    if(Object.prototype.toString.call(array) !== '[object ArrayBuffer]') {
	      array = array.buffer
	    }
	    if(!array) {
	      return
	    }
	    var n = array.length || array.byteLength
	    var log_n = bits.log2(n)|0
	    DATA[log_n].push(array)
	  }
	}

	function freeArrayBuffer(buffer) {
	  if(!buffer) {
	    return
	  }
	  var n = buffer.length || buffer.byteLength
	  var log_n = bits.log2(n)
	  DATA[log_n].push(buffer)
	}

	function freeTypedArray(array) {
	  freeArrayBuffer(array.buffer)
	}

	exports.freeUint8 =
	exports.freeUint16 =
	exports.freeUint32 =
	exports.freeInt8 =
	exports.freeInt16 =
	exports.freeInt32 =
	exports.freeFloat32 = 
	exports.freeFloat =
	exports.freeFloat64 = 
	exports.freeDouble = 
	exports.freeUint8Clamped = 
	exports.freeDataView = freeTypedArray

	exports.freeArrayBuffer = freeArrayBuffer

	exports.freeBuffer = function freeBuffer(array) {
	  BUFFER[bits.log2(array.length)].push(array)
	}

	exports.malloc = function malloc(n, dtype) {
	  if(dtype === undefined || dtype === 'arraybuffer') {
	    return mallocArrayBuffer(n)
	  } else {
	    switch(dtype) {
	      case 'uint8':
	        return mallocUint8(n)
	      case 'uint16':
	        return mallocUint16(n)
	      case 'uint32':
	        return mallocUint32(n)
	      case 'int8':
	        return mallocInt8(n)
	      case 'int16':
	        return mallocInt16(n)
	      case 'int32':
	        return mallocInt32(n)
	      case 'float':
	      case 'float32':
	        return mallocFloat(n)
	      case 'double':
	      case 'float64':
	        return mallocDouble(n)
	      case 'uint8_clamped':
	        return mallocUint8Clamped(n)
	      case 'buffer':
	        return mallocBuffer(n)
	      case 'data':
	      case 'dataview':
	        return mallocDataView(n)

	      default:
	        return null
	    }
	  }
	  return null
	}

	function mallocArrayBuffer(n) {
	  var n = bits.nextPow2(n)
	  var log_n = bits.log2(n)
	  var d = DATA[log_n]
	  if(d.length > 0) {
	    return d.pop()
	  }
	  return new ArrayBuffer(n)
	}
	exports.mallocArrayBuffer = mallocArrayBuffer

	function mallocUint8(n) {
	  return new Uint8Array(mallocArrayBuffer(n), 0, n)
	}
	exports.mallocUint8 = mallocUint8

	function mallocUint16(n) {
	  return new Uint16Array(mallocArrayBuffer(2*n), 0, n)
	}
	exports.mallocUint16 = mallocUint16

	function mallocUint32(n) {
	  return new Uint32Array(mallocArrayBuffer(4*n), 0, n)
	}
	exports.mallocUint32 = mallocUint32

	function mallocInt8(n) {
	  return new Int8Array(mallocArrayBuffer(n), 0, n)
	}
	exports.mallocInt8 = mallocInt8

	function mallocInt16(n) {
	  return new Int16Array(mallocArrayBuffer(2*n), 0, n)
	}
	exports.mallocInt16 = mallocInt16

	function mallocInt32(n) {
	  return new Int32Array(mallocArrayBuffer(4*n), 0, n)
	}
	exports.mallocInt32 = mallocInt32

	function mallocFloat(n) {
	  return new Float32Array(mallocArrayBuffer(4*n), 0, n)
	}
	exports.mallocFloat32 = exports.mallocFloat = mallocFloat

	function mallocDouble(n) {
	  return new Float64Array(mallocArrayBuffer(8*n), 0, n)
	}
	exports.mallocFloat64 = exports.mallocDouble = mallocDouble

	function mallocUint8Clamped(n) {
	  if(hasUint8C) {
	    return new Uint8ClampedArray(mallocArrayBuffer(n), 0, n)
	  } else {
	    return mallocUint8(n)
	  }
	}
	exports.mallocUint8Clamped = mallocUint8Clamped

	function mallocDataView(n) {
	  return new DataView(mallocArrayBuffer(n), 0, n)
	}
	exports.mallocDataView = mallocDataView

	function mallocBuffer(n) {
	  n = bits.nextPow2(n)
	  var log_n = bits.log2(n)
	  var cache = BUFFER[log_n]
	  if(cache.length > 0) {
	    return cache.pop()
	  }
	  return new Buffer(n)
	}
	exports.mallocBuffer = mallocBuffer

	exports.clearCache = function clearCache() {
	  for(var i=0; i<32; ++i) {
	    POOL.UINT8[i].length = 0
	    POOL.UINT16[i].length = 0
	    POOL.UINT32[i].length = 0
	    POOL.INT8[i].length = 0
	    POOL.INT16[i].length = 0
	    POOL.INT32[i].length = 0
	    POOL.FLOAT[i].length = 0
	    POOL.DOUBLE[i].length = 0
	    POOL.UINT8C[i].length = 0
	    DATA[i].length = 0
	    BUFFER[i].length = 0
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(51).Buffer))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(52)
	var ieee754 = __webpack_require__(53)
	var isArray = __webpack_require__(54)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(51).Buffer, (function() { return this; }())))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 53 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 54 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 55 */
/***/ function(module, exports) {

	/**
	 * Bit twiddling hacks for JavaScript.
	 *
	 * Author: Mikola Lysenko
	 *
	 * Ported from Stanford bit twiddling hack library:
	 *    http://graphics.stanford.edu/~seander/bithacks.html
	 */

	"use strict"; "use restrict";

	//Number of bits in an integer
	var INT_BITS = 32;

	//Constants
	exports.INT_BITS  = INT_BITS;
	exports.INT_MAX   =  0x7fffffff;
	exports.INT_MIN   = -1<<(INT_BITS-1);

	//Returns -1, 0, +1 depending on sign of x
	exports.sign = function(v) {
	  return (v > 0) - (v < 0);
	}

	//Computes absolute value of integer
	exports.abs = function(v) {
	  var mask = v >> (INT_BITS-1);
	  return (v ^ mask) - mask;
	}

	//Computes minimum of integers x and y
	exports.min = function(x, y) {
	  return y ^ ((x ^ y) & -(x < y));
	}

	//Computes maximum of integers x and y
	exports.max = function(x, y) {
	  return x ^ ((x ^ y) & -(x < y));
	}

	//Checks if a number is a power of two
	exports.isPow2 = function(v) {
	  return !(v & (v-1)) && (!!v);
	}

	//Computes log base 2 of v
	exports.log2 = function(v) {
	  var r, shift;
	  r =     (v > 0xFFFF) << 4; v >>>= r;
	  shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
	  shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
	  shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
	  return r | (v >> 1);
	}

	//Computes log base 10 of v
	exports.log10 = function(v) {
	  return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
	          (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
	          (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
	}

	//Counts number of bits
	exports.popCount = function(v) {
	  v = v - ((v >>> 1) & 0x55555555);
	  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
	  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
	}

	//Counts number of trailing zeros
	function countTrailingZeros(v) {
	  var c = 32;
	  v &= -v;
	  if (v) c--;
	  if (v & 0x0000FFFF) c -= 16;
	  if (v & 0x00FF00FF) c -= 8;
	  if (v & 0x0F0F0F0F) c -= 4;
	  if (v & 0x33333333) c -= 2;
	  if (v & 0x55555555) c -= 1;
	  return c;
	}
	exports.countTrailingZeros = countTrailingZeros;

	//Rounds to next power of 2
	exports.nextPow2 = function(v) {
	  v += v === 0;
	  --v;
	  v |= v >>> 1;
	  v |= v >>> 2;
	  v |= v >>> 4;
	  v |= v >>> 8;
	  v |= v >>> 16;
	  return v + 1;
	}

	//Rounds down to previous power of 2
	exports.prevPow2 = function(v) {
	  v |= v >>> 1;
	  v |= v >>> 2;
	  v |= v >>> 4;
	  v |= v >>> 8;
	  v |= v >>> 16;
	  return v - (v>>>1);
	}

	//Computes parity of word
	exports.parity = function(v) {
	  v ^= v >>> 16;
	  v ^= v >>> 8;
	  v ^= v >>> 4;
	  v &= 0xf;
	  return (0x6996 >>> v) & 1;
	}

	var REVERSE_TABLE = new Array(256);

	(function(tab) {
	  for(var i=0; i<256; ++i) {
	    var v = i, r = i, s = 7;
	    for (v >>>= 1; v; v >>>= 1) {
	      r <<= 1;
	      r |= v & 1;
	      --s;
	    }
	    tab[i] = (r << s) & 0xff;
	  }
	})(REVERSE_TABLE);

	//Reverse bits in a 32 bit word
	exports.reverse = function(v) {
	  return  (REVERSE_TABLE[ v         & 0xff] << 24) |
	          (REVERSE_TABLE[(v >>> 8)  & 0xff] << 16) |
	          (REVERSE_TABLE[(v >>> 16) & 0xff] << 8)  |
	           REVERSE_TABLE[(v >>> 24) & 0xff];
	}

	//Interleave bits of 2 coordinates with 16 bits.  Useful for fast quadtree codes
	exports.interleave2 = function(x, y) {
	  x &= 0xFFFF;
	  x = (x | (x << 8)) & 0x00FF00FF;
	  x = (x | (x << 4)) & 0x0F0F0F0F;
	  x = (x | (x << 2)) & 0x33333333;
	  x = (x | (x << 1)) & 0x55555555;

	  y &= 0xFFFF;
	  y = (y | (y << 8)) & 0x00FF00FF;
	  y = (y | (y << 4)) & 0x0F0F0F0F;
	  y = (y | (y << 2)) & 0x33333333;
	  y = (y | (y << 1)) & 0x55555555;

	  return x | (y << 1);
	}

	//Extracts the nth interleaved component
	exports.deinterleave2 = function(v, n) {
	  v = (v >>> n) & 0x55555555;
	  v = (v | (v >>> 1))  & 0x33333333;
	  v = (v | (v >>> 2))  & 0x0F0F0F0F;
	  v = (v | (v >>> 4))  & 0x00FF00FF;
	  v = (v | (v >>> 16)) & 0x000FFFF;
	  return (v << 16) >> 16;
	}


	//Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
	exports.interleave3 = function(x, y, z) {
	  x &= 0x3FF;
	  x  = (x | (x<<16)) & 4278190335;
	  x  = (x | (x<<8))  & 251719695;
	  x  = (x | (x<<4))  & 3272356035;
	  x  = (x | (x<<2))  & 1227133513;

	  y &= 0x3FF;
	  y  = (y | (y<<16)) & 4278190335;
	  y  = (y | (y<<8))  & 251719695;
	  y  = (y | (y<<4))  & 3272356035;
	  y  = (y | (y<<2))  & 1227133513;
	  x |= (y << 1);
	  
	  z &= 0x3FF;
	  z  = (z | (z<<16)) & 4278190335;
	  z  = (z | (z<<8))  & 251719695;
	  z  = (z | (z<<4))  & 3272356035;
	  z  = (z | (z<<2))  & 1227133513;
	  
	  return x | (z << 2);
	}

	//Extracts nth interleaved component of a 3-tuple
	exports.deinterleave3 = function(v, n) {
	  v = (v >>> n)       & 1227133513;
	  v = (v | (v>>>2))   & 3272356035;
	  v = (v | (v>>>4))   & 251719695;
	  v = (v | (v>>>8))   & 4278190335;
	  v = (v | (v>>>16))  & 0x3FF;
	  return (v<<22)>>22;
	}

	//Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
	exports.nextCombination = function(v) {
	  var t = v | (v - 1);
	  return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
	}



/***/ },
/* 56 */
/***/ function(module, exports) {

	"use strict"

	function dupe_array(count, value, i) {
	  var c = count[i]|0
	  if(c <= 0) {
	    return []
	  }
	  var result = new Array(c), j
	  if(i === count.length-1) {
	    for(j=0; j<c; ++j) {
	      result[j] = value
	    }
	  } else {
	    for(j=0; j<c; ++j) {
	      result[j] = dupe_array(count, value, i+1)
	    }
	  }
	  return result
	}

	function dupe_number(count, value) {
	  var result, i
	  result = new Array(count)
	  for(i=0; i<count; ++i) {
	    result[i] = value
	  }
	  return result
	}

	function dupe(count, value) {
	  if(typeof value === "undefined") {
	    value = 0
	  }
	  switch(typeof count) {
	    case "number":
	      if(count > 0) {
	        return dupe_number(count|0, value)
	      }
	    break
	    case "object":
	      if(typeof (count.length) === "number") {
	        return dupe_array(count, value, 0)
	      }
	    break
	  }
	  return []
	}

	module.exports = dupe

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = {
	  init:           sqInit,
	  sweepBipartite: sweepBipartite,
	  sweepComplete:  sweepComplete,
	  scanBipartite:  scanBipartite,
	  scanComplete:   scanComplete
	}

	var pool  = __webpack_require__(50)
	var bits  = __webpack_require__(55)
	var isort = __webpack_require__(58)

	//Flag for blue
	var BLUE_FLAG = (1<<28)

	//1D sweep event queue stuff (use pool to save space)
	var INIT_CAPACITY      = 1024
	var RED_SWEEP_QUEUE    = pool.mallocInt32(INIT_CAPACITY)
	var RED_SWEEP_INDEX    = pool.mallocInt32(INIT_CAPACITY)
	var BLUE_SWEEP_QUEUE   = pool.mallocInt32(INIT_CAPACITY)
	var BLUE_SWEEP_INDEX   = pool.mallocInt32(INIT_CAPACITY)
	var COMMON_SWEEP_QUEUE = pool.mallocInt32(INIT_CAPACITY)
	var COMMON_SWEEP_INDEX = pool.mallocInt32(INIT_CAPACITY)
	var SWEEP_EVENTS       = pool.mallocDouble(INIT_CAPACITY * 8)

	//Reserves memory for the 1D sweep data structures
	function sqInit(count) {
	  var rcount = bits.nextPow2(count)
	  if(RED_SWEEP_QUEUE.length < rcount) {
	    pool.free(RED_SWEEP_QUEUE)
	    RED_SWEEP_QUEUE = pool.mallocInt32(rcount)
	  }
	  if(RED_SWEEP_INDEX.length < rcount) {
	    pool.free(RED_SWEEP_INDEX)
	    RED_SWEEP_INDEX = pool.mallocInt32(rcount)
	  }
	  if(BLUE_SWEEP_QUEUE.length < rcount) {
	    pool.free(BLUE_SWEEP_QUEUE)
	    BLUE_SWEEP_QUEUE = pool.mallocInt32(rcount)
	  }
	  if(BLUE_SWEEP_INDEX.length < rcount) {
	    pool.free(BLUE_SWEEP_INDEX)
	    BLUE_SWEEP_INDEX = pool.mallocInt32(rcount)
	  }
	  if(COMMON_SWEEP_QUEUE.length < rcount) {
	    pool.free(COMMON_SWEEP_QUEUE)
	    COMMON_SWEEP_QUEUE = pool.mallocInt32(rcount)
	  }
	  if(COMMON_SWEEP_INDEX.length < rcount) {
	    pool.free(COMMON_SWEEP_INDEX)
	    COMMON_SWEEP_INDEX = pool.mallocInt32(rcount)
	  }
	  var eventLength = 8 * rcount
	  if(SWEEP_EVENTS.length < eventLength) {
	    pool.free(SWEEP_EVENTS)
	    SWEEP_EVENTS = pool.mallocDouble(eventLength)
	  }
	}

	//Remove an item from the active queue in O(1)
	function sqPop(queue, index, count, item) {
	  var idx = index[item]
	  var top = queue[count-1]
	  queue[idx] = top
	  index[top] = idx
	}

	//Insert an item into the active queue in O(1)
	function sqPush(queue, index, count, item) {
	  queue[count] = item
	  index[item]  = count
	}

	//Recursion base case: use 1D sweep algorithm
	function sweepBipartite(
	    d, visit,
	    redStart,  redEnd, red, redIndex,
	    blueStart, blueEnd, blue, blueIndex) {

	  //store events as pairs [coordinate, idx]
	  //
	  //  red create:  -(idx+1)
	  //  red destroy: idx
	  //  blue create: -(idx+BLUE_FLAG)
	  //  blue destroy: idx+BLUE_FLAG
	  //
	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = d-1
	  var iend     = elemSize-1

	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = redIndex[i]
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -(idx+1)
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }

	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = blueIndex[i]+BLUE_FLAG
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }

	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive  = 0
	  var blueActive = 0
	  for(var i=0; i<n; ++i) {
	    var e = SWEEP_EVENTS[2*i+1]|0
	    if(e >= BLUE_FLAG) {
	      //blue destroy event
	      e = (e-BLUE_FLAG)|0
	      sqPop(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive--, e)
	    } else if(e >= 0) {
	      //red destroy event
	      sqPop(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive--, e)
	    } else if(e <= -BLUE_FLAG) {
	      //blue create event
	      e = (-e-BLUE_FLAG)|0
	      for(var j=0; j<redActive; ++j) {
	        var retval = visit(RED_SWEEP_QUEUE[j], e)
	        if(retval !== void 0) {
	          return retval
	        }
	      }
	      sqPush(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive++, e)
	    } else {
	      //red create event
	      e = (-e-1)|0
	      for(var j=0; j<blueActive; ++j) {
	        var retval = visit(e, BLUE_SWEEP_QUEUE[j])
	        if(retval !== void 0) {
	          return retval
	        }
	      }
	      sqPush(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive++, e)
	    }
	  }
	}

	//Complete sweep
	function sweepComplete(d, visit, 
	  redStart, redEnd, red, redIndex,
	  blueStart, blueEnd, blue, blueIndex) {

	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = d-1
	  var iend     = elemSize-1

	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = (redIndex[i]+1)<<1
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }

	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = (blueIndex[i]+1)<<1
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = (-idx)|1
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx|1
	  }

	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive    = 0
	  var blueActive   = 0
	  var commonActive = 0
	  for(var i=0; i<n; ++i) {
	    var e     = SWEEP_EVENTS[2*i+1]|0
	    var color = e&1
	    if(i < n-1 && (e>>1) === (SWEEP_EVENTS[2*i+3]>>1)) {
	      color = 2
	      i += 1
	    }
	    
	    if(e < 0) {
	      //Create event
	      var id = -(e>>1) - 1

	      //Intersect with common
	      for(var j=0; j<commonActive; ++j) {
	        var retval = visit(COMMON_SWEEP_QUEUE[j], id)
	        if(retval !== void 0) {
	          return retval
	        }
	      }

	      if(color !== 0) {
	        //Intersect with red
	        for(var j=0; j<redActive; ++j) {
	          var retval = visit(RED_SWEEP_QUEUE[j], id)
	          if(retval !== void 0) {
	            return retval
	          }
	        }
	      }

	      if(color !== 1) {
	        //Intersect with blue
	        for(var j=0; j<blueActive; ++j) {
	          var retval = visit(BLUE_SWEEP_QUEUE[j], id)
	          if(retval !== void 0) {
	            return retval
	          }
	        }
	      }

	      if(color === 0) {
	        //Red
	        sqPush(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive++, id)
	      } else if(color === 1) {
	        //Blue
	        sqPush(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive++, id)
	      } else if(color === 2) {
	        //Both
	        sqPush(COMMON_SWEEP_QUEUE, COMMON_SWEEP_INDEX, commonActive++, id)
	      }
	    } else {
	      //Destroy event
	      var id = (e>>1) - 1
	      if(color === 0) {
	        //Red
	        sqPop(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive--, id)
	      } else if(color === 1) {
	        //Blue
	        sqPop(BLUE_SWEEP_QUEUE, BLUE_SWEEP_INDEX, blueActive--, id)
	      } else if(color === 2) {
	        //Both
	        sqPop(COMMON_SWEEP_QUEUE, COMMON_SWEEP_INDEX, commonActive--, id)
	      }
	    }
	  }
	}

	//Sweep and prune/scanline algorithm:
	//  Scan along axis, detect intersections
	//  Brute force all boxes along axis
	function scanBipartite(
	  d, axis, visit, flip,
	  redStart,  redEnd, red, redIndex,
	  blueStart, blueEnd, blue, blueIndex) {
	  
	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = axis
	  var iend     = axis+d

	  var redShift  = 1
	  var blueShift = 1
	  if(flip) {
	    blueShift = BLUE_FLAG
	  } else {
	    redShift  = BLUE_FLAG
	  }

	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = i + redShift
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }
	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = i + blueShift
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	  }

	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive    = 0
	  for(var i=0; i<n; ++i) {
	    var e = SWEEP_EVENTS[2*i+1]|0
	    if(e < 0) {
	      var idx   = -e
	      var isRed = false
	      if(idx >= BLUE_FLAG) {
	        isRed = !flip
	        idx -= BLUE_FLAG 
	      } else {
	        isRed = !!flip
	        idx -= 1
	      }
	      if(isRed) {
	        sqPush(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive++, idx)
	      } else {
	        var blueId  = blueIndex[idx]
	        var bluePtr = elemSize * idx
	        
	        var b0 = blue[bluePtr+axis+1]
	        var b1 = blue[bluePtr+axis+1+d]

	red_loop:
	        for(var j=0; j<redActive; ++j) {
	          var oidx   = RED_SWEEP_QUEUE[j]
	          var redPtr = elemSize * oidx

	          if(b1 < red[redPtr+axis+1] || 
	             red[redPtr+axis+1+d] < b0) {
	            continue
	          }

	          for(var k=axis+2; k<d; ++k) {
	            if(blue[bluePtr + k + d] < red[redPtr + k] || 
	               red[redPtr + k + d] < blue[bluePtr + k]) {
	              continue red_loop
	            }
	          }

	          var redId  = redIndex[oidx]
	          var retval
	          if(flip) {
	            retval = visit(blueId, redId)
	          } else {
	            retval = visit(redId, blueId)
	          }
	          if(retval !== void 0) {
	            return retval 
	          }
	        }
	      }
	    } else {
	      sqPop(RED_SWEEP_QUEUE, RED_SWEEP_INDEX, redActive--, e - redShift)
	    }
	  }
	}

	function scanComplete(
	  d, axis, visit,
	  redStart,  redEnd, red, redIndex,
	  blueStart, blueEnd, blue, blueIndex) {

	  var ptr      = 0
	  var elemSize = 2*d
	  var istart   = axis
	  var iend     = axis+d

	  for(var i=redStart; i<redEnd; ++i) {
	    var idx = i + BLUE_FLAG
	    var redOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = red[redOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	    SWEEP_EVENTS[ptr++] = red[redOffset+iend]
	    SWEEP_EVENTS[ptr++] = idx
	  }
	  for(var i=blueStart; i<blueEnd; ++i) {
	    var idx = i + 1
	    var blueOffset = elemSize*i
	    SWEEP_EVENTS[ptr++] = blue[blueOffset+istart]
	    SWEEP_EVENTS[ptr++] = -idx
	  }

	  //process events from left->right
	  var n = ptr >>> 1
	  isort(SWEEP_EVENTS, n)
	  
	  var redActive    = 0
	  for(var i=0; i<n; ++i) {
	    var e = SWEEP_EVENTS[2*i+1]|0
	    if(e < 0) {
	      var idx   = -e
	      if(idx >= BLUE_FLAG) {
	        RED_SWEEP_QUEUE[redActive++] = idx - BLUE_FLAG
	      } else {
	        idx -= 1
	        var blueId  = blueIndex[idx]
	        var bluePtr = elemSize * idx

	        var b0 = blue[bluePtr+axis+1]
	        var b1 = blue[bluePtr+axis+1+d]

	red_loop:
	        for(var j=0; j<redActive; ++j) {
	          var oidx   = RED_SWEEP_QUEUE[j]
	          var redId  = redIndex[oidx]

	          if(redId === blueId) {
	            break
	          }

	          var redPtr = elemSize * oidx
	          if(b1 < red[redPtr+axis+1] || 
	            red[redPtr+axis+1+d] < b0) {
	            continue
	          }
	          for(var k=axis+2; k<d; ++k) {
	            if(blue[bluePtr + k + d] < red[redPtr + k] || 
	               red[redPtr + k + d]   < blue[bluePtr + k]) {
	              continue red_loop
	            }
	          }

	          var retval = visit(redId, blueId)
	          if(retval !== void 0) {
	            return retval 
	          }
	        }
	      }
	    } else {
	      var idx = e - BLUE_FLAG
	      for(var j=redActive-1; j>=0; --j) {
	        if(RED_SWEEP_QUEUE[j] === idx) {
	          for(var k=j+1; k<redActive; ++k) {
	            RED_SWEEP_QUEUE[k-1] = RED_SWEEP_QUEUE[k]
	          }
	          break
	        }
	      }
	      --redActive
	    }
	  }
	}

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';

	//This code is extracted from ndarray-sort
	//It is inlined here as a temporary workaround

	module.exports = wrapper;

	var INSERT_SORT_CUTOFF = 32

	function wrapper(data, n0) {
	  if (n0 <= 4*INSERT_SORT_CUTOFF) {
	    insertionSort(0, n0 - 1, data);
	  } else {
	    quickSort(0, n0 - 1, data);
	  }
	}

	function insertionSort(left, right, data) {
	  var ptr = 2*(left+1)
	  for(var i=left+1; i<=right; ++i) {
	    var a = data[ptr++]
	    var b = data[ptr++]
	    var j = i
	    var jptr = ptr-2
	    while(j-- > left) {
	      var x = data[jptr-2]
	      var y = data[jptr-1]
	      if(x < a) {
	        break
	      } else if(x === a && y < b) {
	        break
	      }
	      data[jptr]   = x
	      data[jptr+1] = y
	      jptr -= 2
	    }
	    data[jptr]   = a
	    data[jptr+1] = b
	  }
	}

	function swap(i, j, data) {
	  i *= 2
	  j *= 2
	  var x = data[i]
	  var y = data[i+1]
	  data[i] = data[j]
	  data[i+1] = data[j+1]
	  data[j] = x
	  data[j+1] = y
	}

	function move(i, j, data) {
	  i *= 2
	  j *= 2
	  data[i] = data[j]
	  data[i+1] = data[j+1]
	}

	function rotate(i, j, k, data) {
	  i *= 2
	  j *= 2
	  k *= 2
	  var x = data[i]
	  var y = data[i+1]
	  data[i] = data[j]
	  data[i+1] = data[j+1]
	  data[j] = data[k]
	  data[j+1] = data[k+1]
	  data[k] = x
	  data[k+1] = y
	}

	function shufflePivot(i, j, px, py, data) {
	  i *= 2
	  j *= 2
	  data[i] = data[j]
	  data[j] = px
	  data[i+1] = data[j+1]
	  data[j+1] = py
	}

	function compare(i, j, data) {
	  i *= 2
	  j *= 2
	  var x = data[i],
	      y = data[j]
	  if(x < y) {
	    return false
	  } else if(x === y) {
	    return data[i+1] > data[j+1]
	  }
	  return true
	}

	function comparePivot(i, y, b, data) {
	  i *= 2
	  var x = data[i]
	  if(x < y) {
	    return true
	  } else if(x === y) {
	    return data[i+1] < b
	  }
	  return false
	}

	function quickSort(left, right, data) {
	  var sixth = (right - left + 1) / 6 | 0, 
	      index1 = left + sixth, 
	      index5 = right - sixth, 
	      index3 = left + right >> 1, 
	      index2 = index3 - sixth, 
	      index4 = index3 + sixth, 
	      el1 = index1, 
	      el2 = index2, 
	      el3 = index3, 
	      el4 = index4, 
	      el5 = index5, 
	      less = left + 1, 
	      great = right - 1, 
	      tmp = 0
	  if(compare(el1, el2, data)) {
	    tmp = el1
	    el1 = el2
	    el2 = tmp
	  }
	  if(compare(el4, el5, data)) {
	    tmp = el4
	    el4 = el5
	    el5 = tmp
	  }
	  if(compare(el1, el3, data)) {
	    tmp = el1
	    el1 = el3
	    el3 = tmp
	  }
	  if(compare(el2, el3, data)) {
	    tmp = el2
	    el2 = el3
	    el3 = tmp
	  }
	  if(compare(el1, el4, data)) {
	    tmp = el1
	    el1 = el4
	    el4 = tmp
	  }
	  if(compare(el3, el4, data)) {
	    tmp = el3
	    el3 = el4
	    el4 = tmp
	  }
	  if(compare(el2, el5, data)) {
	    tmp = el2
	    el2 = el5
	    el5 = tmp
	  }
	  if(compare(el2, el3, data)) {
	    tmp = el2
	    el2 = el3
	    el3 = tmp
	  }
	  if(compare(el4, el5, data)) {
	    tmp = el4
	    el4 = el5
	    el5 = tmp
	  }

	  var pivot1X = data[2*el2]
	  var pivot1Y = data[2*el2+1]
	  var pivot2X = data[2*el4]
	  var pivot2Y = data[2*el4+1]

	  var ptr0 = 2 * el1;
	  var ptr2 = 2 * el3;
	  var ptr4 = 2 * el5;
	  var ptr5 = 2 * index1;
	  var ptr6 = 2 * index3;
	  var ptr7 = 2 * index5;
	  for (var i1 = 0; i1 < 2; ++i1) {
	    var x = data[ptr0+i1];
	    var y = data[ptr2+i1];
	    var z = data[ptr4+i1];
	    data[ptr5+i1] = x;
	    data[ptr6+i1] = y;
	    data[ptr7+i1] = z;
	  }

	  move(index2, left, data)
	  move(index4, right, data)
	  for (var k = less; k <= great; ++k) {
	    if (comparePivot(k, pivot1X, pivot1Y, data)) {
	      if (k !== less) {
	        swap(k, less, data)
	      }
	      ++less;
	    } else {
	      if (!comparePivot(k, pivot2X, pivot2Y, data)) {
	        while (true) {
	          if (!comparePivot(great, pivot2X, pivot2Y, data)) {
	            if (--great < k) {
	              break;
	            }
	            continue;
	          } else {
	            if (comparePivot(great, pivot1X, pivot1Y, data)) {
	              rotate(k, less, great, data)
	              ++less;
	              --great;
	            } else {
	              swap(k, great, data)
	              --great;
	            }
	            break;
	          }
	        }
	      }
	    }
	  }
	  shufflePivot(left, less-1, pivot1X, pivot1Y, data)
	  shufflePivot(right, great+1, pivot2X, pivot2Y, data)
	  if (less - 2 - left <= INSERT_SORT_CUTOFF) {
	    insertionSort(left, less - 2, data);
	  } else {
	    quickSort(left, less - 2, data);
	  }
	  if (right - (great + 2) <= INSERT_SORT_CUTOFF) {
	    insertionSort(great + 2, right, data);
	  } else {
	    quickSort(great + 2, right, data);
	  }
	  if (great - less <= INSERT_SORT_CUTOFF) {
	    insertionSort(less, great, data);
	  } else {
	    quickSort(less, great, data);
	  }
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = boxIntersectIter

	var pool = __webpack_require__(50)
	var bits = __webpack_require__(55)
	var bruteForce = __webpack_require__(60)
	var bruteForcePartial = bruteForce.partial
	var bruteForceFull = bruteForce.full
	var sweep = __webpack_require__(57)
	var findMedian = __webpack_require__(61)
	var genPartition = __webpack_require__(62)

	//Twiddle parameters
	var BRUTE_FORCE_CUTOFF    = 128       //Cut off for brute force search
	var SCAN_CUTOFF           = (1<<22)   //Cut off for two way scan
	var SCAN_COMPLETE_CUTOFF  = (1<<22)  

	//Partition functions
	var partitionInteriorContainsInterval = genPartition(
	  '!(lo>=p0)&&!(p1>=hi)', 
	  ['p0', 'p1'])

	var partitionStartEqual = genPartition(
	  'lo===p0',
	  ['p0'])

	var partitionStartLessThan = genPartition(
	  'lo<p0',
	  ['p0'])

	var partitionEndLessThanEqual = genPartition(
	  'hi<=p0',
	  ['p0'])

	var partitionContainsPoint = genPartition(
	  'lo<=p0&&p0<=hi',
	  ['p0'])

	var partitionContainsPointProper = genPartition(
	  'lo<p0&&p0<=hi',
	  ['p0'])

	//Frame size for iterative loop
	var IFRAME_SIZE = 6
	var DFRAME_SIZE = 2

	//Data for box statck
	var INIT_CAPACITY = 1024
	var BOX_ISTACK  = pool.mallocInt32(INIT_CAPACITY)
	var BOX_DSTACK  = pool.mallocDouble(INIT_CAPACITY)

	//Initialize iterative loop queue
	function iterInit(d, count) {
	  var levels = (8 * bits.log2(count+1) * (d+1))|0
	  var maxInts = bits.nextPow2(IFRAME_SIZE*levels)
	  if(BOX_ISTACK.length < maxInts) {
	    pool.free(BOX_ISTACK)
	    BOX_ISTACK = pool.mallocInt32(maxInts)
	  }
	  var maxDoubles = bits.nextPow2(DFRAME_SIZE*levels)
	  if(BOX_DSTACK < maxDoubles) {
	    pool.free(BOX_DSTACK)
	    BOX_DSTACK = pool.mallocDouble(maxDoubles)
	  }
	}

	//Append item to queue
	function iterPush(ptr,
	  axis, 
	  redStart, redEnd, 
	  blueStart, blueEnd, 
	  state, 
	  lo, hi) {

	  var iptr = IFRAME_SIZE * ptr
	  BOX_ISTACK[iptr]   = axis
	  BOX_ISTACK[iptr+1] = redStart
	  BOX_ISTACK[iptr+2] = redEnd
	  BOX_ISTACK[iptr+3] = blueStart
	  BOX_ISTACK[iptr+4] = blueEnd
	  BOX_ISTACK[iptr+5] = state

	  var dptr = DFRAME_SIZE * ptr
	  BOX_DSTACK[dptr]   = lo
	  BOX_DSTACK[dptr+1] = hi
	}

	//Special case:  Intersect single point with list of intervals
	function onePointPartial(
	  d, axis, visit, flip,
	  redStart, redEnd, red, redIndex,
	  blueOffset, blue, blueId) {

	  var elemSize = 2 * d
	  var bluePtr  = blueOffset * elemSize
	  var blueX    = blue[bluePtr + axis]

	red_loop:
	  for(var i=redStart, redPtr=redStart*elemSize; i<redEnd; ++i, redPtr+=elemSize) {
	    var r0 = red[redPtr+axis]
	    var r1 = red[redPtr+axis+d]
	    if(blueX < r0 || r1 < blueX) {
	      continue
	    }
	    if(flip && blueX === r0) {
	      continue
	    }
	    var redId = redIndex[i]
	    for(var j=axis+1; j<d; ++j) {
	      var r0 = red[redPtr+j]
	      var r1 = red[redPtr+j+d]
	      var b0 = blue[bluePtr+j]
	      var b1 = blue[bluePtr+j+d]
	      if(r1 < b0 || b1 < r0) {
	        continue red_loop
	      }
	    }
	    var retval
	    if(flip) {
	      retval = visit(blueId, redId)
	    } else {
	      retval = visit(redId, blueId)
	    }
	    if(retval !== void 0) {
	      return retval
	    }
	  }
	}

	//Special case:  Intersect one point with list of intervals
	function onePointFull(
	  d, axis, visit,
	  redStart, redEnd, red, redIndex,
	  blueOffset, blue, blueId) {

	  var elemSize = 2 * d
	  var bluePtr  = blueOffset * elemSize
	  var blueX    = blue[bluePtr + axis]

	red_loop:
	  for(var i=redStart, redPtr=redStart*elemSize; i<redEnd; ++i, redPtr+=elemSize) {
	    var redId = redIndex[i]
	    if(redId === blueId) {
	      continue
	    }
	    var r0 = red[redPtr+axis]
	    var r1 = red[redPtr+axis+d]
	    if(blueX < r0 || r1 < blueX) {
	      continue
	    }
	    for(var j=axis+1; j<d; ++j) {
	      var r0 = red[redPtr+j]
	      var r1 = red[redPtr+j+d]
	      var b0 = blue[bluePtr+j]
	      var b1 = blue[bluePtr+j+d]
	      if(r1 < b0 || b1 < r0) {
	        continue red_loop
	      }
	    }
	    var retval = visit(redId, blueId)
	    if(retval !== void 0) {
	      return retval
	    }
	  }
	}

	//The main box intersection routine
	function boxIntersectIter(
	  d, visit, initFull,
	  xSize, xBoxes, xIndex,
	  ySize, yBoxes, yIndex) {

	  //Reserve memory for stack
	  iterInit(d, xSize + ySize)

	  var top  = 0
	  var elemSize = 2 * d
	  var retval

	  iterPush(top++,
	      0,
	      0, xSize,
	      0, ySize,
	      initFull ? 16 : 0, 
	      -Infinity, Infinity)
	  if(!initFull) {
	    iterPush(top++,
	      0,
	      0, ySize,
	      0, xSize,
	      1, 
	      -Infinity, Infinity)
	  }

	  while(top > 0) {
	    top  -= 1

	    var iptr = top * IFRAME_SIZE
	    var axis      = BOX_ISTACK[iptr]
	    var redStart  = BOX_ISTACK[iptr+1]
	    var redEnd    = BOX_ISTACK[iptr+2]
	    var blueStart = BOX_ISTACK[iptr+3]
	    var blueEnd   = BOX_ISTACK[iptr+4]
	    var state     = BOX_ISTACK[iptr+5]

	    var dptr = top * DFRAME_SIZE
	    var lo        = BOX_DSTACK[dptr]
	    var hi        = BOX_DSTACK[dptr+1]

	    //Unpack state info
	    var flip      = (state & 1)
	    var full      = !!(state & 16)

	    //Unpack indices
	    var red       = xBoxes
	    var redIndex  = xIndex
	    var blue      = yBoxes
	    var blueIndex = yIndex
	    if(flip) {
	      red         = yBoxes
	      redIndex    = yIndex
	      blue        = xBoxes
	      blueIndex   = xIndex
	    }

	    if(state & 2) {
	      redEnd = partitionStartLessThan(
	        d, axis,
	        redStart, redEnd, red, redIndex,
	        hi)
	      if(redStart >= redEnd) {
	        continue
	      }
	    }
	    if(state & 4) {
	      redStart = partitionEndLessThanEqual(
	        d, axis,
	        redStart, redEnd, red, redIndex,
	        lo)
	      if(redStart >= redEnd) {
	        continue
	      }
	    }
	    
	    var redCount  = redEnd  - redStart
	    var blueCount = blueEnd - blueStart

	    if(full) {
	      if(d * redCount * (redCount + blueCount) < SCAN_COMPLETE_CUTOFF) {
	        retval = sweep.scanComplete(
	          d, axis, visit, 
	          redStart, redEnd, red, redIndex,
	          blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	        continue
	      }
	    } else {
	      if(d * Math.min(redCount, blueCount) < BRUTE_FORCE_CUTOFF) {
	        //If input small, then use brute force
	        retval = bruteForcePartial(
	            d, axis, visit, flip,
	            redStart,  redEnd,  red,  redIndex,
	            blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	        continue
	      } else if(d * redCount * blueCount < SCAN_CUTOFF) {
	        //If input medium sized, then use sweep and prune
	        retval = sweep.scanBipartite(
	          d, axis, visit, flip, 
	          redStart, redEnd, red, redIndex,
	          blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	        continue
	      }
	    }
	    
	    //First, find all red intervals whose interior contains (lo,hi)
	    var red0 = partitionInteriorContainsInterval(
	      d, axis, 
	      redStart, redEnd, red, redIndex,
	      lo, hi)

	    //Lower dimensional case
	    if(redStart < red0) {

	      if(d * (red0 - redStart) < BRUTE_FORCE_CUTOFF) {
	        //Special case for small inputs: use brute force
	        retval = bruteForceFull(
	          d, axis+1, visit,
	          redStart, red0, red, redIndex,
	          blueStart, blueEnd, blue, blueIndex)
	        if(retval !== void 0) {
	          return retval
	        }
	      } else if(axis === d-2) {
	        if(flip) {
	          retval = sweep.sweepBipartite(
	            d, visit,
	            blueStart, blueEnd, blue, blueIndex,
	            redStart, red0, red, redIndex)
	        } else {
	          retval = sweep.sweepBipartite(
	            d, visit,
	            redStart, red0, red, redIndex,
	            blueStart, blueEnd, blue, blueIndex)
	        }
	        if(retval !== void 0) {
	          return retval
	        }
	      } else {
	        iterPush(top++,
	          axis+1,
	          redStart, red0,
	          blueStart, blueEnd,
	          flip,
	          -Infinity, Infinity)
	        iterPush(top++,
	          axis+1,
	          blueStart, blueEnd,
	          redStart, red0,
	          flip^1,
	          -Infinity, Infinity)
	      }
	    }

	    //Divide and conquer phase
	    if(red0 < redEnd) {

	      //Cut blue into 3 parts:
	      //
	      //  Points < mid point
	      //  Points = mid point
	      //  Points > mid point
	      //
	      var blue0 = findMedian(
	        d, axis, 
	        blueStart, blueEnd, blue, blueIndex)
	      var mid = blue[elemSize * blue0 + axis]
	      var blue1 = partitionStartEqual(
	        d, axis,
	        blue0, blueEnd, blue, blueIndex,
	        mid)

	      //Right case
	      if(blue1 < blueEnd) {
	        iterPush(top++,
	          axis,
	          red0, redEnd,
	          blue1, blueEnd,
	          (flip|4) + (full ? 16 : 0),
	          mid, hi)
	      }

	      //Left case
	      if(blueStart < blue0) {
	        iterPush(top++,
	          axis,
	          red0, redEnd,
	          blueStart, blue0,
	          (flip|2) + (full ? 16 : 0),
	          lo, mid)
	      }

	      //Center case (the hard part)
	      if(blue0 + 1 === blue1) {
	        //Optimization: Range with exactly 1 point, use a brute force scan
	        if(full) {
	          retval = onePointFull(
	            d, axis, visit,
	            red0, redEnd, red, redIndex,
	            blue0, blue, blueIndex[blue0])
	        } else {
	          retval = onePointPartial(
	            d, axis, visit, flip,
	            red0, redEnd, red, redIndex,
	            blue0, blue, blueIndex[blue0])
	        }
	        if(retval !== void 0) {
	          return retval
	        }
	      } else if(blue0 < blue1) {
	        var red1
	        if(full) {
	          //If full intersection, need to handle special case
	          red1 = partitionContainsPoint(
	            d, axis,
	            red0, redEnd, red, redIndex,
	            mid)
	          if(red0 < red1) {
	            var redX = partitionStartEqual(
	              d, axis,
	              red0, red1, red, redIndex,
	              mid)
	            if(axis === d-2) {
	              //Degenerate sweep intersection:
	              //  [red0, redX] with [blue0, blue1]
	              if(red0 < redX) {
	                retval = sweep.sweepComplete(
	                  d, visit,
	                  red0, redX, red, redIndex,
	                  blue0, blue1, blue, blueIndex)
	                if(retval !== void 0) {
	                  return retval
	                }
	              }

	              //Normal sweep intersection:
	              //  [redX, red1] with [blue0, blue1]
	              if(redX < red1) {
	                retval = sweep.sweepBipartite(
	                  d, visit,
	                  redX, red1, red, redIndex,
	                  blue0, blue1, blue, blueIndex)
	                if(retval !== void 0) {
	                  return retval
	                }
	              }
	            } else {
	              if(red0 < redX) {
	                iterPush(top++,
	                  axis+1,
	                  red0, redX,
	                  blue0, blue1,
	                  16,
	                  -Infinity, Infinity)
	              }
	              if(redX < red1) {
	                iterPush(top++,
	                  axis+1,
	                  redX, red1,
	                  blue0, blue1,
	                  0,
	                  -Infinity, Infinity)
	                iterPush(top++,
	                  axis+1,
	                  blue0, blue1,
	                  redX, red1,
	                  1,
	                  -Infinity, Infinity)
	              }
	            }
	          }
	        } else {
	          if(flip) {
	            red1 = partitionContainsPointProper(
	              d, axis,
	              red0, redEnd, red, redIndex,
	              mid)
	          } else {
	            red1 = partitionContainsPoint(
	              d, axis,
	              red0, redEnd, red, redIndex,
	              mid)
	          }
	          if(red0 < red1) {
	            if(axis === d-2) {
	              if(flip) {
	                retval = sweep.sweepBipartite(
	                  d, visit,
	                  blue0, blue1, blue, blueIndex,
	                  red0, red1, red, redIndex)
	              } else {
	                retval = sweep.sweepBipartite(
	                  d, visit,
	                  red0, red1, red, redIndex,
	                  blue0, blue1, blue, blueIndex)
	              }
	            } else {
	              iterPush(top++,
	                axis+1,
	                red0, red1,
	                blue0, blue1,
	                flip,
	                -Infinity, Infinity)
	              iterPush(top++,
	                axis+1,
	                blue0, blue1,
	                red0, red1,
	                flip^1,
	                -Infinity, Infinity)
	            }
	          }
	        }
	      }
	    }
	  }
	}

/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict'

	var DIMENSION   = 'd'
	var AXIS        = 'ax'
	var VISIT       = 'vv'
	var FLIP        = 'fp'

	var ELEM_SIZE   = 'es'

	var RED_START   = 'rs'
	var RED_END     = 're'
	var RED_BOXES   = 'rb'
	var RED_INDEX   = 'ri'
	var RED_PTR     = 'rp'

	var BLUE_START  = 'bs'
	var BLUE_END    = 'be'
	var BLUE_BOXES  = 'bb'
	var BLUE_INDEX  = 'bi'
	var BLUE_PTR    = 'bp'

	var RETVAL      = 'rv'

	var INNER_LABEL = 'Q'

	var ARGS = [
	  DIMENSION,
	  AXIS,
	  VISIT,
	  RED_START,
	  RED_END,
	  RED_BOXES,
	  RED_INDEX,
	  BLUE_START,
	  BLUE_END,
	  BLUE_BOXES,
	  BLUE_INDEX
	]

	function generateBruteForce(redMajor, flip, full) {
	  var funcName = 'bruteForce' + 
	    (redMajor ? 'Red' : 'Blue') + 
	    (flip ? 'Flip' : '') +
	    (full ? 'Full' : '')

	  var code = ['function ', funcName, '(', ARGS.join(), '){',
	    'var ', ELEM_SIZE, '=2*', DIMENSION, ';']

	  var redLoop = 
	    'for(var i=' + RED_START + ',' + RED_PTR + '=' + ELEM_SIZE + '*' + RED_START + ';' +
	        'i<' + RED_END +';' +
	        '++i,' + RED_PTR + '+=' + ELEM_SIZE + '){' +
	        'var x0=' + RED_BOXES + '[' + AXIS + '+' + RED_PTR + '],' +
	            'x1=' + RED_BOXES + '[' + AXIS + '+' + RED_PTR + '+' + DIMENSION + '],' +
	            'xi=' + RED_INDEX + '[i];'

	  var blueLoop = 
	    'for(var j=' + BLUE_START + ',' + BLUE_PTR + '=' + ELEM_SIZE + '*' + BLUE_START + ';' +
	        'j<' + BLUE_END + ';' +
	        '++j,' + BLUE_PTR + '+=' + ELEM_SIZE + '){' +
	        'var y0=' + BLUE_BOXES + '[' + AXIS + '+' + BLUE_PTR + '],' +
	            (full ? 'y1=' + BLUE_BOXES + '[' + AXIS + '+' + BLUE_PTR + '+' + DIMENSION + '],' : '') +
	            'yi=' + BLUE_INDEX + '[j];'

	  if(redMajor) {
	    code.push(redLoop, INNER_LABEL, ':', blueLoop)
	  } else {
	    code.push(blueLoop, INNER_LABEL, ':', redLoop)
	  }

	  if(full) {
	    code.push('if(y1<x0||x1<y0)continue;')
	  } else if(flip) {
	    code.push('if(y0<=x0||x1<y0)continue;')
	  } else {
	    code.push('if(y0<x0||x1<y0)continue;')
	  }

	  code.push('for(var k='+AXIS+'+1;k<'+DIMENSION+';++k){'+
	    'var r0='+RED_BOXES+'[k+'+RED_PTR+'],'+
	        'r1='+RED_BOXES+'[k+'+DIMENSION+'+'+RED_PTR+'],'+
	        'b0='+BLUE_BOXES+'[k+'+BLUE_PTR+'],'+
	        'b1='+BLUE_BOXES+'[k+'+DIMENSION+'+'+BLUE_PTR+'];'+
	      'if(r1<b0||b1<r0)continue ' + INNER_LABEL + ';}' +
	      'var ' + RETVAL + '=' + VISIT + '(')

	  if(flip) {
	    code.push('yi,xi')
	  } else {
	    code.push('xi,yi')
	  }

	  code.push(');if(' + RETVAL + '!==void 0)return ' + RETVAL + ';}}}')

	  return {
	    name: funcName, 
	    code: code.join('')
	  }
	}

	function bruteForcePlanner(full) {
	  var funcName = 'bruteForce' + (full ? 'Full' : 'Partial')
	  var prefix = []
	  var fargs = ARGS.slice()
	  if(!full) {
	    fargs.splice(3, 0, FLIP)
	  }

	  var code = ['function ' + funcName + '(' + fargs.join() + '){']

	  function invoke(redMajor, flip) {
	    var res = generateBruteForce(redMajor, flip, full)
	    prefix.push(res.code)
	    code.push('return ' + res.name + '(' + ARGS.join() + ');')
	  }

	  code.push('if(' + RED_END + '-' + RED_START + '>' +
	                    BLUE_END + '-' + BLUE_START + '){')

	  if(full) {
	    invoke(true, false)
	    code.push('}else{')
	    invoke(false, false)
	  } else {
	    code.push('if(' + FLIP + '){')
	    invoke(true, true)
	    code.push('}else{')
	    invoke(true, false)
	    code.push('}}else{if(' + FLIP + '){')
	    invoke(false, true)
	    code.push('}else{')
	    invoke(false, false)
	    code.push('}')
	  }
	  code.push('}}return ' + funcName)

	  var codeStr = prefix.join('') + code.join('')
	  var proc = new Function(codeStr)
	  return proc()
	}


	exports.partial = bruteForcePlanner(false)
	exports.full    = bruteForcePlanner(true)

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	module.exports = findMedian

	var genPartition = __webpack_require__(62)

	var partitionStartLessThan = genPartition('lo<p0', ['p0'])

	var PARTITION_THRESHOLD = 8   //Cut off for using insertion sort in findMedian

	//Base case for median finding:  Use insertion sort
	function insertionSort(d, axis, start, end, boxes, ids) {
	  var elemSize = 2 * d
	  var boxPtr = elemSize * (start+1) + axis
	  for(var i=start+1; i<end; ++i, boxPtr+=elemSize) {
	    var x = boxes[boxPtr]
	    for(var j=i, ptr=elemSize*(i-1); 
	        j>start && boxes[ptr+axis] > x; 
	        --j, ptr-=elemSize) {
	      //Swap
	      var aPtr = ptr
	      var bPtr = ptr+elemSize
	      for(var k=0; k<elemSize; ++k, ++aPtr, ++bPtr) {
	        var y = boxes[aPtr]
	        boxes[aPtr] = boxes[bPtr]
	        boxes[bPtr] = y
	      }
	      var tmp = ids[j]
	      ids[j] = ids[j-1]
	      ids[j-1] = tmp
	    }
	  }
	}

	//Find median using quick select algorithm
	//  takes O(n) time with high probability
	function findMedian(d, axis, start, end, boxes, ids) {
	  if(end <= start+1) {
	    return start
	  }

	  var lo       = start
	  var hi       = end
	  var mid      = ((end + start) >>> 1)
	  var elemSize = 2*d
	  var pivot    = mid
	  var value    = boxes[elemSize*mid+axis]
	  
	  while(lo < hi) {
	    if(hi - lo < PARTITION_THRESHOLD) {
	      insertionSort(d, axis, lo, hi, boxes, ids)
	      value = boxes[elemSize*mid+axis]
	      break
	    }
	    
	    //Select pivot using median-of-3
	    var count  = hi - lo
	    var pivot0 = (Math.random()*count+lo)|0
	    var value0 = boxes[elemSize*pivot0 + axis]
	    var pivot1 = (Math.random()*count+lo)|0
	    var value1 = boxes[elemSize*pivot1 + axis]
	    var pivot2 = (Math.random()*count+lo)|0
	    var value2 = boxes[elemSize*pivot2 + axis]
	    if(value0 <= value1) {
	      if(value2 >= value1) {
	        pivot = pivot1
	        value = value1
	      } else if(value0 >= value2) {
	        pivot = pivot0
	        value = value0
	      } else {
	        pivot = pivot2
	        value = value2
	      }
	    } else {
	      if(value1 >= value2) {
	        pivot = pivot1
	        value = value1
	      } else if(value2 >= value0) {
	        pivot = pivot0
	        value = value0
	      } else {
	        pivot = pivot2
	        value = value2
	      }
	    }

	    //Swap pivot to end of array
	    var aPtr = elemSize * (hi-1)
	    var bPtr = elemSize * pivot
	    for(var i=0; i<elemSize; ++i, ++aPtr, ++bPtr) {
	      var x = boxes[aPtr]
	      boxes[aPtr] = boxes[bPtr]
	      boxes[bPtr] = x
	    }
	    var y = ids[hi-1]
	    ids[hi-1] = ids[pivot]
	    ids[pivot] = y

	    //Partition using pivot
	    pivot = partitionStartLessThan(
	      d, axis, 
	      lo, hi-1, boxes, ids,
	      value)

	    //Swap pivot back
	    var aPtr = elemSize * (hi-1)
	    var bPtr = elemSize * pivot
	    for(var i=0; i<elemSize; ++i, ++aPtr, ++bPtr) {
	      var x = boxes[aPtr]
	      boxes[aPtr] = boxes[bPtr]
	      boxes[bPtr] = x
	    }
	    var y = ids[hi-1]
	    ids[hi-1] = ids[pivot]
	    ids[pivot] = y

	    //Swap pivot to last pivot
	    if(mid < pivot) {
	      hi = pivot-1
	      while(lo < hi && 
	        boxes[elemSize*(hi-1)+axis] === value) {
	        hi -= 1
	      }
	      hi += 1
	    } else if(pivot < mid) {
	      lo = pivot + 1
	      while(lo < hi &&
	        boxes[elemSize*lo+axis] === value) {
	        lo += 1
	      }
	    } else {
	      break
	    }
	  }

	  //Make sure pivot is at start
	  return partitionStartLessThan(
	    d, axis, 
	    start, mid, boxes, ids,
	    boxes[elemSize*mid+axis])
	}

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict'

	module.exports = genPartition

	var code = 'for(var j=2*a,k=j*c,l=k,m=c,n=b,o=a+b,p=c;d>p;++p,k+=j){var _;if($)if(m===p)m+=1,l+=j;else{for(var s=0;j>s;++s){var t=e[k+s];e[k+s]=e[l],e[l++]=t}var u=f[p];f[p]=f[m],f[m++]=u}}return m'

	function genPartition(predicate, args) {
	  var fargs ='abcdef'.split('').concat(args)
	  var reads = []
	  if(predicate.indexOf('lo') >= 0) {
	    reads.push('lo=e[k+n]')
	  }
	  if(predicate.indexOf('hi') >= 0) {
	    reads.push('hi=e[k+o]')
	  }
	  fargs.push(
	    code.replace('_', reads.join())
	        .replace('$', predicate))
	  return Function.apply(void 0, fargs)
	}

/***/ },
/* 63 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("centerPosition", ["position", "center"]);
		ecs.addEach(function centerPosition(entity, elapsed) { // eslint-disable-line no-unused-vars
			var position = game.entities.get(entity, "position");
			var center = game.entities.get(entity, "center");
			var size = game.entities.get(entity, "size");
			// FIXME: doesn't work with cameras yet.
			if (center.x) {
				position.x = Math.floor(game.canvas.width / 2);
				if (size) {
					position.x -= Math.floor(size.width / 2);
				}
			}
			if (center.y) {
				position.y = Math.floor(game.canvas.height / 2);
				if (size) {
					position.y -= Math.floor(size.height / 2);
				}
			}
		}, "centerPosition");
	};


/***/ },
/* 64 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		ecs.add(function clearScreen(entities, context) {
			context.clearRect(0, 0, game.canvas.width, game.canvas.height);
		});
	};


/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("constrainToPlayableArea", ["position", "size", "playableArea"]);
		ecs.addEach(function constrainToPlayableArea(entity, elapsed) { // eslint-disable-line no-unused-vars
			var position = game.entities.get(entity, "position");
			var playableArea = game.entities.get(entity, "playableArea");
			var size = game.entities.get(entity, "size");
			if (position.x < playableArea.x) {
				position.x = playableArea.x;
			}
			if (position.x + size.width > playableArea.x + playableArea.width) {
				position.x = playableArea.x + playableArea.width - size.width;
			}
			if (position.y < playableArea.y) {
				position.y = playableArea.y;
			}
			if (position.y + size.height > playableArea.y + playableArea.height) {
				position.y = playableArea.y + playableArea.height - size.height;
			}
		}, "constrainToPlayableArea");
	};


/***/ },
/* 66 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("controlPlayer", ["movement2d", "playerController2d"]);
		ecs.addEach(function controlPlayer(entity, elapsed) { // eslint-disable-line no-unused-vars
			var movement2d = game.entities.get(entity, "movement2d");
			var playerController2d = game.entities.get(entity, "playerController2d");
			movement2d.up = game.input.button(playerController2d.up);
			movement2d.down = game.input.button(playerController2d.down);
			movement2d.left = game.input.button(playerController2d.left);
			movement2d.right = game.input.button(playerController2d.right);
		}, "controlPlayer");
	};


/***/ },
/* 67 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		ecs.add(function drawFrameRate(entities, context, elapsed) {
			var fps = Math.floor(1000 / elapsed);

			context.font = "24px mono";
			if (fps < 30) {
				context.fillStyle = "red";
			} else if (fps < 50) {
				context.fillStyle = "yellow";
			} else {
				context.fillStyle = "green";
			}

			var msg = fps + " FPS";
			var w = context.measureText(msg).width;
			context.fillText(msg, game.canvas.width - w - 50, 50);
		});
	};


/***/ },
/* 68 */
/***/ function(module, exports) {

	"use strict";

	function drawEntity(game, entity, context) {
		var imageComponent = game.entities.get(entity, "image");

		var image = imageComponent.buffer;
		if (!image) {
			image = game.images.get(imageComponent.name);
		}
		if (!image) {
			console.error("No such image", imageComponent.name, "for entity", entity, game.entities.get(entity, "name"));
			return;
		}

		// FIXME: disable these checks/warnings in production version

		var sx = imageComponent.sourceX || 0;
		var sy = imageComponent.sourceY || 0;

		var dx = imageComponent.destinationX || 0;
		var dy = imageComponent.destinationY || 0;

		var size = game.entities.get(entity, "size") || { "width": 0, "height": 0 };

		var sw = imageComponent.sourceWidth || image.width;
		if (sw === 0) {
			console.warn("sourceWidth is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
		}
		var sh = imageComponent.sourceHeight || image.height;
		if (sh === 0) {
			console.warn("sourceHeight is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
		}

		var dw = imageComponent.destinationWidth || size.width || image.width;
		if (dw === 0) {
			console.warn("destinationWidth is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
		}
		var dh = imageComponent.destinationHeight || size.height || image.height;
		if (dh === 0) {
			console.warn("destinationHeight is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
		}


		try {
			var position = game.entities.get(entity, "position");

			var dx2 = dx + position.x;
			var dy2 = dy + position.y;

			var rotation = game.entities.get(entity, "rotation");
			if (rotation !== undefined) {
				context.save();
				var rx = rotation.x || size.width / 2 || 0;
				var ry = rotation.y || size.height / 2 || 0;
				var x = position.x + rx;
				var y = position.y + ry;
				context.translate(x, y);
				context.rotate(rotation.angle);

				dx2 = dx - rx;
				dy2 = dy - ry;
			}

			context.drawImage(image, sx, sy, sw, sh, dx2, dy2, dw, dh);

			if (rotation !== undefined) {
				context.restore();
			}
		} catch (e) {
			console.error("Error drawing image", imageComponent.name, e);
		}
	}

	module.exports = function(ecs, game) {
		game.entities.registerSearch("drawImage", ["image", "position"]);
		ecs.add(function drawImage(entities, context) {
			var ids = entities.find("drawImage");
			ids.sort(function(a, b) {
				var za = (entities.get(a, "zindex") || { zindex: 0 }).zindex;
				var zb = (entities.get(b, "zindex") || { zindex: 0 }).zindex;
				var ya = (entities.get(a, "position") || { y: 0 }).y;
				var yb = (entities.get(b, "position") || { y: 0 }).y;
				return za - zb || ya - yb;
			});

			for (var i = 0; i < ids.length; i++) {
				drawEntity(game, ids[i], context);
			}
		});
	};


/***/ },
/* 69 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("drawRectangles", ["position", "size"]);
		ecs.addEach(function drawRectangles(entity, context) {
			var strokeStyle = game.entities.get(entity, "strokeStyle");
			if (strokeStyle) {
				context.strokeStyle = strokeStyle;
			}
			var position = game.entities.get(entity, "position");
			var size = game.entities.get(entity, "size");
			context.strokeRect(Math.floor(position.x), Math.floor(position.y), size.width, size.height);
		}, "drawRectangles");
	};


/***/ },
/* 70 */
/***/ function(module, exports) {

	"use strict";

	function distanceSquared(x1, y1, x2, y2) {
		return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
	}

	module.exports = function(ecs, game) {
		game.entities.registerSearch("followParent", ["position", "size", "follow"]);
		ecs.addEach(function followParent(entity, elapsed) { // eslint-disable-line no-unused-vars
			var position = game.entities.get(entity, "position");
			var follow = game.entities.get(entity, "follow");
			var size = game.entities.get(entity, "size");

			var x1 = position.x + (size.width / 2);
			var y1 = position.y + (size.height / 2);

			var parent = follow.id;
			if (game.entities.get(parent, "id") === undefined) {
				return;
			}
			var parentPosition = game.entities.get(parent, "position");
			var parentSize = game.entities.get(parent, "size");

			var x2 = parentPosition.x + (parentSize.width / 2);
			var y2 = parentPosition.y + (parentSize.height / 2);

			var angle = Math.atan2(y2 - y1, x2 - x1);
			var rotation = game.entities.get(entity, "rotation");
			if (rotation !== undefined) {
				rotation.angle = angle - (Math.PI / 2);
			}

			var distSquared = distanceSquared(x1, y1, x2, y2);
			if (distSquared < follow.distance * follow.distance) {
				return;
			}

			var toMove = Math.sqrt(distSquared) - follow.distance;

			position.x += toMove * Math.cos(angle);
			position.y += toMove * Math.sin(angle);
		}, "followParent");
	};


/***/ },
/* 71 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("matchAspectRatioSearch", ["matchAspectRatio", "size"]);
		ecs.addEach(function matchCanvasSize(entity, elapsed) { // eslint-disable-line no-unused-vars
			var size = game.entities.get(entity, "size");

			var match = game.entities.get(entity, "matchAspectRatio").id;
			var matchSize = game.entities.get(match, "size");
			if (matchSize === undefined) {
				return;
			}

			var matchAspectRatio = matchSize.width / matchSize.height;

			var currentAspectRatio = size.width / size.height;
			if (currentAspectRatio > matchAspectRatio) {
				size.height = Math.floor(size.width / matchAspectRatio);
			} else if (currentAspectRatio < matchAspectRatio) {
				size.width = Math.floor(size.height * matchAspectRatio);
			}
		}, "matchAspectRatioSearch");
	};


/***/ },
/* 72 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		ecs.addEach(function matchCanvasSize(entity, elapsed) { // eslint-disable-line no-unused-vars
			var size = game.entities.get(entity, "size");
			if (size === undefined) {
				game.entities.set(entity, "size", {
					width: game.canvas.width,
					height: game.canvas.height
				});
			} else {
				size.width = game.canvas.width;
				size.height = game.canvas.height;
			}
		}, "matchCanvasSize");
	};


/***/ },
/* 73 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("matchParent", ["position", "match"]);
		ecs.addEach(function matchParent(entity, elapsed) { // eslint-disable-line no-unused-vars
			var match = game.entities.get(entity, "match");

			var parentPosition = game.entities.get(match.id, "position");
			if (parentPosition === undefined) {
				return;
			}

			game.entities.set(entity, "position", {
				x: parentPosition.x + match.offsetX,
				y: parentPosition.y + match.offsetY
			});
		}, "matchParent");
	};


/***/ },
/* 74 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) {
		game.entities.registerSearch("viewport", ["camera", "position", "size"]);
		ecs.addEach(function viewportMoveToCamera(entity, context) {
			var position = game.entities.get(entity, "position");
			var size = game.entities.get(entity, "size");

			context.save();
			context.scale(game.canvas.width / size.width, game.canvas.height / size.height);
			context.translate(-Math.floor(position.x), -Math.floor(position.y));
		}, "viewport");
	};


/***/ },
/* 75 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function viewportReset(ecs, game) { // eslint-disable-line no-unused-vars
		ecs.add(function(entities, context) { // eslint-disable-line no-unused-vars
			context.restore();
		});
	};


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./renderer/render-progress.js": 77,
		"./renderer/render_ability_cooldowns.js": 78,
		"./renderer/render_end_btns.js": 79,
		"./renderer/render_film.js": 80,
		"./renderer/render_tutorial_text.js": 81,
		"./renderer/render_zen.js": 82,
		"./renderer/render_zengrenade.js": 83,
		"./renderer/sample-renderer-system.js": 84,
		"./simulation/increment_om.js": 85,
		"./simulation/mouse_simulation.js": 86,
		"./simulation/mouse_simulation_credits.js": 87,
		"./simulation/mouse_simulation_end.js": 88,
		"./simulation/mouse_simulation_title.js": 89,
		"./simulation/player_bob.js": 90,
		"./simulation/projectile_rotation.js": 91,
		"./simulation/resolve_collisions.js": 92,
		"./simulation/sample-simulation-system.js": 93,
		"./simulation/zengrenade.js": 94
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 76;


/***/ },
/* 77 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
		data.entities.registerSearch("search", ["progress", "progress_meter"]);
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
			var progress = data.entities.get(entity, "progress");
			context.globalAlpha = 0.65;
			var prog= progress.value/progress.max > 1? 1:progress.value/progress.max ;

			for(var i = 0;i < progress.blocks.length;i++){
				var match =data.entities.get(progress.blocks[i],"match");
				var block_size = data.entities.get(progress.blocks[i],"size");
				var colors = data.entities.get(progress.blocks[i],"colors");
				var color = Math.floor(progress.value/progress.pill_value)>=i?colors.full:colors.empty;  
				context.fillStyle = color;

				context.fillRect(position.x, position.y + match.offsetY, block_size.width, block_size.height);

			}
	        context.globalAlpha = 1;

		}, "search");
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
			var image = data.entities.get(entity,"image");
			context.globalAlpha = 0.5;
			context.drawImage(data.images.get(image.name),position.x,position.y,size.width,size.height);
			context.globalAlpha = 1;
		}, "lotus");
	};


/***/ },
/* 78 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars

	        var cursor = 2;
	        var name = data.entities.get(entity, "name");
	        var timers = data.entities.get(cursor, "timers");
	        var position = data.entities.get(entity, "position");
	        var size = data.entities.get(entity, "size");
	        
	        if(name == "zengrenade") {
	            if(timers.zen_cooldown.running) {
	                var zen_percent = timers.zen_cooldown.time / timers.zen_cooldown.max;
	                context.globalAlpha = 0.25;
	                context.fillStyle = "black";
	                context.fillRect(position.x + size.width * 0.15, position.y + size.height * 0.15, (size.width * 0.7) - ((size.width * 0.7) * zen_percent), size.height * 0.7);
	                context.globalAlpha = 1;
	            }
	        }

	    }, "ability_icon");
	}


/***/ },
/* 79 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
		data.entities.registerSearch("search", ["btn"]);
		data.entities.registerSearch("cursor", ["cursor"]);
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
			context.globalAlpha = 1;
			var image = data.entities.get(entity,"image");
			context.drawImage(data.images.get(image.name),position.x,position.y,size.width,size.height);

		}, "search");
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
			context.globalAlpha = 1;
			var image = data.entities.get(entity,"image");
			context.drawImage(data.images.get(image.name),position.x,position.y,size.width,size.height);

		}, "cursor");
	};


/***/ },
/* 80 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
	        
	        var timers = data.entities.get(entity, "timers");
	        if(timers.bring_in_film.running === true){

	            context.fillStyle = "white";
	            context.globalAlpha = 0.7;
	            context.fillRect(0,0,data.canvas.width, data.canvas.height*(timers.bring_in_film.time/timers.bring_in_film.max));
	            context.globalAlpha = 1;
	        }else{
	             context.fillStyle = "white";
	            context.globalAlpha = 0.7;
	            context.fillRect(0,0,data.canvas.width, data.canvas.height);
	            context.globalAlpha = 1;
	        }
	        
	       
	    }, "camera");
	}


/***/ },
/* 81 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
	    ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars

	        var pos_txt = "This is Positive Energy. It will bring your monk to zen";
	        var neg_txt = "This is Negative Energy. It will ruin your monk's concentration.";
	        var zengrenade_txt = "Press space to drop a zen grenade.";

	        // Positive Projectile Position: {"x": data.canvas.width * 0.25, "y": data.canvas.height * 0.1}
	        context.font = "20px Arial";
	        context.fillStyle = "black";
	        context.fillText(pos_txt, data.canvas.width * 0.25 - (context.measureText(pos_txt).width / 2), data.canvas.height * 0.2);
	        context.fillText(neg_txt, data.canvas.width * 0.75 - (context.measureText(neg_txt).width / 2), data.canvas.height * 0.2);
	        context.fillText(zengrenade_txt, data.canvas.width * 0.5 - (context.measureText(zengrenade_txt).width / 2), data.canvas.height * 0.85);

	    }, "camera");
	}


/***/ },
/* 82 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
		
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
			var om_progress = data.entities.get(entity,"om_progress");
			context.strokeStyle = "#82d1e1"
			context.lineWidth = size.width*0.05;
			context.globalAlpha = 1;
			context.beginPath();
			context.arc(position.x+size.width/2,position.y+size.height/2,size.width/2- size.width*0.02,0,Math.PI*2*om_progress.value/om_progress.max);
			context.stroke();
			context.globalAlpha = 1;
		}, "om");
	};


/***/ },
/* 83 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
	        var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
	        context.globalAlpha = 0.6;
			context.fillStyle = "red"; 
	        context.beginPath();
			context.arc(position.x + size.width/2, position.y+size.height/2, size.width/2, 0, Math.PI*2);
	        context.closePath();
	        context.fill();
	        context.globalAlpha = 1;
	    }, "zengrenade");
	}


/***/ },
/* 84 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) { // eslint-disable-line no-unused-vars
		data.entities.registerSearch("sampleRendererSystem", ["camera", "position", "size"]);
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
			var color = data.entities.get(entity, "fillStyle");
			context.fillStyle = color; 
			context.fillRect(position.x, position.y, size.width, size.height);
		}, "sampleRendererSystem");
	};


/***/ },
/* 85 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
	    ecs.addEach(function(entity, elapsed) {
	        var player = 1;
	        var player_image = data.entities.get(player,"image");
	        var progress_meter = 7;
	        var progress = data.entities.get(progress_meter,"progress");
	        var om_progress = data.entities.get(entity,"om_progress");
	        if(progress.value === progress.max){
	        	om_progress.value += om_progress.increment;
	        	player_image.name = "monkzenmode";
	        } else if(progress.value <= 30) {
	            player_image.name = "pissedface";
	        } else {
	            player_image.name = player_image.name == "monkzenmode"?"player":player_image.name;
	        }
			if(om_progress.value >= om_progress.max) {
				om_progress.value = om_progress.max;
			}
	        if(om_progress.value == om_progress.max){
	        	om_progress.zen = true;
	        }
	    }, "om");
	}


/***/ },
/* 86 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
	    ecs.addEach(function(entity, elapsed) {
	        var progress_meter = 7;
	        var increment_progress =1;
	        var progress = data.entities.get(progress_meter,"progress");

			var player = 1;
			var om_meter = 3;
			var player_timers = data.entities.get(player, "timers");
	        var entity_size = data.entities.get(entity, "size");
	        var entity_position = data.entities.get(entity, "position");
	        var image = data.entities.get(entity, "image");
	        var timers = data.entities.get(entity, "timers");
	        var click_image = data.entities.get(entity, "click_image");
	        var cursor_position = {
	            "x": data.input.mouse.x - entity_size.width / 2,
	            "y": data.input.mouse.y - entity_size.height / 2
	        };
	        data.entities.set(entity, "position", cursor_position);

	        var timers = data.entities.get(entity, "timers");
	        var entity_collisions = data.entities.get(entity, "collisions");
	        var om_progress = data.entities.get(om_meter, "om_progress");
	        if(data.input.mouse.consumePressed(0)) {
				console.log(om_progress.zen);
	            for(var i = 0; i < entity_collisions.length; ++i) {
	                if(data.entities.get(entity_collisions[i], "name") == "play_button") {
	                    data.entities.set(entity_collisions[i], "image", {"name": "play_pressed"}); 
	                    data.switchScene("main", {"level": 1});
	                }
	                if(data.entities.get(entity_collisions[i], "projectile") && !data.entities.get(entity_collisions[i], "negative_effect")) {
	                    var vel = data.entities.get(entity_collisions[i],"velocity");
	                    var col_timers = data.entities.get(entity_collisions[i],"timers");
	                    vel.x = -2*vel.x;
	                    vel.y = -2*vel.y;
	                    col_timers.push_back.running= true;
	                    col_timers.push_back.timer=0;

	                }
					if(data.entities.get(entity_collisions[i], "name") == "om" && om_progress.zen) {
						player_timers.dat_outro.running = true;
					}
	                if(data.entities.get(entity_collisions[i], "projectile") && data.entities.get(entity_collisions[i], "negative_effect")) {
	                    data.entities.destroy(entity_collisions[i--]);
	                }
	            }
	            image.name = click_image;
	            timers.cursor_click.time = 0;
	            timers.cursor_click.running = true;
	        }

	        var grenade, grenade_timers;

	        if(data.input.button("zengrenade")) {
	            // Show reticle
	            if(!timers.zen_cooldown.running) {
	                image.name = "zengrenade_reticle";
	                image.destinationWidth = entity_size.width * 6;
	                image.destinationHeight = entity_size.height * 6;
	                image.destinationX = -image.destinationWidth / 2 + entity_size.width / 2;
	                image.destinationY = -image.destinationHeight / 2 + entity_size.height / 2;
	            }
	        }
	        if(data.input.buttonReleased("zengrenade")) {
	            if(!timers.zen_cooldown.running) {
	                grenade = data.instantiatePrefab("zengrenade");
	                data.entities.set(entity, "image", {"name": "cursor"});
	                data.entities.set(grenade, "position", { "x": cursor_position.x - entity_size.width / 2, "y": cursor_position.y - entity_size.height / 2});
	                data.entities.set(grenade, "size", {"width": entity_size.width * 2, "height": entity_size.height * 2});
	                timers.zen_cooldown.time = 0;
	                timers.zen_cooldown.running = true;
	            }
	        }

	    }, "cursor");
	}


/***/ },
/* 87 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
	    ecs.addEach(function(entity, elapsed) {
	        var entity_size = data.entities.get(entity, "size");
	        var entity_position = data.entities.get(entity, "position");
	        var image = data.entities.get(entity, "image");
	        var click_image = data.entities.get(entity, "click_image");
	        var cursor_position = {
	            "x": data.input.mouse.x - entity_size.width / 2,
	            "y": data.input.mouse.y - entity_size.height / 2
	        };
	        data.entities.set(entity, "position", cursor_position);

	        var timers = data.entities.get(entity, "timers");
	        var entity_collisions = data.entities.get(entity, "collisions");
	        if(data.input.mouse.consumePressed(0)) {
	            for(var i = 0; i < entity_collisions.length; ++i) {
	                if(data.entities.get(entity_collisions[i], "name") == "back_title") {
	                    data.entities.set(entity_collisions[i], "image", {"name": "back_to_title_pressed"}); 
	                    data.sounds.stop("title");
	                    data.switchScene("title");
	                }
					if(data.entities.get(entity_collisions[i], "target_url").length > 0) {
						window.location = data.entities.get(entity_collisions[i], "target_url");
					}
	            }
	            image.name = click_image;
	            timers.cursor_click.time = 0;
	            timers.cursor_click.running = true;
	        }

	    }, "cursor");
	}


/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = function(ecs, data) {
	    ecs.addEach(function(entity, elapsed) {
	        var entity_size = data.entities.get(entity, "size");
	        var entity_position = data.entities.get(entity, "position");
	        var image = data.entities.get(entity, "image");
	        var click_image = data.entities.get(entity, "click_image");
	        var cursor_position = {
	            "x": data.input.mouse.x - entity_size.width / 2,
	            "y": data.input.mouse.y - entity_size.height / 2
	        };
	        data.entities.set(entity, "position", cursor_position);

	        var timers = data.entities.get(entity, "timers");
	        var entity_collisions = data.entities.get(entity, "collisions");
	        if(data.input.mouse.consumePressed(0)) {
	            var film_timer = data.entities.get(0, "timers");
	            film_timer.bring_in_film.time = 2999;
	            film_timer.start_end.time = 999;
	            for(var i = 0; i < entity_collisions.length; ++i) {
	                if(data.entities.get(entity_collisions[i], "name") == "title") {
	                    data.sounds.stop("main");
	                    data.switchScene("title");
	                }
	                if(data.entities.get(entity_collisions[i], "name") == "try_again") {
	                    data.sounds.stop("main");
	                    data.switchScene("main", {"mode": "normal"});
	                }
	            }
	            image.name = click_image;
	            timers.cursor_click.time = 0;
	            timers.cursor_click.running = true;
	        }
	    }, "cursor");
	}

/***/ },
/* 89 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
	    ecs.addEach(function(entity, elapsed) {
	        var entity_size = data.entities.get(entity, "size");
	        var entity_position = data.entities.get(entity, "position");
	        var image = data.entities.get(entity, "image");
	        var click_image = data.entities.get(entity, "click_image");
	        var cursor_position = {
	            "x": data.input.mouse.x - entity_size.width / 2,
	            "y": data.input.mouse.y - entity_size.height / 2
	        };
	        data.entities.set(entity, "position", cursor_position);

	        var timers = data.entities.get(entity, "timers");
	        var entity_collisions = data.entities.get(entity, "collisions");
	        if(data.input.mouse.consumePressed(0)) {
	            for(var i = 0; i < entity_collisions.length; ++i) {
	                if(data.entities.get(entity_collisions[i], "name") == "play") {
	                    data.entities.set(entity_collisions[i], "image", {"name": "play_pressed"}); 
	                    data.sounds.stop("title");
	                    data.switchScene("tutorial");
	                }
	                if(data.entities.get(entity_collisions[i], "name") == "zenmode") {
	                    data.entities.set(entity_collisions[i], "image", {"name": "zenmode_pressed"}); 
	                    data.sounds.stop("title");
	                    data.switchScene("main", {"mode": "zen", "level": 1});
	                }
	                if(data.entities.get(entity_collisions[i], "name") == "credits") {
	                    data.entities.set(entity_collisions[i], "image", {"name": "credits_pressed"}); 
	                    data.switchScene("credits");
	                }
	            }
	            image.name = click_image;
	            timers.cursor_click.time = 0;
	            timers.cursor_click.running = true;
	        }

	    }, "cursor");
	}


/***/ },
/* 90 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
	    ecs.addEach(function(entity, elapsed) {
	        var half_bob_range = 7;
	        var time_incriment = 0.009;

	        var image = data.entities.get(entity, "image");
	        var time = data.entities.get(entity,"time");
	        
	        image.destinationY = Math.sin(time.bob_time)*half_bob_range;
	        time.bob_time += time_incriment; 
	    }, "player");
	}


/***/ },
/* 91 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, data) {
	    ecs.addEach(function rotate_projectiles(entity, elapsed) {
	        var rotation = data.entities.get(entity, "rotation");
	        var image = data.entities.get(entity, "image");
	        var dx = data.entities.get(entity, "velocity").x;
	        var mod = data.entities.get(entity, "mod");
	        if(dx > 0) {
	            data.entities.set(entity, "rotation", {"angle": (rotation.angle + mod)});
	        } else {
	            data.entities.set(entity, "rotation", {"angle": (rotation.angle - mod)});
	        }
	    }, "projectile");
	}


/***/ },
/* 92 */
/***/ function(module, exports) {

	"use strict";

	function distance( pos1, pos2 ) {
	    return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y)); 
	}

	module.exports = function(ecs, data) {
	    ecs.addEach(function resolveCollisions(entity, elapse) {
	        var score = data.entities.get(entity, "score");
	        var entity_collisions = data.entities.get(entity, "collisions");
	        var ouch_image = data.entities.get(entity, "ouch_image");
	        var zen_image = data.entities.get(entity, "zen_image");
	        var player_image = data.entities.get(entity, "image");
	        var player_pos = data.entities.get(entity, "position");
	        var player_radius = data.entities.get(entity, "size").width / 2;
	        var player_center = {
	            "x": player_pos.x + player_radius,
	            "y": player_pos.y + player_radius
	        };
	        var progress_meter = 7;
	        var progress = data.entities.get(progress_meter,"progress");

	        var timers = data.entities.get(entity, "timers");

	        var rotation = data.entities.get(entity, "rotation");

	        var half_bob_range = 0.075;
	        var time_incriment = 3;

	        var time = data.entities.get(entity,"time");

	        for( var i = 0; i < entity_collisions.length; ++i) {
	            if(data.entities.get(entity_collisions[i], "projectile")) {
	                var proj_pos = data.entities.get(entity_collisions[i], "position");
	                var proj_radius = data.entities.get(entity_collisions[i], "size").width / 2;
	                var proj_center = {
	                    "x": proj_pos.x + proj_radius,
	                    "y": proj_pos.y + proj_radius
	                };
	                if( distance(player_center, proj_center) <= (player_radius + proj_radius) ) {
	                    progress.value += data.entities.get(entity_collisions[i],"effect");
	                    if(data.entities.get(entity_collisions[i], "negative_effect")) {
	                        timers.ouch_pain.running = true;
	                        timers.ouch_pain.time = 0;
	                        data.entities.set(entity, "is_hit", true); 
	                    } else {
	                        data.entities.set(entity, "score", ++score);
	                    }
	                    data.entities.destroy(entity_collisions[i]);
	                }

	            }
	        }
	        if (progress.value > progress.max){
	            progress.value = progress.max;
	        }
	        if (progress.value < 0){
	            data.switchScene("end",{"win":false});
	        }

	        if(data.entities.get(entity, "is_hit")) {
	            var mod = Math.cos(time.jitter_time)*half_bob_range;
	            data.entities.set(entity, "rotation", {"angle": (rotation.angle + mod)});
	            time.jitter_time += time_incriment;
	            player_image.name = ouch_image;
	        } else {
	            player_image.name = zen_image;
	        }

			if(data.input.button("mute")) {
				if(data.sounds.muted) {
					data.sounds.unmute();
				} else {
					data.sounds.mute();
				}
			}

	    }, "player");
	}


/***/ },
/* 93 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
		ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		}, "player");
	};


/***/ },
/* 94 */
/***/ function(module, exports) {

	"use strict";

	function distance( pos1, pos2 ) {
	    return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y)); 
	}

	module.exports = function(ecs, data) {
	    ecs.addEach(function zengrenade(entity, elapsed) {
	        
	        var player_pos = data.entities.get(entity, "position");
	        var player_radius = data.entities.get(entity, "size").width / 2;
	        var player_center = {
	            "x": player_pos.x + player_radius,
	            "y": player_pos.y + player_radius
	        };
	        var entity_collisions = data.entities.get(entity, "collisions");
	        for(var i = 0; i < entity_collisions.length; i++) {
	            if(data.entities.get(entity_collisions[i], "projectile")) {
	                var proj_pos = data.entities.get(entity_collisions[i], "position");
	                var proj_radius = data.entities.get(entity_collisions[i], "size").width / 2;
	                var proj_center = {
	                    "x": proj_pos.x + proj_radius,
	                    "y": proj_pos.y + proj_radius
	                };
	                if( distance(player_center, proj_center) <= (player_radius + proj_radius) ) {
	                    data.entities.destroy(entity_collisions[i--]);
	                } 
	            }
	        }
	                     
	    }, "zengrenade");
	}


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./boom.js": 96,
		"./bring_in_film.js": 97,
		"./change_image.js": 98,
		"./dat_intro.js": 99,
		"./dat_outro.js": 100,
		"./main-enter-credits.js": 101,
		"./main-enter.js": 102,
		"./main-exit-credits.js": 103,
		"./main-exit.js": 104,
		"./ouch_pain.js": 105,
		"./pull_pin.js": 106,
		"./push_back_stop.js": 107,
		"./ramp_speed.js": 108,
		"./set_constants.js": 109,
		"./set_constants_title.js": 110,
		"./spawn_clouds.js": 111,
		"./spawn_projectiles.js": 112,
		"./spawn_tutorial.js": 113,
		"./start_end.js": 114,
		"./tutorial_enter.js": 115,
		"./tutorial_exit.js": 116,
		"./zen_cooldown.js": 117,
		"./zen_kill.js": 118
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 95;


/***/ },
/* 96 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {

	    var size = data.entities.get(entity, "size");
	    var pos = data.entities.get(entity, "position");
	    var step = data.entities.get(entity, "size_step");
	    var new_size = {
	        "width": size.width + step,
	        "height": size.height + step,
	    }
	    data.entities.set(entity, "size", new_size);
	    var new_pos = {
	        "x": pos.x - step / 2,
	        "y": pos.y - step / 2
	    }
	    data.entities.set(entity, "position", new_pos);

	    var timers = data.entities.get(entity, "timers");
	    timers.boom.time = 0;
	    timers.boom.running = true;

	}


/***/ },
/* 97 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {
	   var timers =data.entities.get(entity, "timers"); 
	   timers.start_end.running = true;
	}


/***/ },
/* 98 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {
	    data.entities.set(entity, "image", {"name": "cursor"});
	}


/***/ },
/* 99 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {

		var camera = 0;
		var constants = data.entities.get(camera, "constants");
		var player_pos = data.entities.get(entity, "position");
		var player_size = data.entities.get(entity, "size");
		var cam_timers = data.entities.get(camera, "timers");
	    var timers = data.entities.get(entity, "timers");

		if( player_pos.y < constants.center.y - player_size.height / 2 ) {
			player_pos.y += 5;
			timers.dat_intro.time = 0;
			timers.dat_intro.running = true;
		} else {
			cam_timers.spawn_projectile.running = true;
			cam_timers.ramp_speed.running = true;
		}


	}


/***/ },
/* 100 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {

		var player_pos = data.entities.get(entity, "position");
		var player_size = data.entities.get(entity, "size");
		var timers = data.entities.get(entity, "timers");
		var level = data.arguments.level;

		if(player_pos.y > -player_size.height) {
			player_pos.y -= 5;
			timers.dat_outro.time = 0;
			timers.dat_outro.running = true;
		} else {
			level++;
			data.switchScene("main", {"level": level, "mode": data.arguments.mode});
		}

	}


/***/ },
/* 101 */
/***/ function(module, exports) {

	"use strict";

	function place_entity(data, id, width_mod, height_mod, x_mod, y_mod, centered) {
	    var entity_size = data.entities.get(id, "size");
	    var entity_pos = data.entities.get(id, "position");
	    entity_size.width = data.canvas.width * width_mod;
	    entity_size.height = data.canvas.width * height_mod;
	    if(centered) {
	        entity_pos.x = (data.canvas.width * x_mod) - (entity_size.width / 2);
	    } else {
	        entity_pos.x = data.canvas.width * x_mod;
	    }
	    entity_pos.y = data.canvas.height * y_mod;
	}

	module.exports = function(data) { // eslint-disable-line no-unused-vars
	    console.log("meh");
	    //data.sounds.play("title", true);

	    var title = 3;
	    place_entity(data, title, 0.5, 0.109, 0.5, 0.11, true);

	    var back_title = 4;
	    place_entity(data, back_title, 0.25, 0.05, 0.5, 0.001, true);

	    var dev = 5;
	    place_entity(data, dev, 0.37, 0.058, 0.06, 0.35, false);

	    var anthony = 6;
	    place_entity(data, anthony, 0.375, 0.058, 0.06, 0.48, false);

	    var matthew = 7;
	    place_entity(data, matthew, 0.35, 0.041, 0.07, 0.6, false);

	    var artwork = 8;
	    place_entity(data, artwork, 0.256, 0.058, 0.57, 0.35, false);

	    var ryan = 9;
	    place_entity(data, ryan, 0.306, 0.041, 0.55, 0.5, false);

	    var music = 10;
	    place_entity(data, music, 0.189, 0.058, 0.61, 0.6, false);

	    var zoe = 11;
	    place_entity(data, zoe, 0.229, 0.041, 0.59, 0.73, false);


	};


/***/ },
/* 102 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(data) { // eslint-disable-line no-unused-vars

		var camera = 0;
		var camera_timers = data.entities.get(camera, "timers");
		var level = parseInt(data.arguments.level) - 1;

		var levels = [
			{
				"background": "background",
			},
			{
				"background": "background2",
			},
			{
				"background": "background3",
			}
		]

		if(level == 0) {
			camera_timers.spawn_clouds.running = true;
		}

		data.entities.set(camera, "image", { "name": levels[level]["background"] });
		
	};


/***/ },
/* 103 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(game) { // eslint-disable-line no-unused-vars
	};


/***/ },
/* 104 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(game) { // eslint-disable-line no-unused-vars
	};


/***/ },
/* 105 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {
	   data.entities.set(entity, "is_hit", false); 
	   var time = data.entities.get(entity, "time");
	   time.jitter_time = 0;
	   data.entities.set(entity, "rotation", {"angle": 0});
	}


/***/ },
/* 106 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {

	    var timers = data.entities.get(entity, "timers");
	    timers.boom.running = true;

	}


/***/ },
/* 107 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {
	   var timers = data.entities.get(entity, "timers");
	   var velocity = data.entities.get(entity, "velocity");
	   velocity.x = -velocity.x/2;
	   velocity.y = -velocity.y/2;
	}


/***/ },
/* 108 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {

		var timers = data.entities.get(entity, "timers");
		if(timers.spawn_projectile.max > 150) {
			timers.spawn_projectile.max -= 10;
			timers.ramp_speed.time = 0;
			timers.ramp_speed.running = true;
		}

	}


/***/ },
/* 109 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {
	    
	    //data.sounds.play("background", true);
	    //data.sounds.play("beach", true);
	    var player = 1;
	    var om = 3;

	    var player_size = data.entities.get(player, "size");
	    var om_size = data.entities.get(om,"size");

	    var constants = data.entities.get(entity, "constants");
	    constants.center = {
	        "x": (data.canvas.width / 2),
	        "y": (data.canvas.height * 0.6)
	    }
	    var new_pos = {
	        "x": constants.center.x - player_size.width / 2,
	        "y": -player_size.height,
	    }
	    var om_pos = {
	        "x": data.canvas.width*0.9 -om_size.width,
	        "y": data.canvas.height*0.95 -om_size.height
	    }
	    data.entities.set(player, "position", new_pos);

	    /*
	    var cone_id = 4;
	    var cone_icon_size = data.entities.get(cone_id, "size");
	    var cone_icon_position = {
	        "x": (data.canvas.width / 2) - cone_icon_size.width * 1.5,
	        "y": (data.canvas.height * 0.95) - cone_icon_size.height,
	    }
	    data.entities.set(cone_id, "position", cone_icon_position);
	    {
	        "id": 4,
	        "name": "cone",
	        "ability_icon": true,
	        "image": {
	            "name": "cone"
	        },
	        "position": {
	            "x": 0,
	            "y": 0
	        },
	        "size": {
	            "width": 75,
	            "height": 75
	        }
	    },
	    */

	    var bomb_id = 5;
	    var bomb_icon_size = data.entities.get(bomb_id, "size");
	    var bomb_icon_position = {
	        "x": (data.canvas.width / 2) - bomb_icon_size.width * 0.5,
	        "y": (data.canvas.height * 0.95) - bomb_icon_size.height,
	    }
	    data.entities.set(bomb_id, "position", bomb_icon_position);

	    /*
	    var laser_id = 6;
	    var laser_icon_size = data.entities.get(bomb_id, "size");
	    var laser_icon_position = {
	        "x": (data.canvas.width / 2) + laser_icon_size.width * 0.5,
	        "y": (data.canvas.height * 0.95) - laser_icon_size.height,
	    }
	    data.entities.set(laser_id, "position", laser_icon_position);
	     {
	        "id": 6,
	        "name": "lazer",
	        "image": {
	            "name": "lazer"
	        },
	        "ability_icon": true,
	        "position": {
	            "x": 0,
	            "y": 0
	        },
	        "size": {
	            "width": 75,
	            "height": 75
	        }
	    },
	    */
	    
	    data.entities.set(om,"position",om_pos);

	    var progress_meter = 7;
	    var progress_meter_size = data.entities.get(progress_meter,"size");
	    var progress_meter_position = data.entities.get(progress_meter,"position");
	    var progress = data.entities.get(progress_meter,"progress");

	    progress_meter_size.height = data.canvas.height * 0.5;
	    progress_meter_size.width = data.canvas.width *0.02;
	    progress_meter_position.x = data.canvas.width*0.1 + om_size.width/2;
	    progress_meter_position.y = data.canvas.height*0.25;

	    var tempArray = [];
	    var pill_number = 15;
	    var buffer = 0.05*(progress_meter_size.height/pill_number);
	    var pill_size = {
	        "width":progress_meter_size.width,
	        "height": 0.95 *(progress_meter_size.height/pill_number)
	    }
	    for (var i = 0; i<pill_number;++i){
	        var pill = data.instantiatePrefab("progress_block");
	        var match = data.entities.get(pill,"match");

	        data.entities.set(pill,"size",pill_size);
	        match.offsetY = i*(buffer + pill_size.height);

	        tempArray.push(pill);
	    }
	    for (var i= tempArray.length -1; i>= 0; --i){
	        progress.blocks.push(tempArray[i]);
	    }

	    var lotus = 8;
	    var lotus_size=data.entities.get(lotus,"size");
	    var lotus_position = data.entities.get(lotus,"position");


	    lotus_position.y = progress_meter_position.y + progress_meter_size.height*0.9;
	    lotus_position.x = progress_meter_position.x + progress_meter_size.width/2.3- lotus_size.width/2;

	}


/***/ },
/* 110 */
/***/ function(module, exports) {

	"use strict";

	function place_entity(data, id, width_mod, height_mod, x_mod, y_mod, left) {
	    var entity_size = data.entities.get(id, "size");
	    var entity_pos = data.entities.get(id, "position");
	    entity_size.width = data.canvas.width * width_mod;
	    entity_size.height = data.canvas.width * height_mod;
	    if(left) {
	        entity_pos.x = (data.canvas.width * x_mod) - (entity_size.width);
	    } else {
	        entity_pos.x = data.canvas.width * x_mod;
	    }
	    entity_pos.y = data.canvas.height * y_mod;
	}

	module.exports = function(entity, data) {

	    //data.sounds.play("title", true);

	    var title = 3;
	    place_entity(data, title, 0.6, 0.303, 0, 0, false);

	    var play_button = 4;
	    place_entity(data, play_button, 0.139, 0.08, 0.98, 0, true);

	    var zenmode_button = 5;
	    place_entity(data, zenmode_button, 0.324, 0.08, 0.98, 0.15, true);

	    var credits_button = 6;
	    place_entity(data, credits_button, 0.238, 0.08, 0.98, 0.30, true);


	}


/***/ },
/* 111 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {

	    var cloud = data.instantiatePrefab("cloud");
	    var image = data.entities.get(cloud, "image");
	    var pos = {
	        "x": Math.floor(Math.random() * ((data.canvas.width - 200) - 1)) + 1,
	        "y": Math.floor(Math.random() * (205 - 15)) + 15
	    };
	    data.entities.set(cloud, "position", pos);

	    var black_cloud = Math.floor(Math.random() * (9 - 1)) + 1;
	    var cloud_num, cloud_name;

	    if( black_cloud > 3 ) {
	        cloud_num = Math.floor(Math.random() * (3 - 1)) + 1;
	        cloud_name = "dark_clouds" + cloud_num.toString();
	        switch(cloud_num) {
	            case 3:
	                data.entities.set(cloud, "size", {"width": 200, "height": 95});
	                break;
	            case 2:
	                data.entities.set(cloud, "size", {"width": 200, "height": 89});
	                break;
	            case 1:
	                data.entities.set(cloud, "size", {"width": 200, "height": 91});
	                break;
	            default:
	                data.entities.set(cloud, "size", {"width": 0, "height": 0});
	                break;
	        }
	        data.entities.set(cloud, "z-index", {"z-index": 0});
	    } else {
	        cloud_num = Math.floor(Math.random() * (5 - 1)) + 1;
	        cloud_name = "clouds" + cloud_num.toString();
	        switch(cloud_num) {
	            case 5:
	                data.entities.set(cloud, "size", {"width": 200, "height": 79});
	                break;
	            case 4:
	                data.entities.set(cloud, "size", {"width": 200, "height": 62});
	                break;
	            case 3:
	                data.entities.set(cloud, "size", {"width": 200, "height": 71});
	                break;
	            case 2:
	                data.entities.set(cloud, "size", {"width": 200, "height": 102});
	                break;
	            case 1:
	                data.entities.set(cloud, "size", {"width": 200, "height": 86});
	                break;
	            default:
	                data.entities.set(cloud, "size", {"width": 0, "height": 0});
	                break;
	        }
	        data.entities.set(cloud, "z-index", {"z-index": 1});
	    }

	    image.name = cloud_name;
	    data.entities.set(cloud, "image", image);
	    var mod = Math.random() * (0.08 + 0.08) - 0.08;
	    data.entities.set(cloud, "velocity", {"x": mod, "y": 0});

	    var timers = data.entities.get(entity, "timers");
	    timers.spawn_clouds.time = 0;
	    timers.spawn_clouds.max = 2000;
	    timers.spawn_clouds.running = true;

	}


/***/ },
/* 112 */
/***/ function(module, exports) {

	"use strict";

	function normalize(x, y, pos) {

	    var d = Math.sqrt((pos.x - x) * (pos.x - x) + (pos.y - y) * (pos.y - y)); 

	    return {
	        "x": (x-pos.x)/d,
	        "y": (y-pos.y)/d
	    };

	}

	function cast_to_edge(size,x, y, pos, data) {

	    var uv = normalize(x, y, pos);

	    do {
	        x+=uv.x;
	        y-=Math.abs(uv.y);
	    } while( x + size.width >= 0 && x <= data.canvas.width && y+size.height >= 0 );

	    return {"x": x, "y": y}

	}

	module.exports = function(entity, data) {

	    var constants = data.entities.get(entity, "constants"); 
	    var x = Math.floor(Math.random() * data.canvas.width);
	    var y = Math.floor(Math.random() * data.canvas.height);

	    var projectile = data.instantiatePrefab("projectile");
	    var projectile_size = data.entities.get(projectile,"size");

	    var new_pos = cast_to_edge(projectile_size,x, y, constants.center, data);
	    new_pos.x = new_pos.x + projectile_size.width/2;
	    new_pos.y = new_pos.y + projectile_size.height/2;
	    data.entities.set(projectile, "position", new_pos);

	    var uv = normalize(new_pos.x, new_pos.y, constants.center);
	    var negative = Math.floor(Math.random() * (9 - 1)) + 1;
	    var big = Math.floor(Math.random() * 9) % 2;
	    if(data.arguments.mode == "zen") {
	        negative = 0;
	    }
	    data.entities.set(projectile, "negative_effect", negative > 2);
	    if(negative > 2){
	        data.entities.set(projectile, "image", {"name": "negative_projectile"});
	    } else {
	        data.entities.set(projectile, "image", {"name": "positive_projectile"});
	    }
	    if(big) {
	        data.entities.set(projectile, "size", {"width": 40, "height": 40});
	        data.entities.set(projectile, "mod", 0.01);
	        if(negative > 2) {
	            data.entities.set(projectile, "effect", -20);
	        } else {
	            data.entities.set(projectile, "effect", 10);
	        }
	        data.entities.set(projectile, "velocity", {"x": -uv.x * 0.03, "y": -uv.y * 0.03});
	    } else {
	        data.entities.set(projectile, "size", {"width": 25, "height": 25});
	        if(negative > 2) {
	            data.entities.set(projectile, "effect", -10);
				data.entities.set(projectile, "mod", 0.02);
	        } else {
	            data.entities.set(projectile, "effect", 5);
				data.entities.set(projectile, "mod", 0.04);
	        }
	        data.entities.set(projectile, "velocity", {"x": -uv.x * 0.05, "y": -uv.y * 0.05});
	    }

	    var timers = data.entities.get(entity, "timers");
	    timers.spawn_projectile.time = 0;
	    timers.spawn_projectile.running = true;

	}


/***/ },
/* 113 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {

	    var pos_projectile = data.instantiatePrefab("projectile");
	    data.entities.set(pos_projectile, "position", {"x": data.canvas.width * 0.25, "y": data.canvas.height * 0.1});
	    data.entities.set(pos_projectile, "size", {"width": 40, "height": 40});
	    data.entities.set(pos_projectile, "image", {"name": "positive_projectile"});
	    var neg_projectile = data.instantiatePrefab("projectile");
	    data.entities.set(neg_projectile, "position", {"x": data.canvas.width * 0.75, "y": data.canvas.height * 0.1});
	    data.entities.set(neg_projectile, "size", {"width": 40, "height": 40});
	    data.entities.set(neg_projectile, "image", {"name": "negative_projectile"});

	}


/***/ },
/* 114 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {
	   var title_btn = data.instantiatePrefab("end_btn_title");
	   var try_again_btn = data.instantiatePrefab("end_btn_try_again");

	   var btn_size = {
	    "width":data.canvas.width*0.3,
	    "height": data.canvas.height* 0.2
	   }

	   var title_position = data.entities.get(title_btn,"position");
	   var try_position = data.entities.get(try_again_btn,"position");
	   var title_size = data.entities.get(title_btn,"size");
	   title_size.width = btn_size.width;
	   title_size.height = btn_size.height;
	   var try_size = data.entities.get(try_again_btn,"size");
	   try_size.height = btn_size.height;
	   try_size.width = btn_size.width;

	   title_position.x = data.canvas.width/2 - title_size.width/2;
	   try_position.x = data.canvas.width/2 - try_size.width/2;

	   title_position.y = data.canvas.height/3;
	   try_position.y = data.canvas.height/2;
	}


/***/ },
/* 115 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(data) { // eslint-disable-line no-unused-vars

	    var play = 4;
	    var play_position = data.entities.get(play, "position");
	    var play_size = data.entities.get(play, "size");

	    play_position.x = data.canvas.width / 2 - play_size.width / 2;
	    play_position.y = data.canvas.height * 0.4 - play_size.height / 2;

	};


/***/ },
/* 116 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(data) { // eslint-disable-line no-unused-vars

	};


/***/ },
/* 117 */
/***/ function(module, exports) {

	"use script";

	module.exports = function(entity, data) {
	        
	}


/***/ },
/* 118 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function(entity, data) {
	    data.entities.destroy(entity);
	}


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./animations.json": 120,
		"./entities.json": 121,
		"./images.json": 122,
		"./inputs.json": 123,
		"./prefabs.json": 124,
		"./scenes.json": 125,
		"./sounds.json": 126,
		"./systems.json": 127
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 119;


/***/ },
/* 120 */
/***/ function(module, exports) {

	module.exports = {
		"zengrenade": [
			{
				"filmstripFrames": 50,
				"time": 25,
				"properties": {
					"image": {
						"name": "zengrenade_animation",
						"sourceX": 0,
						"sourceY": 0,
						"sourceWidth": 25350,
						"sourceHeight": 508
					}
				}
			}
		]
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = {
		"title": [
			{
				"id": 0,
				"name": "camera",
				"camera": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"timers": {
					"set_constants": {
						"running": true,
						"time": 0,
						"max": 1,
						"script": "./scripts/set_constants_title"
					}
				},
				"matchCanvasSize": true,
				"velocity": {
					"x": 0,
					"y": 0
				},
				"image": {
					"name": "background"
				},
				"zindex": {
					"zindex": -1
				}
			},
			{
				"id": 2,
				"name": "cursor",
				"cursor": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 40,
					"height": 40
				},
				"image": {
					"name": "cursor"
				},
				"click_image": "cursor_clicked",
				"timers": {
					"cursor_click": {
						"running": false,
						"time": 0,
						"max": 150,
						"script": "./scripts/change_image"
					}
				},
				"collisions": [],
				"zindex": {
					"zindex": 6
				}
			},
			{
				"id": 3,
				"name": "title",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "title"
				}
			},
			{
				"id": 4,
				"name": "play",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 179,
					"height": 103
				},
				"collisions": [],
				"image": {
					"name": "play"
				}
			},
			{
				"id": 5,
				"name": "zenmode",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 415,
					"height": 103
				},
				"collisions": [],
				"image": {
					"name": "zenmode"
				}
			},
			{
				"id": 6,
				"name": "credits",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 305,
					"height": 103
				},
				"collisions": [],
				"image": {
					"name": "credits"
				}
			}
		],
		"main": [
			{
				"id": 0,
				"name": "camera",
				"camera": true,
				"constants": {
					"center": {
						"x": 0,
						"y": 0
					}
				},
				"timers": {
					"set_constants": {
						"running": true,
						"time": 0,
						"max": 1,
						"script": "./scripts/set_constants"
					},
					"spawn_clouds": {
						"running": false,
						"time": 0,
						"max": 750,
						"script": "./scripts/spawn_clouds"
					},
					"spawn_projectile": {
						"running": false,
						"time": 0,
						"max": 500,
						"script": "./scripts/spawn_projectiles"
					},
					"ramp_speed": {
						"running": false,
						"time": 0,
						"max": 5000,
						"script": "./scripts/ramp_speed"
					}
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"matchCanvasSize": true,
				"image": {
					"name": "background"
				},
				"zindex": {
					"zindex": -1
				}
			},
			{
				"id": 1,
				"name": "player",
				"player": true,
				"timers": {
					"ouch_pain": {
						"running": false,
						"time": 0,
						"max": 250,
						"script": "./scripts/ouch_pain"
					},
					"dat_intro": {
						"running": true,
						"time": 0,
						"max": 15,
						"script": "./scripts/dat_intro"
					},
					"dat_outro": {
						"running": false,
						"time": 0,
						"max": 15,
						"script": "./scripts/dat_outro"
					}
				},
				"time": {
					"bob_time": 0,
					"jitter_time": 0
				},
				"is_hit": false,
				"ouch_image": "player_ouch",
				"zen_image": "player",
				"rotation": {
					"angle": 0
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 200,
					"height": 241
				},
				"image": {
					"name": "player"
				},
				"velocity": {
					"x": 0,
					"y": 0
				},
				"collisions": [],
				"abilities": {
					"cone": {
						"cooldown": 6,
						"prefab": "cone_ability"
					},
					"bomb": {
						"cooldown": 3,
						"prefab": "bomb_ability"
					},
					"laser": {
						"cooldown": 9,
						"prefab": "laser_ability"
					}
				},
				"zindex": {
					"zindex": 5
				}
			},
			{
				"id": 2,
				"name": "cursor",
				"cursor": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 40,
					"height": 40
				},
				"image": {
					"name": "cursor"
				},
				"click_image": "cursor_clicked",
				"timers": {
					"cursor_click": {
						"running": false,
						"time": 0,
						"max": 150,
						"script": "./scripts/change_image"
					},
					"zen_cooldown": {
						"running": false,
						"time": 0,
						"max": 10000
					}
				},
				"collisions": [],
				"zindex": {
					"zindex": 6
				}
			},
			{
				"id": 3,
				"name": "om",
				"om": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 125,
					"height": 131
				},
				"image": {
					"name": "medallion"
				},
				"meter_full": false,
				"max_value": 100,
				"value": 0,
				"collisions": [],
				"zindex": {
					"zindex": 1
				},
				"om_progress": {
					"value": 0,
					"max": 100,
					"increment": 0.01,
					"zen": false
				}
			},
			{
				"id": 5,
				"name": "zengrenade",
				"ability_icon": true,
				"image": {
					"name": "zengrenade"
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 75,
					"height": 75
				}
			},
			{
				"id": 7,
				"name": "progress_meter",
				"progress_meter": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 50,
					"height": 50
				},
				"progress": {
					"blocks": [],
					"max": 150,
					"value": 50,
					"pill_value": 10
				},
				"timers": {}
			},
			{
				"id": 8,
				"name": "lotus",
				"lotus": true,
				"size": {
					"width": 220,
					"height": 131
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"image": {
					"name": "lotus"
				}
			}
		],
		"tutorial": [
			{
				"id": 0,
				"name": "camera",
				"camera": true,
				"constants": {
					"center": {
						"x": 0,
						"y": 0
					}
				},
				"timers": {
					"set_constants": {
						"running": true,
						"time": 0,
						"max": 1,
						"script": "./scripts/set_constants"
					},
					"spawn_clouds": {
						"running": true,
						"time": 0,
						"max": 750,
						"script": "./scripts/spawn_clouds"
					},
					"spawn_tutorial": {
						"running": true,
						"time": 0,
						"max": 150,
						"script": "./scripts/spawn_tutorial"
					}
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"matchCanvasSize": true,
				"image": {
					"name": "background"
				},
				"zindex": {
					"zindex": -1
				}
			},
			{
				"id": 1,
				"name": "player",
				"player": true,
				"timers": {
					"ouch_pain": {
						"running": false,
						"time": 0,
						"max": 250,
						"script": "./scripts/ouch_pain"
					}
				},
				"time": {
					"bob_time": 0,
					"jitter_time": 0
				},
				"is_hit": false,
				"ouch_image": "player_ouch",
				"zen_image": "player",
				"rotation": {
					"angle": 0
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 200,
					"height": 241
				},
				"image": {
					"name": "player"
				},
				"velocity": {
					"x": 0,
					"y": 0
				},
				"collisions": [],
				"abilities": {
					"cone": {
						"cooldown": 6,
						"prefab": "cone_ability"
					},
					"bomb": {
						"cooldown": 3,
						"prefab": "bomb_ability"
					},
					"laser": {
						"cooldown": 9,
						"prefab": "laser_ability"
					}
				},
				"zindex": {
					"zindex": 5
				}
			},
			{
				"id": 2,
				"name": "cursor",
				"cursor": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 40,
					"height": 40
				},
				"image": {
					"name": "cursor"
				},
				"click_image": "cursor_clicked",
				"timers": {
					"cursor_click": {
						"running": false,
						"time": 0,
						"max": 150,
						"script": "./scripts/change_image"
					},
					"zen_cooldown": {
						"running": false,
						"time": 0,
						"max": 10000
					}
				},
				"collisions": [],
				"zindex": {
					"zindex": 6
				}
			},
			{
				"id": 3,
				"name": "om",
				"om": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 125,
					"height": 131
				},
				"image": {
					"name": "medallion"
				},
				"meter_full": false,
				"max_value": 100,
				"value": 0,
				"zindex": {
					"zindex": 1
				},
				"om_progress": {
					"value": 0,
					"max": 100,
					"increment": 0.009,
					"zen": false
				}
			},
			{
				"id": 4,
				"name": "play_button",
				"play_button": true,
				"image": {
					"name": "play"
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"collisions": [],
				"size": {
					"width": 179,
					"height": 103
				}
			},
			{
				"id": 5,
				"name": "zengrenade",
				"ability_icon": true,
				"image": {
					"name": "zengrenade"
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 75,
					"height": 75
				}
			},
			{
				"id": 7,
				"name": "progress_meter",
				"progress_meter": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 50,
					"height": 50
				},
				"progress": {
					"blocks": [],
					"max": 150,
					"value": 50,
					"pill_value": 10
				},
				"timers": {}
			},
			{
				"id": 8,
				"name": "lotus",
				"lotus": true,
				"size": {
					"width": 220,
					"height": 131
				},
				"position": {
					"x": 0,
					"y": 0
				},
				"image": {
					"name": "lotus"
				}
			}
		],
		"end": [
			{
				"id": 0,
				"name": "camera",
				"camera": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"matchCanvasSize": true,
				"image": {
					"name": "background"
				},
				"zindex": {
					"zindex": -1
				},
				"timers": {
					"bring_in_film": {
						"running": true,
						"time": 0,
						"max": 3000,
						"script": "./scripts/bring_in_film"
					},
					"start_end": {
						"running": false,
						"time": 0,
						"max": 1000,
						"script": "./scripts/start_end"
					}
				}
			},
			{
				"id": 2,
				"name": "cursor",
				"cursor": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 40,
					"height": 40
				},
				"image": {
					"name": "cursor"
				},
				"click_image": "cursor_clicked",
				"timers": {
					"cursor_click": {
						"running": false,
						"time": 0,
						"max": 150,
						"script": "./scripts/change_image"
					},
					"zen_cooldown": {
						"running": false,
						"time": 0,
						"max": 10000
					}
				},
				"collisions": [],
				"zindex": {
					"zindex": 6
				}
			}
		],
		"credits": [
			{
				"id": 0,
				"name": "camera",
				"camera": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"matchCanvasSize": true,
				"zindex": {
					"zindex": -1
				},
				"image": {
					"name": "background"
				},
				"timers": {}
			},
			{
				"id": 2,
				"name": "cursor",
				"cursor": true,
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 40,
					"height": 40
				},
				"click_image": "cursor_clicked",
				"image": {
					"name": "cursor"
				},
				"timers": {
					"cursor_click": {
						"running": false,
						"time": 0,
						"max": 150,
						"script": "./scripts/change_image"
					}
				},
				"collisions": [],
				"zindex": {
					"zindex": 6
				}
			},
			{
				"id": 3,
				"name": "title",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "credits_scene"
				}
			},
			{
				"id": 4,
				"name": "back_title",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 426,
					"height": 99
				},
				"collisions": [],
				"image": {
					"name": "back_to_title"
				},
				"zindex": {
					"zindex": 4
				}
			},
			{
				"id": 5,
				"name": "dev",
				"position": {
					"x": 5,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "dev"
				}
			},
			{
				"id": 6,
				"name": "anthony",
				"target_url": "http://anthonyquisenberry.com",
				"collisions": [],
				"credit_link": true,
				"position": {
					"x": 5,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "anthony"
				}
			},
			{
				"id": 7,
				"name": "matthew",
				"target_url": "http://matthew-caldwell.com",
				"collisions": [],
				"position": {
					"x": 5,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "matthew"
				}
			},
			{
				"id": 8,
				"name": "artwork",
				"position": {
					"x": 5,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "artwork"
				}
			},
			{
				"id": 9,
				"name": "ryan",
				"target_url": "http://ryangiordano.com",
				"collisions": [],
				"position": {
					"x": 5,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "ryan"
				}
			},
			{
				"id": 10,
				"name": "music",
				"position": {
					"x": 5,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "music"
				}
			},
			{
				"id": 11,
				"credit_link": true,
				"name": "zoe",
				"position": {
					"x": 5,
					"y": 0
				},
				"size": {
					"width": 0,
					"height": 0
				},
				"image": {
					"name": "zoe"
				}
			}
		]
	};

/***/ },
/* 122 */
/***/ function(module, exports) {

	module.exports = {
		"cursor": "images/cursor.png",
		"cursor_clicked": "images/cursorclicked.png",
		"player": "images/player_image.png",
		"player_ouch": "images/monkmad.png",
		"pissedface": "images/pissedmonk.png",
		"background": "images/beach1.png",
		"background2": "images/background2.png",
		"background3": "images/background3.png",
		"medallion": "images/medallion.png",
		"zengrenade": "images/zengrenade.png",
		"zengrenade_reticle": "images/zengrenadereticle.png",
		"zengrenade_animation": "images/zengrenade_animation.png",
		"lazer": "images/lazer.png",
		"cone": "images/cone.png",
		"negative_projectile": "images/badswirl2.png",
		"positive_projectile": "images/goodswirl.png",
		"clouds1": "images/clouds1.png",
		"clouds2": "images/clouds2.png",
		"clouds3": "images/clouds3.png",
		"clouds4": "images/clouds4.png",
		"clouds5": "images/clouds5.png",
		"dark_clouds1": "images/darkclouds1.png",
		"dark_clouds2": "images/darkclouds2.png",
		"dark_clouds3": "images/darkclouds3.png",
		"lotus": "images/lotus.png",
		"monkzenmode": "images/monkzenmode.png",
		"back_to_title": "images/backtotitle.png",
		"back_to_title_pressed": "images/backtotitlepressed.png",
		"try_again": "images/tryagain.png",
		"title": "images/title.png",
		"play": "images/play.png",
		"play_pressed": "images/playpressed.png",
		"zenmode": "images/zenmodeselect.png",
		"zenmode_pressed": "images/zenmodeselectpressed.png",
		"credits": "images/credits.png",
		"credits_pressed": "images/creditspressed.png",
		"credits_scene": "images/creditsscene.png",
		"dev": "images/development.png",
		"anthony": "images/anthony.png",
		"matthew": "images/matt.png",
		"artwork": "images/artwork.png",
		"ryan": "images/ryan.png",
		"music": "images/music.png",
		"zoe": "images/zoe.png"
	};

/***/ },
/* 123 */
/***/ function(module, exports) {

	module.exports = {
		"zengrenade": {
			"type": "button",
			"inputs": [
				{
					"device": "keyboard",
					"key": "space"
				}
			]
		},
		"pause": {
			"type": "button",
			"inputs": [
				{
					"device": "keyboard",
					"key": "p"
				},
				{
					"device": "keyboard",
					"key": "escape"
				}
			]
		},
		"mute": {
			"type": "button",
			"inputs": [
				{
					"device": "keyboard",
					"key": "m"
				}
			]
		}
	};

/***/ },
/* 124 */
/***/ function(module, exports) {

	module.exports = {
		"projectile": {
			"name": "projectile",
			"projectile": true,
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 40,
				"height": 40
			},
			"velocity": {
				"x": 0,
				"y": 0
			},
			"collisions": [],
			"image": {
				"name": "negative_projectile"
			},
			"negative_effect": true,
			"effect": 1,
			"death_animation": "",
			"mod": 0.01,
			"rotation": {
				"angle": 0
			},
			"z-index": {
				"z-index": 3
			},
			"timers": {
				"push_back": {
					"running": false,
					"time": 0,
					"max": 500,
					"script": "./scripts/push_back_stop"
				}
			}
		},
		"progress_block": {
			"name": "progress_block",
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 0,
				"height": 0
			},
			"match": {
				"id": 7,
				"offsetX": 0,
				"offsetY": 0
			},
			"colors": {
				"empty": "#f04f50",
				"full": "#f1ea40"
			}
		},
		"zengrenade": {
			"name": "zengrenade",
			"animation": {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 0.75,
				"name": "zengrenade"
			},
			"zengrenade": true,
			"timers": {
				"boom": {
					"running": false,
					"time": 0,
					"max": 50,
					"script": "./scripts/boom"
				},
				"pull_pin": {
					"running": true,
					"time": 0,
					"max": 250,
					"script": "./scripts/pull_pin"
				},
				"kill": {
					"running": true,
					"time": 0,
					"max": 1500,
					"script": "./scripts/zen_kill"
				}
			},
			"position": {
				"x": 0,
				"y": 0
			},
			"size_step": 5,
			"size": {
				"width": 0,
				"height": 0
			},
			"collisions": [],
			"z-index": {
				"z-index": 3
			}
		},
		"cloud": {
			"name": "cloud",
			"cloud": true,
			"dark": false,
			"image": {
				"name": "clouds1"
			},
			"velocity": {
				"x": 0,
				"y": 0
			},
			"left": true,
			"z-index": {
				"z-index": 1
			}
		},
		"end_btn_title": {
			"name": "title",
			"btn": true,
			"title": true,
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 0,
				"height": 0
			},
			"collisions": [],
			"image": {
				"name": "back_to_title"
			}
		},
		"end_btn_try_again": {
			"name": "try_again",
			"btn": true,
			"try_again": true,
			"position": {
				"x": 0,
				"y": 0
			},
			"size": {
				"width": 0,
				"height": 0
			},
			"collisions": [],
			"image": {
				"name": "try_again"
			}
		}
	};

/***/ },
/* 125 */
/***/ function(module, exports) {

	module.exports = {
		"title": {
			"first": true
		},
		"main": {
			"onEnter": "./scripts/main-enter",
			"onExit": "./scripts/main-exit"
		},
		"end": {},
		"credits": {},
		"tutorial": {
			"onEnter": "./scripts/tutorial_enter",
			"onExit": "./scripts/tutorial_exit"
		}
	};

/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports = {
		"background": "sounds/meditation_background.mp3",
		"beach": "sounds/beach.mp3",
		"title": "sounds/meditation_level_2_v2.mp3"
	};

/***/ },
/* 127 */
/***/ function(module, exports) {

	module.exports = {
		"simulation": [
			{
				"name": "splat-ecs/lib/systems/match-canvas-size",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/advance-timers",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/advance-animations",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/control-player",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/apply-movement-2d",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/apply-velocity",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "./systems/simulation/mouse_simulation_credits",
				"scenes": [
					"credits"
				]
			},
			{
				"name": "./systems/simulation/mouse_simulation",
				"scenes": [
					"main",
					"tutorial"
				]
			},
			{
				"name": "./systems/simulation/mouse_simulation_title",
				"scenes": [
					"title"
				]
			},
			{
				"name": "./systems/simulation/mouse_simulation_end",
				"scenes": [
					"end"
				]
			},
			{
				"name": "splat-ecs/lib/systems/apply-friction",
				"scenes": [
					"main",
					"title",
					"end",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/follow-parent",
				"scenes": [
					"main",
					"title",
					"end",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/box-collider",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "./systems/simulation/resolve_collisions",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "./systems/simulation/player_bob",
				"scenes": [
					"main",
					"end",
					"tutorial"
				]
			},
			{
				"name": "./systems/simulation/increment_om",
				"scenes": [
					"main",
					"tutorial"
				]
			},
			{
				"name": "./systems/simulation/projectile_rotation",
				"scenes": [
					"main",
					"tutorial"
				]
			},
			{
				"name": "./systems/simulation/zengrenade",
				"scenes": [
					"main",
					"tutorial"
				]
			}
		],
		"renderer": [
			{
				"name": "splat-ecs/lib/systems/clear-screen",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/viewport-move-to-camera",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/draw-image",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			},
			{
				"name": "./systems/renderer/render-progress",
				"scenes": [
					"main",
					"tutorial"
				]
			},
			{
				"name": "./systems/renderer/render_ability_cooldowns",
				"scenes": [
					"main",
					"tutorial"
				]
			},
			{
				"name": "./systems/renderer/render_zen",
				"scenes": [
					"main",
					"tutorial"
				]
			},
			{
				"name": "./systems/renderer/render_film",
				"scenes": [
					"end"
				]
			},
			{
				"name": "./systems/renderer/render_end_btns",
				"scenes": [
					"end"
				]
			},
			{
				"name": "./systems/renderer/render_tutorial_text",
				"scenes": [
					"tutorial"
				]
			},
			{
				"name": "splat-ecs/lib/systems/viewport-reset",
				"scenes": [
					"main",
					"title",
					"end",
					"credits",
					"tutorial"
				]
			}
		]
	};

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./achieved.png": 130,
		"./anthony.png": 131,
		"./arrow.png": 132,
		"./artwork.png": 133,
		"./background2.png": 134,
		"./background3.png": 135,
		"./backtotitle.png": 136,
		"./backtotitlepressed.png": 137,
		"./badswirl.png": 138,
		"./badswirl2.png": 139,
		"./bamboo.png": 140,
		"./barreticle.png": 141,
		"./beach1.png": 142,
		"./clouds1.png": 143,
		"./clouds2.png": 144,
		"./clouds3.png": 145,
		"./clouds4.png": 146,
		"./clouds5.png": 147,
		"./cone.png": 148,
		"./conepressed.png": 149,
		"./conereticle.png": 150,
		"./credits.png": 151,
		"./creditspressed.png": 152,
		"./creditsscene.png": 153,
		"./cursor.png": 154,
		"./cursorclicked.png": 155,
		"./darkclouds1.png": 156,
		"./darkclouds2.png": 157,
		"./darkclouds3.png": 158,
		"./development.png": 159,
		"./failed.png": 160,
		"./gameover.png": 161,
		"./goodswirl.png": 162,
		"./lazer.png": 163,
		"./lazerpressed.png": 164,
		"./logo.png": 165,
		"./lotus.png": 166,
		"./matt.png": 167,
		"./medallion.png": 168,
		"./monkmad.png": 169,
		"./monkzenmode.png": 170,
		"./monkzenmodeeye1.png": 171,
		"./monkzenmodeeye2.png": 172,
		"./monkzenmodeeye3.png": 173,
		"./music.png": 174,
		"./nirvana.png": 175,
		"./pissedmonk.png": 176,
		"./play.png": 177,
		"./player_image.png": 178,
		"./playpressed.png": 179,
		"./ryan.png": 180,
		"./title.png": 181,
		"./tryagain.png": 182,
		"./tryagainpressed.png": 183,
		"./zengrenade.png": 184,
		"./zengrenade_animation.png": 185,
		"./zengrenadepressed.png": 186,
		"./zengrenadereticle.png": 187,
		"./zenmode.png": 188,
		"./zenmodeanimate.png": 189,
		"./zenmodeselect.png": 190,
		"./zenmodeselectpressed.png": 191,
		"./zoe.png": 192
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 129;


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/achieved.png";

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/anthony.png";

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/arrow.png";

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/artwork.png";

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/background2.png";

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/background3.png";

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/backtotitle.png";

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/backtotitlepressed.png";

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/badswirl.png";

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/badswirl2.png";

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/bamboo.png";

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/barreticle.png";

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/beach1.png";

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/clouds1.png";

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/clouds2.png";

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/clouds3.png";

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/clouds4.png";

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/clouds5.png";

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/cone.png";

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/conepressed.png";

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/conereticle.png";

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/credits.png";

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/creditspressed.png";

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/creditsscene.png";

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/cursor.png";

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/cursorclicked.png";

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/darkclouds1.png";

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/darkclouds2.png";

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/darkclouds3.png";

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/development.png";

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/failed.png";

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/gameover.png";

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/goodswirl.png";

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/lazer.png";

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/lazerpressed.png";

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/logo.png";

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/lotus.png";

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/matt.png";

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/medallion.png";

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/monkmad.png";

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/monkzenmode.png";

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/monkzenmodeeye1.png";

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/monkzenmodeeye2.png";

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/monkzenmodeeye3.png";

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/music.png";

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/nirvana.png";

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/pissedmonk.png";

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/play.png";

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/player_image.png";

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/playpressed.png";

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/ryan.png";

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/title.png";

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/tryagain.png";

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/tryagainpressed.png";

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zengrenade.png";

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zengrenade_animation.png";

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zengrenadepressed.png";

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zengrenadereticle.png";

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zenmode.png";

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zenmodeanimate.png";

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zenmodeselect.png";

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zenmodeselectpressed.png";

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/zoe.png";

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./beach.mp3": 194,
		"./meditation_background.mp3": 195,
		"./meditation_background.wav": 196,
		"./meditation_level_2.mp3": 197,
		"./meditation_level_2_v2.mp3": 198,
		"./meditation_level_2_v2.wav": 199
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 193;


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "sounds/beach.mp3";

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "sounds/meditation_background.mp3";

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "sounds/meditation_background.wav";

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "sounds/meditation_level_2.mp3";

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "sounds/meditation_level_2_v2.mp3";

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "sounds/meditation_level_2_v2.wav";

/***/ }
/******/ ]);