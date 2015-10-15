const loop = require( "core/loop" )
const stage = require( "core/stage" )
const engine = require( "core/engine" )
const sound = require( "core/sound" )

stage.init()
engine.init()

document.getElementById( "main" ).appendChild( engine.dom )

const xp = new ( require( "xp/Xp" ) )()
engine.scene.add( xp )

//sound.load( "mp3/StGermain_RoseRouge.mp3" )
var div = document.getElementById("startExp");
var backDiv = document.getElementById("backStart");
var play = 0;
div.addEventListener("click", function(event){
    console.log("click");
    if( play == 0){
      sound.load("mp3/ErikSatie_gymnopedie3.mp3");
      fade(div);
      fade(backDiv);
      play ++;
    }
});
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

sound.on( "start", () => {
  loop.add( () => {
    xp.update( sound.getData() )
  })
})

loop.start()
