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
    //this.renderer.autoClear = false;
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
      /*** CAMERA SIMPLE ANIMATION ON Z ***/
      this.cameraAnim += 0.02;
      this.camera.position.z += Math.sin(this.cameraAnim);

      /** MULTI CAMERA CONTROL **/
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

    this._bufferSize = 1024; // change this value for more or less data

    this._analyser = this._context.createAnalyser();
    this._analyser.fftSize = this._bufferSize;
    this._binCount = this._analyser.frequencyBinCount; // this._bufferSize / 2
    //console.log( this._binCount )

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

//sound.load( "mp3/StGermain_RoseRouge.mp3" )
var div = document.getElementById("startExp");
var backDiv = document.getElementById("backStart");
var play = 0;
div.addEventListener("click", function (event) {
    if (play == 0) {
        sound.load("mp3/ErikSatie_gymnopedie3.mp3");
        fade(div);
        fade(backDiv);
        play++;
    }
});
function fade(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

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
      var part = new THREE.ImageUtils.loadTexture("img/particles.png");

      this.animSin = 0;
      this.nbPart = 1000;
      //console.log(" Particules Number : " + this.nbPart )

      /*** LIGHT PART  ***/

      this.light = new THREE.PointLight(0xff0000, 1, 1000);
      this.light.position.set(150, 150, 150);
      this.add(this.light);

      this.aLight = new THREE.AmbientLight(0x404040);
      this.aLight.position.set(150, 150, 150);
      this.add(this.aLight);

      /*** POINT SPLINE ***/

      this.shaderLineMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          width: { type: 'f', value: 40 }
        },
        attributes: {
          vertexOpacity: { type: 'f', value: 1 }
        },
        size: 8,
        vertexShader: "#define GLSLIFY 1\nvarying float posX;\nvoid main(){\n  posX = position.x;\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(position,1.0);\n}\n",
        fragmentShader: "#define GLSLIFY 1\nvarying float posX;\nvoid main(){\n    gl_FragColor = vec4(0.6,1.0,0.8,0.8);\n}\n",
        transparent: true
      });
      var lineMaterial = new THREE.LineBasicMaterial({ color: 0xD8DBE2, opacity: 1, linewidth: 5 });

      this.linePoint = new THREE.Geometry();
      this.linePoint2 = new THREE.Geometry();
      for (var i = 0 - window.innerWidth / 16; i < window.innerWidth; i += 8) {
        this.linePoint.vertices.push(new THREE.Vector3(i, 10, 20));
        this.linePoint2.vertices.push(new THREE.Vector3(i, 0, 20));
      }

      this.line = new THREE.Line(this.linePoint, lineMaterial);
      this.line2 = new THREE.Line(this.linePoint2, this.shaderLineMaterial);
      this.add(this.line);
      this.add(this.line2);

      this.lineLength = this.line.geometry.vertices.length;

      /*** PARTICLE 1 ***/

      var particleCount = this.nbPart;
      this.particles = new THREE.Geometry();
      var pMaterial = new THREE.PointCloudMaterial({
        //  map: part,
        color: 0xcccccc,
        size: 10,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.5
        // depthTest: false
      });
      for (var p = 0; p < particleCount; p++) {

        var pX = (p % (this.lineLength - 1) - window.innerWidth / 16) * 1.1,
            pY = Math.random() * 5,
            //Math.random() * 500 - 250,
        pZ = Math.random() * 5 + 17,
            particle = new THREE.Vector3(pX, pY, pZ);
        this.particles.vertices.push(particle);
      }
      this.particleSystem = new THREE.PointCloud(this.particles, pMaterial);

      /*** PARTICLE 2 ***/

      /*REMINDERS
      THREE.NoBlending
      THREE.NormalBlending
      THREE.AdditiveBlending
      THREE.SubtractiveBlending
      THREE.MultiplyBlending
      THREE.CustomBlending */

      var particleCount2 = 30;
      this.particles2 = new THREE.Geometry();
      var pMaterial2 = new THREE.PointCloudMaterial({
        map: part,
        color: 0x58A4B0,
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
          size: { type: 'f', value: 40 },
          u_tex: { type: 't', value: new THREE.ImageUtils.loadTexture("img/ptc.png") }
        },
        attributes: {
          vertexOpacity: { type: 'f', value: 1 }
        },
        vertexShader: "#define GLSLIFY 1\nuniform float time;\nuniform vec2 resolution;\n\nuniform float size;\nvarying vec2 particle;\nvarying vec3 vColor;\nvarying float xPos;\nvarying vec2 vUv;\nvoid main(){\n  vUv = uv;\n  gl_PointSize = .9 - position.x/3.0;\n  particle = vec2(position.xy);\n  vColor = vec3(position);\n  xPos = position.x;\n  gl_Position = projectionMatrix *\n                modelViewMatrix *\n                vec4(position,1.0);\n}\n",
        fragmentShader: "#define GLSLIFY 1\nuniform float time;\nvarying vec3 vColor;\nuniform vec2 resolution ;\nuniform sampler2D u_tex;\nvarying float xPos;\n//varying vec3 vColor;  // 'varying' vars are passed to the fragment shader\nvarying vec2 particle;\nvarying vec2 vUv;\nvoid main() { // pass the color to the fragment shader\n\n  vec2 uv = vUv;\n  vec2 position = (gl_FragCoord.xy / resolution.xy);\n\n  /*  //Ca tricote , ca tricote\n  if ( position.x < 10.0 && position.y < 20.0 ){\n    vec4 texture = texture2D( u_tex, position.xy);\n    gl_FragColor = texture;\n  }\n  else {\n    gl_FragColor = vec4(0.0);\n  }*/\n\n  gl_FragColor = vec4(.85, .9, 0.85,1.0-position.x/2.0);\n}\n",
        transparent: true

      });

      for (var p = 0; p < particleCount2; p++) {
        var pX = (p % (this.lineLength - 1) - window.innerWidth / 20) * 1.5,
            pY = Math.random() * 5,
            //Math.random() * 500 - 250,
        pZ = Math.random() * 5,
            particle2 = new THREE.Vector3(pX, pY, pZ);

        this.particles2.vertices.push(particle2);
      }

      // create the particle system
      this.particleSystem2 = new THREE.PointCloud(this.particles2, this.shaderMaterial);
      //this.add(this.particleSystem);
      this.add(this.particleSystem2);

      /*** GEOMETRY CUBE PART ***/

      this.speed = 0.01;
      this.sizeCube = 0;
      var geometry = new THREE.BoxGeometry(20, 20, 20);
      var material = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
      this.object = new THREE.Mesh(geometry, material);
      this.object.position.x -= window.innerWidth / 16 + 5;
      this.object.position.z = 20;
      this.add(this.object);

      /** Cube function from three exemple  **/

      var geometryCube = _cube(22);

      this.iceCube = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: 0x5D737E, linewidth: 2, linecap: 'butt' }));
      this.iceCube.position.x = this.object.position.x;
      this.iceCube.position.y = this.object.position.y;
      this.iceCube.position.z = this.object.position.z;
      this.add(this.iceCube);
      function _cube(size) {
        //  console.log("CUBED")
        var h = size * 0.5;

        var geometry2 = new THREE.Geometry();

        geometry2.vertices.push(new THREE.Vector3(-h, -h, -h), new THREE.Vector3(-h, h, -h), new THREE.Vector3(-h, h, -h), new THREE.Vector3(h, h, -h), new THREE.Vector3(h, h, -h), new THREE.Vector3(h, -h, -h), new THREE.Vector3(h, -h, -h), new THREE.Vector3(-h, -h, -h), new THREE.Vector3(-h, -h, h), new THREE.Vector3(-h, h, h), new THREE.Vector3(-h, h, h), new THREE.Vector3(h, h, h), new THREE.Vector3(h, h, h), new THREE.Vector3(h, -h, h), new THREE.Vector3(h, -h, h), new THREE.Vector3(-h, -h, h), new THREE.Vector3(-h, -h, -h), new THREE.Vector3(-h, -h, h), new THREE.Vector3(-h, h, -h), new THREE.Vector3(-h, h, h), new THREE.Vector3(h, h, -h), new THREE.Vector3(h, h, h), new THREE.Vector3(h, -h, -h), new THREE.Vector3(h, -h, h));

        return geometry2;
      }
    }
  }, {
    key: "update",
    value: function update(data) {
      if (!data) {
        return;
      }
      this.linePoint.verticesNeedUpdate = true;
      this.linePoint2.verticesNeedUpdate = true;
      this.particles.verticesNeedUpdate = true;
      this.particles2.verticesNeedUpdate = true;

      //this.sizeCube += 0.01
      this.object.rotation.z -= 2 * this.speed;
      this.object.rotation.x -= 3 * this.speed;
      this.iceCube.rotation.z -= 2 * this.speed;
      this.iceCube.rotation.x -= 3 * this.speed;
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

      /**** SOUND *****/

      var volume = getAverageVolume(data.freq);
      var average = 0;
      var freqSize = 5;
      for (var i = 0; i < freqSize; i++) {
        average += data.freq[i];
      }
      this.animSin += 0.1;
      for (var i = this.lineLength - 1; i > 0; i--) {
        this.line.geometry.vertices[i].y = this.line.geometry.vertices[i - 1].y;
        this.line2.geometry.vertices[i].y = this.line2.geometry.vertices[i - 1].y;
        this.line2.geometry.vertices[i].z = this.line2.geometry.vertices[i - 1].z;
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
      this.iceCube.position.y = this.line.geometry.vertices[0].y;
      this.object.position.y = this.line.geometry.vertices[0].y;

      this.line2.geometry.vertices[0].y = Math.sin(this.animSin) / 2 * (average / freqSize) * .6 + 10;
      this.line2.geometry.vertices[0].z = Math.sin(this.animSin) / 2 * 0.4;
      //this.line.geometry.vertices[0].y =  Perlin.noise(817)
      //console.log(this.line.geometry.vertices[0].y)
      //console.log();

      /** MULTI CAMERA SETUP  **/
      engine.n = 1;

      /*
      if(data.freq[0] >250){
        engine.n=1
      }else if(data.freq[0] < 210){
        engine.n=2
      }*/
    }
  }]);

  return Xp;
})(THREE.Object3D);

module.exports = Xp;

},{"core/engine":1}]},{},[5]);
