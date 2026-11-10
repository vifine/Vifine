
// =====================================================================
// ЕДИНАЯ МОДЕЛЬ: двойная спираль потребностей внутри тенсегрити.
// Равновесие «необходимость / достаточность» по 8 уровням (Карта ресурсов)
// управляет натяжением тросов каркаса; обрыв связи гасит ось здоровья.
// =====================================================================
var NEEDS = [
    "Физиологические",
    "Безопасность",
    "Принадлежность и любовь",
    "Признание",
    "Познание и понимание",
    "Эстетические",
    "Самоактуализация",
    "Здоровьесбережение",
  ],
  NB = NEEDS.length,
  BASE = 7,
  D_CRIT = 0.3,
  D_BACK = 0.24,
  PRESETS = {
    balance: { nec: [7, 7, 7, 7, 7, 7, 7, 7], suf: [7, 7, 7, 7, 7, 7, 7, 7] },
    skew: { nec: [10, 7, 7, 7, 7, 7, 7, 7], suf: [3, 7, 7, 7, 7, 7, 7, 7] },
    burnout: { nec: [10, 9, 9, 7, 7, 7, 7, 9], suf: [3, 2, 2, 10, 7, 5, 10, 1] },
  };
var U = {
  s: 0,
  D: 0,
  bend: 0,
  hs: 1,
  grow: 0,
  fade: 1,
  hover: -1,
  sel: -1,
  needUnst: !1,
  cutUnst: !1,
  nec: PRESETS.balance.nec.slice(),
  suf: PRESETS.balance.suf.slice(),
  cn: PRESETS.balance.nec.slice(),
  cs: PRESETS.balance.suf.slice(),
  jitter(prev) {
    let a = 0.0011 * U.s * U.s;
    for (let k = 0; k < 12; k++)
      ((prev[k].x += (Math.random() - 0.5) * a), (prev[k].y += (Math.random() - 0.5) * a), (prev[k].z += (Math.random() - 0.5) * a));
  },
};

// ---------- геометрия ядра (в долях полувысоты каркаса) ----------
var uCb = new THREE.Vector3(),
  uCt = new THREE.Vector3();
Jn.forEach((n) => uCb.add(homes[0][n]));
Kn.forEach((n) => uCt.add(homes[0][n]));
var H0 = uCt.multiplyScalar(1 / 6).distanceTo(uCb.multiplyScalar(1 / 6)),
  HH = H0 / 2,
  PYR_A = 0.42,
  PYR_VB = -0.96,
  PYR_VA = 1.38,
  SP_V0 = -0.8,
  SP_V1 = 0.9,
  SP_R = 0.3,
  SP_TURNS = 4.25,
  SP_SEG = 320,
  SP_RAD = 10,
  SP_TUBE = 0.022,
  AX_V0 = -0.93,
  AX_V1 = 1.1,
  LEVEL_T = NEEDS.map((i, t) => 0.04 + (0.92 * t) / (NB - 1));

var core = new THREE.Group();
an.add(core);
var pyr = new THREE.Group();
core.add(pyr);

