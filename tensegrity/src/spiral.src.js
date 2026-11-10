import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

var ms = [
    "\u0424\u0438\u0437\u0438\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435",
    "\u0412 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438",
    "\u0412 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u043D\u043E\u0441\u0442\u0438 \u0438 \u043B\u044E\u0431\u0432\u0438",
    "\u0412 \u043F\u0440\u0438\u0437\u043D\u0430\u043D\u0438\u0438",
    "\u0412 \u043F\u043E\u0437\u043D\u0430\u043D\u0438\u0438 \u0438 \u043F\u043E\u043D\u0438\u043C\u0430\u043D\u0438\u0438",
    "\u042D\u0441\u0442\u0435\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435",
    "\u0412 \u0441\u0430\u043C\u043E\u0430\u043A\u0442\u0443\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438",
    "\u0412 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435\u0441\u0431\u0435\u0440\u0435\u0433\u0430\u044E\u0449\u0435\u043C \u043E\u0431\u0440\u0430\u0437\u0435 \u0436\u0438\u0437\u043D\u0438",
  ],
  pc = new URLSearchParams(location.search),
  be = new THREE.WebGLRenderer({
    antialias: !0,
    preserveDrawingBuffer: !0,
  });
be.setPixelRatio(Math.min(devicePixelRatio, 2));
be.setSize(innerWidth, innerHeight);
be.outputColorSpace = THREE.SRGBColorSpace;
be.toneMapping = THREE.ACESFilmicToneMapping;
be.shadowMap.enabled = !0;
be.shadowMap.type = THREE.VSMShadowMap;
document.getElementById("app").appendChild(be.domElement);
var Ln = new THREE.Scene();
Ln.background = new THREE.Color(16777215);
Ln.environment = new THREE.PMREMGenerator(be).fromScene(new RoomEnvironment(), 0.03).texture;
var ze = new THREE.PerspectiveCamera(22, innerWidth / innerHeight, 0.1, 100);
ze.position.set(0, 1.7, 14.2);
var Ci = new OrbitControls(ze, be.domElement);
Ci.enableRotate = !1;
Ci.enablePan = !1;
Ci.enableDamping = !0;
Ci.minDistance = 8;
Ci.maxDistance = 22;
Ci.target.set(0, 0.05, 0);
function ku() {
  let i = innerWidth,
    t = innerHeight,
    e = i / t;
  ((ze.aspect = e),
    (ze.fov = Math.max(22, 2 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(THREE.MathUtils.degToRad(e < 1 ? 8.2 : 13)) / e)))),
    e > 1.25 ? ze.setViewOffset(i, t, -i * (t < 560 ? 0.2 : 0.17), 0, i, t) : ze.setViewOffset(i, t, 0, -t * 0.02, i, t),
    ze.updateProjectionMatrix());
}
ku();
var Pi = new THREE.DirectionalLight(16777215, 2.2);
Pi.position.set(0.8, 10, 1.2);
Pi.castShadow = !0;
Pi.shadow.mapSize.set(512, 512);
Pi.shadow.radius = 16;
Pi.shadow.blurSamples = 14;
Object.assign(Pi.shadow.camera, {
  left: -3,
  right: 3,
  top: 3,
  bottom: -3,
});
Ln.add(Pi);
var Gu = new THREE.DirectionalLight(15136503, 0.6);
Gu.position.set(-5, 3, 4);
Ln.add(Gu);
Ln.add(new THREE.HemisphereLight(16777215, 14937840, 0.45));
var ke = new THREE.Group();
Ln.add(ke);
var o0 = (() => {
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
    return ((n.wrapS = n.wrapT = THREE.RepeatWrapping), n.repeat.set(60, 2), n);
  })(),
  l0 = new THREE.MeshPhysicalMaterial({
    color: 1415086,
    metalness: 0.8,
    roughness: 0.38,
    bumpMap: o0,
    bumpScale: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    iridescence: 0.2,
    iridescenceIOR: 1.4,
    envMapIntensity: 1.1,
  }),
  c0 = new THREE.MeshPhysicalMaterial({
    color: 14673128,
    metalness: 1,
    roughness: 0.28,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.2,
  }),
  h0 = new THREE.MeshPhysicalMaterial({
    color: 10726321,
    metalness: 1,
    roughness: 0.08,
    clearcoat: 0.6,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.35,
  }),
  Pu = new THREE.MeshPhysicalMaterial({
    color: 15267832,
    metalness: 0,
    roughness: 0.04,
    transparent: !0,
    opacity: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide,
    depthWrite: !1,
  }),
  u0 = new THREE.MeshPhysicalMaterial({
    color: 13620955,
    metalness: 1,
    roughness: 0.25,
    envMapIntensity: 1.1,
  }),
  Po = new THREE.MeshBasicMaterial({
    color: new THREE.Color(5435592),
    toneMapped: !1,
    transparent: !0,
  }),
  Vu = new THREE.MeshPhysicalMaterial({
    color: 10483679,
    roughness: 0.05,
    transparent: !0,
    opacity: 0.35,
    clearcoat: 1,
    depthWrite: !1,
  }),
  gs = -1.55,
  mc = 2.15,
  Pn = 1.85;
{
  let i = [
      [-Pn, -Pn],
      [Pn, -Pn],
      [Pn, Pn],
      [-Pn, Pn],
    ].map(([o, l]) => new THREE.Vector3(o, gs, l)),
    t = new THREE.Vector3(0, mc, 0),
    e = [];
  for (let o = 0; o < 4; o++) {
    let l = i[o],
      c = i[(o + 1) % 4];
    e.push(l.x, l.y, l.z, c.x, c.y, c.z, t.x, t.y, t.z);
  }
  let n = new THREE.BufferGeometry();
  (n.setAttribute("position", new THREE.Float32BufferAttribute(e, 3)), n.computeVertexNormals());
  let s = new THREE.Mesh(n, Pu);
  ((s.renderOrder = 5), ke.add(s));
  let r = new THREE.Mesh(new THREE.BoxGeometry(Pn * 2, 0.06, Pn * 2), Pu.clone());
  ((r.material.opacity = 0.28), (r.position.y = gs - 0.03), (r.renderOrder = 4), ke.add(r));
  let a = (o, l) => {
    let c = new THREE.Vector3().subVectors(l, o),
      h = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, c.length(), 8), u0);
    (h.position.copy(o).add(l).multiplyScalar(0.5),
      h.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.normalize()),
      (h.castShadow = !0),
      ke.add(h));
  };
  for (let o = 0; o < 4; o++) (a(i[o], i[(o + 1) % 4]), a(i[o], t));
}
var d0 = 4.25,
  Iu = gs + 0.32,
  f0 = mc - 0.62,
  p0 = 0.92,
  Hu = 0.052,
  gc = 420,
  De = 0,
  sc = 0,
  Sr = 0;
