import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

var U = { k: () => 1, Ls: [1, 1, 1, 1, 1, 1], Qt: 1, pull: 1, step() {}, render() {} };
var dh = [
    "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0438\u0434\u0435\u043D\u0442\u0438\u0447\u043D\u043E\u0441\u0442\u044C",
    "\u041F\u043E\u0437\u0438\u0442\u0438\u0432\u043D\u043E\u0435 \u0441\u0430\u043C\u043E\u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u0435",
    "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0431\u0440\u0430\u0437 \xAB\u042F\xBB",
    "\u041A\u043E\u0433\u043D\u0438\u0442\u0438\u0432\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0435\u0442\u0435\u043D\u0442\u043D\u043E\u0441\u0442\u044C",
    "\u042D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0435\u0442\u0435\u043D\u0442\u043D\u043E\u0441\u0442\u044C",
    "\u042D\u043A\u0437\u0438\u0441\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u0438",
  ],
  qi = new URLSearchParams(location.search),
  Lx = document.getElementById("app"),
  ve = new THREE.WebGLRenderer({
    antialias: !0,
    alpha: !0,
    preserveDrawingBuffer: !0,
  });
ve.setPixelRatio(Math.min(devicePixelRatio, 2));
ve.setSize(innerWidth, innerHeight);
ve.outputColorSpace = THREE.SRGBColorSpace;
ve.toneMapping = THREE.ACESFilmicToneMapping;
ve.toneMappingExposure = 1;
ve.shadowMap.enabled = !0;
ve.shadowMap.type = THREE.VSMShadowMap;
Lx.appendChild(ve.domElement);
var an = new THREE.Scene();
an.background = new THREE.Color(16777215);
an.environment = new THREE.PMREMGenerator(ve).fromScene(new RoomEnvironment(), 0.03).texture;
var camera = new THREE.PerspectiveCamera(19, innerWidth / innerHeight, 0.1, 100);
camera.position.set(5.4, 2.4, 7.4);
function tf() {
  let i = innerWidth,
    t = innerHeight,
    e = i / t;
  ((camera.aspect = e),
    (camera.fov = Math.max(
      19,
      2 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(THREE.MathUtils.degToRad(e < 1 ? 7.6 : 12)) / e)),
    )),
    e > 1.25
      ? camera.setViewOffset(i, t, -i * (t < 560 ? 0.2 : 0.17), -t * 0.02, i, t)
      : camera.setViewOffset(i, t, 0, -t * 0.075, i, t),
    camera.updateProjectionMatrix());
}
tf();
var ge = new OrbitControls(camera, ve.domElement);
ge.enableDamping = !0;
ge.dampingFactor = 0.07;
ge.enablePan = !1;
ge.minDistance = 4;
ge.maxDistance = 26;
ge.zoomSpeed = 1.1;
ge.touches = {
  ONE: null,
  TWO: null,
};
ge.minPolarAngle = 0.05;
ge.maxPolarAngle = 1.5;
ge.target.set(0, -0.22, 0);
ge.enableRotate = !1;
var Fn = new THREE.DirectionalLight(16777215, 2.3);
Fn.position.set(0.9, 10, 0.7);
Fn.castShadow = !0;
Fn.shadow.mapSize.set(512, 512);
Fn.shadow.camera.left = -3;
Fn.shadow.camera.right = 3;
Fn.shadow.camera.top = 3;
Fn.shadow.camera.bottom = -3;
Fn.shadow.radius = 18;
Fn.shadow.blurSamples = 14;
Fn.shadow.bias = -4e-4;
an.add(Fn);
var ef = new THREE.DirectionalLight(14677234, 0.6);
ef.position.set(-5, 2, -3);
an.add(ef);
an.add(new THREE.HemisphereLight(16777215, 14675696, 0.4));
var $e = 6,
  Vi = 1.05,
  L = 2.6,
  Jn = [0, 1, 2, 3, 4, 5],
  Kn = [6, 7, 8, 9, 10, 11],
  STRUTS = Jn.map((i, t) => [i, Kn[t]]),
  da = [];
STRUTS.forEach(([i, t]) => {
  ((da[i] = t), (da[t] = i));
});
var RING = [],
  STAR = [],
  Ji = [],
  _s = [];
for (let i = 0; i < $e; i++) {
  let t = (i + 1) % $e,
    e = (i + 2) % $e,
    n = (i + $e - 1) % $e;
  (RING.push([Jn[i], Jn[t]], [Kn[i], Kn[t]]),
    STAR.push([Jn[i], Jn[e]], [Kn[i], Kn[e]]),
    Ji.push([Jn[i], Kn[t]]),
    _s.push([Jn[i], Kn[n]]));
}
var REST = {
    ring: Vi * 0.92,
    star: Vi * 0.92 * Math.sqrt(3) * 0.995,
    diag: Vi * 2,
  },
  th = 0.14,
  Dx = 0.003,
  nr = (i, t) => i * 16 + t,
  cutSet = new Set(),
  lh = new Map();
function nf(i) {
  let t = [];
  for (let r = 0; r < $e; r++) {
    let a = (2 * Math.PI * r) / $e;
    t.push(new THREE.Vector3(Vi * Math.cos(a), 0, Vi * Math.sin(a)));
  }
  let e = 2 * Vi * Math.abs(Math.sin(i / 2)),
    n = Math.sqrt(Math.max(L * L - e * e, 0.04));
  for (let r = 0; r < $e; r++) {
    let a = (2 * Math.PI * r) / $e + i;
    t.push(new THREE.Vector3(Vi * Math.cos(a), n, Vi * Math.sin(a)));
  }
  let s = new THREE.Vector3();
  return (t.forEach((r) => s.add(r)), s.multiplyScalar(1 / t.length), t.map((r) => r.sub(s)));
}
var pos = nf(-2.1),
  we = pos.map((i) => i.clone()),
  homes = [null, null],
  Yt = 0,
  rn = 1,
  Ue = null,
  $n = null,
  yl = 1,
  ee = new THREE.Vector3(),
  Dn = new THREE.Vector3();
function ta(i, t, e, n, s) {
  ee.subVectors(pos[t], pos[i]);
  let r = ee.length();
  if (r < 1e-6) return;
  let a = r - e;
  (s && a < 0) || (ee.multiplyScalar((a / r) * 0.5 * n), pos[i].add(ee), pos[t].sub(ee));
}
var js = new THREE.Vector3(),
  Qs = new THREE.Vector3(),
  eh = new THREE.Vector3(),
  fh = new THREE.Vector3(),
  ph = new THREE.Vector3();
function sf(i, t, e, n) {
  (js.subVectors(t, i), Qs.subVectors(n, e), eh.subVectors(i, e));
  let s = js.dot(js),
    r = Qs.dot(Qs),
    a = Qs.dot(eh),
    o = js.dot(eh),
    l = js.dot(Qs),
    c = s * r - l * l,
    h = c > 1e-8 ? THREE.MathUtils.clamp((l * a - o * r) / c, 0, 1) : 0,
    p = (l * h + a) / r;
  return (
    p < 0
      ? ((p = 0), (h = THREE.MathUtils.clamp(-o / s, 0, 1)))
      : p > 1 && ((p = 1), (h = THREE.MathUtils.clamp((l - o) / s, 0, 1))),
    fh.copy(i).addScaledVector(js, h),
    ph.copy(e).addScaledVector(Qs, p),
    [h, p]
  );
}
var zd = 0.2;
function Nx() {
  for (let i = 0; i < $e; i++)
    for (let t = i + 1; t < $e; t++) {
      let [e, n] = STRUTS[i],
        [s, r] = STRUTS[t],
        [a, o] = sf(pos[e], pos[n], pos[s], pos[r]);
      Dn.subVectors(fh, ph);
      let l = Dn.length();
      l < zd &&
        l > 1e-6 &&
        (Dn.multiplyScalar(((zd - l) / l) * 0.5),
        pos[e].addScaledVector(Dn, 1 - a),
        pos[n].addScaledVector(Dn, a),
        pos[s].addScaledVector(Dn, -(1 - o)),
        pos[r].addScaledVector(Dn, -o));
    }
}
var se = new THREE.Vector3(),
  Nn = new THREE.Vector3(),
  hl = new THREE.Vector3(),
  nh = new THREE.Vector3();
