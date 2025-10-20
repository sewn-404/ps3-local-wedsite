/* PS3-friendly rotating cube demo
   - Tries CSS 3D transforms first
   - Falls back to a simple canvas software projection renderer
   - Written in ES5 (no let/const, no arrow functions) for ancient browsers
*/
(function(){
  'use strict';

  var statusEl = document.getElementById('status');
  var speedBtn = document.getElementById('speedBtn');
  var toggleBtn = document.getElementById('toggleRender');
  var cubeEl = document.getElementById('cube');
  var sceneEl = document.getElementById('cube-scene');
  var canvas = document.getElementById('cube-canvas');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  var useCanvasFallback = false; // forced flag
  var preferCss3d = (function(){
    var el = document.createElement('p');
    var has3d = false;
    var transforms = {
      'webkitTransform':'-webkit-transform',
      'OTransform':'-o-transform',
      'msTransform':'-ms-transform',
      'MozTransform':'-moz-transform',
      'transform':'transform'
    };
    // add to body to test
    document.body.insertBefore(el, document.body.firstChild);
    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = 'translateZ(1px)';
        var st = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        if (st && st !== 'none') {
          has3d = true;
          break;
        }
      }
    }
    document.body.removeChild(el);
    return has3d;
  })();

  function setStatus(s) {
    if (statusEl) { statusEl.innerHTML = s; }
  }

  var fpsEl = document.getElementById('fps');
  // FPS tracking
  var frameCount = 0, fpsLast = 0, fpsTimeStart = Date.now();
  function frameTick() {
    frameCount += 1;
    var now = Date.now();
    if (now - fpsTimeStart >= 1000) {
      fpsLast = frameCount;
      frameCount = 0;
      fpsTimeStart = now;
      if (fpsEl) { fpsEl.innerHTML = 'FPS: ' + fpsLast; }
    }
  }

  // Basic rotation state
  var rx = 0, ry = 0, speed = 0.8; // degrees per frame approx
  var fast = false;

  // CSS animate loop using transform set
  function cssTick() {
    if (useCanvasFallback || !cubeEl) { return; }
    rx += 0.3 * (fast ? 2.5 : 1);
    ry += 0.5 * (fast ? 2.5 : 1);
    var t = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    cubeEl.style.transform = t;
    // count this frame
    try { frameTick(); } catch (e) { }
    // request next frame, but PS3 may not have requestAnimationFrame
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(cssTick);
    } else {
      setTimeout(cssTick, 33);
    }
  }

  // Very small, simple 3D cube renderer for canvas fallback
  function canvasRenderer() {
    if (!ctx) { return; }
    var W = canvas.width, H = canvas.height;
    var theta = 0;
    var vertices = [
      [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1], // back
      [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]      // front
    ];
    var faces = [ [0,1,2,3], [4,5,6,7], [0,1,5,4], [2,3,7,6], [0,3,7,4], [1,2,6,5] ];

    function project(v, rotX, rotY) {
      // rotate
      var x = v[0], y = v[1], z = v[2];
      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      // rotate X
      var y1 = y * cosX - z * sinX;
      var z1 = y * sinX + z * cosX;
      // rotate Y
      var x2 = x * cosY + z1 * sinY;
      var z2 = -x * sinY + z1 * cosY;
      var depth = 3;
      var f = depth / (depth - z2);
      return { x: W/2 + x2 * 60 * f, y: H/2 + y1 * 60 * f, z: z2 };
    }

    function draw() {
      theta += 0.02 * (fast ? 3 : 1);
      ctx.clearRect(0,0,W,H);
      // compute projected verts
      var pv = [];
      for (var i=0;i<vertices.length;i++) { pv.push(project(vertices[i], theta*0.7, theta*1.1)); }
      // sort faces by average z
      var fdata = [];
      for (var i2=0;i2<faces.length;i2++) {
        var f = faces[i2];
        var avgz = (pv[f[0]].z + pv[f[1]].z + pv[f[2]].z + pv[f[3]].z) / 4;
        fdata.push({idx:i2, avgz:avgz});
      }
      fdata.sort(function(a,b){return b.avgz - a.avgz;});

      for (var k=0;k<fdata.length;k++) {
        var face = faces[fdata[k].idx];
        // choose color from face index
        var colors = ['#ffd166','#ff7b7b','#8ad4ff','#b39cff','#c1fba4','#ffd6a5'];
        ctx.fillStyle = colors[fdata[k].idx%colors.length];
        ctx.beginPath();
        for (var j=0;j<face.length;j++) {
          var p = pv[face[j]];
          if (j===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.stroke();
      }
      if (window.requestAnimationFrame) window.requestAnimationFrame(draw); else setTimeout(draw, 33);
      // FPS for canvas path
      try { frameTick(); } catch (e) { }
    }
    draw();
  }

  // Wire up controls
  if (speedBtn) {
    speedBtn.onclick = function(){ fast = !fast; speedBtn.innerHTML = fast ? 'Speed: Fast' : 'Speed: Slow'; };
  }

  if (toggleBtn) {
    toggleBtn.onclick = function(){ useCanvasFallback = !useCanvasFallback; applyRenderer(); };
  }

  function applyRenderer() {
    // decide which to use
    var cssOk = preferCss3d && !useCanvasFallback;
    if (!cssOk) {
      // fallback
      document.body.className = (document.body.className || '') + ' no-3d';
      if (sceneEl) sceneEl.style.display = 'none';
      if (canvas) canvas.style.display = 'block';
      setStatus('Using canvas fallback renderer');
      canvasRenderer();
    } else {
      // use CSS
      document.body.className = (document.body.className || '').replace(/\bno-3d\b/g, '');
      if (sceneEl) sceneEl.style.display = 'block';
      if (canvas) canvas.style.display = 'none';
      setStatus('Using CSS 3D transforms');
      cssTick();
    }
  }

  // Initial setup
  try { applyRenderer(); } catch (e) { try { document.body.className += ' no-3d'; canvasRenderer(); } catch (e2) { setStatus('Renderer failed'); } }

})();