function oc(i, t, e, n) {
  let s = 1 + 0.5 * De * (i === 0 ? -1 : 1),
    r = Math.abs(De) * 0.14 * Math.sin(t * Math.PI * 9 + e * 2.2 + i * 1.7) * (i === 0 ? Math.max(0, -De) : Math.max(0, De)) * 2,
    a = p0 * (1 - t * 0.86) * s + r,
    o = 2 * Math.PI * d0 * t + i * Math.PI,
    l = Iu + (f0 - Iu) * t,
    c = Wu(t);
  return n.set(c.x + a * Math.cos(o), l, c.z + a * Math.sin(o));
}
var m0 = new THREE.Vector3();
function Wu(i) {
  return m0.set(De * 0.42 * Math.sin(Math.PI * i), 0, De * 0.12 * Math.sin(Math.PI * i));
}
var Io = class extends THREE.Curve {
    constructor(t) {
      (super(), (this.s = t), (this.time = 0));
    }
    getPoint(t, e = new THREE.Vector3()) {
      return oc(this.s, t, this.time, e);
    }
  },
  lc = [new Io(0), new Io(1)],
  Xu = [l0, c0].map((i, t) => {
    let e = new THREE.Mesh(new THREE.TubeGeometry(lc[t], gc, Hu, 14, !1), i);
    return ((e.castShadow = !0), ke.add(e), e);
  });