function ir() {
  (se.set(0, 0, 0), pos.forEach((n) => se.add(n)), se.multiplyScalar(1 / 12));
  let i = new THREE.Vector3(),
    t = new THREE.Vector3();
  (Kn.forEach((n) => i.add(pos[n])),
    Jn.forEach((n) => t.add(pos[n])),
    Nn.subVectors(i, t).normalize(),
    hl.set(1, 0, 0).addScaledVector(Nn, -Nn.x).normalize(),
    nh.crossVectors(Nn, hl));
  let e = 0;
  for (let n = 0; n < $e; n++) {
    let s = Math.atan2(ee.subVectors(pos[Jn[n]], se).dot(nh), ee.dot(hl)),
      r = Math.atan2(ee.subVectors(pos[Kn[n]], se).dot(nh), ee.dot(hl));
    e += ((r - s + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  }
  return e / $e;
}
var rf = THREE.MathUtils.degToRad(18),
  fa = 0,
  af = -10,
  Un = !0,
  of = 0,
  mi = 0,
  Vd = -1.6,
  Ux = 7 * (1 / 720) * (1 / 720),
  mh = Array.from(
    {
      length: 12,
    },
    () => new THREE.Vector3(),
  ),
  ra = 1,
  Qn = 1,
  kd = new THREE.Vector3(),
  rr = [1, -1];
function gh(i) {
  for (let e = 0; e < 12; e++) {
    for (let s = 0; s < 12; s++)
      (ee.subVectors(pos[s], we[s]).multiplyScalar(0.993), we[s].copy(pos[s]), pos[s].add(ee), mi > 0 && (pos[s].y -= Ux * mi));
    if ($n) {
      let s = $n.dir * 0.0032;
      (Kn.forEach((r) => {
        (ee.copy(pos[r]).sub(se).applyAxisAngle(Nn, s).add(se), pos[r].lerp(ee, 1));
      }),
        Jn.forEach((r) => {
          (ee
            .copy(pos[r])
            .sub(se)
            .applyAxisAngle(Nn, -s * 0.3)
            .add(se),
            pos[r].lerp(ee, 1));
        }));
    }
    if ((Ue && pos[Ue.node].lerp(Ue.target, 0.3), ra < 1))
      for (let s = 0; s < 12; s++) (kd.copy(mh[s]).lerp(homes[Yt][s], ra), pos[s].lerp(kd, 0.05));
    else if (homes[Yt] && rn > 0) for (let s = 0; s < 12; s++) pos[s].lerp(homes[Yt][s], Dx * rn);
    di >= 1 && U.squeeze && (U.despin(), U.squeeze());
    let n = Yt === 0 ? Ji : _s;
    for (let s = 0; s < 2; s++)
      (RING.forEach(([r, a]) => {
        cutSet.has(nr(r, a)) || ta(r, a, REST.ring * Qn, th * U.k(r, a), !0);
      }),
        STAR.forEach(([r, a]) => {
          cutSet.has(nr(r, a)) || ta(r, a, REST.star * Qn, th * U.k(r, a), !0);
        }),
        n.forEach(([r, a]) => {
          cutSet.has(nr(r, a)) || ta(r, a, REST.diag * yl * Qn, th * U.k(r, a), !0);
        }),
        STRUTS.forEach(([r, a], q) => ta(r, a, L * U.Ls[q], 1, !1)),
        Nx(),
        STRUTS.forEach(([r, a], q) => ta(r, a, L * U.Ls[q], 1, !1)));
    if (mi > 0)
      for (let s = 0; s < 12; s++)
        pos[s].y < Vd + 0.135 &&
          ((pos[s].y = Vd + 0.135),
          (we[s].x += (pos[s].x - we[s].x) * 0.3),
          (we[s].z += (pos[s].z - we[s].z) * 0.3),
          we[s].y < pos[s].y && (we[s].y = pos[s].y));
    (se.set(0, 0, 0),
      pos.forEach((s) => se.add(s)),
      se.multiplyScalar(1 / 12),
      (se.y -= of),
      se.multiplyScalar(0.5),
      (se.y *= 1 - mi),
      pos.forEach((s, r) => {
        (s.sub(se), we[r].sub(se));
      }));
  }
  ((fa = ir()), Un && fa * rr[Yt] < -rf && ((Yt = 1 - Yt), (af = i), (rn = 0), (yl = 1), di >= 1 && ar([12, 50, 22])));
}
function Fx() {
  let i = 9;
  for (let t = 0; t < $e; t++)
    for (let e = t + 1; e < $e; e++) {
      let [n, s] = STRUTS[t],
        [r, a] = STRUTS[e];
      (sf(pos[n], pos[s], pos[r], pos[a]), (i = Math.min(i, fh.distanceTo(ph))));
    }
  return i;
}
function lf(i) {
  let t = null;
  for (let e of [-2.1, 2.1]) {
    (nf(e).forEach((a, o) => {
      (pos[o].copy(a), we[o].copy(a));
    }),
      (Yt = i),
      (rn = 0),
      (Un = !1));
    for (let a = 0; a < 1200; a++) gh(0);
    let s = Fx(),
      r = ir();
    (!t || s > t.g) &&
      (t = {
        g: s,
        tw: r,
        P: pos.map((a) => a.clone()),
      });
  }
  return ((Un = !0), t);
}
var cf = [
    {
      g: 0.3904053015441785,
      tw: 2.097245793088457,
      P: [
        [-0.8318395473555963, -0.9887504618318099, -0.5063845324847914],
        [0.021398141087636265, -0.9845538080003919, -0.9778106901833356],
        [0.8552640237281818, -0.9846729709123547, -0.47425188860329476],
        [0.836748804555914, -0.9882879685981297, 0.4997239862316499],
        [-0.015948445460261834, -0.9912393487856112, 0.9716588737066896],
        [-0.8506837917396542, -0.9916792083181591, 0.4679978955559806],
        [-0.018341321870408385, 0.9852585639144834, 0.9773637626800659],
        [-0.8546689718258339, 0.984531092759567, 0.4765658316536339],
        [-0.8382712379641819, 0.9879903423008247, -0.497441759395947],
        [0.013142758061240368, 0.9914258446211767, -0.9707882707475597],
        [0.8496068244463143, 0.9912757793193213, -0.4707168892524774],
        [0.833592764336647, 0.9887021435310837, 0.5040836808393862],
      ],
    },
    {
      g: 0.39040530154417974,
      tw: -2.0972457930884576,
      P: [
        [-0.8337830215768013, -0.9857597891042428, -0.5093076453091352],
        [0.020726638698677947, -0.9844617106666654, -0.9784074113534754],
        [0.8532227337934705, -0.9874205576715258, -0.4725288326592221],
        [0.8319888711297293, -0.9909257073370268, 0.5013866421716862],
        [-0.02196305249267467, -0.9913459222878868, 0.9709710105491268],
        [-0.8553367871822701, -0.9892732435083145, 0.4650232390291995],
        [0.8564377677251047, 0.9893221079760712, -0.46234826672222423],
        [0.832626038392988, 0.9850541319666292, 0.5121719090426189],
        [-0.023024555330148255, 0.984602164836833, 0.9777528883226808],
        [-0.8544243674874509, 0.9877175618188643, 0.4700624974778207],
        [-0.8313238244499247, 0.9907397994512438, -0.5042480689419958],
        [0.02485355877929607, 0.9917511645260207, -0.9705279616070823],
      ],
    },
  ],
  hf = (i) => ({
    g: i.g,
    tw: i.tw,
    P: i.P.map((t) => new THREE.Vector3(t[0], t[1], t[2])),
  }),
  vl = qi.has("resettle") ? lf(0) : hf(cf[0]),
  Ml = qi.has("resettle") ? lf(1) : hf(cf[1]);
Un = !0;
homes[0] = vl.P;
homes[1] = Ml.P;
rr[0] = Math.sign(vl.tw);
rr[1] = Math.sign(Ml.tw);
homes[0].forEach((i, t) => {
  pos[t].copy(i);
});
window.__design = {
  gap0: vl.g,
  gap1: Ml.g,
  tw0: (vl.tw * 180) / Math.PI,
  tw1: (Ml.tw * 180) / Math.PI,
};
Yt = 0;
rn = 1;
pos.forEach((i, t) => we[t].copy(i));
var twistEq = Math.abs(ir()),
  Hd = "#0b6f78";
var XS = new THREE.MeshPhysicalMaterial({
    color: 15922421,
    metalness: 1,
    roughness: 0.07,
    envMapIntensity: 1.35,
    iridescence: 0.35,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [180, 420],
  }),
  qS = new THREE.MeshPhysicalMaterial({
    color: 13225940,
    metalness: 1,
    roughness: 0.22,
    anisotropy: 0.8,
    envMapIntensity: 1.2,
  });
function Ox() {
  let i = document.createElement("canvas");
  ((i.width = 64), (i.height = 64));
  let t = i.getContext("2d");
  ((t.fillStyle = "#8f989e"), t.fillRect(0, 0, 64, 64));
  for (let n = -64; n < 128; n += 16) {
    let s = t.createLinearGradient(n, 0, n + 16, 0);
    (s.addColorStop(0, "#5e676d"),
      s.addColorStop(0.45, "#d9dfe3"),
      s.addColorStop(0.6, "#c3cace"),
      s.addColorStop(1, "#5e676d"),
      t.save(),
      t.transform(1, 0, 1, 1, 0, 0),
      t.translate(-32, 0),
      (t.fillStyle = s),
      t.fillRect(n, 0, 16, 64),
      t.restore());
  }
  let e = new THREE.CanvasTexture(i);
  return ((e.wrapS = e.wrapT = THREE.RepeatWrapping), e.repeat.set(1, 5), (e.colorSpace = THREE.SRGBColorSpace), e);
}
var df = Ox(),
  _h = df.clone();
_h.colorSpace = THREE.NoColorSpace;
_h.needsUpdate = !0;
var Cl = new THREE.MeshPhysicalMaterial({
    color: 6252397,
    map: df,
    bumpMap: _h,
    bumpScale: 2.2,
    metalness: 1,
    roughness: 0.34,
    envMapIntensity: 1.15,
  }),
  Bx = Cl;
var ff = (i) => `500 ${i}px Montserrat, "Segoe UI", Arial, sans-serif`,
  sa = 0;
function zx(i) {
  if (sa) return sa;
  ((i.font = ff(100)), i.letterSpacing !== void 0 && (i.letterSpacing = "8px"));
  let t = Math.max(...dh.map((e) => i.measureText(e.toUpperCase()).width));
  return ((sa = Math.min(104, Math.floor((100 * (2048 * 0.62)) / t))), sa);
}
function xh(i) {
  let n = () => {
      let _ = document.createElement("canvas");
      return ((_.width = 2048), (_.height = 400), [_, _.getContext("2d")]);
    },
    [s, r] = n(),
    [a, o] = n(),
    [l, c] = n(),
    h = r.createLinearGradient(0, 0, 0, 400);
  if (
    (h.addColorStop(0, "#0f7f96"),
    h.addColorStop(0.5, "#1597ae"),
    h.addColorStop(1, "#0f7f96"),
    (r.fillStyle = h),
    r.fillRect(0, 0, 2048, 400),
    (o.fillStyle = "rgb(0,95,200)"),
    o.fillRect(0, 0, 2048, 400),
    (c.fillStyle = "#000"),
    c.fillRect(0, 0, 2048, 400),
    i)
  ) {
    let _ = zx(r),
      M = i.toUpperCase();
    for (let [m, f] of [
      [r, "#c4fdff"],
      [o, "rgb(0,170,0)"],
      [c, "#ffffff"],
    ])
      ((m.font = ff(_)),
        (m.textAlign = "center"),
        (m.textBaseline = "middle"),
        m.letterSpacing !== void 0 && (m.letterSpacing = "8px"),
        (m.fillStyle = f),
        m.save(),
        m.translate(2048 / 2, 400 / 2),
        m.scale(1, -1),
        m.fillText(M, 0, 6),
        m.restore());
  }
  let p = new THREE.CanvasTexture(s);
  p.colorSpace = THREE.SRGBColorSpace;
  let u = new THREE.CanvasTexture(a),
    d = new THREE.CanvasTexture(l);
  return (
    (d.colorSpace = THREE.SRGBColorSpace),
    (p.anisotropy = u.anisotropy = d.anisotropy = ve.capabilities.getMaxAnisotropy()),
    {
      map: p,
      mask: u,
      glow: d,
    }
  );
}
function Vx() {
  let i = [];
  for (let r = 0; r <= 80; r++) {
    let a = r / 80,
      o = Math.min(a, 1 - a),
      l = o < 0.045 ? 0.074 * (0.82 + 0.18 * Math.sin(((Math.PI / 2) * o) / 0.045)) : 0.074;
    i.push(new THREE.Vector2(l, a - 0.5));
  }
  (i.unshift(new THREE.Vector2(0, -0.5)), i.push(new THREE.Vector2(0, 0.5)));
  let n = new THREE.LatheGeometry(i, 72, Math.PI),
    s = n.attributes.uv;
  for (let r = 0; r < s.count; r++) {
    let a = s.getX(r),
      o = s.getY(r);
    s.setXY(r, o, a);
  }
  return (n.computeVertexNormals(), n);
}
var kx = Vx(),
  Hx = xh("");
function Gx() {
  dh.forEach((i, t) => {
    let e = xh(i),
      n = yh[t];
    (aa[t].map.dispose(),
      aa[t].mask.dispose(),
      (aa[t] = e),
      ml && ((n.map = e.map), (n.roughnessMap = n.metalnessMap = e.mask), (n.emissiveMap = e.glow), (n.needsUpdate = !0)));
  });
}
document.fonts &&
  document.fonts
    .load("500 100px Montserrat")
    .then(() => {
      ((sa = 0), setTimeout(Gx, 0));
    })
    .catch(() => {});
var Wx = (() => {
    let i = document.createElement("canvas");
    i.width = i.height = 256;
    let t = i.getContext("2d"),
      e = t.createImageData(256, 256);
    for (let s = 0; s < e.data.length; s += 4) {
      let r = 110 + Math.random() * 145 * (Math.random() < 0.18 ? 1 : 0.35);
      ((e.data[s] = e.data[s + 1] = e.data[s + 2] = r), (e.data[s + 3] = 255));
    }
    t.putImageData(e, 0, 0);
    let n = new THREE.CanvasTexture(i);
    return ((n.wrapS = n.wrapT = THREE.RepeatWrapping), n.repeat.set(10, 2), n);
  })(),
  aa = dh.map((i) => xh(i)),
  yh = aa.map(
    ({ map: i, mask: t, glow: e }) =>
      new THREE.MeshPhysicalMaterial({
        map: i,
        roughnessMap: t,
        metalnessMap: t,
        metalness: 1,
        roughness: 0.5,
        bumpMap: Wx,
        bumpScale: 0.6,
        emissive: new THREE.Color(6222069),
        emissiveMap: e,
        emissiveIntensity: 0.85,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        iridescence: 0.22,
        iridescenceIOR: 1.4,
        iridescenceThicknessRange: [300, 500],
        envMapIntensity: 1.1,
      }),
  ),
  struts = STRUTS.map((i, t) => {
    let e = new THREE.Mesh(kx, yh[t]);
    return ((e.castShadow = !0), (e.userData.strut = t), an.add(e), e);
  }),
  Xx = new THREE.SphereGeometry(0.135, 48, 32),
  qx = new THREE.MeshPhysicalMaterial({
    color: 10726321,
    metalness: 1,
    roughness: 0.1,
    clearcoat: 0.6,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.35,
  }),
  Yx = new THREE.MeshPhysicalMaterial({
    color: 726553,
    roughness: 0.06,
    metalness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.4,
  }),
  pf = pos.map((i, t) => {
    let e = new THREE.Mesh(Xx, qx);
    return ((e.castShadow = !0), (e.userData.node = t), an.add(e), e);
  }),
  mf = new THREE.SphereGeometry(0.1375, 72, 4, 0, Math.PI * 2, Math.PI / 2 - 0.07, 0.14);
mf.rotateX(Math.PI / 2);
var Gd = pos.map(() => {
    let i = new THREE.Mesh(mf, Yx);
    return (an.add(i), i);
  }),
  Zx = 0.135,
  YS = [...RING, ...STAR, ...Ji, ..._s],
  Jx = new THREE.MeshPhysicalMaterial({
    color: 678498,
    metalness: 0.1,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    transmission: 0.35,
    thickness: 0.06,
    ior: 1.5,
    attenuationColor: new THREE.Color(344906),
    attenuationDistance: 0.08,
    envMapIntensity: 1.3,
  }),
  Kx = new THREE.SphereGeometry(0.1372, 48, 10, 0, Math.PI * 2, 0, 0.3),
  pa = new THREE.InstancedMesh(Kx, Jx, 12);
pa.frustumCulled = !1;
pa.castShadow = !0;
an.add(pa);
var oa = new THREE.Vector3();
function Sl(i, t, e) {
  return (
    oa.subVectors(pos[da[i]], pos[i]).normalize(),
    e.subVectors(pos[t], pos[i]),
    e.addScaledVector(oa, -e.dot(oa)),
    e.lengthSq() < 1e-8 && e.set(1, 0, 0),
    e
      .normalize()
      .multiplyScalar(Zx * 1.02)
      .add(pos[i])
  );
}
var ki = 12;
function Pl(i, t, e) {
  let n = new THREE.InstancedMesh(new THREE.CylinderGeometry(e, e, 1, 8, 1, !0), t, i.length * ki);
  return ((n.frustumCulled = !1), (n.castShadow = !0), an.add(n), n);
}
var $x = Pl(RING, Cl, 0.0078),
  jx = Pl(STAR, Bx, 0.0078),
  wA = Pl(Ji, Cl.clone(), 0.0078),
  wB = Pl(_s, Cl.clone(), 0.0078);
wA.material.transparent = wB.material.transparent = !0;
var Mh = -1.6;
function Qx(i) {
  let t = document.createElement("canvas");
  t.width = t.height = 256;
  let e = t.getContext("2d"),
    n = e.createRadialGradient(128, 128, 0, 128, 128, 128);
  return (i.forEach(([s, r]) => n.addColorStop(s, r)), (e.fillStyle = n), e.fillRect(0, 0, 256, 256), new THREE.CanvasTexture(t));
}
var Il = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.ShadowMaterial({
    color: 0,
    opacity: 0.12,
  }),
);
Il.rotation.x = -Math.PI / 2;
Il.position.y = Mh;
Il.receiveShadow = !0;
an.add(Il);
var Hi = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    transparent: !0,
    depthWrite: !1,
    map: Qx([
      [0, "rgba(0,0,0,.16)"],
      [0.5, "rgba(0,0,0,.06)"],
      [1, "rgba(0,0,0,0)"],
    ]),
  }),
);
Hi.rotation.x = -Math.PI / 2;
Hi.position.y = Mh + 0.006;
Hi.renderOrder = 3;
an.add(Hi);
var ul = STRUTS.map(() => !1),
  ih = new THREE.Vector3(),
  sh = new THREE.Vector3(),
  Wd = new THREE.Vector3(),
  ms = new THREE.Vector3(),
  ea = new THREE.Vector3(),
  rh = new THREE.Vector3();