var uNoise = (() => {
    let c = document.createElement("canvas");
    c.width = c.height = 256;
    let x = c.getContext("2d"),
      d = x.createImageData(256, 256);
    for (let s = 0; s < d.data.length; s += 4) {
      let r = 110 + Math.random() * 145 * (Math.random() < 0.18 ? 1 : 0.35);
      ((d.data[s] = d.data[s + 1] = d.data[s + 2] = r), (d.data[s + 3] = 255));
    }
    x.putImageData(d, 0, 0);
    let t = new THREE.CanvasTexture(c);
    return ((t.wrapS = t.wrapT = THREE.RepeatWrapping), t.repeat.set(60, 2), t);
  })(),
  mNec = new THREE.MeshPhysicalMaterial({
    color: 1415086,
    metalness: 0.8,
    roughness: 0.38,
    bumpMap: uNoise,
    bumpScale: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    iridescence: 0.2,
    iridescenceIOR: 1.4,
    envMapIntensity: 1.1,
  }),
  mSuf = new THREE.MeshPhysicalMaterial({
    color: 14673128,
    metalness: 1,
    roughness: 0.28,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.2,
  }),
  mBall = new THREE.MeshPhysicalMaterial({
    color: 10726321,
    metalness: 1,
    roughness: 0.08,
    clearcoat: 0.6,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.35,
  }),
  mGlass = new THREE.MeshPhysicalMaterial({
    color: 15267832,
    metalness: 0,
    roughness: 0.04,
    transparent: !0,
    opacity: 0.13,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide,
    depthWrite: !1,
  }),
  mBase = mGlass.clone(),
  mEdge = new THREE.MeshPhysicalMaterial({
    color: 13620955,
    metalness: 1,
    roughness: 0.25,
    envMapIntensity: 1.1,
    transparent: !0,
  }),
  mAxis = new THREE.MeshBasicMaterial({ color: new THREE.Color(5435592), toneMapped: !1, transparent: !0 }),
  mHalo = new THREE.MeshPhysicalMaterial({
    color: 10483679,
    roughness: 0.05,
    transparent: !0,
    opacity: 0.35,
    clearcoat: 1,
    depthWrite: !1,
  }),
  mRing = new THREE.MeshBasicMaterial({ color: new THREE.Color(4188639), toneMapped: !1, transparent: !0, opacity: 0 }),
  mPulse = new THREE.MeshBasicMaterial({ color: new THREE.Color(12582390).multiplyScalar(1.3), toneMapped: !1 });
mBase.opacity = 0.24;

// стеклянная пирамида: основание у нижнего шестиугольника, вершина над верхним
{
  let yb = PYR_VB * HH,
    ya = PYR_VA * HH,
    b = [
      [-PYR_A, -PYR_A],
      [PYR_A, -PYR_A],
      [PYR_A, PYR_A],
      [-PYR_A, PYR_A],
    ].map(([x, z]) => new THREE.Vector3(x, yb, z)),
    apex = new THREE.Vector3(0, ya, 0),
    v = [];
  for (let k = 0; k < 4; k++) {
    let p = b[k],
      q = b[(k + 1) % 4];
    v.push(p.x, p.y, p.z, q.x, q.y, q.z, apex.x, apex.y, apex.z);
  }
  let g = new THREE.BufferGeometry();
  (g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3)), g.computeVertexNormals());
  let faces = new THREE.Mesh(g, mGlass);
  ((faces.renderOrder = 5), pyr.add(faces));
  let plate = new THREE.Mesh(new THREE.BoxGeometry(PYR_A * 2, 0.016, PYR_A * 2), mBase);
  ((plate.position.y = yb - 0.008), (plate.renderOrder = 4), pyr.add(plate));
  let edge = (p, q) => {
    let d = new THREE.Vector3().subVectors(q, p),
      m = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, d.length(), 8), mEdge);
    (m.position.copy(p).add(q).multiplyScalar(0.5), m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), pyr.add(m));
  };
  for (let k = 0; k < 4; k++) (edge(b[k], b[(k + 1) % 4]), edge(b[k], apex));
}

