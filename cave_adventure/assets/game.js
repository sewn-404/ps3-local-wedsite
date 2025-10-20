// Small, resilient script for Cave Adventure
(function(){
  try {
    var storage = window.localStorage;
  } catch(e) { var storage = null; }

  function safeGet(key){ try { return storage ? storage.getItem(key) : null; } catch(e){ return null; } }
  function safeSet(key,val){ try { if(storage) storage.setItem(key,val); } catch(e){} }

  var VISITED_KEY = 'cave_visited';
  var visited = {};
  var raw = safeGet(VISITED_KEY);
  if(raw){ try{ visited = JSON.parse(raw) || {}; }catch(e){ visited = {}; } }

  // mark current page visited
  var page = (document.location.pathname || location.href).split('/').pop() || 'start.html';
  visited[page] = (visited[page] || 0) + 1;
  safeSet(VISITED_KEY, JSON.stringify(visited));

  // add status bar
  function createStatus(){
    var bar = document.createElement('div');
    bar.className = 'status-bar';
    var count = Object.keys(visited).length;
    bar.innerHTML = 'Visited: <strong>' + count + '</strong>' +
      ' <button id="cave-reset">Reset</button>';
    document.body.appendChild(bar);
    var btn = document.getElementById('cave-reset');
    if(btn) btn.addEventListener('click', function(){ if(storage){ storage.removeItem(VISITED_KEY); location.reload(); } });
  }

  // highlight visited links
  function markLinks(){
    var anchors = document.getElementsByTagName('a');
    for(var i=0;i<anchors.length;i++){
      var a = anchors[i];
      var target = a.getAttribute('href');
      if(!target) continue;
      var name = target.split('/').pop().split('#')[0];
      if(name && visited[name]) a.className = (a.className? a.className + ' ':'') + 'visited';
    }
  }

  // run when DOM ready
  function init(){ createStatus(); markLinks(); startClock(); }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else { init(); }

  // --- Local time updater ---
  function formatTwo(n){ return (n<10? '0'+n : ''+n); }
  function startClock(){
    try{
      var el = document.getElementById('local-time');
      if(!el) return;
      function tick(){
        var d = new Date();
        var date = d.getFullYear() + '-' + formatTwo(d.getMonth()+1) + '-' + formatTwo(d.getDate());
        var time = formatTwo(d.getHours()) + ':' + formatTwo(d.getMinutes()) + ':' + formatTwo(d.getSeconds());
        el.textContent = date + ' ' + time;
      }
      tick();
      setInterval(tick, 1000);
    }catch(e){ /* degrade quietly */ }
  }

})();
