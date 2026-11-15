/*
 * Hero background: a looping sketch-style story.
 *   chaos (paper, tables, letters, a tangle of lines, loose shapes)
 *   -> the papers fly into place and turn into the company's functions
 *   -> hand-drawn connections link them into one system
 *   -> an AI spark runs around it and lights every function
 *   -> everything loosens and drifts back into chaos, then it starts again.
 * Plain canvas 2D, no dependencies. The text block is kept clear of the
 * drawing. Pauses off-screen / in hidden tabs; reduced motion = one static
 * frame of the finished system.
 */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var content = document.querySelector('.hero-content');
  if (!hero || !content) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CYCLE = 18000;
  var TAU = Math.PI * 2;
  var INK = '26,26,26';

  var W = 0, H = 0, dpr = 1, IR = 26, textRect = null;
  var nodes = [], edges = [], debris = [], tangle = null;
  var raf = 0, running = false, visible = true, startTime = 0;

  // ---------- helpers ----------
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(x) { return Math.min(1, Math.max(0, x)); }
  function smooth(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function circ(cx, cy, r) {
    return 'M' + (cx - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0';
  }

  // "paper" objects that later turn into functions
  var PAPER = {
    team: 'M-17 -12L17 -12L17 6L2 6L-8 14L-7 6L-17 6Z',
    marketing: 'M-18 -11L18 -12L19 11L-17 12ZM-17.5 -10L1 3L18.5 -11',
    sales: 'M-12 -16L9 -16L14 -10L13 16L-12 16ZM9 -16L9 -10L14 -10M-7 -4L8 -4M-7 2L8 2M-7 8L3 8',
    warehouse: 'M-18 -10L-6 -10L-3 -6L18 -6L18 12L-18 12Z',
    delivery: 'M-14 -14L14 -13L13 14L-13 15ZM-8 -5L7 -5M-8 1L7 1M-8 7L1 7',
    finance: 'M-17 -12L17 -13L18 12L-16 13ZM-16.5 -3L17.5 -4M-16 4L18 3.5M-5 -12.5L-4.5 12.5M6 -12.8L6.5 12.5',
    analytics: 'M-15 -12L15 -12L15 14L-15 14ZM-15 -5L15 -5M-8 -16L-8 -9M8 -16L8 -9M-8 2L-3 2M3 2L8 2M-8 8L-3 8'
  };
  var ICON = {
    team: circ(0, -6, 4.2) + 'M-9 12C-9 2 9 2 9 12' + circ(-12, -2, 3) + 'M-17 11C-17 5 -12 3 -9 5' + circ(12, -2, 3) + 'M17 11C17 5 12 3 9 5',
    marketing: 'M-13 -4L-5 -4L8 -11L8 11L-5 4L-13 4ZM-9 4L-7 12L-3 12L-4 5M12 -6L16 -9M12 0L17 0M12 6L16 9',
    sales: 'M-14 -11L-9 -11L-5 6L9 6L12 -6L-7 -6' + circ(-3, 11, 2) + circ(7, 11, 2),
    warehouse: 'M0 -13L12 -7L12 7L0 13L-12 7L-12 -7ZM-12 -7L0 -1L12 -7M0 -1L0 13',
    delivery: 'M-14 -8H4V6H-14ZM4 -3H10L14 2V6H4' + circ(-8, 8, 3) + circ(8, 8, 3),
    finance: 'M6 -8C6 -13 -8 -13 -8 -6C-8 1 8 -1 8 7C8 14 -7 14 -7 8M0 -15V15',
    analytics: 'M-13 12H13M-9 12V4H-4V12M-2 12V-3H3V12M5 12V-9H10V12'
  };
  var ORDER = ['marketing', 'sales', 'warehouse', 'delivery', 'finance', 'analytics', 'team'];
  var SPARK = new Path2D('M0 -1Q.22 -.22 1 0Q.22 .22 0 1Q-.22 .22 -1 0Q-.22 -.22 0 -1Z');

  function wobbleCircle() {
    var n = 14, pts = [], a0 = rnd(0, TAU), i;
    for (i = 0; i < n; i++) {
      var a = a0 + i * TAU / n, r = 1 + rnd(-0.03, 0.03);
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return smoothPath(pts, true);
  }
  function smoothPath(pts, closed) {
    var p = new Path2D(), n = pts.length, i;
    p.moveTo(pts[0][0], pts[0][1]);
    var last = closed ? n : n - 1;
    for (i = 0; i < last; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      if (!closed) { if (i === 0) p0 = p1; if (i + 2 >= n) p3 = p2; }
      p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
                      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    return p;
  }
  function makeTangle() {
    var loops = [], k, i;
    for (k = 0; k < 6; k++) {
      var pts = [], a = rnd(0, TAU), cx = rnd(-8, 8), cy = rnd(-8, 8), steps = (3 + (k % 2)) * 7;
      for (i = 0; i < steps; i++) {
        a += TAU / 7 + rnd(-0.25, 0.25);
        var r = 56 * (0.35 + 0.65 * Math.random());
        pts.push([cx + r * Math.cos(a) * 1.05, cy + r * Math.sin(a) * 0.88]);
      }
      loops.push(smoothPath(pts, false));
    }
    return loops;
  }

  // ---------- layout ----------
  function outsideText(pad) {
    var m = 36, tries = 80, x, y;
    while (tries--) {
      x = rnd(m, W - m); y = rnd(m, H - m);
      if (!textRect || x < textRect.l - pad || x > textRect.r + pad || y < textRect.t - pad || y > textRect.b + pad) return [x, y];
    }
    return [rnd(m, W - m), rnd(m, 70)];
  }
  function inRect(x, y, pad) {
    return textRect && x > textRect.l - pad && x < textRect.r + pad && y > textRect.t - pad && y < textRect.b + pad;
  }
  function clampPt(x, y) {
    return [Math.min(W - IR - 8, Math.max(IR + 8, x)), Math.min(H - IR - 8, Math.max(IR + 8, y))];
  }
  function pushOut(x, y) {
    var pad = IR + 14;
    if (!inRect(x, y, pad)) return clampPt(x, y);
    var l = textRect.l - pad, r = textRect.r + pad, t = textRect.t - pad, b = textRect.b + pad;
    var cands = [clampPt(x, t), clampPt(x, b), clampPt(l, y), clampPt(r, y)], best = null, bd = 1e9, i;
    for (i = 0; i < cands.length; i++) {
      if (inRect(cands[i][0], cands[i][1], pad - 4)) continue;
      var d = Math.abs(cands[i][0] - x) + Math.abs(cands[i][1] - y);
      if (d < bd) { bd = d; best = cands[i]; }
    }
    return best || clampPt(x, t);
  }

  function build() {
    var hr = hero.getBoundingClientRect(), cr = content.getBoundingClientRect();
    W = Math.max(1, Math.round(hr.width)); H = Math.max(1, Math.round(hr.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    IR = Math.max(19, Math.min(30, W * 0.021));
    textRect = { l: cr.left - hr.left, r: cr.right - hr.left, t: cr.top - hr.top, b: cr.bottom - hr.top };

    var N = ORDER.length, i;
    var cx = W / 2, cy = H / 2;
    var rx = W / 2 - IR - 26, ry = H / 2 - IR - 22;
    nodes = [];
    for (i = 0; i < N; i++) {
      var ang = -Math.PI / 2 + i * TAU / N;
      var tgt = pushOut(cx + rx * Math.cos(ang), cy + ry * Math.sin(ang));
      var base = outsideText(24);
      nodes.push({
        key: ORDER[i], tx: tgt[0], ty: tgt[1], bx: base[0], by: base[1],
        ax: rnd(14, 34), ay: rnd(14, 34), kx: 1 + Math.floor(Math.random() * 3), ky: 1 + Math.floor(Math.random() * 3),
        ph: rnd(0, TAU), ph2: rnd(0, TAU), rot: rnd(-0.7, 0.7), rs: rnd(0.15, 0.35), rk: 1 + Math.floor(Math.random() * 2),
        paper: new Path2D(PAPER[ORDER[i]]), icon: new Path2D(ICON[ORDER[i]]), ring: wobbleCircle(),
        x: 0, y: 0, pulse: 0
      });
    }

    edges = [];
    for (i = 0; i < N; i++) {
      var A = nodes[i], B = nodes[(i + 1) % N];
      var dx = B.tx - A.tx, dy = B.ty - A.ty, len = Math.sqrt(dx * dx + dy * dy) || 1;
      var ux = dx / len, uy = dy / len, off = IR + 4;
      var mx = (A.tx + B.tx) / 2, my = (A.ty + B.ty) / 2;
      var ox = mx - cx, oy = my - cy, ol = Math.sqrt(ox * ox + oy * oy) || 1;
      var bow = Math.min(40, len * 0.16);
      var p0 = { x: A.tx + ux * off, y: A.ty + uy * off };
      var p2 = { x: B.tx - ux * off, y: B.ty - uy * off };
      var c = { x: mx + ox / ol * bow, y: my + oy / ol * bow };
      var crosses = false, ti;
      for (ti = 0; ti <= 12; ti++) {
        var tt = ti / 12, aa = 1 - tt;
        var qx = aa * aa * p0.x + 2 * aa * tt * c.x + tt * tt * p2.x;
        var qy = aa * aa * p0.y + 2 * aa * tt * c.y + tt * tt * p2.y;
        if (inRect(qx, qy, 8)) { crosses = true; break; }
      }
      if (crosses) continue;
      edges.push({ p0: p0, c: c, p2: p2, len: len * 1.2, path: (function (a, b, cc) {
        var p = new Path2D(); p.moveTo(a.x, a.y); p.quadraticCurveTo(cc.x, cc.y, b.x, b.y); return p;
      })(p0, p2, c) });
    }

    debris = [];
    var shapes = [
      'M-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0', 'M-8 6L8 6L0 -8Z', 'M-6 -6L6 -7L7 6L-6 7Z',
      'M-10 0Q-8 -10 2 -9', 'M-8 0L8 -3', 'M-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0', 'M-7 -5Q0 -12 7 -4'
    ];
    var count = W < 700 ? 9 : 16;
    for (i = 0; i < count; i++) {
      var pos = outsideText(14);
      debris.push({
        p: new Path2D(shapes[i % shapes.length]), bx: pos[0], by: pos[1],
        ax: rnd(8, 26), ay: rnd(8, 26), kx: 1 + Math.floor(Math.random() * 3), ky: 1 + Math.floor(Math.random() * 3),
        ph: rnd(0, TAU), rot: rnd(0, TAU), rk: 1 + Math.floor(Math.random() * 2), s: rnd(0.8, 1.3)
      });
    }

    var tp = outsideText(60);
    tangle = { loops: makeTangle(), bx: tp[0], by: tp[1], s: W < 700 ? 0.8 : 1.15 };
  }

  // ---------- drawing ----------
  function quadPoint(e, t) {
    var a = 1 - t;
    return {
      x: a * a * e.p0.x + 2 * a * t * e.c.x + t * t * e.p2.x,
      y: a * a * e.p0.y + 2 * a * t * e.c.y + t * t * e.p2.y
    };
  }
  function drawSpark(x, y, r, alpha, rot) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(r, r);
    ctx.fillStyle = 'rgba(' + INK + ',' + alpha.toFixed(3) + ')';
    ctx.fill(SPARK);
    ctx.restore();
  }

  function frame(now, fixedU) {
    if (!startTime) startTime = now;
    var u = fixedU != null ? fixedU : ((now - startTime) % CYCLE) / CYCLE;
    var t = u * TAU;

    // timeline
    var m = smooth(0.18, 0.42, u) - smooth(0.80, 0.96, u);      // papers -> functions
    var lines = smooth(0.36, 0.54, u) - smooth(0.70, 0.80, u);  // connections drawn
    var alive = smooth(0.50, 0.58, u) - smooth(0.74, 0.80, u);  // AI layer
    var sp = ((u - 0.52) / 0.24) * 1.5 * edges.length;           // spark position: ~1.5 laps over the AI window
    var e = ease(m);
    var N = nodes.length, i;

    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // tangle of lines: wobbles in chaos, fades as the system forms
    var ta = 1 - smooth(0.16, 0.38, u) * 1 + smooth(0.84, 0.97, u);
    ta = clamp01(ta);
    if (ta > 0.01) {
      ctx.save();
      ctx.translate(tangle.bx + Math.sin(t + 1) * 10, tangle.by + Math.cos(t * 2) * 8);
      ctx.rotate(Math.sin(t) * 0.12);
      var ts = tangle.s * (1 - 0.35 * (1 - ta));
      ctx.scale(ts, ts);
      ctx.lineWidth = 1.2 / ts;
      ctx.strokeStyle = 'rgba(' + INK + ',' + (0.55 * ta).toFixed(3) + ')';
      for (i = 0; i < tangle.loops.length; i++) ctx.stroke(tangle.loops[i]);
      ctx.restore();
    }

    // loose shapes
    var da = 1 - smooth(0.2, 0.4, u) + smooth(0.86, 0.98, u);
    da = clamp01(da);
    if (da > 0.01) {
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = 'rgba(' + INK + ',' + (0.5 * da).toFixed(3) + ')';
      for (i = 0; i < debris.length; i++) {
        var d = debris[i];
        ctx.save();
        ctx.translate(d.bx + d.ax * Math.sin(t * d.kx + d.ph), d.by + d.ay * Math.cos(t * d.ky + d.ph));
        ctx.rotate(d.rot + Math.sin(t * d.rk + d.ph) * 0.5);
        ctx.scale(d.s, d.s);
        ctx.stroke(d.p);
        ctx.restore();
      }
    }

    // node positions
    for (i = 0; i < N; i++) {
      var n = nodes[i];
      var chx = n.bx + n.ax * Math.sin(t * n.kx + n.ph);
      var chy = n.by + n.ay * Math.cos(t * n.ky + n.ph2);
      var bend = Math.sin(Math.PI * e) * 26 * (i % 2 ? 1 : -1);
      n.x = lerp(chx, n.tx, e) + bend;
      n.y = lerp(chy, n.ty, e) - bend * 0.6;
    }

    // connections
    if (lines > 0.01) {
      ctx.lineWidth = 1.5;
      for (i = 0; i < edges.length; i++) {
        var p = clamp01(lines * (1 + edges.length * 0.1) - i * 0.1);
        if (p <= 0.001) continue;
        var ed = edges[i];
        ctx.setLineDash([ed.len * p, ed.len * 2]);
        ctx.strokeStyle = 'rgba(' + INK + ',0.8)';
        ctx.stroke(ed.path);
        // second, lighter pass: hand-drawn doubled line
        ctx.save(); ctx.translate(1.2, -1);
        ctx.strokeStyle = 'rgba(' + INK + ',0.22)';
        ctx.stroke(ed.path);
        ctx.restore();
      }
      ctx.setLineDash([]);
    }

    // AI spark running around the ring + pulses on the functions it passes
    var sparkPos = null;
    for (i = 0; i < N; i++) nodes[i].pulse = 0;
    if (alive > 0.01 && edges.length) {
      var E = edges.length, s = ((sp % E) + E) % E, si = Math.min(E - 1, Math.floor(s)), sf = s - si;
      sparkPos = quadPoint(edges[si], sf);
      for (i = 0; i < N; i++) {
        var ddx = nodes[i].x - sparkPos.x, ddy = nodes[i].y - sparkPos.y;
        nodes[i].pulse = Math.max(0, 1 - Math.sqrt(ddx * ddx + ddy * ddy) / 70) * alive;
      }
    }

    // nodes
    for (i = 0; i < N; i++) {
      var q = nodes[i];
      var k = IR / 32;
      var paperA = 1 - smooth(0.3, 0.62, e);
      var iconA = smooth(0.55, 0.95, e);
      var rot = lerp(q.rot + Math.sin(t * q.rk + q.ph) * q.rs, 0, e);
      ctx.save();
      ctx.translate(q.x, q.y);
      var pk = 1 + 0.14 * q.pulse;
      if (paperA > 0.01) {
        ctx.save();
        ctx.rotate(rot);
        var ps = k * 1.4 * pk;
        ctx.scale(ps, ps);
        ctx.lineWidth = 1.7 / ps;
        ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * paperA).toFixed(3) + ')';
        ctx.strokeStyle = 'rgba(' + INK + ',' + (0.95 * paperA).toFixed(3) + ')';
        ctx.fill(q.paper); ctx.stroke(q.paper);
        ctx.restore();
      }
      if (iconA > 0.01) {
        ctx.save();
        var rs2 = IR * pk;
        ctx.scale(rs2, rs2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.95 * iconA).toFixed(3) + ')';
        ctx.fill(q.ring);
        ctx.lineWidth = 1.7 / rs2;
        ctx.strokeStyle = 'rgba(' + INK + ',' + (0.9 * iconA).toFixed(3) + ')';
        ctx.setLineDash([6.4 * iconA, 7]);
        ctx.stroke(q.ring);
        ctx.setLineDash([]);
        ctx.restore();
        ctx.save();
        var is = k * pk;
        ctx.scale(is, is);
        ctx.lineWidth = 1.6 / is;
        ctx.strokeStyle = 'rgba(' + INK + ',' + (0.9 * iconA * smooth(0.6, 1, iconA)).toFixed(3) + ')';
        ctx.stroke(q.icon);
        ctx.restore();
      }
      // small AI badge
      if (alive > 0.02) {
        drawSpark(IR * 0.8, -IR * 0.8, 6.5 + 2.5 * q.pulse, 0.9 * alive, t * 2 + i);
      }
      ctx.restore();
    }

    if (sparkPos) {
      drawSpark(sparkPos.x, sparkPos.y, 11, alive, t * 3);
      ctx.fillStyle = 'rgba(' + INK + ',' + (0.25 * alive).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(sparkPos.x, sparkPos.y, 16, 0, TAU); ctx.fill();
    }

    if (running) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduceMotion || !visible || document.hidden) return;
    running = true; raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  function init() {
    build();
    if (reduceMotion) frame(performance.now(), 0.66); else start();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { build(); if (reduceMotion) frame(performance.now(), 0.66); });
  init();

  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { build(); if (reduceMotion) frame(performance.now(), 0.66); }, 150);
  });
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function () {
      clearTimeout(rt);
      rt = setTimeout(function () { build(); if (reduceMotion) frame(performance.now(), 0.66); }, 120);
    });
    ro.observe(content);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); else stop(); }).observe(hero);
  }
})();
