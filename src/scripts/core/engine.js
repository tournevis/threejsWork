const loop = require( "core/loop" )
const stage = require( "core/stage" )

class Engine {

  constructor() {
    this.n = 1;
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera( 75, 0, 1, 10000 )
    this.cameraAnim = 0.01;
    //this.camera.position.z = 10
    this.camera2 = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 10000 );
    this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } )
    this.renderer.setPixelRatio( window.devicePixelRatio )
  //this.renderer.autoClear = false;
		this.camera.position.z = 200;
    this.dom = this.renderer.domElement

    /** CUSTOM RENDER PASS **/
    /*this.composer = new THREE.EffectComposer( this.renderer )
    var effectBloom = new THREE.BloomPass( 1.3 );
    this.composer.addPass(effectBloom);*/

    this._binds = {}
    this._binds.onUpdate = this._onUpdate.bind( this )
    this._binds.onResize = this._onResize.bind( this )
  }

  _onUpdate() {
    /*** CAMERA SIMPLE ANIMATION ON Z ***/
    this.cameraAnim += 0.02;
    this.camera.position.z += Math.sin(this.cameraAnim )

    /** MULTI CAMERA CONTROL **/
    switch(this.n){
      case 1 :
    this.renderer.render( this.scene, this.camera )
      break;
      case 2 :
    this.renderer.render(this.scene, this.camera2)
      break;
    }

    //this.renderer.clear();
    //this.composer.render();
  }

  _onResize() {
    const w = stage.width
    const h = stage.height

    this.renderer.setSize( w, h )

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  init() {
    loop.add( this._binds.onUpdate )
    stage.on( "resize", this._binds.onResize )
    this._onResize()
  }

}

module.exports = new Engine()