function ty(i, t, e) {
  (ih.copy(t).project(camera), sh.copy(e).project(camera));
  let n = (sh.x - ih.x) * camera.aspect,
    s = sh.y - ih.y,
    r = Math.hypot(n, s) + 1e-6;
  n / r > 0.12 ? (ul[i] = !1) : n / r < -0.12 && (ul[i] = !0);
  let a = ul[i] ? e : t,
    o = ul[i] ? t : e;
  ms.subVectors(o, a);
  let l = ms.length();
  (ms.multiplyScalar(1 / l),
    rh.addVectors(a, o).multiplyScalar(0.5),
    ea.subVectors(camera.position, rh),
    ea.addScaledVector(ms, -ea.dot(ms)).normalize(),
    Wd.crossVectors(ms, ea),
    sr.makeBasis(Wd, ms, ea));
  let c = struts[i];
  (c.quaternion.setFromRotationMatrix(sr), c.position.copy(rh), c.scale.set(1, l, 1));
  for (let h of STRUTS[i])
    (Gd[h].position.copy(pos[h]), ee.subVectors(pos[da[h]], pos[h]).normalize(), Gd[h].quaternion.setFromUnitVectors(ey, ee));
}
var Sh = new THREE.Vector3(0, 1, 0),
  ey = new THREE.Vector3(0, 0, 1),
  Tl = new THREE.Quaternion(),
  sr = new THREE.Matrix4(),
  gf = new THREE.Vector3(),
  vn = new THREE.Vector3(),
  zi = new THREE.Vector3(),
  ch = new THREE.Vector3(),
  jn = Array.from(
    {
      length: ki + 1,
    },
    () => new THREE.Vector3(),
  ),
  eqLen = [new Map(), new Map()],
  key = (i, t) => i * 16 + t;
[0, 1].forEach((i) =>
  [...RING, ...STAR, ...Ji, ..._s].forEach(([t, e]) => eqLen[i].set(key(t, e), homes[i][t].distanceTo(homes[i][e]))),
);
var Xd = new Map(),
  ny = new THREE.Vector3(),
  iy = new THREE.Vector3(),
  qd = new THREE.Vector3(0, -1, 0);
