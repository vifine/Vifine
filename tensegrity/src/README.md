# Исходники моделей Т.А. Бусыгиной (vifine.tech/tensegrity)

- `v4.src.js`, `spiral.src.js` — исходники страниц /tensegrity/v4/ и /tensegrity/spiral/, восстановленные из опубликованных бандлов (three r187; имена внутренних переменных остались короткими).
- `unity.core.js` — новый код единой модели: спираль потребностей внутри каркаса, «Карта ресурсов», связь равновесия с натяжением тросов.
- `unity.css`, `unity.body.html` — стили и разметка новой страницы.
- `mkunity.py` — собирает `unity.src.js` (v4 + правки + unity.core.js) и `unity.shell.html` (шапка и шрифты берутся из опубликованной v4; путь `../live/v4.html` в скрипте заменить на `../v4/index.html`, вкладку «Единая модель» в меню при этом не дублировать).
- `build.mjs` — бандлит исходник esbuild-ом и вставляет в HTML: `node build.mjs unity.src.js unity.shell.html unity.html`.

Зависимости: `npm i three@0.187.0 esbuild`.
Параметры для отладки: `?still`, `?dtcap=0.3&cap=18` (реальное время при низком FPS), `?slack=1.3`.