function g0(i) {
  Xu.forEach((t, e) => {
    lc[e].time = i;
    let n = new THREE.TubeGeometry(lc[e], gc, Hu, 14, !1),
      s = t.geometry.drawRange;
    (t.geometry.dispose(), (t.geometry = n), n.setDrawRange(s.start, s.count));
  });
}
var cc = class extends THREE.Curve {
    getPoint(t, e = new THREE.Vector3()) {
      let n = gs + 0.05 + (mc - 0.35 - gs) * t,
        s = Wu(t);
      return e.set(s.x, n, s.z);
    }
  },
  _s = new cc(),
  yr = new THREE.Mesh(new THREE.TubeGeometry(_s, 60, 0.03, 12, !1), Po);
ke.add(yr);
var xs = new THREE.Mesh(new THREE.TubeGeometry(_s, 60, 0.075, 16, !1), Vu);
xs.renderOrder = 6;
ke.add(xs);
var wo = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 32), Po);
ke.add(wo);
function _0() {
  (yr.geometry.dispose(),
    (yr.geometry = new THREE.TubeGeometry(_s, 60, 0.03, 12, !1)),
    xs.geometry.dispose(),
    (xs.geometry = new THREE.TubeGeometry(_s, 60, 0.075, 16, !1)));
}
var Lu = ms.map((i, t) => 0.04 + (0.92 * t) / (ms.length - 1)),
  x0 = new THREE.SphereGeometry(0.135, 48, 32),
  balls = ms.map((i, t) => {
    let e = new THREE.Mesh(x0, h0.clone());
    return ((e.castShadow = !0), (e.userData.level = t), ke.add(e), e);
  }),
  y0 = new THREE.TorusGeometry(0.2, 0.008, 8, 64),
  Ao = new THREE.MeshBasicMaterial({
    color: new THREE.Color(4188639),
    toneMapped: !1,
    transparent: !0,
    opacity: 0,
  }),
  Ro = new THREE.Mesh(y0, Ao);
ke.add(Ro);
var v0 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(12582390).multiplyScalar(1.3),
    toneMapped: !1,
  }),
  M0 = Array.from(
    {
      length: 6,
    },
    (i, t) => {
      let e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), v0);
      return (
        ke.add(e),
        {
          m: e,
          s: t % 2,
          t: t / 6,
        }
      );
    },
  ),
  qu = gs - 0.62,
  Do = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({
      color: 0,
      opacity: 0.11,
    }),
  );