function sy(i, t, e, n, s) {
  let r = lh.get(i.id * 1e3 + t) ?? s;
  lh.set(i.id * 1e3 + t, r);
  let a = 1 - Math.pow(1 - Math.min(1, (s - r) * 1.6), 3);
  vn.subVectors(n, e);
  let o = vn.length();
  vn.multiplyScalar(1 / o);
  let l = o * (0.5 - 0.34 * a),
    c = ki / 2;
  [
    [e, 1, 0],
    [n, -1, c],
  ].forEach(([h, p, u]) => {
    for (let d = 0; d <= c; d++) {
      let _ = d / c;
      jn[d]
        .copy(h)
        .addScaledVector(vn, p * l * _)
        .addScaledVector(qd, 0.32 * a * _ * _)
        .addScaledVector(ch.crossVectors(vn, qd).normalize(), 0.06 * a * Math.sin(s * 2 + t) * _ * _);
    }
    for (let d = 0; d < c; d++) {
      ee.subVectors(jn[d + 1], jn[d]);
      let _ = ee.length();
      (Tl.setFromUnitVectors(Sh, ee.multiplyScalar(1 / Math.max(_, 1e-6))),
        Dn.addVectors(jn[d], jn[d + 1]).multiplyScalar(0.5),
        sr.compose(Dn, Tl, gf.set(1, _ * 1.05, 1)),
        i.setMatrixAt(t * ki + u + d, sr));
    }
  });
}
function dl(i, t, e, n) {
  (t.forEach(([s, r], a) => {
    let o = Sl(s, r, ny),
      l = Sl(r, s, iy);
    if (cutSet.has(nr(s, r))) {
      sy(i, a, o, l, n);
      return;
    }
    vn.subVectors(l, o);
    let c = vn.length();
    vn.multiplyScalar(1 / c);
    let h = pos[s].distanceTo(pos[r]);
    (zi.addVectors(o, l).multiplyScalar(0.5).sub(se),
      zi.addScaledVector(vn, -zi.dot(vn)),
      zi.lengthSq() < 1e-6 && zi.set(0, -1, 0),
      zi.normalize(),
      ch.crossVectors(vn, zi));
    let p = e ? eqLen[Yt].get(key(s, r)) : eqLen[t === Ji ? 0 : 1].get(key(s, r)),
      u = e ? Math.max(0, p - h - p * 0.006) : Math.max(0, p * 1.08 - h),
      d = Math.min(e ? 0.28 : 0.34, 0.55 * Math.sqrt(p * u)),
      _ = key(s, r),
      M = Xd.get(_) || {
        a: 0,
        l: h,
      };
    ((M.a = Math.min(0.045, M.a * 0.93 + (e && u === 0 ? Math.abs(h - M.l) * 0.9 : 0))), (M.l = h), Xd.set(_, M));
    let m = M.a * Math.sin(n * 38 + a * 1.7);
    for (let f = 0; f <= ki; f++) {
      let v = f / ki;
      jn[f]
        .copy(o)
        .addScaledVector(vn, c * v)
        .addScaledVector(zi, d * 4 * v * (1 - v))
        .addScaledVector(ch, m * Math.sin(Math.PI * v));
    }
    for (let f = 0; f < ki; f++) {
      ee.subVectors(jn[f + 1], jn[f]);
      let v = ee.length();
      (Tl.setFromUnitVectors(Sh, ee.multiplyScalar(1 / v)),
        Dn.addVectors(jn[f], jn[f + 1]).multiplyScalar(0.5),
        sr.compose(Dn, Tl, gf.set(1, v * 1.05, 1)),
        i.setMatrixAt(a * ki + f, sr));
    }
  }),
    (i.instanceMatrix.needsUpdate = !0));
}
var ml = !0,
  ry = -1,
  gl = 1,
  _l = 0;
function ay(i, t) {
  (camera.updateMatrixWorld(),
    se.set(0, 0, 0),
    pos.forEach((h) => se.add(h)),
    se.multiplyScalar(1 / 12),
    STRUTS.forEach(([h, p], u) => ty(u, pos[h], pos[p])));
  let e = 0,
    n = 1 / 0;
  pos.forEach((h) => {
    ((e = Math.max(e, Math.hypot(h.x - se.x, h.z - se.z))), (n = Math.min(n, h.y)));
  });
  let s = Math.max(0.2, n - Mh);
  ((Hi.position.x = se.x),
    (Hi.position.z = se.z),
    Hi.scale.setScalar(e * 2.6 + s * 0.8),
    (Hi.material.opacity = THREE.MathUtils.clamp(1.25 - s * 0.35, 0.35, 1)),
    pf.forEach((h, p) => h.position.copy(pos[p])));
  let r = new THREE.Matrix4(),
    a = new THREE.Quaternion(),
    o = new THREE.Vector3(),
    l = new THREE.Vector3(0, 0, 0),
    c = new THREE.Vector3(1, 1, 1);
  (pos.forEach((h, p) => {
    (oa.subVectors(h, pos[da[p]]).normalize(), a.setFromUnitVectors(Sh, oa), r.compose(h, a, c), pa.setMatrixAt(p, r));
  }),
    (pa.instanceMatrix.needsUpdate = !0),
    dl($x, RING, !0, i),
    dl(jx, STAR, !0, i),
    dl(wA, Ji, Yt === 0, i),
    dl(wB, _s, Yt === 1, i),
    (gl += ((Yt === 0 ? 1 : 0.14) - gl) * Math.min(1, t * 3)),
    (_l += ((Yt === 1 ? 1 : 0.14) - _l) * Math.min(1, t * 3)),
    (wA.material.opacity = gl),
    (wB.material.opacity = _l));
  U.render(i, t);
}
var bh = document.getElementById("profile"),
  le = bh.getContext("2d"),
  Al = Math.min(devicePixelRatio, 2);
bh.width = 280 * Al;
bh.height = 104 * Al;
le.scale(Al, Al);
var ah = -1,
  Yd = -1;
function Zd(i) {
  return 0.85 * (i * i - 1) * (i * i - 1) - 0 * i;
}
function oy(i) {
  let t = THREE.MathUtils.clamp((-fa * rr[0]) / twistEq, -1.6, 1.6);
  ah += (t - ah) * Math.min(1, i * 10);
  let e = 280,
    n = 104,
    s = (o) => e / 2 + o * 95,
    r = (o) => 94 - o * 66;
  (le.clearRect(0, 0, e, n), (le.lineWidth = 1.6), (le.strokeStyle = Hd), le.beginPath());
  for (let o = 0; o <= 140; o++) {
    let l = -1.45 + (2.9 * o) / 140,
      c = Zd(l);
    o ? le.lineTo(s(l), r(c)) : le.moveTo(s(l), r(c));
  }
  (le.stroke(),
    le.setLineDash([2, 4]),
    (le.strokeStyle = "rgba(11,111,120,.35)"),
    le.beginPath(),
    le.moveTo(s(0), r(0.85) + 8),
    le.lineTo(s(0), n - 16),
    le.stroke(),
    le.setLineDash([]));
  let a = THREE.MathUtils.clamp(ah, -1.45, 1.45);
  ((le.fillStyle = Hd),
    le.beginPath(),
    le.arc(s(a), r(Zd(a)) - 6, 5.6, 0, Math.PI * 2),
    le.fill(),
    (le.font = "600 9px Inter, Arial, sans-serif"),
    (le.fillStyle = "#6a7a80"),
    (le.textAlign = "center"),
    le.letterSpacing !== void 0 && (le.letterSpacing = "2px"),
    le.fillText("\u0411\u0410\u0420\u042C\u0415\u0420", s(0), r(0.85) - 10),
    Yd !== Yt &&
      ((Yd = Yt), document.querySelectorAll("[data-state]").forEach((o) => o.classList.toggle("on", +o.dataset.state === Yt))));
}
var Rl = new THREE.Raycaster(),
  Eh = new THREE.Vector2(),
  _f = new THREE.Plane(),
  oh = new THREE.Vector3(),
  qe = ve.domElement,
  xf = performance.now();
function gi() {
  xf = performance.now();
}
function yf(i) {
  Eh.set((i.clientX / innerWidth) * 2 - 1, -(i.clientY / innerHeight) * 2 + 1);
}
function vf() {
  Rl.setFromCamera(Eh, camera);
  let i = Rl.intersectObjects([...pf, ...struts], !1)[0];
  if (!i) return null;
  if (i.object.userData.node !== void 0) {
    let s = i.object.userData.node;
    return {
      node: s,
      strut: STRUTS.findIndex((r) => r.includes(s)),
    };
  }
  let t = i.object.userData.strut,
    [e, n] = STRUTS[t];
  return {
    node: i.point.distanceTo(pos[e]) < i.point.distanceTo(pos[n]) ? e : n,
    strut: t,
  };
}
var Gi = [],
  na = new THREE.Quaternion(),
  Wi = new THREE.Vector3(),
  ly = new THREE.Vector3(),
  Jd = new THREE.Vector3(),
  Kd = new THREE.Vector3(),
  sn = null;
function rotateModel(i) {
  let t = i.length();
  if (t < 1e-7) return;
  na.setFromAxisAngle(ly.copy(i).multiplyScalar(1 / t), t);
  let e = new THREE.Vector3();
  (pos.forEach((n) => e.add(n)), e.multiplyScalar(1 / 12));
  for (let n = 0; n < 12; n++) (pos[n].sub(e).applyQuaternion(na).add(e), we[n].sub(e).applyQuaternion(na).add(e));
  (homes.forEach((n) => n.forEach((s) => s.applyQuaternion(na))), mh.forEach((n) => n.applyQuaternion(na)));
}
var Mf = !qi.has("nohaptic"),
  Sf = typeof navigator < "u" && "vibrate" in navigator,
  xl = null;
