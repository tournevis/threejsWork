(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// PERLIN NOISE
// based 99.999% on Processing's implementation, found here:
// https://github.com/processing/processing/blob/master/core/src/processing/core/PApplet.java
// credit goes entirely to them. i just ported it to javascript.

var Alea = require("alea"); // this is pretty great, btw

var Perlin = module.exports = function(seed) {
	if (seed != undefined) {
		this.alea_rand = new Alea(seed); // use provided seed
	} else {
		this.alea_rand = new Alea(); // use random seed
	}
	this.PERLIN_YWRAPB = 4;
	this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
	this.PERLIN_ZWRAPB = 8;
	this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
	this.PERLIN_SIZE = 4095;
	this.perlin_octaves = 4; // default to medium smooth
	this.perlin_amp_falloff = 0.5; // 50% reduction/octave
	this.perlin_array = new Array();
	// generate cos lookup table
	var DEG_TO_RAD = 0.0174532925;
	var SINCOS_PRECISION = 0.5;
	var SINCOS_LENGTH = Math.floor(360/SINCOS_PRECISION);
	this.cosLUT = new Array();
	for (var i = 0; i < SINCOS_LENGTH; i++) {
		this.cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
	}
	this.perlin_TWOPI = SINCOS_LENGTH;
	this.perlin_PI = SINCOS_LENGTH;
	this.perlin_PI >>= 1;
}

Perlin.prototype.noiseReseed = function() {
	this.alea_rand = new Alea(); // new random seed
	this.perlin_array = new Array(); // start the perlin array fresh
}

Perlin.prototype.noiseSeed = function(seed) {
	this.alea_rand = new Alea(seed); // use provided seed
	this.perlin_array = new Array(); // start the perlin array fresh
}


Perlin.prototype.noiseDetail = function(lod, falloff) {
	if (Math.floor(lod) > 0) this.perlin_octaves = Math.floor(lod);
	if (falloff != undefined && falloff > 0) this.perlin_amp_falloff = falloff;
}

Perlin.prototype.noise_fsc = function(i) {
	return 0.5 * (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.perlin_TWOPI]);
}

Perlin.prototype.noise = function(x, y, z) {
	if (x == undefined) {
		return false; // we need at least one param
	}
	if (y == undefined) {
		y = 0; // use 0 if not provided
	}
	if (z == undefined) {
		z = 0; // use 0 if not provided
	}
	
	// build the first perlin array if there isn't one
	if (this.perlin_array.length == 0) {
		this.perlin_array = new Array();
		for (var i = 0; i < this.PERLIN_SIZE + 1; i++) {
			this.perlin_array[i] = this.alea_rand();
		}
	}

	if (x < 0) x = -x;
	if (y < 0) y = -y;
	if (z < 0) z = -z;
	var xi = Math.floor(x);
	var yi = Math.floor(y);
	var zi = Math.floor(z);
	var xf = x - xi;
	var yf = y - yi;
	var zf = z - zi;
	var r = 0;
	var ampl = 0.5;
	var rxf, ryf, n1, n2, n3;
	
	for (var i = 0; i < this.perlin_octaves; i++) {
		// look at all this math stuff
		var of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
		rxf = this.noise_fsc(xf);
		ryf = this.noise_fsc(yf);
		n1  = this.perlin_array[of & this.PERLIN_SIZE];
		n1 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n1);
		n2  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
		n1 += ryf * (n2-n1);
		of += this.PERLIN_ZWRAP;
		n2  = this.perlin_array[of & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n2);
		n3  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n3 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
		n2 += ryf * (n3 - n2);
		n1 += this.noise_fsc(zf) * (n2 - n1);
		r += n1 * ampl;
		ampl *= this.perlin_amp_falloff;
		xi <<= 1;
		xf *= 2;
		yi <<= 1;
		yf *= 2;
		zi <<= 1; 
		zf *= 2;
		if (xf >= 1) { xi++; xf--; }
		if (yf >= 1) { yi++; yf--; }
		if (zf >= 1) { zi++; zf--; }
	}
	return r;
}

},{"alea":2}],2:[function(require,module,exports){
(function (root, factory) {
  if (typeof exports === 'object') {
      module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
      define(factory);
  } else {
      root.Alea = factory();
  }
}(this, function () {

  'use strict';

  // From http://baagoe.com/en/RandomMusings/javascript/

  // importState to sync generator states
  Alea.importState = function(i){
    var random = new Alea();
    random.importState(i);
    return random;
  };

  return Alea;

  function Alea() {
    return (function(args) {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if (args.length == 0) {
        args = [+new Date];
      }
      var mash = Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() + 
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;

      // my own additions to sync state between two generators
      random.exportState = function(){
        return [s0, s1, s2, c];
      };
      random.importState = function(i){
        s0 = +i[0] || 0;
        s1 = +i[1] || 0;
        s2 = +i[2] || 0;
        c = +i[3] || 0;
      };
 
      return random;

    } (Array.prototype.slice.call(arguments)));
  }

  function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }
}));

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loop = require("core/loop");
var stage = require("core/stage");

var Engine = (function () {
  function Engine() {
    _classCallCheck(this, Engine);

    this.n = 1;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 0, 1, 10000);
    this.cameraAnim = 0.01;
    //this.camera.position.z = 10
    this.camera2 = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -500, 10000);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //  this.renderer.autoClear = false;
    this.camera.position.z = 200;

    this.dom = this.renderer.domElement;

    /** CUSTOM RENDER PASS **/
    /*this.composer = new THREE.EffectComposer( this.renderer )
    var effectBloom = new THREE.BloomPass( 1.3 );
    this.composer.addPass(effectBloom);*/

    this._binds = {};
    this._binds.onUpdate = this._onUpdate.bind(this);
    this._binds.onResize = this._onResize.bind(this);
  }

  _createClass(Engine, [{
    key: "_onUpdate",
    value: function _onUpdate() {
      this.cameraAnim += 0.02;
      this.camera.position.z += Math.sin(this.cameraAnim);

      switch (this.n) {
        case 1:
          this.renderer.render(this.scene, this.camera);
          break;
        case 2:
          this.renderer.render(this.scene, this.camera2);
          break;
      }

      //this.renderer.clear();
      //this.composer.render();
    }
  }, {
    key: "_onResize",
    value: function _onResize() {
      var w = stage.width;
      var h = stage.height;

      this.renderer.setSize(w, h);

      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }, {
    key: "init",
    value: function init() {
      loop.add(this._binds.onUpdate);
      stage.on("resize", this._binds.onResize);
      this._onResize();
    }
  }]);

  return Engine;
})();

