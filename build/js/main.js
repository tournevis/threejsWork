(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"core/loop":2,"core/stage":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
        // this._source.start( 0 )

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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

sound.load("mp3/StGermain_RoseRouge.mp3");
sound.on("start", function () {
  loop.add(function () {
    xp.update(sound.getData());
  });
});

loop.start();

},{"core/engine":1,"core/loop":2,"core/sound":3,"core/stage":4,"xp/Xp":6}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var engine = require("core/engine");

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

      var geom = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
      var mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
      var mesh = new THREE.Mesh(geom, mat);
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

      /*** GEOMETRY PART ***/
      var wireframe_material = new THREE.MeshBasicMaterial({ color: 0x2B4141, wireframe: true, wireframe_linewidth: 10 });
      this.speed = 0.01;
      this.sizeCube = 0;
      var geometry = new THREE.BoxGeometry(100, 100, 100, 20, 20, 20);
      var material = new THREE.MeshLambertMaterial({ color: 0xF0544F });
      var materialLine = new THREE.LineBasicMaterial({ color: 0x5D737E, linewidth: 1 });
      this.object = new THREE.Mesh(geometry, material);
      //  this.object2 = new THREE.Mesh(geometry2 ,material);
      this.add(this.object);

      this.object2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x2B4141 }));
      this.object2.position.x -= 50;
      this.object2.position.z -= 20;
      this.object2.position.y -= 50;

      this.add(this.object2);
      /** Cube function from three exemple  **/
      var geometryCube = _cube(110);
      this.iceCube = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: 0x5D737E, linewidth: 10, linecap: 'butt' }));
      this.add(this.iceCube);
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
      //  this.sizeCube += 0.01
      this.object.rotation.z -= 2 * this.speed;
      this.object.rotation.x -= 3 * this.speed;
      this.object2.rotation.z -= 2 * this.speed;
      this.object2.rotation.x -= 3 * this.speed;

      this.iceCube.rotation.z -= 2 * this.speed;
      this.iceCube.rotation.x -= 3 * this.speed;

      // Want to customize things ?
      // http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/
      //  this.iceCube.scale.x = ( data.freq[0] /100);
      if (data.freq[0] > 250) {
        engine.n = 2;
      } else if (data.freq[0] < 210) {

        engine.n = 1;
      }
      //this.iceCube.scale.y += Math.cos(this.sizeCube * Math.PI) * 0.01
      //this.iceCube.scale.z += Math.cos(this.sizeCube * Math.PI) * 0.01
      //console.log( data.freq, data.time )
      console.log(data.freq[2]);

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

},{"core/engine":1}]},{},[5]);