if (Mf && !Sf && /iP(hone|ad|od)/.test(navigator.userAgent)) {
  let i = document.createElement("label"),
    t = document.createElement("input");
  ((t.type = "checkbox"),
    t.setAttribute("switch", ""),
    i.appendChild(t),
    (i.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none"),
    i.setAttribute("aria-hidden", "true"),
    document.body.appendChild(i),
    (xl = () => i.click()));
}
var $d = 0;
function ar(i) {
  if (!Mf || !window.__v4started) return;
  let t = performance.now();
  if (!(t - $d < 40)) {
    $d = t;
    try {
      Sf ? navigator.vibrate(i) : xl && (xl(), Array.isArray(i) && i.length > 2 && setTimeout(xl, 90));
    } catch {}
  }
}
var cy = +qi.get("spindecay") || 0.5,
  Xi = new Map(),
  fi = null,
  Th = -1e9,
  ma = new THREE.Vector3(),
  bf = () => {
    let [i, t] = [...Xi.values()];
    return {
      span: Math.max(20, Math.hypot(i.x - t.x, i.y - t.y)),
      ang: Math.atan2(t.y - i.y, t.x - i.x),
    };
  };
function hy(i) {
  ((i = THREE.MathUtils.clamp(i, ge.minDistance, ge.maxDistance)),
    ma.subVectors(camera.position, ge.target).setLength(i),
    camera.position.copy(ge.target).add(ma));
}
qe.addEventListener("pointerdown", (i) => {
  if (
    (Xi.set(i.pointerId, {
      x: i.clientX,
      y: i.clientY,
    }),
    Xi.size >= 2)
  ) {
    ((sn = null), Wi.set(0, 0, 0), Ue && ((Ue = null), (ge.enabled = !0)));
    let e = bf();
    ((fi = {
      span: e.span,
      ang: e.ang,
      dist: camera.position.distanceTo(ge.target),
    }),
      (Th = performance.now()),
      (pi = null),
      gi(),
      (qe.style.cursor = ""));
    return;
  }
  if (fi) return;
  (yf(i), gi());
  let t = vf();
  if (!t) {
    ((pi = null),
      (er = !1),
      Rh.classList.remove("on"),
      (sn = {
        x: i.clientX,
        y: i.clientY,
      }),
      Wi.set(0, 0, 0),
      qe.setPointerCapture(i.pointerId),
      (qe.style.cursor = "grabbing"));
    return;
  }
  ((ge.enabled = !1),
    _f.setFromNormalAndCoplanarPoint(camera.getWorldDirection(ee).clone(), pos[t.node]),
    (Ue = {
      node: t.node,
      target: pos[t.node].clone(),
      det: 0,
    }),
    (Gi.length = 0),
    ar(8),
    qe.setPointerCapture(i.pointerId),
    (qe.style.cursor = "grabbing"));
});
qe.addEventListener("pointermove", (i) => {
  if (
    (Xi.has(i.pointerId) &&
      Xi.set(i.pointerId, {
        x: i.clientX,
        y: i.clientY,
      }),
    fi)
  ) {
    if (Xi.size >= 2) {
      let t = bf();
      hy((fi.dist * fi.span) / t.span);
      let e = t.ang - fi.ang;
      ((e = Math.atan2(Math.sin(e), Math.cos(e))),
        (fi.ang = t.ang),
        camera.getWorldDirection(ma),
        rotateModel(ma.multiplyScalar(e)),
        (Th = performance.now()),
        gi());
    }
    return;
  }
  if ((yf(i), sn)) {
    let t = i.clientX - sn.x,
      e = i.clientY - sn.y;
    ((sn.x = i.clientX),
      (sn.y = i.clientY),
      Jd.setFromMatrixColumn(camera.matrixWorld, 0),
      Kd.setFromMatrixColumn(camera.matrixWorld, 1));
    let n = new THREE.Vector3().addScaledVector(Kd, t * 0.0065).addScaledVector(Jd, e * 0.0065);
    (rotateModel(n), Wi.lerp(n, 0.5), (sn.t = performance.now()), gi());
    return;
  }
  if (Ue)
    (Rl.setFromCamera(Eh, camera),
      Rl.ray.intersectPlane(_f, oh) &&
        (Ue.target.copy(oh), Gi.push([performance.now(), oh.clone()]), Gi.length > 6 && Gi.shift()),
      gi());
  else {
    let t = vf();
    ((ry = t ? t.strut : -1), (qe.style.cursor = t ? "grab" : ""));
  }
});
function Ef(i) {
  if ((Xi.delete(i.pointerId), fi)) {
    Xi.size === 0 && (fi = null);
    return;
  }
  if (sn) {
    (performance.now() - (sn.t || 0) > 90 && Wi.set(0, 0, 0), (sn = null), (qe.style.cursor = ""));
    try {
      qe.releasePointerCapture(i.pointerId);
    } catch {}
    return;
  }
  if (Ue) {
    if (Gi.length > 1) {
      let [t, e] = Gi[0],
        [n, s] = Gi[Gi.length - 1];
      if (performance.now() - n < 80) {
        let r = s
          .clone()
          .sub(e)
          .multiplyScalar(((1 / Math.max(16, n - t)) * 16.666666666666668) / 12)
          .clampLength(0, 0.03);
        we[Ue.node].copy(pos[Ue.node]).sub(r);
      }
    }
    ((Ue = null), (ge.enabled = !0), (qe.style.cursor = ""));
    try {
      qe.releasePointerCapture(i.pointerId);
    } catch {}
  }
}
qe.addEventListener("pointerup", Ef);
qe.addEventListener("pointercancel", Ef);
function activeCables() {
  return [...RING, ...STAR, ...(Yt === 0 ? Ji : _s)];
}
function nearestCable(i, t) {
  let e = null,
    n = 13,
    s = new THREE.Vector3(),
    r = new THREE.Vector3();
  for (let [a, o] of activeCables()) {
    if (cutSet.has(nr(a, o))) continue;
    (Sl(a, o, s).project(camera), Sl(o, a, r).project(camera));
    let l = ((s.x + 1) / 2) * innerWidth,
      c = ((1 - s.y) / 2) * innerHeight,
      h = ((r.x + 1) / 2) * innerWidth,
      p = ((1 - r.y) / 2) * innerHeight,
      u = h - l,
      d = p - c,
      _ = u * u + d * d || 1,
      M = THREE.MathUtils.clamp(((i - l) * u + (t - c) * d) / _, 0.1, 0.9),
      m = Math.hypot(l + u * M - i, c + d * M - t);
    m < n && ((n = m), (e = [a, o]));
  }
  return e;
}
var wf = document.getElementById("restore");
function Af() {
  wf.classList.toggle("show", cutSet.size > 0);
}
var ti = !1,
  ca = document.getElementById("status");
function uy() {
  let i = pos.map((r) => r.clone()),
    t = we.map((r) => r.clone()),
    e = [];
  for (let r = 0; r < 12; r++) for (let a = r + 1; a < 12; a++) e.push(homes[Yt][r].distanceTo(homes[Yt][a]));
  let n = {
    homeOn: rn,
    latchOn: Un,
    collapse: mi,
    restScale: Qn,
    state: Yt,
  };
  ((rn = 0), (Un = !1), (mi = 0), (Qn = 1));
  let s = 0;
  for (let r = 0; r < 3; r++) {
    for (let l = 0; l < 12; l++) we[l].sub(new THREE.Vector3().randomDirection().multiplyScalar(0.02));
    for (let l = 0; l < 240; l++) gh(0);
    let a = 0,
      o = 0;
    for (let l = 0; l < 12; l++)
      for (let c = l + 1; c < 12; c++) ((a = Math.max(a, Math.abs(pos[l].distanceTo(pos[c]) - e[o]) / e[o])), o++);
    s = Math.max(s, a);
  }
  return (
    pos.forEach((r, a) => {
      (r.copy(i[a]), we[a].copy(t[a]));
    }),
    (rn = n.homeOn),
    (Un = n.latchOn),
    (mi = n.collapse),
    (Qn = n.restScale),
    (Yt = n.state),
    s
  );
}
function dy(i, t) {
  ca && ((ca.textContent = i), (ca.className = "status show " + t));
}
function cutCable(i, t) {
  (cutSet.add(nr(i, t)), (rn = 0), (Un = !1));
  let e = uy();
  ((U.cutUnst = e > 0.12), (ti = U.cutUnst || U.needUnst),
    (window.__lastProbe = e),
    ee.subVectors(pos[t], pos[i]).normalize().multiplyScalar(0.025),
    we[i].add(ee),
    we[t].sub(ee),
    dy(
      ti
        ? "\u0421\u0432\u044F\u0437\u044C \u0440\u0430\u0437\u043E\u0440\u0432\u0430\u043D\u0430 \u2014 \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0430 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0441\u0442\u044C"
        : "\u0421\u0432\u044F\u0437\u044C \u0440\u0430\u0437\u043E\u0440\u0432\u0430\u043D\u0430 \u2014 \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u043F\u0435\u0440\u0435\u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u043B\u0430 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435 \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u043B\u0430 \u0446\u0435\u043B\u043E\u0441\u0442\u043D\u043E\u0441\u0442\u044C",
      ti ? "bad" : "ok",
    ),
    ar(ti ? [35, 40, 25, 40, 90] : [28, 60, 10]),
    Af(),
    gi());
}
function restoreAll() {
  cutSet.size &&
    (cutSet.clear(), lh.clear(), (Un = !U.needUnst), (U.cutUnst = !1), (ti = U.needUnst), ca && (ca.className = "status"), Af(), gi(), ar([10, 40, 10]));
}
qe.addEventListener("dblclick", (i) => {
  let t = nearestCable(i.clientX, i.clientY);
  t && cutCable(t[0], t[1]);
});
var tr = {
  t: 0,
  x: 0,
  y: 0,
};
qe.addEventListener("pointerup", (i) => {
  if (i.pointerType !== "touch") return;
  let t = performance.now();
  if (t - Th < 450) {
    tr.t = 0;
    return;
  }
  if (t - tr.t < 320 && Math.hypot(i.clientX - tr.x, i.clientY - tr.y) < 30) {
    let e = nearestCable(i.clientX, i.clientY);
    (e && cutCable(e[0], e[1]), (tr.t = 0));
    return;
  }
  tr = {
    t,
    x: i.clientX,
    y: i.clientY,
  };
});
wf.addEventListener("click", restoreAll);
window.addEventListener("keydown", (i) => {
  let t = i.key.toLowerCase();
  (t === "r" || t === "\u043A") && restoreAll();
});
function flipTo(i) {
  if (U.needUnst) return;
  (cutSet.size && restoreAll(),
    gi(),
    i !== Yt && ar(6),
    !(i === Yt || $n) &&
      ((rn = 0),
      ($n = {
        dir: rr[i],
        target: i,
      })));
}
document.querySelectorAll("[data-state]").forEach((i) => i.addEventListener("click", () => flipTo(+i.dataset.state)));
document.getElementById("flip").addEventListener("click", () => flipTo(1 - Yt));
var yn = null,
  er = !1,
  Rh = document.getElementById("top");
function Rf() {
  (gi(), (er = !er), Rh.classList.toggle("on", er), (pi = er ? "view" : "up"), Wi.set(0, 0, 0));
}
var pi = null,
  fy = new THREE.Vector3(0, 1, 0),
  ha = new THREE.Vector3(),
  ia = new THREE.Vector3();
function Cf(i, t) {
  (ir(), t === "view" ? ha.subVectors(camera.position, se).normalize() : ha.copy(fy), ia.copy(ha), t !== "up" && Nn.dot(ia) < 0 && ia.negate());
  let e = Nn.angleTo(ia);
  if (e > 0.002) {
    let n = new THREE.Vector3().crossVectors(Nn, ia);
    n.lengthSq() > 1e-10 && rotateModel(n.normalize().multiplyScalar(e * Math.min(1, i * 2.2)));
  }
  return e;
}
Rh.addEventListener("click", Rf);
window.addEventListener("keydown", (i) => {
  let t = i.key.toLowerCase();
  (t === " " && (i.preventDefault(), flipTo(1 - Yt)),
    (t === "v" || t === "\u043C") && Rf(),
    (t === "a" || t === "\u0444") && assemble(!0),
    (t === "h" || t === "\u0440") && document.body.classList.toggle("clean"),
    (t === "l" || t === "\u0434") &&
      ((ml = !ml),
      yh.forEach((e, n) => {
        let s = ml ? aa[n] : Hx;
        ((e.map = s.map), (e.roughnessMap = e.metalnessMap = s.mask), (e.emissiveMap = s.glow), (e.needsUpdate = !0));
      })),
    (t === "f" || t === "\u0430") &&
      (document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.()));
});
addEventListener("resize", () => {
  (tf(), ve.setSize(innerWidth, innerHeight));
});
var auto = {
  phase: "wander",
  t: 0,
  w: new THREE.Vector3(0, 0.25, 0),
  target: new THREE.Vector3(0, 0.25, 0),
  next: 0,
};
function py() {
  return new THREE.Vector3().randomDirection().multiplyScalar(0.18 + Math.random() * 0.14);
}
function my(i) {
  ((auto.t += i),
    auto.phase === "wander"
      ? (auto.t > auto.next && (auto.target.copy(py()), (auto.next = auto.t + 3 + Math.random() * 2)),
        auto.w.lerp(auto.target, Math.min(1, i * 0.6)),
        rotateModel(ee.copy(auto.w).multiplyScalar(i)),
        auto.t > 10 && ((auto.phase = "star"), (auto.t = 0)))
      : auto.phase === "star" &&
        (Cf(i, "view"), auto.w.multiplyScalar(0.9), auto.t > 6 && ((auto.phase = "wander"), (auto.t = 0), (auto.next = 0))));
}
var di = 1,
  hh = !1;
function assemble(i) {
  if (i) {
    (ir(), ha.subVectors(camera.position, se).normalize());
    let n = new THREE.Quaternion().setFromUnitVectors(Nn.clone(), ha),
      s = 2 * Math.acos(THREE.MathUtils.clamp(n.w, -1, 1));
    s > 1e-4 && rotateModel(new THREE.Vector3(n.x, n.y, n.z).normalize().multiplyScalar(s));
  }
  let t = homes[Yt];
  ir();
  let e = Nn.clone();
  (STRUTS.forEach(([n, s]) => {
    let r = t[n].clone().add(t[s]).multiplyScalar(0.5),
      a = r.clone().addScaledVector(e, -r.dot(e));
    (a.lengthSq() < 1e-4 && a.set(1, 0, 0).addScaledVector(e, -e.x), a.normalize());
    let o = a.clone().multiplyScalar(1.7 + Math.random() * 0.6),
      l = (Math.random() - 0.5) * 0.5;
    for (let c of [n, s]) {
      let h = t[c].clone().sub(r).applyAxisAngle(a, l);
      (pos[c].copy(r).add(o).add(h), we[c].copy(pos[c]), mh[c].copy(pos[c]));
    }
  }),
    (di = 0),
    (Un = !1),
    (rn = 0),
    i && ((hh = !0), (pi = null)));
}
var jd = performance.now(),
  fl = 0;
function Pf(i) {
  let t = Math.min(+qi.get("dtcap") || 0.05, (i - jd) / 1e3);
  jd = i;
  let e = i / 1e3;
  U.step(t);
  for (
    di < 1 &&
      ((di = Math.min(1, di + t / 2.2)),
      (ra = 1 - Math.pow(1 - di, 3)),
      (Qn = 1 + 0.9 * (1 - ra)),
      di >= 1 &&
        ((ra = 1),
        (Qn = 1),
        (Un = !cutSet.size),
        hh &&
          ((hh = !1),
          setTimeout(() => {
            pi = "up";
          }, 700)))),
      fl = Math.min(fl + t, (+qi.get("cap") || 4) / 60);
    fl >= 1 / 60;
  )
    ($n && Yt !== $n.target && (yl = Math.min(1.42, yl + 0.012)),
      (of = 0.06 * Math.sin(e * 0.8)),
      gh(e),
      $n && Yt === $n.target && fa * rr[Yt] > rf * 1.6 && ($n = null),
      (mi += ((ti ? 1 : 0) - mi) * (ti ? 0.05 : 0.03)),
      di >= 1 && (Qn += ((ti ? 1.14 : U.Qt) - Qn) * 0.03),
      cutSet.size || U.needUnst ? (rn = 0) : !$n && e - af > 0.4 && (rn = Math.min(U.pull, rn + 0.01)),
      (fl -= 1 / 60));
  if (yn) {
    yn.t = Math.min(1, yn.t + t / 1.6);
    let n = yn.t < 0.5 ? 4 * yn.t ** 3 : 1 - (-2 * yn.t + 2) ** 3 / 2,
      s = new THREE.Spherical(yn.from.radius, THREE.MathUtils.lerp(yn.from.phi, yn.to.phi, n), yn.from.theta);
    (camera.position.setFromSpherical(s).add(ge.target), yn.t >= 1 && (yn = null));
  }
  if (
    (sn ||
      (Wi.lengthSq() > 1e-9 &&
        (rotateModel(ma.copy(Wi).multiplyScalar(Math.min(3, t * 60))), Wi.multiplyScalar(Math.exp(-t * cy)))),
    pi && !sn)
  ) {
    let n = Cf(t, pi);
    pi === "up" && n < 0.004 && (pi = null);
  }
  if (
    (!Ue && !sn && !er && di >= 1 && !ti && performance.now() - xf > 7e3 ? my(t) : ((auto.phase = "wander"), (auto.t = 0)),
    Ue && homes[Yt])
  ) {
    let n = Math.floor(pos[Ue.node].distanceTo(homes[Yt][Ue.node]) / 0.28);
    (n > Ue.det && ar(n > 3 ? 9 : 5), (Ue.det = n));
  }
  (ge.update(), ay(e, t), oy(t), ve.render(an, camera), requestAnimationFrame(Pf));
}
var UNST_SLACK = +qi.get("slack") || 1.14;

// =====================================================================
// СЦЕНАРИИ · физика тенсегрити
// Каждый трос — пружина (закон Гука): F = k·max(0, l − l0).
// Ресурс компонента i → жёсткость тросов у его концов и «распор» стержня i.
// Баланс потребностей → длина покоя тросов, т.е. предварительное натяжение.
// Форма каждый кадр находится из равновесия сил (решатель v4).
// Ослабление одного элемента → нагрузка уходит на соседей (взаимокомпенсация),
// форма меняется, но равновесие сохраняется. Перегруженные узлы устают;
// при низком балансе усталость не восстанавливается → каскад → потеря жёсткости.
// =====================================================================
var COMP = dh.slice(),
  NC = COMP.length,
  CAB = [];
RING.forEach(([a, b]) => CAB.push({ a, b, t: "ring", g: 0, k: 0 }));
STAR.forEach(([a, b]) => CAB.push({ a, b, t: "star", g: 1, k: 0 }));
Ji.forEach(([a, b]) => CAB.push({ a, b, t: "diag", g: 2, s: 0, k: 0 }));
_s.forEach(([a, b]) => CAB.push({ a, b, t: "diag", g: 3, s: 1, k: 0 }));
CAB.forEach((c, i) => {
  c.i = [RING, STAR, Ji, _s][c.g].findIndex(([a, b]) => a === c.a && b === c.b);
  c.f = 0; // сила (нормированная к норме)
  c.F = 0; // сила (сырая)
});
U = {
  Qt: 1,
  bal: 9, load: 5, cl: 5, comp: [9, 9, 9, 9, 9, 9],
  cb: 9, cc: [9, 9, 9, 9, 9, 9],
  h: [1, 1, 1, 1, 1, 1],   // «здоровье» узлов: падает при перегрузке (усталость)
  kc: [1, 1, 1, 1, 1, 1],  // жёсткость тросов у стержня i
  Ls: [1, 1, 1, 1, 1, 1],  // распор стержня i
  F0: 0, f0n: 0, D0: [], dev: 0,           // эталон силы в норме
  margin: 1, tautN: 30, maxF: 1,
  pull: 1, collapsed: !1, cutUnst: !1, needUnst: !1, hot: -1, cascade: 0,
  k(r, a) { return 0.5 * (U.kc[r % 6] + U.kc[a % 6]); },
  jitter() {},
};
U.comp = [9, 9, 9, 9, 9, 9];
var M_CRIT = 0.02, M_BACK = 0.5, DEV_MAX = +qi.get("dev") || 0.15;
var eff = (i) => U.cc[i] * U.h[i];

// ---------- интерфейс ----------
var uRows = document.getElementById("rows"),
  uTval = document.getElementById("tval"),
  uTbar = document.getElementById("tbar"),
  uLval = document.getElementById("lval"),
  uLbar = document.getElementById("lbar"),
  uText = document.getElementById("baltext"),
  uCap = document.getElementById("caption"),
  uChain = document.getElementById("chain"),
  uVl = [],
  uPlay = document.getElementById("play");
function mkRow(label, cls, getv, setv, idx) {
  let row = document.createElement("div");
  row.className = "row " + cls;
  row.innerHTML = `<span class="nm">${label}</span><span class="tr"><input type="range" min="0" max="10" step="1" value="${getv()}" aria-label="${label.replace(/<[^>]+>/g, "")}"><b class="hp"></b></span><span class="vl"></span>`;
  uRows.appendChild(row);
  let inp = row.querySelector("input"), vl = row.querySelector(".vl"), hp = row.querySelector(".hp");
  let sync = () => {
    inp.value = getv();
    inp.style.setProperty("--v", getv() * 10 + "%");
  };
  inp.addEventListener("input", () => { uStop(); setv(+inp.value); sync(); uMark(null); gi(); });
  row.addEventListener("pointerenter", () => { U.hot = idx; });
  row.addEventListener("pointerleave", () => { U.hot === idx && (U.hot = -1); });
  sync();
  uVl.push({ sync, vl, hp, idx, row });
}
mkRow("Профессиональная нагрузка", "load", () => U.load, (v) => (U.load = v), -3);
mkRow("Баланс потребностей", "bal", () => U.bal, (v) => (U.bal = v), -2);
COMP.forEach((n, k) => mkRow(`<i>${k + 1}</i>${n}`, "comp", () => U.comp[k], (v) => (U.comp[k] = v), k));
var SCEN = {
  ok:       { load: 5, bal: 9, comp: [9, 9, 9, 9, 9, 9], t: "Норма: нагрузка распределена по всем связям поровну, каркас в равновесии" },
  load:     { load: 5, bal: 9, comp: [9, 9, 9, 3, 9, 9], t: "Один компонент просел: его связи разгрузились, соседи взяли нагрузку на себя. Форма изменилась — устойчивость сохранилась" },
  two:      { load: 6, bal: 8, comp: [9, 9, 9, 3, 3, 9], t: "Просели два соседних компонента: компенсация работает на пределе, соседние связи перегружены" },
  deficit:  { load: 6, bal: 4, comp: [9, 9, 9, 3, 3, 9], t: "Та же нагрузка, но потребности не удовлетворены: предварительное натяжение падает, каркас мягче и сильнее деформируется, усталость узлов не восстанавливается" },
  burnout:  { load: 7, bal: 2, comp: [6, 5, 5, 3, 3, 6], t: "Истощение: предварительное натяжение потеряно, компенсировать нечем — каркас складывается" },
};
var SC_IDS = ["ok", "load", "two", "deficit", "burnout"];
function uMark(id) { document.querySelectorAll("[data-sc]").forEach((b) => b.classList.toggle("on", b.dataset.sc === id)); }
function uApply(id, quiet) {
  let p = SCEN[id];
  if (!p) return;
  quiet || uStop();
  U.bal = p.bal; U.load = p.load; U.comp = p.comp.slice();
  id === "ok" && (U.h = U.h.map(() => 1));
  uVl.forEach((r) => r.sync()); uMark(id); uCap.textContent = p.t; gi();
}
document.querySelectorAll("[data-sc]").forEach((b) => b.addEventListener("click", () => uApply(b.dataset.sc)));
window.addEventListener("keydown", (e) => {
  if (e.target && e.target.tagName === "INPUT") return;
  let k = e.key;
  /^[1-5]$/.test(k) && uApply(SC_IDS[+k - 1]);
  (k === "p" || k === "з") && uToggle();
});
var uSheet = document.getElementById("sheet");
uSheet && uSheet.addEventListener("click", () => document.body.classList.toggle("map"));

// показ: норма → один → два → дефицит → истощение → восстановление
var TL = [[0, "ok"], [5, "load"], [12, "two"], [19, "deficit"], [28, "burnout"], [35, "ok"]],
  uT = -1, uBar = document.getElementById("tl"), uStep0 = -1;
function uToggle() { uT < 0 ? ((uT = 0), uPlay && (uPlay.textContent = "Стоп")) : uStop(); }
function uStop() { uT >= 0 && ((uT = -1), uPlay && (uPlay.textContent = "Показать сценарий"), uBar && uBar.style.setProperty("--p", "0%")); }
uPlay && uPlay.addEventListener("click", uToggle);

var CHAIN = [
  ["Баланс потребностей", ["удовлетворяются в меру", "перекос", "не удовлетворяются"]],
  ["Ресурсы идентичности", ["в норме", "часть ресурсов просела", "истощаются"]],
  ["Взаимокомпенсация", ["нагрузка распределена равномерно", "соседние элементы берут нагрузку на себя", "компенсировать нечем"]],
  ["Устойчивость профессионального Я", ["форма и равновесие сохранены", "форма изменилась, равновесие сохранено", "равновесие потеряно"]],
  ["Психологическое благополучие", ["поддерживается", "поддерживается ценой напряжения", "нарушено"]],
];
uChain.innerHTML = CHAIN.map((c) => `<li><i></i><div><b>${c[0]}</b><span></span></div></li>`).join("");
var uChainSig = "";
function uChainUpdate() {
  let dead = ti,
    minE = Math.min(...U.cc.map((v, i) => eff(i))),
    lv = [
      U.cb >= 7 ? 0 : U.cb >= 4 ? 1 : 2,
      dead || U.cascade > 0.05 ? 2 : minE < 7 ? 1 : 0,
      dead ? 2 : U.maxF > 1.15 ? 1 : 0,
      dead ? 2 : U.maxF > 1.15 || minE < 7 ? 1 : 0,
      0,
    ];
  lv[4] = Math.max(lv[2], lv[3]);
  let sig = lv.join("");
  if (sig === uChainSig) return;
  uChainSig = sig;
  [...uChain.children].forEach((li, n) => { li.className = "s" + lv[n]; li.querySelector("span").textContent = CHAIN[n][1][lv[n]]; });
}
var uLastTxt = "";
function uStatus() {
  let txt, cls = "";
  ti
    ? ((txt = U.cutUnst ? "Связь разорвана — каркас потерял жёсткость" : "Деформация превысила предел — жёсткость потеряна, каркас сложился"), (cls = "bad"))
    : U.cascade > 0.05
      ? ((txt = "Каскад: перегруженные узлы устают и передают слабость дальше"), (cls = "bad"))
      : U.maxF > 1.15
        ? ((txt = "Взаимокомпенсация: нагрузка перераспределилась, равновесие сохранено"), (cls = "warn"))
        : (txt = "Равновесие: силы распределены равномерно");
  txt !== uLastTxt && ((uLastTxt = txt), (uText.textContent = txt), (uText.className = cls));
  let m = ti ? 0 : Math.round(100 * U.margin), l = ti ? 0 : Math.round(100 * (U.maxF - 1));
  uTval.textContent = m + "%";
  uTbar.style.setProperty("--t", m + "%");
  uTbar.classList.toggle("bad", ti || U.margin < 0.5);
  uLval.textContent = (l > 0 ? "+" : "") + l + "%";
  uLbar.style.setProperty("--t", Math.min(100, Math.max(0, l)) + "%");
  uVl.forEach((r) => {
    if (r.idx === -2) { r.vl.textContent = U.bal; return; }
    if (r.idx === -3) { r.vl.textContent = U.load; return; }
    let e = eff(r.idx), tired = U.h[r.idx] < 0.97;
    r.vl.textContent = tired ? Math.round(e) : U.comp[r.idx];
    r.vl.classList.toggle("tired", tired);
    r.hp.style.width = (tired ? 100 * (1 - U.h[r.idx]) : 0) + "%";
  });
  uChainUpdate();
}


// ---------- гашение вращения целиком ----------
// Несимметричные силы раскручивают каркас; убираем из скоростей узлов вращение тела
// как целого (момент импульса), деформации остаются. Вращение мышью идёт отдельно.
var uI = new THREE.Matrix3(), uL = new THREE.Vector3(), uW = new THREE.Vector3(), uC = new THREE.Vector3(),
  uR = new THREE.Vector3(), uV = new THREE.Vector3(), uX = new THREE.Vector3();
var DESPIN = qi.has("despin") ? +qi.get("despin") : 1;
U.despin = function () {
  if (!DESPIN) return;
  // гасим только там, где каркас не притягивается к своей форме (иначе спорим с притяжением)
  // и не трогаем перещёлкивание: там поворот — часть перехода в другое состояние
  if ($n || U.flipT > 0) return;
  let k = (Ue ? 0.08 : Math.max(0, 1 - rn)) * DESPIN;
  uC.set(0, 0, 0);
  pos.forEach((p) => uC.add(p));
  uC.multiplyScalar(1 / 12);
  uL.set(0, 0, 0);
  let xx = 0, yy = 0, zz = 0, xy = 0, xz = 0, yz = 0;
  for (let n = 0; n < 12; n++) {
    uR.subVectors(pos[n], uC);
    uV.subVectors(pos[n], we[n]);
    uL.add(uX.crossVectors(uR, uV));
    xx += uR.x * uR.x; yy += uR.y * uR.y; zz += uR.z * uR.z;
    xy += uR.x * uR.y; xz += uR.x * uR.z; yz += uR.y * uR.z;
  }
  uI.set(yy + zz, -xy, -xz, -xy, xx + zz, -yz, -xz, -yz, xx + yy);
  if (Math.abs(uI.determinant()) < 1e-9) return;
  uW.copy(uL).applyMatrix3(uI.invert()).multiplyScalar(k);
  for (let n = 0; n < 12; n++) {
    uR.subVectors(pos[n], uC);
    we[n].add(uX.crossVectors(uW, uR)); // v -= ω×r  ⇔  prev += ω×r
  }
};

// ---------- внешняя нагрузка: осевое сжатие каркаса ----------
var uA = new THREE.Vector3(), uB2 = new THREE.Vector3(), uDir = new THREE.Vector3();
U.squeeze = function () {
  if (!U.P) return;
  (uA.set(0, 0, 0), uB2.set(0, 0, 0), Jn.forEach((n) => uA.add(pos[n])), Kn.forEach((n) => uB2.add(pos[n])));
  uDir.subVectors(uB2, uA).normalize().multiplyScalar(U.P);
  (Kn.forEach((n) => pos[n].sub(uDir)), Jn.forEach((n) => pos[n].add(uDir)));
};

// ---------- силы ----------
var uLen = new THREE.Vector3();
function uRest(c) { return REST[c.t] * Qn * (c.t === "diag" ? yl : 1); }
// измерение: силы в активных тросах и попарные расстояния узлов в текущем состоянии
function uMeasure() {
  let F = [], D = [], sum = 0, n = 0, taut = 0;
  CAB.forEach((c, i) => {
    let act = (c.t !== "diag" || c.s === Yt) && !cutSet.has(nr(c.a, c.b));
    c.act = act;
    if (!act) { F[i] = 0; return; }
    let l = pos[c.a].distanceTo(pos[c.b]), r = uRest(c), x = Math.max(0, l - r) / r;
    F[i] = U.k(c.a, c.b) * x;
    sum += F[i]; n++;
    x > 2e-4 && taut++;
  });
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) D.push(pos[a].distanceTo(pos[b]));
  return { F, D, taut, mean: sum / Math.max(1, n) };
}
// эталон нормы для каждого из двух устойчивых состояний: считается один раз в фоне,
// на отдельном прогоне физики с нормальными параметрами (нагрузка 5, все ресурсы 9)
U.R = [null, null];
function uCalib(state) {
  let save = {
    pos: pos.map((p) => p.clone()), we: we.map((p) => p.clone()),
    Yt, rn, Un, mi, Qn, yl, $n, Ue, kc: U.kc.slice(), Ls: U.Ls.slice(), P: U.P,
  };
  U.kc.fill(1); U.Ls.fill(1); U.P = 0.5 * (+qi.get("P") || 0.02);
  Yt = state; rn = 0.12; Un = !1; mi = 0; Qn = 1; yl = 1; $n = null; Ue = null;
  homes[state].forEach((h, i) => { pos[i].copy(h); we[i].copy(h); });
  for (let s = 0; s < 900; s++) gh(0);
  U.R[state] = uMeasure();
  save.pos.forEach((p, i) => pos[i].copy(p)); save.we.forEach((p, i) => we[i].copy(p));
  Yt = save.Yt; rn = save.rn; Un = save.Un; mi = save.mi; Qn = save.Qn; yl = save.yl; $n = save.$n; Ue = save.Ue;
  U.kc = save.kc; U.Ls = save.Ls; U.P = save.P;
}
function uForces() {
  if (!U.R[0]) (uCalib(0), uCalib(1));
  let m = uMeasure(), R = U.R[Yt], mx = 0, dev = 0;
  U.tautN = m.taut;
  for (let q = 0; q < m.D.length; q++) dev = Math.max(dev, Math.abs(m.D[q] - R.D[q]) / R.D[q]);
  U.dev += (dev - U.dev) * 0.15;
  CAB.forEach((c, i) => {
    c.F = m.F[i];
    c.f = c.act && R.F[i] ? m.F[i] / R.F[i] : 0;
    c.act && (mx = Math.max(mx, c.f));
  });
  U.maxF += (Math.max(1, mx) - U.maxF) * 0.15;
  // запас устойчивости: насколько форма далека от предела деформации и сколько тросов держат
  let tf = THREE.MathUtils.clamp((m.taut - 16) / 12, 0, 1);
  U.margin = THREE.MathUtils.clamp(1 - U.dev / DEV_MAX, 0, 1) * tf;
}

