
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
// мобильная панель: закрыть тапом вне панели или свайпом вниз
var uPanel = document.getElementById("needs"),
  uMapOpen = () => document.body.classList.contains("map"),
  uClose = () => (document.body.classList.remove("map"), (uPanel.style.transform = ""));
var uTap = null;
document.addEventListener("pointerdown", (e) => {
  uTap = uMapOpen() && !uPanel.contains(e.target) && !(uSheet && uSheet.contains(e.target)) ? { x: e.clientX, y: e.clientY } : null;
}, true);
document.addEventListener("pointerup", (e) => {
  uTap && Math.hypot(e.clientX - uTap.x, e.clientY - uTap.y) < 10 && uClose();
  uTap = null;
}, true);
var uSw = null;
uPanel.addEventListener("touchstart", (e) => {
  let t = e.touches[0];
  uSw = e.touches.length === 1 && e.target.tagName !== "INPUT" ? { y: t.clientY, x: t.clientX, top: uPanel.scrollTop, dy: 0, on: !1 } : null;
}, { passive: !0 });
uPanel.addEventListener("touchmove", (e) => {
  if (!uSw || !uMapOpen()) return;
  let t = e.touches[0], dy = t.clientY - uSw.y, dx = t.clientX - uSw.x;
  if (!uSw.on) {
    if (uSw.top > 0 || uPanel.scrollTop > 0 || dy < 8 || Math.abs(dx) > dy) return;
    uSw.on = !0;
    uPanel.classList.add("drag");
  }
  e.preventDefault();
  uSw.dy = Math.max(0, dy);
  uPanel.style.transform = "translateY(" + uSw.dy + "px)";
}, { passive: !1 });
uPanel.addEventListener("touchend", () => {
  if (!uSw) return;
  uPanel.classList.remove("drag");
  uSw.on && uSw.dy > 70 ? uClose() : (uPanel.style.transform = "");
  uSw = null;
});

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
    Yt, rn, Un, mi, Qn, yl, $n, Ue, ra, kc: U.kc.slice(), Ls: U.Ls.slice(), P: U.P,
  };
  let t0 = performance.now();
  U.kc.fill(1); U.Ls.fill(1); U.P = 0.5 * (+qi.get("P") || 0.02);
  Yt = state; rn = 0.12; Un = !1; mi = 0; Qn = 1; yl = 1; $n = null; Ue = null; ra = 1;
  homes[state].forEach((h, i) => { pos[i].copy(h); we[i].copy(h); });
  for (let s = 0; s < 900; s++) gh(0);
  U.R[state] = uMeasure();
  save.pos.forEach((p, i) => pos[i].copy(p)); save.we.forEach((p, i) => we[i].copy(p));
  Yt = save.Yt; rn = save.rn; Un = save.Un; mi = save.mi; Qn = save.Qn; yl = save.yl; $n = save.$n; Ue = save.Ue; ra = save.ra;
  U.calibMs = (U.calibMs || 0) + performance.now() - t0;
  U.kc = save.kc; U.Ls = save.Ls; U.P = save.P;
}
function uForces() {
  let m = uMeasure(), R = U.R[Yt], mx = 0, dev = 0;
  U.tautN = m.taut;
  // пока каркас усаживается (после сборки, перещёлкивания, восстановления) — показания заморожены;
  // на выходе берём текущие значения сразу, без сглаживания со старыми
  if ($n || U.flipT > 0) return void (U.frozen = !0);
  let snap = U.frozen;
  U.frozen = !1;
  for (let q = 0; q < m.D.length; q++) dev = Math.max(dev, Math.abs(m.D[q] - R.D[q]) / R.D[q]);
  U.dev = snap ? dev : U.dev + (dev - U.dev) * 0.15;
  CAB.forEach((c, i) => {
    c.F = m.F[i];
    c.f = c.act && R.F[i] ? m.F[i] / R.F[i] : 0;
    c.act && (mx = Math.max(mx, c.f));
  });
  U.maxF = snap ? Math.max(1, mx) : U.maxF + (Math.max(1, mx) - U.maxF) * 0.15;
  // запас устойчивости: насколько форма далека от предела деформации и сколько тросов держат
  let tf = THREE.MathUtils.clamp((m.taut - 16) / 12, 0, 1);
  U.margin = THREE.MathUtils.clamp(1 - U.dev / DEV_MAX, 0, 1) * tf;
}


