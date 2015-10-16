varying float posX;
void main(){
  posX = position.x;
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}