// ---------- шаг ----------
U.step = function (dt) {
  dt = Math.min(dt, 0.05);
  if (uT >= 0) {
    uT += dt;
    let cur = TL[0];
    for (const f of TL) uT >= f[0] && (cur = f);
    cur[1] !== uStep0 && ((uStep0 = cur[1]), uApply(cur[1], !0));
    uBar && uBar.style.setProperty("--p", Math.min(100, (uT / TL[TL.length - 1][0]) * 100) + "%");
    uT > TL[TL.length - 1][0] + 5 && uStop();
  } else uStep0 = -1;
  let k = 1 - Math.exp(-dt * 3);
  for (let j = 0; j < NC; j++) U.cc[j] += (U.comp[j] - U.cc[j]) * k;
  U.cb += (U.bal - U.cb) * k;
  U.cl += (U.load - U.cl) * k;
  // параметры механики
  let balDef = Math.max(0, 9 - U.cb) / 9, worst = balDef;
  for (let j = 0; j < NC; j++) {
    let w = Math.min(1, eff(j) / 9), d = 1 - w;
    U.kc[j] = 0.12 + 0.88 * w * w;
    U.Ls[j] = 1 - 0.03 * d;
    worst = Math.max(worst, d);
  }
  // перещёлкивание: на время перехода и 3 с после него каркас фиксируется в новом состоянии
  // после перехода (и после восстановления) каркас 3 с держится в своём состоянии, затем за 1,5 с отпускается
  Yt !== U.lastYt && ((U.lastYt = Yt), (U.flipT = 4.5));
  U.flipT = Math.max(0, (U.flipT || 0) - dt);
  let base = qi.has("pull") ? +qi.get("pull") : 0.12;
  U.pull = $n ? 1 : base + (1 - base) * Math.min(1, U.flipT / 1.5);
  // нагрузка снимается на время перещёлкивания (иначе сжатие не даёт призме перейти во второе состояние)
  U.lw = THREE.MathUtils.clamp((U.lw ?? 1) + ($n ? -dt * 4 : dt / 1.5), 0, 1);
  U.P = U.lw * (U.cl / 10) * (+qi.get("P") || 0.02);
  U.Qt = 1 + 0.075 * balDef * balDef;
  if (di >= 1) uForces();
  // усталость: перегрузка истощает узел; восстановление идёт из баланса потребностей
  let casc = 0;
  for (let j = 0; j < NC; j++) {
    let o = 0;
    CAB.forEach((c) => { c.act && (c.a % 6 === j || c.b % 6 === j) && (o = Math.max(o, c.f)); });
    let wear = $n || U.flipT > 0 ? 0 : Math.max(0, o - 1.15) * 0.06,
      heal = 0.3 * Math.pow(Math.max(0, U.cb - 2) / 7, 2);
    let dh = (heal * (1 - U.h[j]) - wear) * dt;
    U.h[j] = Math.min(1, Math.max(0.25, U.h[j] + dh));
    dh < -1e-4 && (casc += -dh / dt);
  }
  U.cascade += (casc - U.cascade) * 0.1;
  // потеря жёсткости: мало тросов под натяжением → механизм складывается
  let flipping = $n || U.flipT > 0;
  flipping && (U.margin = Math.max(U.margin, 0.5));
  if (!U.needUnst && di >= 1 && !flipping && U.margin < M_CRIT) {
    ((U.needUnst = !0), (Un = !1), (rn = 0));
    ar([35, 40, 25, 40, 90]);
  } else if (U.needUnst) {
    // восстановление: ресурсы и баланс должны вернуться выше, чем порог падения
    let ok = U.cb >= 6 && U.cc.every((v, i) => eff(i) >= 5);
    ok && ((U.needUnst = !1), (U.margin = M_BACK), (U.flipT = 4.5), U.cutUnst || ((Un = !cutSet.size), ca && (ca.className = "status")), ar([10, 40, 10]));
  }
  ti = U.cutUnst || U.needUnst;
  // стержни: тускнеют с ресурсом
  yh.forEach((m, i) => {
    let w = Math.min(1, eff(i) / 9), hot = U.hot === i;
    m.color.copy(uGray).lerp(uBase[i], w * w);
    m.emissiveIntensity = (0.05 + 0.8 * w * w) * (hot ? 2 : 1);
  });
  uStatus();
};
var uBase = yh.map((m) => m.color.clone()),
  uGray = new THREE.Color(0x4a4f52);

