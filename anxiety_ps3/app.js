// Very small, ES5-compatible interaction for PS3 browsers
function el(id){ return document.getElementById(id); }
var textEl = el('text');
var sceneEl = el('scene');
var choicesEl = el('choices');

function choose(n){
  if(n===1){
    textEl.innerHTML = 'You give the thought a name. Naming it makes it feel smaller.';
    choicesEl.innerHTML = '<button class="btn" onclick="choose(3)">Breathe slowly</button>' +
                         '<button class="btn" onclick="restart()">Let it pass</button>';
  } else if(n===2){
    textEl.innerHTML = 'You try to ignore it. The thought grows a little louder.';
    choicesEl.innerHTML = '<button class="btn" onclick="choose(3)">Breathe slowly</button>' +
                         '<button class="btn" onclick="restart()">Start over</button>';
  } else if(n===3){
    textEl.innerHTML = 'You breathe in... and out. The pebble rolls away, and the room feels a bit lighter.';
    choicesEl.innerHTML = '<button class="btn" onclick="restart()">Finish</button>';
  }
}

function restart(){
  textEl.innerHTML = 'You wake up in a quiet room. A thought sits like a small pebble in your mind. What do you do?';
  choicesEl.innerHTML = '<button class="btn" onclick="choose(1)">Name the thought</button>' +
                        '<button class="btn" onclick="choose(2)">Ignore it</button>' +
                        '<button class="btn" onclick="choose(3)">Breathe slowly</button>';
}
