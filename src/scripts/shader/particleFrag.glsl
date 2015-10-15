uniform float time;
varying vec3 vColor;
uniform vec2 resolution ;
uniform sampler2D u_tex;
varying float xPos;
//varying vec3 vColor;  // 'varying' vars are passed to the fragment shader
varying vec2 particle;
varying vec2 vUv;
void main() { // pass the color to the fragment shader

  vec2 uv = vUv;
  vec2 position = (gl_FragCoord.xy / resolution.xy);

/*
  if ( position.x < 10.0 && position.y < 20.0 ){
    vec4 texture = texture2D( u_tex, position.xy);
    gl_FragColor = texture;
  }
  else {
    gl_FragColor = vec4(0.0);
  }*/


  gl_FragColor = vec4(1.0, 0.2, 0.2,1.0-position.x);
}