Do.rotation.x = -Math.PI / 2;
Do.position.y = qu;
Do.receiveShadow = !0;
Ln.add(Do);
var _c = new THREE.Mesh(
  new THREE.PlaneGeometry(6.5, 6.5),
  new THREE.MeshBasicMaterial({
    transparent: !0,
    depthWrite: !1,
    map: (() => {
      let i = document.createElement("canvas");
      i.width = i.height = 256;
      let t = i.getContext("2d"),
        e = t.createRadialGradient(128, 128, 0, 128, 128, 128);
      return (
        e.addColorStop(0, "rgba(0,0,0,.14)"),
        e.addColorStop(0.5, "rgba(0,0,0,.05)"),
        e.addColorStop(1, "rgba(0,0,0,0)"),
        (t.fillStyle = e),
        t.fillRect(0, 0, 256, 256),
        new THREE.CanvasTexture(i)
      );
    })(),
  }),
);
_c.rotation.x = -Math.PI / 2;
_c.position.y = qu + 0.003;
Ln.add(_c);
var S0 = document.getElementById("labels"),
  b0 = document.getElementById("leaders"),
  Du = ms.map((i) => {
    let t = document.createElement("div");
    return ((t.className = "lbl"), (t.textContent = i), S0.appendChild(t), t);
  }),
  Nu = ms.map(() => {
    let i = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    return (b0.appendChild(i), i);
  }),
  Xe = -1,
  hc = !0,
  rc = 0,
  Yu = -1e9,
  Zu = () => innerWidth < 900 || innerHeight < 560,
  ys = be.domElement,
  Co = 0.35,
  Lo = 0,
  xr = 0,
  uc = 0,
  gn = null,
  br = -1e9,
  Uu = new THREE.Raycaster(),
  Fu = new THREE.Vector2();
function Ju(i) {
  (Fu.set((i.clientX / innerWidth) * 2 - 1, -(i.clientY / innerHeight) * 2 + 1), Uu.setFromCamera(Fu, ze));
  let t = Uu.intersectObjects(balls, !1)[0];
  return t ? t.object.userData.level : -1;
}
ys.addEventListener("pointerdown", (i) => {
  ((gn = {
    x: i.clientX,
    y: i.clientY,
    moved: 0,
  }),
    ys.setPointerCapture(i.pointerId),
    (br = performance.now()));
});
ys.addEventListener("pointermove", (i) => {
  if (gn) {
    let t = i.clientX - gn.x,
      e = i.clientY - gn.y;
    ((gn.x = i.clientX),
      (gn.y = i.clientY),
      (gn.moved += Math.abs(t) + Math.abs(e)),
      (Lo = t * 0.006),
      (uc = e * 0.004),
      (Co += Lo),
      (xr = THREE.MathUtils.clamp(xr + uc, -0.5, 0.6)),
      (br = performance.now()));
  } else ((Xe = Ju(i)), (ys.style.cursor = Xe >= 0 ? "pointer" : "grab"));
});
ys.addEventListener("pointerup", (i) => {
  if (gn && gn.moved < 6) {
    let t = Ju(i);
    ((Xe = t === Xe && i.pointerType === "touch" ? -1 : t), (Yu = performance.now()));
  }
  gn = null;
  try {
    ys.releasePointerCapture(i.pointerId);
  } catch {}
});
var Mr = document.getElementById("balance"),
  ac = document.getElementById("baltext"),
  E0 = document.getElementById("meter");
Mr.addEventListener("input", () => {
  ((Sr = +Mr.value / 100), (br = performance.now()));
});
document.getElementById("reset").addEventListener("click", () => {
  ((Mr.value = 0), (Sr = 0), (br = performance.now()));
});
document.getElementById("regrow").addEventListener("click", () => {
  In = 0;
});
window.addEventListener("keydown", (i) => {
  let t = i.key.toLowerCase();
  ((t === "h" || t === "\u0440") && document.body.classList.toggle("clean"),
    (t === "l" || t === "\u0434") && (hc = !hc),
    (t === "f" || t === "\u0430") &&
      (document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.()),
    (t === "a" || t === "\u0444") && (In = 0),
    t === "0" && ((Mr.value = 0), (Sr = 0)));
});
addEventListener("resize", () => {
  (ku(), be.setSize(innerWidth, innerHeight));
});
function T0() {
  let i = Math.abs(De);
  (E0.style.setProperty("--pos", 50 + De * 50 + "%"),
    i < 0.06
      ? (ac.textContent =
          "\u0420\u0430\u0432\u043D\u043E\u0432\u0435\u0441\u0438\u0435: \u043F\u043E\u0442\u0440\u0435\u0431\u043D\u043E\u0441\u0442\u0438 \u0443\u0434\u043E\u0432\u043B\u0435\u0442\u0432\u043E\u0440\u044F\u044E\u0442\u0441\u044F \u0432 \u043C\u0435\u0440\u0443 \u2014 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435")
      : (ac.textContent =
          (De < 0
            ? "\u041F\u0435\u0440\u0435\u043A\u043E\u0441 \u0432 \u0441\u0442\u043E\u0440\u043E\u043D\u0443 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438"
            : "\u041F\u0435\u0440\u0435\u043A\u043E\u0441 \u0432 \u0441\u0442\u043E\u0440\u043E\u043D\u0443 \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E\u0441\u0442\u0438") +
          (i > 0.6
            ? " \u2014 \u0440\u0430\u0432\u043D\u043E\u0432\u0435\u0441\u0438\u0435 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u043E"
            : " \u2014 \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u044F\u0435\u0442\u0441\u044F")),
    ac.classList.toggle("off", i >= 0.06));
}
var In = pc.has("still") ? 1 : 0,
  dc = performance.now(),
  Ou = 99;
