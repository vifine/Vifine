import re,sys
src=open('v4.src.js',encoding='utf-8').read()
core=open('phys.core.js',encoding='utf-8').read()
def rep(a,b,count=1):
    global src
    assert src.count(a)==count, (a, src.count(a))
    src=src.replace(a,b)
# натяжение тросов зависит от равновесия потребностей
rep("di >= 1 && (Qn += ((ti ? 1.14 : 1) - Qn) * 0.03),", "di >= 1 && (Qn += ((ti ? 1.14 : U.Qt) - Qn) * 0.03),")
rep("cutSet.size ? (rn = 0) : !$n && e - af > 0.4 && (rn = Math.min(1, rn + 0.01)),",
    "cutSet.size || U.needUnst ? (rn = 0) : !$n && e - af > 0.4 && (rn = Math.min(U.pull, rn + 0.01)),")
rep("((ti = e > 0.12),", "((U.cutUnst = e > 0.12), (ti = U.cutUnst || U.needUnst),")
rep("(cutSet.clear(), lh.clear(), (Un = !0), (ti = !1), ca && (ca.className = \"status\"),", "(cutSet.clear(), lh.clear(), (Un = !U.needUnst), (U.cutUnst = !1), (ti = U.needUnst), ca && (ca.className = \"status\"),")
rep("function flipTo(i) {\n  (cutSet.size && restoreAll(),", "function flipTo(i) {\n  if (U.needUnst) return;\n  (cutSet.size && restoreAll(),")
# провисание тросов при ослаблении
rep("u = e ? Math.max(0, p - h - p * 0.006) : Math.max(0, p * 1.08 - h),", "u = e ? Math.max(0, p - h - p * 0.006) : Math.max(0, p * 1.08 - h),")
# шаг потребностей перед физикой, отрисовка ядра после каркаса
rep("  let e = i / 1e3;\n  for (\n    di < 1 &&", "  let e = i / 1e3;\n  U.step(t);\n  for (\n    di < 1 &&")
rep("    (wA.material.opacity = gl),\n    (wB.material.opacity = _l));\n}", "    (wA.material.opacity = gl),\n    (wB.material.opacity = _l));\n  U.render(i, t);\n}")
# после сборки фигура всегда встаёт вершиной пирамиды вверх
rep("ia.copy(ha), Nn.dot(ia) < 0 && ia.negate());", "ia.copy(ha), t !== \"up\" && Nn.dot(ia) < 0 && ia.negate());")
rep("window.__v4started = !0", "window.__v4started = !0")
rep("ve.debug.checkShaderErrors = qi.has(\"debug\");", "var UNST_SLACK = +qi.get(\"slack\") || 1.14;\n"+core+"\nve.debug.checkShaderErrors = qi.has(\"debug\");")
# физика: жёсткость тросов от ресурса компонентов, распор стержней
rep("let n = Yt === 0 ? Ji : _s;", "di >= 1 && U.squeeze && (U.despin(), U.squeeze());\n    let n = Yt === 0 ? Ji : _s;")
rep("ta(r, a, REST.ring * Qn, th, !0)", "ta(r, a, REST.ring * Qn, th * U.k(r, a), !0)")
rep("ta(r, a, REST.star * Qn, th, !0)", "ta(r, a, REST.star * Qn, th * U.k(r, a), !0)")
rep("ta(r, a, REST.diag * yl * Qn, th, !0)", "ta(r, a, REST.diag * yl * Qn, th * U.k(r, a), !0)")
rep("STRUTS.forEach(([r, a]) => ta(r, a, L, 1, !1))", "STRUTS.forEach(([r, a], q) => ta(r, a, L * U.Ls[q], 1, !1))", 2)
src=src.replace('var dh = [', 'var U = { k: () => 1, Ls: [1, 1, 1, 1, 1, 1], Qt: 1, pull: 1, step() {}, render() {} };\nvar dh = [', 1)
open('scen.src.js','w',encoding='utf-8').write(src)

# ---------- HTML ----------
h=open('../v4/index.html',encoding='utf-8').read()
a=h.index('<script type="module">'); head=h[:a]; tail=h[h.index('</script>',a):]
head=head.replace('<title>Звёздчатая тенсегрити · Бусыгина Т.А.</title>','<title>Сценарии · Бусыгина Т.А.</title>')
css=open('scen.css',encoding='utf-8').read()
i=head.rindex('</style>'); head=head[:i]+css+head[i:]
b0=head.index('<button class="burger"'); 
body=open('scen.body.html',encoding='utf-8').read()
nav_end=head.index('</script>',b0)+len('</script>')
nav=head[b0:nav_end].replace('<a href="https://vifine.tech/tensegrity/v4/" class="on" aria-current="page">Тенсегрити</a>','<a href="https://vifine.tech/tensegrity/v4/">Тенсегрити</a>')
SC='<a href="https://vifine.tech/tensegrity/scenario/">Сценарии</a>'
if SC not in nav: nav=nav.replace('<a href="https://vifine.tech/tensegrity/unity/">Единая модель</a>','<a href="https://vifine.tech/tensegrity/unity/">Единая модель</a>'+SC)
nav=nav.replace(SC,'<a href="https://vifine.tech/tensegrity/scenario/" class="on" aria-current="page">Сценарии</a>')
assert nav.count('aria-current')==1 and 'scenario/' in nav
head=head[:b0]+nav+'\n'+body+'\n'
open('scen.shell.html','w',encoding='utf-8').write(head+'<script type="module"></script>'+tail[len('</script>'):])
print('ok',len(src))