// ---------- цвет тросов по силе ----------
var C_SLACK = new THREE.Color(0xc9d6dc),
  C_NORM = new THREE.Color(1, 1, 1),
  C_HI = new THREE.Color(0xf2a33a),
  C_MAX = new THREE.Color(0xe0442e),
  uCol = new THREE.Color(),
  uMeshes = [$x, jx, wA, wB];
// материал тросов делаем светлее, чтобы цвет экземпляра читался; «норма» = прежний графит
var uCableBase = new THREE.Color(6252397);
[Cl, wA.material, wB.material].forEach((m) => m.color.set(0xffffff));
U.render = function () {
  CAB.forEach((c) => {
    let f = c.f;
    if (!c.act || di < 1) uCol.copy(uCableBase);
    else if (f < 0.35) uCol.copy(C_SLACK).lerp(uCableBase, f / 0.35);
    else if (f <= 1.1) uCol.copy(uCableBase);
    else if (f < 1.6) uCol.copy(uCableBase).lerp(C_HI, (f - 1.1) / 0.5);
    else uCol.copy(C_HI).lerp(C_MAX, Math.min(1, (f - 1.6) / 0.6));
    let m = uMeshes[c.g];
    for (let s = 0; s < ki; s++) m.setColorAt(c.i * ki + s, uCol);
  });
  uMeshes.forEach((m) => m.instanceColor && (m.instanceColor.needsUpdate = !0));
};
window.__u = U;
window.__cab = CAB;
Object.defineProperty(window, "__qn", { get: () => Qn });
// отладка: прогнать физику n шагов по 1/60 с (для измерений)
window.__ff = function (n) {
  for (let s = 0; s < n; s++) {
    U.step(1 / 60);
    $n && Yt !== $n.target && (yl = Math.min(1.42, yl + 0.012));
    gh(s / 60);
    $n && Yt === $n.target && fa * rr[Yt] > rf * 1.6 && ($n = null);
    mi += ((ti ? 1 : 0) - mi) * (ti ? 0.05 : 0.03);
    di >= 1 && (Qn += ((ti ? 1.14 : U.Qt) - Qn) * 0.03);
    cutSet.size || U.needUnst ? (rn = 0) : !$n && (rn = Math.min(U.pull, rn + 0.01));
  }
};
window.__sc = (id) => uApply(id);
window.__pos = pos;