var Bu = new THREE.Vector3(),
  w0 = new THREE.Vector3();
function Ku(i) {
  let t = Math.min(+pc.get("dtcap") || 0.05, (i - dc) / 1e3);
  dc = i;
  let e = i / 1e3;
  ((sc += (Sr - De) * 60 * t), (sc *= Math.exp(-7 * t)), (De += sc * t));
  let n = performance.now() - br > 6e3;
  (gn || ((Co += Lo), (Lo *= 0.95), (uc *= 0.9), n && ((Co += t * 0.25), (xr += (0.08 - xr) * t * 0.8))),
    ke.rotation.set(xr, Co, 0),
    In < 1 && (In = Math.min(1, In + t / 2.4)));
  let s = 1 - Math.pow(1 - In, 3);
  ((Math.abs(De - Ou) > 1e-4 || Math.abs(De) > 0.02) && (g0(e), _0(), (Ou = De)),
    Xu.forEach((c) => c.geometry.setDrawRange(0, Math.floor(s * gc) * 14 * 6)));
  let a = Math.max(0.12, 1 - Math.abs(De) * 1.3);
  (Po.color.setRGB(0.32 * a + 0.08, 0.94 * a + 0.12, 0.78 * a + 0.12),
    (Po.opacity = 0.5 + 0.5 * a),
    (Vu.opacity = 0.12 + 0.28 * a),
    (yr.scale.y = xs.scale.y = 1),
    (yr.visible = xs.visible = In > 0.2));
  let o = _s.getPoint(1, Bu),
    l = _s.getPoint(0.97, w0);
  (wo.position.copy(o).add(new THREE.Vector3(0, 0.12, 0)),
    wo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bu.clone().sub(l).normalize()),
    (wo.visible = In > 0.9),
    balls.forEach((c, h) => {
      oc(h % 2, Lu[h], e, c.position);
      let f = THREE.MathUtils.clamp((s - Lu[h]) * 8, 0, 1);
      (c.scale.setScalar(f * (h === Xe ? 1.18 : 1)), c.material.color.setHex(h === Xe ? 14220280 : 10726321));
    }),
    Xe >= 0
      ? (Ro.position.copy(balls[Xe].position),
        Ro.lookAt(ze.position.clone().applyMatrix4(ke.matrixWorld.clone().invert())),
        Ro.scale.setScalar(1 + 0.12 * Math.sin(e * 4)),
        (Ao.opacity += (0.9 - Ao.opacity) * 0.2))
      : (Ao.opacity *= 0.85),
    M0.forEach((c) => {
      ((c.t += t * (0.09 + 0.06 * a)),
        c.t > 1 && (c.t -= 1),
        oc(c.s, c.t, e, c.m.position),
        (c.m.visible = In >= 1 && c.t < s),
        c.m.scale.setScalar(0.6 + 0.4 * a));
    }),
    Zu() && performance.now() - Yu > 8e3 && In >= 1 && (Xe = Math.floor(e / 2.6) % ms.length),
    T0(),
    Ci.update(),
    ke.updateMatrixWorld(),
    A0(t),
    be.render(Ln, ze),
    requestAnimationFrame(Ku));
}
function A0(i) {
  (ze.updateMatrixWorld(), (rc += ((hc ? 1 : 0) - rc) * Math.min(1, i * 4)));
  let t = innerWidth,
    e = innerHeight,
    s = ((new THREE.Vector3(0, 0.2, 0).applyMatrix4(ke.matrixWorld).project(ze).x + 1) / 2) * t,
    r = ze.position,
    a = balls.map((h, f) => {
      let u = h.getWorldPosition(new THREE.Vector3()),
        d = u.clone().project(ze),
        _ = ((d.x + 1) / 2) * t,
        v = ((1 - d.y) / 2) * e,
        m =
          u
            .clone()
            .sub(new THREE.Vector3(0, u.y, 0).applyMatrix4(new THREE.Matrix4()))
            .dot(r.clone().setY(0).normalize()) < -0.05;
      return {
        k: f,
        x: _,
        y: v,
        right: _ >= s,
        back: m,
        scale: h.scale.x,
      };
    }),
    o = {
      true: s + Math.min(t, e) * 0.3,
      false: s - Math.min(t, e) * 0.3,
    },
    l = document.querySelector(".left"),
    c = l && getComputedStyle(l).opacity !== "0" ? l.getBoundingClientRect() : null;
  a.forEach((h) => {
    h.w = Du[h.k].offsetWidth;
    let f = o[!1],
      u = c && f - h.w - 24 < c.right + 12 && h.y > c.top - 10 && h.y < c.bottom + 10;
    !h.right && (f - h.w < 24 || u) && (h.right = !0);
  });
  for (let h of [!0, !1]) {
    let f = a.filter((d) => d.right === h).sort((d, _) => d.y - _.y),
      u = -1e9;
    f.forEach((d) => {
      ((d.ly = Math.max(d.y, u + 26)), (u = d.ly));
    });
  }
  a.forEach((h) => {
    let f = Du[h.k],
      u = h.w,
      d = o[h.right];
    h.right ? (d = Math.min(d, t - u - 24)) : (d = Math.max(d, u + 24));
    let _ = rc * Math.min(1, h.scale) * (Zu() ? (Xe === h.k ? 1 : 0) : Xe === -1 ? (h.back ? 0.45 : 1) : Xe === h.k ? 1 : 0.25);
    ((f.style.transform = `translate(${h.right ? d + 8 : d - 8}px, ${h.ly}px) translate(${h.right ? "0" : "-100%"}, -50%)`),
      (f.style.opacity = _.toFixed(3)),
      f.classList.toggle("hot", Xe === h.k),
      Nu[h.k].setAttribute("points", `${h.x},${h.y} ${h.right ? h.x + 14 : h.x - 14},${h.ly} ${d},${h.ly}`),
      (Nu[h.k].style.opacity = (_ * 0.7).toFixed(3)));
  });
}
be.debug.checkShaderErrors = pc.has("debug");
be.domElement.style.opacity = "0";
be.domElement.style.transition = "opacity .6s ease";
var zu = !1,
  fc = () => {
    zu || ((zu = !0), (be.domElement.style.opacity = "1"), (dc = performance.now()), requestAnimationFrame(Ku));
  };
(be.compileAsync ? be.compileAsync(Ln, ze) : Promise.resolve()).then(fc, fc);
setTimeout(fc, 4e3);
window.__sp = {
  get bal() {
    return De;
  },
  setBal: (i) => {
    ((Mr.value = i * 100), (Sr = i));
  },
  balls: balls,
  setHover: (i) => {
    Xe = i;
  },
};
