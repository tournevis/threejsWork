uniform float time;
uniform vec2 resolution;

uniform float size;
varying vec2 particle;
varying vec3 vColor;
varying float xPos;
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_PointSize = .9 - position.x/3.0;
  particle = vec2(position.xy);
  vColor = vec3(position);
  xPos = position.x;
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}
