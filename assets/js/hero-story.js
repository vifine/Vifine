/*
 * Hero background: a one-time sketch story, then a calm idle.
 *   0.0s  chaos fills the whole screen (papers, tables, letters, chats, a tangle of lines)
 *         with the caption "From chaos to digital transformation"
 *   1.7s  the tangle fades, every piece flies to its place
 *   3.3s  a hand-drawn "backbone" line is drawn along the bottom; the company's
 *         functions hang on it, each with an AI spark and its own documents
 *   3.7s  headline and buttons appear (CSS, class .hero-revealed)
 *   then  the system only breathes a little. No loop, nothing runs around.
 * Plain canvas 2D, no dependencies. Reduced motion = the finished frame, no caption.
 */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var content = document.querySelector('.hero-content');
  if (!hero || !content) return;
  var caption = hero.querySelector('.hero-caption');

  var canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);
  var ctx = canvas.getContext('2d');
  if (!ctx) { hero.classList.add('hero-revealed'); return; }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // timeline, ms
  var CAP_IN0 = 150, CAP_IN1 = 600, CAP_OUT0 = 2100, CAP_OUT1 = 2800;
  var TANGLE0 = 1700, TANGLE1 = 3600;
  var MOVE0 = 1700, MOVE_DUR = 1900, MOVE_STAG = 600;
  var SPINE0 = 3300, SPINE1 = 4500;
  var STEM0 = 3700, BADGE0 = 4300, REVEAL = 3700, IDLE0 = 4800;
  var END = 99999;

  var INK = '#1f1f1f';
  var TAU = Math.PI * 2;

  // ---------- helpers ----------
  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(x) { return Math.min(1, Math.max(0, x)); }
  function smooth(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function backOut(t) { var c = 1.9; t = t - 1; return 1 + (c + 1) * t * t * t + c * t * t; }
  function circ(cx, cy, r) {
    return 'M' + (cx - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0';
  }

  // ---------- shapes (hand-drawn, ~36 units wide) ----------
  var P = {
    team: 'M-17 -12L17 -12L17 6L2 6L-8 14L-7 6L-17 6Z',
    whatsapp: 'M-16 -11Q-16 -16 -11 -16H11Q16 -16 16 -11V5Q16 10 11 10H-3L-12 16L-10 10H-11Q-16 10 -16 5ZM-6 -8Q-8 -2 -2 3Q2 6 6 4L6 0L2 -2L0 0Q-3 -2 -4 -5L-2 -7L-4 -11Z',
    envelope: 'M-18 -11L18 -12L19 11L-17 12ZM-17.5 -10L1 3L18.5 -11',
    receipt: 'M-12 -16L9 -16L14 -10L13 16L-12 16ZM9 -16L9 -10L14 -10M-7 -4L8 -4M-7 2L8 2M-7 8L3 8',
    folder: 'M-18 -10L-6 -10L-3 -6L18 -6L18 12L-18 12Z',
    note: 'M-14 -14L14 -13L13 14L-13 15ZM-8 -5L7 -5M-8 1L7 1M-8 7L1 7',
    sheet: 'M-17 -12L17 -13L18 12L-16 13ZM-16.5 -3L17.5 -4M-16 4L18 3.5M-5 -12.5L-4.5 12.5M6 -12.8L6.5 12.5',
    calendar: 'M-15 -12L15 -12L15 14L-15 14ZM-15 -5L15 -5M-8 -16L-8 -9M8 -16L8 -9M-9 2L-5 2M-2 2L2 2M5 2L9 2M-9 8L-5 8M-2 8L2 8',
    barcode: 'M-15 -11H15V11H-15ZM-10 -7V7M-6 -7V7M-3 -7V7M1 -7V7M5 -7V7M9 -7V7',
    tag: 'M-14 -2L-2 -14L14 -14L14 2L2 14Z' + circ(6, -8, 2),
    cartP: 'M-14 -11L-9 -11L-5 6L9 6L12 -6L-7 -6' + circ(-3, 11, 2) + circ(7, 11, 2),
    boxP: 'M0 -13L12 -7L12 7L0 13L-12 7L-12 -7ZM-12 -7L0 -1L12 -7M0 -1L0 13',
    truckP: 'M-16 -8H4V6H-16ZM4 -3H11L16 2V6H4' + circ(-9, 8, 3) + circ(9, 8, 3),
    coin: circ(0, 0, 13) + 'M6 -6C6 -10 -6 -10 -6 -4C-6 1 6 -1 6 5C6 10 -5 10 -5 6M0 -12V12',
    chartP: 'M-14 13H14M-10 13V4H-5V13M-2 13V-4H3V13M6 13V-10H11V13'
  };
  var ICON = {
    marketing: 'M-13 -4L-5 -4L8 -11L8 11L-5 4L-13 4ZM-9 4L-7 12L-3 12L-4 5M12 -6L16 -9M12 0L17 0M12 6L16 9',
    sales: P.cartP,
    warehouse: P.boxP,
    delivery: 'M-14 -8H4V6H-14ZM4 -3H10L14 2V6H4' + circ(-8, 8, 3) + circ(8, 8, 3),
    finance: 'M6 -8C6 -13 -8 -13 -8 -6C-8 1 8 -1 8 7C8 14 -7 14 -7 8M0 -15V15',
    analytics: P.chartP,
    team: circ(0, -6, 4.2) + 'M-9 12C-9 2 9 2 9 12' + circ(-12, -2, 3) + 'M-17 11C-17 5 -12 3 -9 5' + circ(12, -2, 3) + 'M17 11C17 5 12 3 9 5'
  };
  var ORDER = ['marketing', 'sales', 'warehouse', 'delivery', 'finance', 'analytics', 'team'];
  var PAPER = { marketing: 'envelope', sales: 'receipt', warehouse: 'folder', delivery: 'note', finance: 'sheet', analytics: 'calendar', team: 'team' };
  var SAT = {
    marketing: ['envelope', 'whatsapp'], sales: ['receipt', 'barcode'], warehouse: ['folder', 'tag'],
    delivery: ['note', 'truckP'], finance: ['sheet', 'coin'], analytics: ['calendar', 'chartP'], team: ['team', 'whatsapp']
  };
  var FILL = ['envelope', 'whatsapp', 'sheet', 'receipt', 'folder', 'note', 'calendar', 'barcode', 'tag', 'cartP', 'boxP', 'truckP', 'coin', 'chartP', 'team'];

  var pathCache = {}, iconCache = {};
  function pp(k) { return pathCache[k] || (pathCache[k] = new Path2D(P[k])); }
  function ip(k) { return iconCache[k] || (iconCache[k] = new Path2D(ICON[k])); }
  var SPARK = new Path2D('M0 -1Q.22 -.22 1 0Q.22 .22 0 1Q-.22 .22 -1 0Q-.22 -.22 0 -1Z');

  function wobbleRing(rng) {
    var n = 16, pts = [], a0 = rng() * TAU, i;
    for (i = 0; i < n; i++) {
      var a = a0 + i * TAU / n, r = 1 + (rng() - 0.5) * 0.06;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    var p = new Path2D();
    p.moveTo(pts[0][0], pts[0][1]);
    for (i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    p.closePath();
    return p;
  }

  // ---------- static item definitions (positions as fractions, so resize keeps the picture) ----------
  var rng0 = seeded(7), defs = [], rings = [], i, j;
  function r0(a, b) { return a + rng0() * (b - a); }
  function mkDef(extra) {
    var d = { fx: r0(0.04, 0.96), fy: r0(0.07, 0.93), rot: r0(-60, 60), wx: r0(0.0006, 0.0013), wy: r0(0.0006, 0.0013),
      px: r0(0, TAU), py: r0(0, TAU), ax: r0(6, 15), ay: r0(6, 15), wr: r0(0.0008, 0.0016), pr: r0(0, TAU), bow: r0(-50, 50) };
    for (var k in extra) d[k] = extra[k];
    return d;
  }
  for (i = 0; i < ORDER.length; i++) {
    var key = ORDER[i];
    rings.push(wobbleRing(rng0));
    defs.push(mkDef({ kind: 'node', k: key, idx: i, paper: PAPER[key], ring: rings[i] }));
    for (j = 0; j < 2; j++) defs.push(mkDef({ kind: 'sat', k: key, idx: i, side: j, paper: SAT[key][j] }));
  }
  for (i = 0; i < 52; i++) defs.push(mkDef({ kind: 'fill', fi: i, paper: FILL[i % FILL.length], sc: 1.5 + r0(0, 1.1) }));
  for (i = 0; i < defs.length; i++) defs[i].order = i / defs.length;

  // ---------- layout ----------
  var W = 0, H = 0, dpr = 1, L = 1, items = [], tangle = [], spine = null, nodes = [];

  function scribble(rng, cx, cy, rx, ry, loops) {
    var n = loops * 9, pts = [], k, p = new Path2D();
    for (k = 0; k < n; k++) {
      var a = k / n * TAU * loops, m = 0.55 + 0.45 * Math.sin(k * 1.7);
      pts.push([cx + Math.cos(a) * rx * m + (rng() - 0.5) * 60, cy + Math.sin(a * 1.13) * ry * m + (rng() - 0.5) * 48]);
    }
    p.moveTo(pts[0][0], pts[0][1]);
    for (k = 1; k < n - 1; k++) p.quadraticCurveTo(pts[k][0], pts[k][1], (pts[k][0] + pts[k + 1][0]) / 2, (pts[k][1] + pts[k + 1][1]) / 2);
    return p;
  }

  function build() {
    var rect = hero.getBoundingClientRect();
    W = Math.max(280, Math.round(rect.width));
    H = Math.max(300, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    L = Math.min(1, Math.max(0.55, W / 1100));
    var cs = 0.55 + 0.45 * L, cx = W / 2, cy = H / 2;

    var R = 36 * L;
    var mL = Math.max(R + 16, W * 0.09);
    var spineY = H - 196 * L, nodeY = spineY + 80 * L, satY = nodeY + 88 * L;
    var spacing = (W - 2 * mL) / (ORDER.length - 1);
    var satDx = Math.min(42 * L, spacing * 0.22);
    var maxFill = W < 700 ? 26 : 52;

    var rngT = seeded(21), x0 = Math.max(18, W * 0.035);
    tangle = [
      { p: scribble(rngT, cx - W * 0.1, cy - H * 0.12, W * 0.44, H * 0.34, 5), a: 0.9, w: 1.6 },
      { p: scribble(rngT, cx + W * 0.14, cy + H * 0.12, W * 0.46, H * 0.36, 4), a: 0.8, w: 1.4 },
      { p: scribble(rngT, cx, cy, W * 0.38, H * 0.34, 6), a: 1, w: 1.2 },
      { p: scribble(rngT, cx - W * 0.3, cy + H * 0.1, W * 0.24, H * 0.3, 3), a: 0.7, w: 1.3 },
      { p: scribble(rngT, cx + W * 0.31, cy - H * 0.12, W * 0.23, H * 0.28, 3), a: 0.7, w: 1.3 }
    ];
    for (var w = 0; w < 7; w++) {
      var wp = new Path2D();
      wp.moveTo(rngT() * W, rngT() * H);
      wp.quadraticCurveTo(rngT() * W, rngT() * H, rngT() * W, rngT() * H);
      tangle.push({ p: wp, a: 0.5, w: 1.1 });
    }

    spine = { x0: x0, x1: W - x0, y: spineY };
    nodes = [];
    items = [];
    var fillCount = 0;
    for (var d = 0; d < defs.length; d++) {
      var df = defs[d], it = { d: df, kind: df.kind, cx: df.fx * W, cy: df.fy * H };
      if (df.kind === 'fill') {
        if (fillCount++ >= maxFill) continue;
        it.s = df.sc * cs;
      } else if (df.kind === 'node') {
        it.tx = mL + df.idx * spacing; it.ty = nodeY; it.R = R;
        it.s0 = 2.3 * cs; it.s1 = 1;
        nodes[df.idx] = it;
      } else {
        var nx = mL + df.idx * spacing;
        it.tx = nx + (df.side ? satDx : -satDx); it.ty = satY;
        it.s0 = 2.1 * cs; it.s1 = 1.05 * L;
      }
      it.rot = df.rot;
      items.push(it);
    }
  }

  // ---------- drawing ----------
  function paper(key, x, y, s, rot, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(s, s);
    ctx.lineWidth = 1.8 / s; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.fillStyle = '#fff'; ctx.strokeStyle = INK;
    var p = pp(key);
    ctx.fill(p); ctx.stroke(p);
    ctx.restore();
  }
  function ringIcon(it, x, y, e, t) {
    var r = lerp(10 * L, it.R, e);
    ctx.save();
    ctx.globalAlpha = Math.min(1, e * 1.1);
    ctx.translate(x, y); ctx.scale(r, r);
    ctx.lineWidth = 2 / r; ctx.fillStyle = '#fff'; ctx.strokeStyle = INK;
    ctx.fill(it.d.ring); ctx.stroke(it.d.ring);
    ctx.restore();
    var is = lerp(0.5, 1.55, e) * L;
    ctx.save();
    ctx.globalAlpha = e;
    ctx.translate(x, y); ctx.scale(is, is);
    ctx.lineWidth = 1.8 / is; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = INK;
    ctx.stroke(ip(it.d.k));
    ctx.restore();
  }
  function sparkAt(x, y, s, a) {
    if (s <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = INK; ctx.fill(SPARK);
    ctx.restore();
  }

  var revealed = false;
  function frame(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var idle = smooth(IDLE0, IDLE0 + 1500, t);
    var k, it, d;

    // tangle
    var tA = 1 - smooth(TANGLE0, TANGLE1, t);
    if (tA > 0.01) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(Math.sin(t / 2100) * 0.03 * (1 - smooth(TANGLE0, TANGLE1, t)));
      ctx.translate(-W / 2, -H / 2);
      ctx.lineCap = 'round'; ctx.strokeStyle = INK;
      for (k = 0; k < tangle.length; k++) {
        ctx.globalAlpha = tangle[k].a * tA; ctx.lineWidth = tangle[k].w;
        ctx.stroke(tangle[k].p);
      }
      ctx.restore();
    }

    // loose pieces
    for (k = 0; k < items.length; k++) {
      it = items[k]; d = it.d;
      if (it.kind !== 'fill') continue;
      var ef = ease(clamp01((t - MOVE0 - d.order * MOVE_STAG) / MOVE_DUR));
      if (ef >= 1) continue;
      var fx = it.cx + (it.cx - W / 2) * ef * 0.35 + Math.sin(t * d.wx + d.px) * d.ax * (1 - ef);
      var fy = it.cy + (it.cy - H / 2) * ef * 0.35 + Math.cos(t * d.wy + d.py) * d.ay * (1 - ef);
      paper(d.paper, fx, fy, it.s * (1 - ef * 0.25), it.rot * (1 + ef * 0.3) + Math.sin(t * d.wr + d.pr) * 7, (1 - ef) * 0.95);
    }

    // backbone line + stems
    var sp = smooth(SPINE0, SPINE1, t);
    if (sp > 0.001) {
      var len = spine.x1 - spine.x0;
      ctx.save();
      ctx.strokeStyle = INK; ctx.lineCap = 'round';
      ctx.setLineDash([len + 20, len + 20]); ctx.lineDashOffset = (len + 20) * (1 - sp);
      ctx.lineWidth = 3.2 * Math.max(0.7, L);
      ctx.beginPath(); ctx.moveTo(spine.x0, spine.y);
      ctx.bezierCurveTo(spine.x0 + len * 0.28, spine.y - 6, spine.x0 + len * 0.6, spine.y + 6, spine.x1, spine.y - 2);
      ctx.stroke();
      ctx.globalAlpha = 0.4; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(spine.x0 + 10, spine.y + 5);
      ctx.bezierCurveTo(spine.x0 + len * 0.28, spine.y, spine.x0 + len * 0.6, spine.y + 10, spine.x1 - 10, spine.y + 3);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      for (k = 0; k < nodes.length; k++) {
        var np = clamp01((t - STEM0 - k * 80) / 500);
        if (np <= 0) continue;
        var yTop = spine.y + 2, yBot = nodes[k].ty - nodes[k].R + 1;
        ctx.beginPath(); ctx.moveTo(nodes[k].tx, yTop); ctx.lineTo(nodes[k].tx, lerp(yTop, yBot, ease(np)));
        ctx.stroke();
      }
      ctx.restore();
    }

    // satellites, then nodes
    for (var pass = 0; pass < 2; pass++) {
      for (k = 0; k < items.length; k++) {
        it = items[k]; d = it.d;
        if (it.kind === 'fill') continue;
        if ((pass === 0) !== (it.kind === 'sat')) continue;
        var e = ease(clamp01((t - MOVE0 - d.order * MOVE_STAG) / MOVE_DUR));
        var dx = it.tx - it.cx, dy = it.ty - it.cy, ln = Math.sqrt(dx * dx + dy * dy) || 1;
        var arc = Math.sin(Math.PI * e) * d.bow;
        var amp = it.kind === 'sat' ? lerp(1, 0.22, e) : lerp(1, 0, e);
        var x = lerp(it.cx, it.tx, e) + (-dy / ln) * arc + Math.sin(t * d.wx + d.px) * d.ax * amp;
        var y = lerp(it.cy, it.ty, e) + (dx / ln) * arc + Math.cos(t * d.wy + d.py) * d.ay * amp;
        var rot = lerp(it.rot, 0, e) + Math.sin(t * d.wr + d.pr) * 7 * (1 - e);
        if (it.kind === 'sat') {
          paper(d.paper, x, y, lerp(it.s0, it.s1, e), rot, 0.97);
        } else {
          paper(d.paper, x, y, lerp(it.s0, it.s1, e), rot, 1 - e * 0.85);
          if (e > 0.25) ringIcon(it, x, y, e, t);
        }
      }
    }

    // AI sparks pop onto every function, then twinkle softly
    for (k = 0; k < nodes.length; k++) {
      var bp = clamp01((t - BADGE0 - k * 80) / 320);
      if (bp <= 0) continue;
      var sc = 8 * L * backOut(bp) * (1 + 0.12 * Math.sin(t / 700 + k * 1.3) * idle);
      sparkAt(nodes[k].tx + nodes[k].R * 0.75, nodes[k].ty - nodes[k].R * 0.75, sc, 0.95);
    }

    // caption veil
    var capA = smooth(CAP_IN0, CAP_IN1, t) - smooth(CAP_OUT0, CAP_OUT1, t);
    if (capA > 0.005) {
      var vr = Math.min(W * 0.46, 500);
      ctx.save();
      ctx.globalAlpha = capA * 0.93;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(W / 2, H / 2, vr, Math.max(60, 92 * L), 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = capA * 0.5;
      ctx.beginPath(); ctx.ellipse(W / 2, H / 2, vr * 1.14, Math.max(80, 124 * L), 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    if (caption) caption.style.opacity = capA.toFixed(3);

    if (!revealed && t >= REVEAL) { revealed = true; hero.classList.add('hero-revealed'); }
  }

  // ---------- run ----------
  var raf = 0, running = false, visible = true, clock = 0, last = 0, rt = 0;

  function loop(now) {
    if (!running) return;
    var dt = last ? Math.min(now - last, 100) : 16;
    last = now;
    clock += dt;
    frame(clock);
    raf = requestAnimationFrame(loop);
  }
  function start() { if (running || reduceMotion) return; running = true; last = 0; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  function sync() { if (visible && !document.hidden) start(); else stop(); }

  function init() {
    build();
    if (reduceMotion) {
      hero.classList.add('hero-revealed');
      frame(END);
      return;
    }
    frame(0);
    start();
  }
  function onResize() {
    clearTimeout(rt);
    rt = setTimeout(function () { build(); frame(reduceMotion ? END : clock); }, 120);
  }

  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(hero);
  else window.addEventListener('resize', onResize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; sync(); }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', sync);

  init();
})();