module.exports = new Engine();

},{"core/loop":4,"core/stage":6}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loop = (function () {
  function Loop() {
    _classCallCheck(this, Loop);

    this._idRAF = -1;
    this._count = 0;

    this._listeners = [];

    this._binds = {};
    this._binds.update = this._update.bind(this);
  }

  _createClass(Loop, [{
    key: "_update",
    value: function _update() {
      var listener = null;
      var i = this._count;
      while (--i >= 0) {
        listener = this._listeners[i];
        if (listener) {
          listener.apply(this, null);
        }
      }
      this._idRAF = requestAnimationFrame(this._binds.update);
    }
  }, {
    key: "start",
    value: function start() {
      this._update();
    }
  }, {
    key: "stop",
    value: function stop() {
      cancelAnimationFrame(this._idRAF);
    }
  }, {
    key: "add",
    value: function add(listener) {
      var idx = this._listeners.indexOf(listener);
      if (idx >= 0) {
        return;
      }
      this._listeners.push(listener);
      this._count++;
    }
  }, {
    key: "remove",
    value: function remove(listener) {
      var idx = this._listeners.indexOf(listener);
      if (idx < 0) {
        return;
      }
      this._listeners.splice(idx, 1);
      this._count--;
    }
  }]);

  return Loop;
})();

module.exports = new Loop();

},{}],5:[function(require,module,exports){
// Want to customize things ?
// http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sound = (function (_Emitter) {
  _inherits(Sound, _Emitter);

  function Sound() {
    _classCallCheck(this, Sound);

    _get(Object.getPrototypeOf(Sound.prototype), "constructor", this).call(this);

    this._context = new AudioContext();

    this._bufferSize = 512; // change this value for more or less data

    this._analyser = this._context.createAnalyser();
    this._analyser.fftSize = this._bufferSize;
    this._binCount = this._analyser.frequencyBinCount; // this._bufferSize / 2
    console.log(this._binCount);

    this._dataFreqArray = new Uint8Array(this._binCount);
    this._dataTimeArray = new Uint8Array(this._binCount);

    this._binds = {};
    this._binds.onLoad = this._onLoad.bind(this);
  }

  _createClass(Sound, [{
    key: "load",
    value: function load(url) {
      this._request = new XMLHttpRequest();
      this._request.open("GET", url, true);
      this._request.responseType = "arraybuffer";

      this._request.onload = this._binds.onLoad;
      this._request.send();
    }
  }, {
    key: "_onLoad",
    value: function _onLoad() {
      var _this = this;

      this._context.decodeAudioData(this._request.response, function (buffer) {
        _this._source = _this._context.createBufferSource();
        _this._source.connect(_this._analyser);
        _this._source.buffer = buffer;
        _this._source.connect(_this._context.destination);
        _this._source.start(0);

        _this.emit("start");
      }, function () {
        console.log("error");
      });
    }
  }, {
    key: "getData",
    value: function getData() {
      this._analyser.getByteFrequencyData(this._dataFreqArray);
      this._analyser.getByteTimeDomainData(this._dataTimeArray);
      return {
        freq: this._dataFreqArray, // from 0 - 256, no sound = 0
        time: this._dataTimeArray // from 0 -256, no sound = 128
      };
    }
  }]);

  return Sound;
})(Emitter);

