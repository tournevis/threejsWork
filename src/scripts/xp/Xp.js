const engine = require( "core/engine" )

class Xp extends THREE.Object3D {

  constructor() {
    super()

    this._createDummyPlane()
  }

  _createDummyPlane() {


    const geom = new THREE.PlaneBufferGeometry( 1000, 1000, 10, 10 )
    const mat = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } )
    const mesh = new THREE.Mesh( geom, mat )
  //  this.add( mesh )
    /*var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000 , wireframe: true} );
    var sphere = new THREE.Mesh( geometry, material );
    this.add( sphere );*/
    /*** LIGHT PART  ***/

    this.light = new THREE.PointLight( 0xff0000, 1, 1000 );
    this.light.position.set( 150, 150, 150 );
    this.add( this.light );

    this.aLight = new THREE.AmbientLight( 0x404040 );
    this.aLight.position.set( 150, 150, 150 );
    this.add( this.aLight );

    /*** GEOMETRY PART ***/
    var wireframe_material = new THREE.MeshBasicMaterial( { color: 0x2B4141, wireframe: true, wireframe_linewidth: 10 } );
    this.speed = 0.01;
    this.sizeCube = 0;
    var geometry = new THREE.BoxGeometry( 100, 100, 100, 20, 20, 20 );
		var  material = new THREE.MeshLambertMaterial( { color: 0xF0544F } );
    var  materialLine = new THREE.LineBasicMaterial( { color: 0x5D737E , linewidth : 1 } );
		this.object = new THREE.Mesh( geometry, material );
  //  this.object2 = new THREE.Mesh(geometry2 ,material);
		this.add( this.object );

    this.object2 = new THREE.Mesh( geometry,new THREE.MeshBasicMaterial( { color: 0x2B4141} ) );
    this.object2.position.x -=50;
    this.object2.position.z -=20;
    this.object2.position.y -=50;


    this.add(this.object2)
    /** Cube function from three exemple  **/
    var geometryCube = _cube( 110 );
    this.iceCube= new THREE.LineSegments( geometryCube, new THREE.LineBasicMaterial( { color: 0x5D737E , linewidth : 10, linecap: 'butt' } ) );
		this.add(this.iceCube );
    function _cube( size ) {
          console.log("CUBED")
  				var h = size * 0.5;

  				var geometry2 = new THREE.Geometry();

  				geometry2.vertices.push(
  					new THREE.Vector3( -h, -h, -h ),
  					new THREE.Vector3( -h, h, -h ),

  					new THREE.Vector3( -h, h, -h ),
  					new THREE.Vector3( h, h, -h ),

  					new THREE.Vector3( h, h, -h ),
  					new THREE.Vector3( h, -h, -h ),

  					new THREE.Vector3( h, -h, -h ),
  					new THREE.Vector3( -h, -h, -h ),


  					new THREE.Vector3( -h, -h, h ),
  					new THREE.Vector3( -h, h, h ),

  					new THREE.Vector3( -h, h, h ),
  					new THREE.Vector3( h, h, h ),

  					new THREE.Vector3( h, h, h ),
  					new THREE.Vector3( h, -h, h ),

  					new THREE.Vector3( h, -h, h ),
  					new THREE.Vector3( -h, -h, h ),

  					new THREE.Vector3( -h, -h, -h ),
  					new THREE.Vector3( -h, -h, h ),

  					new THREE.Vector3( -h, h, -h ),
  					new THREE.Vector3( -h, h, h ),

  					new THREE.Vector3( h, h, -h ),
  					new THREE.Vector3( h, h, h ),

  					new THREE.Vector3( h, -h, -h ),
  					new THREE.Vector3( h, -h, h )
  				 );

  				return geometry2;

  			}
    //this.add(this.object2)
		//this.add( edges );
  }

  update( data ) {
    if( !data ) {
      return
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
    if(data.freq[0] >250){
      engine.n=2
    }else if(data.freq[0] < 210){

      engine.n=1
    }
    //this.iceCube.scale.y += Math.cos(this.sizeCube * Math.PI) * 0.01
    //this.iceCube.scale.z += Math.cos(this.sizeCube * Math.PI) * 0.01
    //console.log( data.freq, data.time )
    console.log(data.freq[2])



    let n = data.freq.length // for bar // from 0 - 256, no sound = 0
    for( var i = 0; i < n; i++ ) {
      // do your stuff here
    }

    n = data.time.length // for wave // from 0 - 256, no sound = 128
    for( i = 0; i < n; i++ ) {
      // do your stuff here
    }
  }


}

module.exports = Xp