// профиль значения уровня вдоль нити
function uProf(arr, t) {
  let x = THREE.MathUtils.clamp(((t - 0.04) / 0.92) * (NB - 1), 0, NB - 1),
    k = Math.min(NB - 2, Math.floor(x)),
    f = x - k;
  return ((f = f * f * (3 - 2 * f)), arr[k] + (arr[k + 1] - arr[k]) * f);
}
var uOff = new THREE.Vector3();
function uAxisOff(t) {
  let b = Math.sin(Math.PI * THREE.MathUtils.clamp(t, 0, 1)) * U.bend;
  return uOff.set(b * 0.11, 0, b * 0.035);
}
// i = 0 — «необходимость», i = 1 — «достаточность»: радиус нити на уровне задаёт его значение
function uStrand(i, t, time, out) {
  let n = uProf(U.cn, t),
    s = uProf(U.cs, t),
    v = i === 0 ? n : s,
    gap = Math.abs(s - n) / 10,
    r =
      SP_R * (1 - t * 0.86) * (0.55 + (0.45 * v) / BASE) +
      gap * 0.02 * Math.sin(t * Math.PI * 9 + time * 2.2 + i * 1.7) * (1 - 0.6 * t),
    a = 2 * Math.PI * SP_TURNS * t + i * Math.PI,
    y = (SP_V0 + (SP_V1 - SP_V0) * t) * HH * U.hs,
    c = uAxisOff(t);
  return out.set(c.x + r * Math.cos(a), y, c.z + r * Math.sin(a));
}
class StrandCurve extends THREE.Curve {
  constructor(i) {
    (super(), (this.i = i), (this.time = 0));
  }
  getPoint(t, out = new THREE.Vector3()) {
    return uStrand(this.i, t, this.time, out);
  }
}
class AxisCurve extends THREE.Curve {
  getPoint(t, out = new THREE.Vector3()) {
    let v = AX_V0 + (AX_V1 - AX_V0) * t,
      c = uAxisOff((v - SP_V0) / (SP_V1 - SP_V0));
    return out.set(c.x, v * HH * U.hs, c.z);
  }
}
var uCurves = [new StrandCurve(0), new StrandCurve(1)],
  uStrands = [mNec, mSuf].map((m, i) => {
    let e = new THREE.Mesh(new THREE.TubeGeometry(uCurves[i], SP_SEG, SP_TUBE, SP_RAD, !1), m);
    return ((e.castShadow = !0), (e.frustumCulled = !1), core.add(e), e);
  }),
  uAxisCurve = new AxisCurve(),
  uAxis = new THREE.Mesh(new THREE.TubeGeometry(uAxisCurve, 48, 0.011, 10, !1), mAxis),
  uHalo = new THREE.Mesh(new THREE.TubeGeometry(uAxisCurve, 48, 0.03, 12, !1), mHalo),
  uTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 28), mAxis);
uHalo.renderOrder = 6;
uAxis.frustumCulled = uHalo.frustumCulled = !1;
core.add(uAxis, uHalo, uTip);
var uBallGeo = new THREE.SphereGeometry(0.052, 36, 24),
  uBalls = NEEDS.map((n, k) => {
    let e = new THREE.Mesh(uBallGeo, mBall.clone());
    return ((e.castShadow = !0), (e.userData.level = k), core.add(e), e);
  }),
  uRing = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.0042, 8, 56), mRing);
core.add(uRing);
var uPulses = Array.from({ length: 6 }, (x, k) => {
  let e = new THREE.Mesh(new THREE.SphereGeometry(0.014, 14, 10), mPulse);
  return (core.add(e), { m: e, s: k % 2, t: k / 6 });
});

function uRebuild(time) {
  uStrands.forEach((m, i) => {
    uCurves[i].time = time;
    let g = new THREE.TubeGeometry(uCurves[i], SP_SEG, SP_TUBE, SP_RAD, !1);
    (m.geometry.dispose(), (m.geometry = g));
  });
  (uAxis.geometry.dispose(),
    (uAxis.geometry = new THREE.TubeGeometry(uAxisCurve, 48, 0.011, 10, !1)),
    uHalo.geometry.dispose(),
    (uHalo.geometry = new THREE.TubeGeometry(uAxisCurve, 48, 0.03, 12, !1)));
}

// ---------- интерфейс: Карта ресурсов ----------
var uRows = document.getElementById("rows"),
  uText = document.getElementById("baltext"),
  uTval = document.getElementById("tval"),
  uTbar = document.getElementById("tbar"),
  uLbl = document.getElementById("needlbl"),
  uInputs = [];