ve.debug.checkShaderErrors = qi.has("debug");
ve.domElement.style.opacity = "0";
ve.domElement.style.transition = "opacity .6s ease";
var Qd = !1,
  uh = () => {
    Qd ||
      ((Qd = !0),
      (window.__v4started = !0),
      (ve.domElement.style.opacity = "1"),
      qi.has("still") || assemble(!0),
      requestAnimationFrame(Pf));
  };
(ve.compileAsync ? ve.compileAsync(an, camera) : Promise.resolve()).then(uh, uh);
setTimeout(uh, 4e3);
window.__t3 = {
  auto: auto,
  probe: () => window.__lastProbe,
  get unstable() {
    return ti;
  },
  cutCable: cutCable,
  restoreAll: restoreAll,
  nearestCable: nearestCable,
  activeCables: activeCables,
  cutSet: cutSet,
  rotateModel: rotateModel,
  assemble: assemble,
  eqLen: eqLen,
  RING: RING,
  STAR: STAR,
  REST: REST,
  key: key,
  wA: wA,
  wB: wB,
  struts: struts,
  aActiveRef: () => [gl, _l],
  pos: pos,
  homes: homes,
  STRUTS: STRUTS,
  L: L,
  camera: camera,
  flipTo: flipTo,
  get state() {
    return Yt;
  },
  get twist() {
    return fa;
  },
  twistEq: twistEq,
};
