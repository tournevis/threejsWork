const engine = require( "core/engine" )
const glslify = require('glslify');
class Xp extends THREE.Object3D {

  constructor() {
    super()

    this._createDummyPlane()
  }

  _createDummyPlane() {
    const geom = new THREE.PlaneBufferGeometry( 1000, 1000, 10, 10 )
    const mat = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } )
    const part = new THREE.ImageUtils.loadTexture( "img/particles.png" );

    this.animSin = 0;
    this.nbPart = 1000;
    console.log(" Particules Number : " + this.nbPart )

    /*** LIGHT PART  ***/

    this.light = new THREE.PointLight( 0xff0000, 1, 1000 );
    this.light.position.set( 150, 150, 150 );
    this.add( this.light );

    this.aLight = new THREE.AmbientLight( 0x404040 );
    this.aLight.position.set( 150, 150, 150 );
    this.add( this.aLight );


    /*** POINT SPLINE ***/

    this.shaderLineMaterial  = new THREE.ShaderMaterial( {
      uniforms: {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        width : { type: 'f', value: 40 }
      },
      attributes: {
        vertexOpacity: { type: 'f', value: 1 },
      },
      size:8,
      vertexShader: glslify('../shader/lineVert.glsl'),
      fragmentShader: glslify('../shader/lineFrag.glsl'),
      transparent: true
    });
    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xD8DBE2, opacity: 1, linewidth: 5} );


    this.linePoint = new THREE.Geometry() ;
    this.linePoint2 = new THREE.Geometry() ;
    for(var i = 0 -window.innerWidth/8  ; i < window.innerWidth; i+=8){
      this.linePoint.vertices.push(new THREE.Vector3( i , 10, 20));
      this.linePoint2.vertices.push(new THREE.Vector3( i , 0, 20));
    }

    this.line = new THREE.Line( this.linePoint, lineMaterial );
    this.line2 = new THREE.Line( this.linePoint2, this.shaderLineMaterial );
    this.add(this.line)
    this.add(this.line2)

    this.lineLength = this.line.geometry.vertices.length;

    /*** PARTICLE 1 ***/

    var particleCount = this.nbPart
    this.particles = new THREE.Geometry()
      var pMaterial = new THREE.PointCloudMaterial({
      //  map: part,
      color: 0xcccccc,
      size:10,
      blending: THREE.AdditiveBlending,
      transparent : true,
      opacity : 0.5
      // depthTest: false
    });
    for (var p = 0; p < particleCount; p++) {

      var pX =(p %(this.lineLength-1 ) - window.innerWidth/8 )* 1.1,
          pY =  Math.random() * 5,//Math.random() * 500 - 250,
          pZ = Math.random() * 5 +17,
          particle = new THREE.Vector3(pX, pY, pZ);
      this.particles.vertices.push(particle);
    }
    this.particleSystem = new THREE.PointCloud(
      this.particles,
      pMaterial
    );


    /*** PARTICLE 2 ***/

          /*REMINDERS

      THREE.NoBlending
      THREE.NormalBlending
      THREE.AdditiveBlending
      THREE.SubtractiveBlending
      THREE.MultiplyBlending
      THREE.CustomBlending */

      var particleCount2 = 500
      this.particles2 = new THREE.Geometry()
        var pMaterial2 = new THREE.PointCloudMaterial({
        map: part,
        color: 0x58A4B0,
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
        size : { type: 'f', value: 40 },
        u_tex : { type : 't', value: new THREE.ImageUtils.loadTexture( "img/ptc.png" )  }
    	},
    	attributes: {
    		vertexOpacity: { type: 'f', value: 1 },
    	},
    	vertexShader: glslify('../shader/particleVert.glsl'),
    	fragmentShader: glslify('../shader/particleFrag.glsl'),
      transparent: true

    } );

      for (var p = 0; p < particleCount2; p++) {
        var pX =(p %(this.lineLength-1 ) - window.innerWidth/12)*1.5,
            pY =  Math.random() * 5,//Math.random() * 500 - 250,
            pZ = Math.random() * 5 ,
            particle2 = new THREE.Vector3(pX, pY, pZ);

        this.particles2.vertices.push(particle2);
      }

    // create the particle system
      this.particleSystem2 = new THREE.PointCloud(
        this.particles2,
        this.shaderMaterial);
      //this.add(this.particleSystem);
      this.add(this.particleSystem2);

    /*** GEOMETRY CUBE PART ***/

    this.speed = 0.01;
    this.sizeCube = 0;
    var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		var  material = new THREE.MeshBasicMaterial( { color: 0xCCCCCC} );
  	this.object = new THREE.Mesh( geometry, material );
    this.object.position.x -= window.innerWidth/8 +5;
    this.object.position.z = 20;
		this.add( this.object );


    /** Cube function from three exemple  **/

    var geometryCube = _cube( 22 );

    this.iceCube= new THREE.LineSegments( geometryCube, new THREE.LineBasicMaterial( { color: 0x5D737E , linewidth : 2, linecap: 'butt' } ) );
    this.iceCube.position.x = this.object.position.x;
    this.iceCube.position.y = this.object.position.y;
    this.iceCube.position.z = this.object.position.z;
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
  }

  update( data ) {
    if( !data ) {
      return
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

    var volume = getAverageVolume(data.freq)
    var average = 0;
    var freqSize = 5;
    for (var i = 0; i < freqSize; i++) {
      average += data.freq[i] ;
    }
    this.animSin += 0.1
    for(var i = this.lineLength-1 ; i > 0; i--){
     this.line.geometry.vertices[i].y = this.line.geometry.vertices[i-1].y
     this.line2.geometry.vertices[i].y = this.line2.geometry.vertices[i-1].y
     this.line2.geometry.vertices[i].z = this.line2.geometry.vertices[i-1].z
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
    this.iceCube.position.y = this.line.geometry.vertices[0].y;
    this.object.position.y = this.line.geometry.vertices[0].y;

    this.line2.geometry.vertices[0].y = Math.sin( this.animSin)/2 * (average /freqSize )*.6 +10
    this.line2.geometry.vertices[0].z = Math.sin( this.animSin)/2 *0.4
    //this.line.geometry.vertices[0].y =  Perlin.noise(817)
    //console.log(this.line.geometry.vertices[0].y)
    //console.log();

    /** MULTI CAMERA SETUP  **/
    engine.n =1;

    /*
    if(data.freq[0] >250){
      engine.n=1
    }else if(data.freq[0] < 210){
      engine.n=2
    }*/
  }


}

module.exports = Xp
