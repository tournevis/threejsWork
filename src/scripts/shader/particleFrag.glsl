uniform float time;
varying vec3 vColor;
uniform vec2 resolution ;
varying float xPos;
//varying vec3 vColor;  // 'varying' vars are passed to the fragment shader
varying vec2 particle;
varying vec2 vUv;
void main() { // pass the color to the fragment shader

  vec2 uv = vUv;

  vec2 position = (gl_FragCoord.xy / resolution.xy);

  // gl_FragColor.r = 0.0;
  // gl_FragColor.g = 1.0;
  // gl_FragColor.b = 0.0;
  // gl_FragColor.a = xPos;

  vec2 mouse_distance = position -  (gl_FragCoord.xy / vec2(16.0,16.0));
	float alpha= 1.0 - length(mouse_distance);

  gl_FragColor = vec4(position.x, position.y, 0.0, alpha);
}