module.exports = new Sound();

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stage = (function (_Emitter) {
  _inherits(Stage, _Emitter);

  function Stage() {
    _classCallCheck(this, Stage);

    _get(Object.getPrototypeOf(Stage.prototype), "constructor", this).call(this);

    this.width = 0;
    this.height = 0;

    this._binds = {};
    this._binds.onResize = this._onResize.bind(this);
    this._binds.update = this._update.bind(this);
  }

  _createClass(Stage, [{
    key: "_onResize",
    value: function _onResize() {
      setTimeout(this._binds.update, 10);
    }
  }, {
    key: "init",
    value: function init() {
      var andDispatch = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      window.addEventListener("resize", this._binds.onResize, false);
      window.addEventListener("orientationchange", this._binds.onResize, false);

      if (andDispatch) {
        this._update();
      }
    }
  }, {
    key: "_update",
    value: function _update() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.emit("resize");
    }
  }, {
    key: "forceResize",
    value: function forceResize() {
      var withDelay = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (withDelay) {
        this._onResize();
        return;
      }
      this._update();
    }
  }]);

  return Stage;
})(Emitter);

module.exports = new Stage();

},{}],7:[function(require,module,exports){
"use strict";

var loop = require("core/loop");
var stage = require("core/stage");
var engine = require("core/engine");
var sound = require("core/sound");

stage.init();
engine.init();

document.getElementById("main").appendChild(engine.dom);

var xp = new (require("xp/Xp"))();
engine.scene.add(xp);

//sound.load( "mp3/StGermain_RoseRouge.mp3" )
sound.load("mp3/ErikSatie_gymnopedie3.mp3");
sound.on("start", function () {
  loop.add(function () {
    xp.update(sound.getData());
  });
});

loop.start();

},{"core/engine":3,"core/loop":4,"core/sound":5,"core/stage":6,"xp/Xp":8}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var engine = require("core/engine");
var PerlinGenerator = require("proc-noise");
var Perlin = new PerlinGenerator();


var Xp = (function (_THREE$Object3D) {
  _inherits(Xp, _THREE$Object3D);

  function Xp() {
    _classCallCheck(this, Xp);

    _get(Object.getPrototypeOf(Xp.prototype), "constructor", this).call(this);

    this._createDummyPlane();
  }

  _createClass(Xp, [{
    key: "_createDummyPlane",
    value: function _createDummyPlane() {
      /*
        */

      var geom = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
      var mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
      var mesh = new THREE.Mesh(geom, mat);
      var part = new THREE.ImageUtils.loadTexture("img/particles.png");
      this.animSin = 0;
      this.nbPart = 180000;
      console.log(" Particules Number : " + this.nbPart);
      //  this.add( mesh )
      /*var geometry = new THREE.SphereGeometry( 5, 32, 32 );
      var material = new THREE.MeshBasicMaterial( {color: 0xff0000 , wireframe: true} );
      var sphere = new THREE.Mesh( geometry, material );
      this.add( sphere );*/
      /*** LIGHT PART  ***/

      this.light = new THREE.PointLight(0xff0000, 1, 1000);
      this.light.position.set(150, 150, 150);
      this.add(this.light);

      this.aLight = new THREE.AmbientLight(0x404040);
      this.aLight.position.set(150, 150, 150);
      this.add(this.aLight);
      /*** POINT SPLINE ***/

      this.linePoint = new THREE.Geometry();
      for (var i = 0 - window.innerWidth / 8; i < window.innerWidth; i += 8) {
        this.linePoint.vertices.push(new THREE.Vector3(i, 10, 20));
      }
      var lineMaterial = new THREE.LineBasicMaterial({ color: 0x404040, opacity: 1, linewidth: 5 });
      this.line = new THREE.Line(this.linePoint, lineMaterial);
      this.add(this.line);

      this.lineLength = this.line.geometry.vertices.length;

      //

      /*** PARTICLE 1 ***/

      var particleCount = this.nbPart;
      this.particles = new THREE.Geometry();
      var pMaterial = new THREE.PointCloudMaterial({
        map: part,
        color: 0x00ffab,
        size: 1,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1
      });
      //img/this.particles.png
      // depthTest: false
      for (var p = 0; p < particleCount; p++) {

        // create a particle with random
        // position values, -250 -> 250

        var pX = p % (this.lineLength - 1) - window.innerWidth / 8,
            pY = Math.random() * 5,
            //Math.random() * 500 - 250,
        pZ = Math.random() * 5 + 17,
            particle = new THREE.Vector3(pX, pY, pZ);

        // add it to the geometry
        this.particles.vertices.push(particle);
      }

      // create the particle system
      this.particleSystem = new THREE.PointCloud(this.particles, pMaterial);

      /*** PARTICLE 2 ***/

      /*THREE.NoBlending
      THREE.NormalBlending
      THREE.AdditiveBlending
      THREE.SubtractiveBlending
      THREE.MultiplyBlending
      THREE.CustomBlending */

      var particleCount2 = this.nbPart / 2;
      this.particles2 = new THREE.Geometry();
      var pMaterial2 = new THREE.PointCloudMaterial({
        map: part,
        color: 0x3D5A6C,
        size: 8,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1
      });
      /****** SHADER INCOMING *****/
      // depthTest: false
      this.shaderMaterial = new THREE.ShaderMaterial({

        uniforms: {
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          size: { type: 'f', value: 40 }
        },
        attributes: {
          vertexOpacity: { type: 'f', value: 1 }
        },
        vertexShader: "#define GLSLIFY 1\nuniform float time;\nuniform vec2 resolution;\n\nuniform float size;\nvarying vec2 particle;\nvarying vec3 vColor;\nvarying float xPos;\nvarying vec2 vUv;\nvoid main(){\n  vUv = uv;\n  gl_PointSize = size;\n  particle = vec2(position.xy);\n  vColor = vec3(position);\n  xPos = position.x;\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(position,1.0);\n}\n",
        fragmentShader: "#define GLSLIFY 1\nuniform float time;\nvarying vec3 vColor;\nuniform vec2 resolution ;\nvarying float xPos;\n//varying vec3 vColor;  // 'varying' vars are passed to the fragment shader\nvarying vec2 particle;\nvarying vec2 vUv;\nvoid main() { // pass the color to the fragment shader\n\n  vec2 uv = vUv;\n\n  vec2 position = (gl_FragCoord.xy / resolution.xy);\n\n  // gl_FragColor.r = 0.0;\n  // gl_FragColor.g = 1.0;\n  // gl_FragColor.b = 0.0;\n  // gl_FragColor.a = xPos;\n\n  vec2 mouse_distance = position -  (gl_FragCoord.xy / vec2(16.0,16.0));\n\tfloat alpha= 1.0 - length(mouse_distance);\n\n  gl_FragColor = vec4(position.x, position.y, 0.0, alpha);\n}\n"

      });
      //img/this.particles.png
      for (var p = 0; p < particleCount2; p++) {

        // create a particle with random
        // position values, -250 -> 250

        var pX = p % (this.lineLength - 1) - window.innerWidth / 8,
            pY = Math.random() * 5,
            //Math.random() * 500 - 250,
        pZ = Math.random() * 5 + 17,
            particle2 = new THREE.Vector3(pX, pY, pZ);

        // add it to the geometry

        this.particles2.vertices.push(particle2);
      }

      // create the particle system
      this.particleSystem2 = new THREE.PointCloud(this.particles2, this.shaderMaterial);

      this.add(this.particleSystem);
      this.add(this.particleSystem2);

      /*** GEOMETRY PART ***/
      var wireframe_material = new THREE.MeshBasicMaterial({ color: 0x2B4141, wireframe: true, wireframe_linewidth: 10 });
      this.speed = 0.01;
      this.sizeCube = 0;
      var geometry = new THREE.BoxGeometry(100, 100, 100, 20, 20, 20);
      var material = new THREE.MeshLambertMaterial({ color: 0xF0544F });
      this.object = new THREE.Mesh(geometry, material);
      //  this.object2 = new THREE.Mesh(geometry2 ,material);
      //	this.add( this.object );

      this.object2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x2B4141 }));
      this.object2.position.x -= 50;
      this.object2.position.z -= 20;
      this.object2.position.y -= 50;

      //this.add(this.object2)

      /** Cube function from three exemple  **/
      var geometryCube = _cube(110);
      this.iceCube = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: 0x5D737E, linewidth: 10, linecap: 'butt' }));
      //	this.add(this.iceCube );
      function _cube(size) {
        console.log("CUBED");
        var h = size * 0.5;

        var geometry2 = new THREE.Geometry();

        geometry2.vertices.push(new THREE.Vector3(-h, -h, -h), new THREE.Vector3(-h, h, -h), new THREE.Vector3(-h, h, -h), new THREE.Vector3(h, h, -h), new THREE.Vector3(h, h, -h), new THREE.Vector3(h, -h, -h), new THREE.Vector3(h, -h, -h), new THREE.Vector3(-h, -h, -h), new THREE.Vector3(-h, -h, h), new THREE.Vector3(-h, h, h), new THREE.Vector3(-h, h, h), new THREE.Vector3(h, h, h), new THREE.Vector3(h, h, h), new THREE.Vector3(h, -h, h), new THREE.Vector3(h, -h, h), new THREE.Vector3(-h, -h, h), new THREE.Vector3(-h, -h, -h), new THREE.Vector3(-h, -h, h), new THREE.Vector3(-h, h, -h), new THREE.Vector3(-h, h, h), new THREE.Vector3(h, h, -h), new THREE.Vector3(h, h, h), new THREE.Vector3(h, -h, -h), new THREE.Vector3(h, -h, h));

        return geometry2;
      }
      //this.add(this.object2)
      //this.add( edges );
    }
  }, {
    key: "update",
    value: function update(data) {
      if (!data) {
        return;
      }
      this.linePoint.verticesNeedUpdate = true;
      this.particles.verticesNeedUpdate = true;
      this.particles2.verticesNeedUpdate = true;

      //  this.sizeCube += 0.01
      this.object.rotation.z -= 2 * this.speed;
      this.object.rotation.x -= 3 * this.speed;
      this.object2.rotation.z -= 2 * this.speed;
      this.object2.rotation.x -= 3 * this.speed;

      this.iceCube.rotation.z -= 2 * this.speed;
      this.iceCube.rotation.x -= 3 * this.speed;
      //  this.particleSystem.rotation.y += 0.01;
      // Want to customize things ?
      // http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/
      //  this.iceCube.scale.x = ( data.freq[0] /100);

      //console.log(this.line);

      // une fois la case 0 recopiee sur la case 1,
      // transferer la valeur nouvelle du capteur dans la case 0 du registre
      //  registre1[0] = capteur[0];
      /**** VOLUME  ****/
      function getAverageVolume(array) {
        var values = 0;
        var average;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
          values += array[i];
        }

        average = values / length;
        return average;
      }

      /*********/

      var volume = getAverageVolume(data.freq);
      var average = 0;
      var freqSize = 10;
      for (var i = 0; i < freqSize; i++) {
        average += data.freq[i];
      }
      this.animSin += 0.1;
      for (var i = this.lineLength - 1; i > 0; i--) {
        this.line.geometry.vertices[i].y = this.line.geometry.vertices[i - 1].y;

        // this.line.geometry.vertices[i].y += Math.sin( this.animSin) * (average /freqSize )
      }

      for (var i = 0; i < this.particles.vertices.length; i++) {
        this.particles.vertices[i].y = this.line.geometry.vertices[i % (this.lineLength - 1)].y;
      }
      for (var i = 0; i < this.particles2.vertices.length; i++) {
        this.particles2.vertices[i].y = this.line.geometry.vertices[i % (this.lineLength - 1)].y;
      }
      //this.particles.vertices[i].y = this.line.geometry.vertices[i].y
      this.line.geometry.vertices[0].y = volume * 2;
      //this.line.geometry.vertices[0].y =  Perlin.noise(817)
      //console.log(this.line.geometry.vertices[0].y)
      //console.log();
      if (data.freq[0] > 250) {
        engine.n = 1;
      } else if (data.freq[0] < 210) {

        engine.n = 1;
      }
      //this.iceCube.scale.y += Math.cos(this.sizeCube * Math.PI) * 0.01
      //this.iceCube.scale.z += Math.cos(this.sizeCube * Math.PI) * 0.01
      //console.log( data.freq, data.time )
      //console.log(data.freq[2])

      var n = data.freq.length; // for bar // from 0 - 256, no sound = 0
      for (var i = 0; i < n; i++) {
        // do your stuff here
      }

      n = data.time.length; // for wave // from 0 - 256, no sound = 128
      for (i = 0; i < n; i++) {
        // do your stuff here
      }
    }
  }]);

  return Xp;
})(THREE.Object3D);

module.exports = Xp;

},{"core/engine":3,"proc-noise":1}]},{},[7]);