NEEDS.forEach((name, k) => {
  let row = document.createElement("div");
  ((row.className = "row"), (row.dataset.i = k));
  row.innerHTML =
    `<span class="nm"><i>${k + 1}</i>${name}</span><span class="tr">` +
    `<input type="range" class="rn" min="0" max="10" step="1" value="${U.nec[k]}" aria-label="${name}: необходимость">` +
    `<input type="range" class="rs" min="0" max="10" step="1" value="${U.suf[k]}" aria-label="${name}: достаточность"></span>` +
    `<span class="vl"></span>`;
  uRows.appendChild(row);
  let [a, b] = row.querySelectorAll("input"),
    vl = row.querySelector(".vl");
  uInputs.push({ row, a, b, vl });
  (a.addEventListener("input", () => {
    ((U.nec[k] = +a.value), uSync(k), uPresetMark(null), gi());
  }),
    b.addEventListener("input", () => {
      ((U.suf[k] = +b.value), uSync(k), uPresetMark(null), gi());
    }),
    row.addEventListener("pointerenter", () => {
      U.hover = k;
    }),
    row.addEventListener("pointerleave", () => {
      U.hover === k && (U.hover = -1);
    }));
});
function uSync(k) {
  let r = uInputs[k];
  ((r.a.value = U.nec[k]),
    (r.b.value = U.suf[k]),
    r.a.style.setProperty("--v", U.nec[k] * 10 + "%"),
    r.b.style.setProperty("--v", U.suf[k] * 10 + "%"),
    (r.vl.textContent = U.nec[k] + " / " + U.suf[k]),
    r.row.classList.toggle("gap", Math.abs(U.nec[k] - U.suf[k]) >= 3));
}
function uPresetMark(id) {
  document.querySelectorAll("[data-preset]").forEach((b) => b.classList.toggle("on", b.dataset.preset === id));
}
function uPreset(id) {
  let p = PRESETS[id];
  p && ((U.nec = p.nec.slice()), (U.suf = p.suf.slice()), NEEDS.forEach((n, k) => uSync(k)), uPresetMark(id), gi());
}
NEEDS.forEach((n, k) => uSync(k));
uPresetMark("balance");
document.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => uPreset(b.dataset.preset)));
var uSheet = document.getElementById("sheet");
uSheet && uSheet.addEventListener("click", () => document.body.classList.toggle("map"));
window.addEventListener("keydown", (e) => {
  if (e.target && e.target.tagName === "INPUT") return;
  let k = e.key.toLowerCase();
  (k === "0" && uPreset("balance"), k === "1" && uPreset("skew"), k === "2" && uPreset("burnout"));
});

// выбор уровня по шару (по расстоянию на экране: шары мелкие)
var uProj = new THREE.Vector3(),
  uDown = null;
function uPick(e) {
  if (U.grow < 0.9) return -1;
  let best = -1,
    bd = 18;
  uBalls.forEach((b, k) => {
    b.getWorldPosition(uProj).project(camera);
    let x = ((uProj.x + 1) / 2) * innerWidth,
      y = ((1 - uProj.y) / 2) * innerHeight,
      d = Math.hypot(x - e.clientX, y - e.clientY);
    d < bd && ((bd = d), (best = k));
  });
  return best;
}
qe.addEventListener("pointerdown", (e) => {
  uDown = { x: e.clientX, y: e.clientY };
});
qe.addEventListener("pointermove", (e) => {
  e.buttons || e.pointerType === "touch" || (U.hover = uPick(e));
});
qe.addEventListener("pointerleave", () => {
  U.hover = -1;
});
qe.addEventListener("pointerup", (e) => {
  if (uDown && Math.hypot(e.clientX - uDown.x, e.clientY - uDown.y) < 6) {
    let k = uPick(e);
    U.sel = k === U.sel ? -1 : k;
  }
  uDown = null;
});