// ---------- старт: плавный переход из «звезды» к равновесию ----------
// звезда держится STAR_HOLD, затем поворот с мягким разгоном и торможением за TURN_DUR,
// затем готовая фигура стоит FINAL_HOLD, и только потом начинается автовращение
var STAR_HOLD = 1500, TURN_DUR = 3.6, FINAL_HOLD = 10;
U.turn = null;
U.startTurn = function () {
  if (pi || er || sn) return;
  ir();
  let up = fy.clone();
  Nn.dot(up) < 0 && up.negate();
  let ang = Nn.angleTo(up);
  if (ang < 0.01) return void (pi = "up");
  U.turn = { t: 0, ax: new THREE.Vector3().crossVectors(Nn, up).normalize(), ang, done: 0 };
  gi();
};
U.turnStep = function (dt) {
  let T = U.turn;
  if (!T) return;
  // пользователь взялся за фигуру или нажал «Звезда» — отдаём управление ему
  if (er || sn || Ue || Wi.lengthSq() > 1e-9) return void (U.turn = null);
  T.t += dt;
  let p = Math.min(1, T.t / TURN_DUR), e = 0.5 - 0.5 * Math.cos(Math.PI * p);
  rotateModel(T.ax.clone().multiplyScalar((e - T.done) * T.ang));
  T.done = e;
  // держим таймер простоя, чтобы автовращение не началось посреди поворота
  xf = performance.now() + (p >= 1 ? (FINAL_HOLD - 7) * 1e3 : 0);
  p >= 1 && ((U.turn = null), (pi = "up"));
};


// ---------- «Восстановить»: тросы, норма, усталость — и каркас плавно поднимается ----------
var uRestoreBtn = document.getElementById("restore");
U.restore = function () {
  uStop();
  cutSet.size && restoreAll();
  uApply("ok", !0);
  U.h.fill(1);
  U.cc = U.comp.slice();
  U.cb = U.bal;
  U.cl = U.load;
  U.needUnst = !1;
  U.cutUnst = !1;
  ti = !1;
  Un = !cutSet.size;
  U.margin = 1;
  U.dev = 0;
  U.maxF = 1;
  U.flipT = 4.5;
  ca && (ca.className = "status");
  gi();
  ar([10, 40, 10]);
};
uRestoreBtn && uRestoreBtn.addEventListener("click", () => U.restore());
window.addEventListener("keydown", (e) => {
  if (e.target && e.target.tagName === "INPUT") return;
  (e.key === "r" || e.key === "R" || e.key === "к" || e.key === "К") && U.restore();
});

// ---------- шаг ----------
U.step = function (dt) {
  dt = Math.min(dt, 0.05);
  // эталон нормы — один раз, в самом начале (до видимой анимации), чтобы не дёргать кадр потом
  U.R[0] || (uCalib(0), uCalib(1));
  U.turnStep(dt);
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
  // после сборки каркас тоже мягко отпускается к физике, без рывка
  di >= 1 && !U.built && ((U.built = !0), (U.flipT = 4.5));
  U.flipT = Math.max(0, (U.flipT || 0) - dt);
  let base = qi.has("pull") ? +qi.get("pull") : 0.12;
  U.pull = $n ? 1 : base + (1 - base) * Math.min(1, U.flipT / 1.5);
  // нагрузка снимается на время перещёлкивания (иначе сжатие не даёт призме перейти во второе состояние)
  U.lw = THREE.MathUtils.clamp((U.lw ?? 0) + ($n ? -dt * 4 : di >= 1 ? dt / 1.5 : -1), 0, 1);
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
  if (!U.needUnst && di >= 1 && !flipping && U.margin < M_CRIT) {
    ((U.needUnst = !0), (Un = !1), (rn = 0));
    ar([35, 40, 25, 40, 90]);
  } else if (U.needUnst) {
    // восстановление: ресурсы и баланс должны вернуться выше, чем порог падения
    let ok = U.cb >= 6 && U.cc.every((v, i) => eff(i) >= 5);
    ok && ((U.needUnst = !1), (U.margin = M_BACK), (U.flipT = 4.5), U.cutUnst || ((Un = !cutSet.size), ca && (ca.className = "status")), ar([10, 40, 10]));
  }
  ti = U.cutUnst || U.needUnst;
  uRestoreBtn && uRestoreBtn.classList.toggle("show", ti || cutSet.size > 0);
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
