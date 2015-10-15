const engine = require( "core/engine" )
var PerlinGenerator = require("proc-noise");
var Perlin = new PerlinGenerator();
const glslify = require('glslify');
class Xp extends THREE.Object3D {

  constructor() {
    super()

    this._createDummyPlane()
  }

  _createDummyPlane() {
    /*


    */


    const geom = new THREE.PlaneBufferGeometry( 1000, 1000, 10, 10 )
    const mat = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } )
    const mesh = new THREE.Mesh( geom, mat )
    const part = new THREE.ImageUtils.loadTexture( "img/particles.png" );
    this.animSin = 0;
    this.nbPart = 180000;
    console.log(" Particules Number : " + this.nbPart )
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
    /*** POINT SPLINE ***/



    this.linePoint = new THREE.Geometry() ;
    for(var i = 0 -window.innerWidth/8  ; i < window.innerWidth; i+=8){
      this.linePoint.vertices.push(new THREE.Vector3( i , 10, 20));
    }
    var lineMaterial = new THREE.LineBasicMaterial( { color: 0x404040, opacity: 1, linewidth: 5} );
    this.line = new THREE.Line( this.linePoint, lineMaterial );
    this.add(this.line)

    this.lineLength = this.line.geometry.vertices.length;

    //

    /*** PARTICLE 1 ***/

    var particleCount = this.nbPart
    this.particles = new THREE.Geometry()
      var pMaterial = new THREE.PointCloudMaterial({
      map: part,
      color: 0x00ffab,
      size:1 ,
      blending: THREE.AdditiveBlending,
      transparent : true,
      opacity : 1,
      // depthTest: false
    });
    //img/this.particles.png
    for (var p = 0; p < particleCount; p++) {

    // create a particle with random
    // position values, -250 -> 250

      var pX =p %(this.lineLength-1 ) - window.innerWidth/8,
          pY =  Math.random() * 5,//Math.random() * 500 - 250,
          pZ = Math.random() * 5 +17,
          particle = new THREE.Vector3(pX, pY, pZ);


    // add it to the geometry
      this.particles.vertices.push(particle);
    }

  // create the particle system
    this.particleSystem = new THREE.PointCloud(
      this.particles,
      pMaterial);


    /*** PARTICLE 2 ***/

    /*THREE.NoBlending
THREE.NormalBlending
THREE.AdditiveBlending
THREE.SubtractiveBlending
THREE.MultiplyBlending
THREE.CustomBlending */

      var particleCount2 = this.nbPart /2
      this.particles2 = new THREE.Geometry()
        var pMaterial2 = new THREE.PointCloudMaterial({
        map: part,
        color: 0x3D5A6C,
        size:8 ,
        blending: THREE.AdditiveBlending,
        transparent : true,
        opacity : 1,
        // depthTest: false
      });
        /****** SHADER INCOMING *****/
      this.shaderMaterial = new THREE.ShaderMaterial( {

    	uniforms: {
    		time: { type: "f", value: 1.0 },
    		resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        size : { type: 'f', value: 40 }
    	},
    	attributes: {
    		vertexOpacity: { type: 'f', value: 1 },
    	},
    	vertexShader: glslify('../shader/particleVert.glsl'),
    	fragmentShader: glslify('../shader/particleFrag.glsl')

    } );
      //img/this.particles.png
      for (var p = 0; p < particleCount2; p++) {

      // create a particle with random
      // position values, -250 -> 250

        var pX =p %(this.lineLength-1 ) - window.innerWidth/8,
            pY =  Math.random() * 5,//Math.random() * 500 - 250,
            pZ = Math.random() * 5 +17,
            particle2 = new THREE.Vector3(pX, pY, pZ);

      // add it to the geometry

        this.particles2.vertices.push(particle2);
      }

    // create the particle system
      this.particleSystem2 = new THREE.PointCloud(
        this.particles2,
        this.shaderMaterial);

        this.add(this.particleSystem);
        this.add(this.particleSystem2);

    /*** GEOMETRY PART ***/
    var wireframe_material = new THREE.MeshBasicMaterial( { color: 0x2B4141, wireframe: true, wireframe_linewidth: 10 } );
    this.speed = 0.01;
    this.sizeCube = 0;
    var geometry = new THREE.BoxGeometry( 100, 100, 100, 20, 20, 20 );
		var  material = new THREE.MeshLambertMaterial( { color: 0xF0544F } );
  		this.object = new THREE.Mesh( geometry, material );
  //  this.object2 = new THREE.Mesh(geometry2 ,material);
	//	this.add( this.object );

    this.object2 = new THREE.Mesh( geometry,new THREE.MeshBasicMaterial( { color: 0x2B4141} ) );
    this.object2.position.x -=50;
    this.object2.position.z -=20;
    this.object2.position.y -=50;


    //this.add(this.object2)


    /** Cube function from three exemple  **/
    var geometryCube = _cube( 110 );
    this.iceCube= new THREE.LineSegments( geometryCube, new THREE.LineBasicMaterial( { color: 0x5D737E , linewidth : 10, linecap: 'butt' } ) );
	//	this.add(this.iceCube );
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

    var volume = getAverageVolume(data.freq)
    var average = 0;
    var freqSize = 10;
    for (var i = 0; i < freqSize; i++) {
      average += data.freq[i] ;
    }
    this.animSin += 0.1
    for(var i = this.lineLength-1 ; i > 0; i--){
     this.line.geometry.vertices[i].y = this.line.geometry.vertices[i-1].y

    // this.line.geometry.vertices[i].y += Math.sin( this.animSin) * (average /freqSize )
    }

    for (var i = 0; i < this.particles.vertices.length; i++) {
      this.particles.vertices[i].y = this.line.geometry.vertices[i %(this.lineLength-1 )].y
    }
    for (var i = 0; i < this.particles2.vertices.length; i++) {
      this.particles2.vertices[i].y = this.line.geometry.vertices[i %(this.lineLength-1 )].y
    }
    //this.particles.vertices[i].y = this.line.geometry.vertices[i].y
    this.line.geometry.vertices[0].y = volume *2
    //this.line.geometry.vertices[0].y =  Perlin.noise(817)
    //console.log(this.line.geometry.vertices[0].y)
    //console.log();
    if(data.freq[0] >250){
      engine.n=1
    }else if(data.freq[0] < 210){

      engine.n=1
    }
    //this.iceCube.scale.y += Math.cos(this.sizeCube * Math.PI) * 0.01
    //this.iceCube.scale.z += Math.cos(this.sizeCube * Math.PI) * 0.01
    //console.log( data.freq, data.time )
    //console.log(data.freq[2])



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