var uLastTxt = "";
function uStatus() {
  let gaps = U.nec.filter((n, k) => Math.abs(n - U.suf[k]) >= 3).length,
    tens = Math.round(100 * (1 - U.s)),
    txt,
    cls = "";
  (U.needUnst
    ? ((txt = "Равновесие потребностей нарушено — связи ослабли, система потеряла устойчивость"), (cls = "bad"))
    : U.cutUnst
      ? ((txt = "Связь разорвана — каркас осел, ось здоровья гаснет"), (cls = "bad"))
      : cutSet.size
        ? ((txt = "Связь разорвана — система перераспределила напряжение и сохранила целостность"), (cls = "warn"))
        : U.s < 0.06
          ? (txt = "Равновесие: потребности удовлетворяются в меру — каркас держит форму")
        : ((txt =
            (gaps === 1 ? "Перекос на одном уровне" : gaps > 1 ? "Перекос на нескольких уровнях" : "Небольшой перекос") +
            " — ресурсы компенсируют нагрузку, связи слабеют"),
          (cls = "warn")),
    txt !== uLastTxt && ((uLastTxt = txt), (uText.textContent = txt), (uText.className = cls)),
    (uTval.textContent = (ti ? 0 : tens) + "%"),
    uTbar.style.setProperty("--t", (ti ? 0 : tens) + "%"),
    uTbar.classList.toggle("bad", ti));
}

// шаг модели потребностей: вызывается перед физикой каркаса
U.step = function (dt) {
  let k = 1 - Math.exp(-dt * 4.5),
    sum = 0,
    sgn = 0;
  for (let j = 0; j < NB; j++)
    ((U.cn[j] += (U.nec[j] - U.cn[j]) * k),
      (U.cs[j] += (U.suf[j] - U.cs[j]) * k),
      (sum += Math.abs(U.cs[j] - U.cn[j])),
      (sgn += U.cs[j] - U.cn[j]));
  ((U.D = sum / NB / 10), (U.bend = THREE.MathUtils.clamp((sgn / NB / 10) * 2.2, -1, 1)), (U.s = Math.min(1, U.D / D_CRIT)));
  if (!U.needUnst && U.D >= D_CRIT) {
    ((U.needUnst = !0), (Un = !1), (rn = 0));
    for (let j = 0; j < 12; j++) we[j].add(new THREE.Vector3().randomDirection().multiplyScalar(0.012));
    ar([35, 40, 25, 40, 90]);
  } else
    U.needUnst &&
      U.D < D_BACK &&
      ((U.needUnst = !1), U.cutUnst || ((Un = !cutSet.size), ca && (ca.className = "status")), ar([10, 40, 10]));
  ti = U.cutUnst || U.needUnst;
  uStatus();
};

// отрисовка ядра: следует за каркасом (ось — между центрами шестиугольников)
var uB = new THREE.Vector3(),
  uT = new THREE.Vector3(),
  uY = new THREE.Vector3(0, 1, 0),
  uX = new THREE.Vector3(1, 0, 0),
  uZ = new THREE.Vector3(),
  uM = new THREE.Matrix4(),
  uP = new THREE.Vector3(),
  uP2 = new THREE.Vector3(),
  uUp = new THREE.Vector3(0, 1, 0),
  uSig = "",
  uLastBuild = 0;
