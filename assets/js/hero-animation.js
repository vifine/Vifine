/*
 * Hero animation: "from chaos to intelligent systems".
 * Scattered nodes (cells, messages, tables) drift randomly, then organise into
 * a layered network, then data pulses start running through it (the "AI" nodes
 * pulse as they process), then it gently dissolves and the cycle repeats.
 * Plain canvas 2D, no dependencies. Pauses off-screen and in hidden tabs;
 * with prefers-reduced-motion it draws one static, ordered frame.
 */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CYCLE = 18000; // ms for one chaos -> order -> running -> chaos loop
  var W = 0, H = 0, dpr = 1;
  var nodes = [], edges = [], pulses = [];
  var raf = 0, running = false, visible = true;
  var startTime = 0, lastSpawn = 0;

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) {
    var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function build() {
    var rect = hero.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var small = W < 700;
    var layers = small ? 4 : 7;
    var perLayer = small ? 6 : 8;
    var layerNodes = [];
    nodes = []; edges = []; pulses = [];

    for (var l = 0; l < layers; l++) {
      var count = perLayer - (l % 2);
      layerNodes[l] = [];
      for (var i = 0; i < count; i++) {
        var n = {
          ox: W * (0.05 + 0.9 * l / (layers - 1)),
          oy: H * (0.1 + 0.8 * (i + 0.5) / count),
          cx: rnd(0, W), cy: rnd(0, H),
          ax: rnd(14, 46), ay: rnd(14, 46),
          sx: rnd(0.00018, 0.0004), sy: rnd(0.00018, 0.0004),
          ph: rnd(0, 6.28),
          size: rnd(5, 9),
          rot: rnd(-0.9, 0.9),
          ai: false,
          layer: l
        };
        nodes.push(n);
        layerNodes[l].push(n);
      }
    }

    // connect every node to its two nearest (by height) neighbours in the next layer
    for (var a = 0; a < layers - 1; a++) {
      layerNodes[a].forEach(function (from) {
        var next = layerNodes[a + 1].slice().sort(function (p, q) {
          return Math.abs(p.oy - from.oy) - Math.abs(q.oy - from.oy);
        });
        for (var k = 0; k < 2 && k < next.length; k++) edges.push({ a: from, b: next[k] });
      });
    }

    // a handful of "AI" nodes in the middle and later layers
    var pool = nodes.filter(function (n) { return n.layer >= 2 && n.layer <= layers - 2; });
    for (var m = 0; m < (small ? 3 : 6) && pool.length; m++) {
      pool.splice(Math.floor(Math.random() * pool.length), 1)[0].ai = true;
    }
  }

  function roundedRect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function frame(now) {
    if (!startTime) startTime = now;
    var time = now - startTime;
    var u = (time % CYCLE) / CYCLE;
    var p = reduceMotion ? 1 : smooth(0.12, 0.38, u) - smooth(0.86, 1, u);
    var net = smooth(0.35, 0.9, p); // how visible the connected network is

    ctx.clearRect(0, 0, W, H);

    // positions
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var wx = n.cx + Math.sin(time * n.sx + n.ph) * n.ax;
      var wy = n.cy + Math.cos(time * n.sy + n.ph) * n.ay;
      n.x = lerp(wx, n.ox, p);
      n.y = lerp(wy, n.oy, p);
    }

    // edges
    if (net > 0.01) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(26,26,26,' + (0.18 * net).toFixed(3) + ')';
      ctx.beginPath();
      for (var e = 0; e < edges.length; e++) {
        ctx.moveTo(edges[e].a.x, edges[e].a.y);
        ctx.lineTo(edges[e].b.x, edges[e].b.y);
      }
      ctx.stroke();
    }

    // data pulses travelling along edges
    if (!reduceMotion) {
      if (p > 0.85 && now - lastSpawn > 160 && pulses.length < 46 && edges.length) {
        lastSpawn = now;
        pulses.push({ e: edges[Math.floor(Math.random() * edges.length)], t: 0, v: rnd(0.0004, 0.0009) });
      }
      for (var q = pulses.length - 1; q >= 0; q--) {
        var pl = pulses[q];
        pl.t += pl.v * 16;
        if (pl.t >= 1 || p < 0.5) { pulses.splice(q, 1); continue; }
        var px = lerp(pl.e.a.x, pl.e.b.x, pl.t);
        var py = lerp(pl.e.a.y, pl.e.b.y, pl.t);
        ctx.fillStyle = 'rgba(26,26,26,' + (0.75 * net).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, 6.2832);
        ctx.fill();
      }
    }

    // nodes: squares/tilted cells in chaos, round and aligned in the system
    for (var k = 0; k < nodes.length; k++) {
      var d = nodes[k];
      var s = d.size * (d.ai ? lerp(1, 1.5, p) : 1);
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(lerp(d.rot, 0, p));
      ctx.fillStyle = 'rgba(26,26,26,' + (d.ai ? lerp(0.3, 0.85, p) : lerp(0.28, 0.5, p)).toFixed(3) + ')';
      roundedRect(-s / 2, -s / 2, s, s, lerp(0.5, s / 2, p));
      ctx.fill();
      ctx.restore();

      if (d.ai && net > 0.05) {
        var ring = s * (2.2 + 0.35 * Math.sin(time / 520 + d.ph));
        ctx.strokeStyle = 'rgba(26,26,26,' + (0.4 * net).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, ring, 0, 6.2832);
        ctx.stroke();
      }
    }

    if (running) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduceMotion || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  build();
  if (reduceMotion) {
    frame(performance.now());
  } else {
    start();
  }

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      build();
      if (reduceMotion) frame(performance.now());
    }, 150);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(hero);
  }
})();