U.render = function (time, dt) {
  (uB.set(0, 0, 0), uT.set(0, 0, 0), Jn.forEach((n) => uB.add(pos[n])), Kn.forEach((n) => uT.add(pos[n])));
  (uB.multiplyScalar(1 / 6), uT.multiplyScalar(1 / 6), uP.subVectors(uT, uB));
  let h = uP.length();
  (h > 0.02 && uY.copy(uP).multiplyScalar(1 / h),
    uP.subVectors(pos[0], uB).addScaledVector(uY, -uP.dot(uY)),
    uP.lengthSq() > 1e-6 && uX.copy(uP).normalize(),
    uZ.crossVectors(uX, uY).normalize(),
    uX.crossVectors(uY, uZ),
    uM.makeBasis(uX, uY, uZ),
    core.quaternion.setFromRotationMatrix(uM),
    core.position.addVectors(uB, uT).multiplyScalar(0.5));
  // сборка каркаса закончилась — спираль вырастает
  di >= 1 ? (U.grow = Math.min(1, U.grow + dt / 2.6)) : (U.grow = 0);
  let g = 1 - Math.pow(1 - U.grow, 3),
    hsT = THREE.MathUtils.clamp(h / H0, 0.04, 1.5);
  ((U.hs += (hsT - U.hs) * Math.min(1, dt * 14)), (U.fade += ((ti ? 0.12 : 1) - U.fade) * Math.min(1, dt * 2.5)));
  let live = U.s > 0.02,
    sig = U.cn.map((v) => v.toFixed(2)).join() + U.cs.map((v) => v.toFixed(2)).join() + U.hs.toFixed(2);
  ((sig !== uSig || (live && time - uLastBuild > 0.045)) && (uRebuild(time), (uSig = sig), (uLastBuild = time)),
    uStrands.forEach((m) => m.geometry.setDrawRange(0, Math.floor(g * SP_SEG) * SP_RAD * 6)),
    pyr.scale.set(1, U.hs, 1));
  let a = Math.max(0.1, (1 - U.s * 0.9) * U.fade),
    show = Math.min(1, U.grow * 3);
  (mAxis.color.setRGB(0.32 * a + 0.08, 0.94 * a + 0.12, 0.78 * a + 0.12),
    (mAxis.opacity = (0.45 + 0.55 * a) * show),
    (mHalo.opacity = (0.1 + 0.26 * a) * show),
    (mGlass.opacity = 0.13 * show * (0.35 + 0.65 * U.fade)),
    (mBase.opacity = 0.24 * show * (0.35 + 0.65 * U.fade)),
    (mEdge.opacity = show),
    (uAxis.visible = uHalo.visible = U.grow > 0.02));
  (uAxisCurve.getPoint(1, uP), uAxisCurve.getPoint(0.96, uP2));
  (uTip.position.copy(uP).addScaledVector(uP2.subVectors(uP, uP2).normalize(), 0.05),
    uTip.quaternion.setFromUnitVectors(uUp, uP2),
    (uTip.visible = U.grow > 0.85));
  let hot = U.hover >= 0 ? U.hover : U.sel;
  (uBalls.forEach((b, k) => {
    uStrand(k % 2, LEVEL_T[k], time, b.position);
    let f = THREE.MathUtils.clamp((g - LEVEL_T[k]) * 8, 0, 1),
      gap = Math.min(1, Math.abs(U.cs[k] - U.cn[k]) / 6);
    (b.scale.setScalar(f * (k === hot ? 1.3 : 1) * (1 + 0.1 * gap * Math.sin(time * 5 + k))),
      b.material.color.setRGB(
        THREE.MathUtils.lerp(k === hot ? 0.69 : 0.37, 0.05, gap),
        THREE.MathUtils.lerp(k === hot ? 0.97 : 0.39, 0.09, gap),
        THREE.MathUtils.lerp(k === hot ? 0.94 : 0.42, 0.11, gap),
      ));
  }),
    hot >= 0
      ? (uRing.position.copy(uBalls[hot].position),
        uRing.lookAt(uP.copy(camera.position)),
        uRing.scale.setScalar(1 + 0.12 * Math.sin(time * 4)),
        (mRing.opacity += (0.9 - mRing.opacity) * 0.2))
      : (mRing.opacity *= 0.85),
    uPulses.forEach((p) => {
      ((p.t += dt * (0.03 + 0.12 * a)),
        p.t > 1 && (p.t -= 1),
        uStrand(p.s, p.t, time, p.m.position),
        (p.m.visible = U.grow >= 1 && !ti),
        p.m.scale.setScalar(0.5 + 0.5 * a));
    }));
  // подпись выбранного уровня
  if (hot >= 0 && U.grow > 0.9 && !document.body.classList.contains("clean")) {
    (core.updateMatrixWorld(), uBalls[hot].getWorldPosition(uP).project(camera));
    let x = ((uP.x + 1) / 2) * innerWidth,
      y = ((1 - uP.y) / 2) * innerHeight;
    ((uLbl.innerHTML = `<b>${NEEDS[hot]}</b><span>необходимость ${U.nec[hot]} · достаточность ${U.suf[hot]}</span>`),
      (uLbl.style.transform = `translate(${Math.round(x + 16)}px, ${Math.round(y)}px) translate(0,-50%)`),
      (uLbl.style.opacity = "1"));
  } else uLbl.style.opacity = "0";
  uInputs.forEach((r, k) => r.row.classList.toggle("hot", k === hot));
};
window.__u = U;
