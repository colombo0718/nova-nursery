/* Mock exam engine — Nova Nursery. No framework, no build. */
const params = new URLSearchParams(location.search);
const SET = params.get("set") || "mini01";
const SET_IDS = SET === "full100" ? ["mini01", "mini02"] : SET.split("+");   // full100 = both half sets: 50 listening + 50 reading
const MODE = params.get("mode") || "full";
const FAST = params.get("fast") === "1"; // test hook: 16x audio, short countdown
const SECONDS_PER_READING_Q = 72;       // official: 50 questions / 60 minutes
const L = "ABCD";

const app = document.getElementById("app");
const player = document.getElementById("player");
let DATA = null;
let rerender = null;            // re-draws the current static screen when UI language changes
const answers = {};             // question id -> chosen letter

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- data helpers ---------- */
// explanation may be a plain string (zh) or {zh, en, vi}
const expl = r => (r.explain && typeof r.explain === "object") ? (r.explain[LANG] || r.explain.zh || "") : (r.explain || "");

function mergeSets(parts) {
  const d = { set_id: parts.map(p => p.set_id).join("+"), listening: [], reading: { gap: [], comp: [] } };
  parts.forEach(p => {
    d.listening.push(...p.listening);
    d.reading.gap.push(...p.reading.gap);
    d.reading.comp.push(...p.reading.comp);
  });
  // listening numbers are baked into the audio (mini02 starts at 26); reading is renumbered: gaps first, then comprehension
  let no = 0;
  d.reading.gap.forEach(g => g.blanks.forEach(b => { b.no = ++no; }));
  d.reading.comp.forEach(g => g.questions.forEach(q => { q.no = ++no; }));
  return d;
}
const countFill = (s, nL, nR) => s.replace("{nL}", nL).replace("{nR}", nR).replace("{min}", Math.round(nR * SECONDS_PER_READING_Q / 60));

function recListening(type) {
  const out = [];
  DATA.listening.forEach(g => {
    if (type && g.type !== type) return;
    g.questions.forEach(q => out.push({
      id: q.id, no: q.no, section: "listening", type: g.type, skill: q.skill, answer: q.answer,
      explain: q.explain, stem: q.stem, options: q.options, group: g
    }));
  });
  return out;
}
function recReading(type) {
  const out = [];
  if (!type || type === "gap") DATA.reading.gap.forEach(g => g.blanks.forEach(b => out.push({
    id: b.id, no: b.no, section: "reading", type: "gap", skill: b.skill, answer: b.answer, explain: b.explain,
    options: b.options, answerWord: b.answer_word, vocabLevel: b.vocab_level
  })));
  if (!type || type === "comp") DATA.reading.comp.forEach(g => g.questions.forEach(q => out.push({
    id: q.id, no: q.no, section: "reading", type: "comp", skill: q.skill, answer: q.answer, explain: q.explain,
    stem: q.stem, options: q.options
  })));
  return out;
}
const partLabel = g => g.type === "dialogue" ? T().part1D : T().part2M;

/* ---------- audio ---------- */
function playAudio(src, onProgress) {
  return new Promise(resolve => {
    player.defaultPlaybackRate = FAST ? 16 : 1;
    player.src = src;
    player.playbackRate = FAST ? 16 : 1;
    let last = -1, lastAt = Date.now(), retries = 0, finished = false, btn = null;
    const done = () => {
      if (finished) return;
      finished = true;
      clearInterval(wd);
      if (btn) btn.remove();
      player.removeEventListener("ended", done);
      player.removeEventListener("error", done);
      player.ontimeupdate = null;
      resolve();
    };
    const tapButton = () => {
      if (btn || finished) return;
      btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = "▶ " + T().tapToPlay;
      btn.style.margin = "12px auto";
      btn.style.display = "block";
      btn.onclick = () => { btn.remove(); btn = null; player.play().catch(tapButton); };
      app.appendChild(btn);
    };
    const start = () => player.play().catch(e => {
      if (e && e.name === "NotAllowedError") tapButton();
      else if (retries++ < 3) setTimeout(start, 500);
      else done();
    });
    player.addEventListener("ended", done);
    player.addEventListener("error", done);
    player.ontimeupdate = () => { if (onProgress && player.duration) onProgress(player.currentTime / player.duration); };
    // watchdog: if playback stops advancing (stalled network / dropped media), nudge it, then skip ahead
    const wd = setInterval(() => {
      if (finished || btn) return;
      if (player.currentTime !== last) { last = player.currentTime; lastAt = Date.now(); return; }
      const idle = (Date.now() - lastAt) / 1000;
      if (player.duration && player.currentTime >= player.duration - 0.3) return done();
      if (idle > 4 && retries < 3) { retries++; lastAt = Date.now(); const t = player.currentTime; player.load(); player.currentTime = t; start(); }
      else if (idle > 8) done();
    }, 1000);
    start();
  });
}
const setBar = p => { const i = $("#bar i"); if (i) i.style.width = Math.round(p * 100) + "%"; };
function countdown(sec) {
  return new Promise(res => {
    const end = Date.now() + sec * 1000; // wall-clock based: unaffected by throttled timers
    const el = $("#cd");
    const tick = () => {
      const left = (end - Date.now()) / 1000;
      if (el) el.textContent = Math.max(0, Math.ceil(left));
      if (left <= 0) { clearInterval(h); res(); }
    };
    const h = setInterval(tick, 100);
    tick();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 200) : ms));

/* ---------- option widgets ---------- */
function optsHtml(rec, cls = "") {
  return `<div class="opts ${cls}" data-qid="${rec.id}">${rec.options.map((o, i) =>
    `<button class="opt${answers[rec.id] === L[i] ? " sel" : ""}" data-l="${L[i]}"><span class="l">(${L[i]})</span><span>${esc(o)}</span></button>`).join("")}</div>`;
}
function markSelected(qid, letter) {
  const box = document.querySelector(`.opts[data-qid="${qid}"]`);
  if (!box) return;
  box.querySelectorAll(".opt").forEach(b => b.classList.toggle("sel", b.dataset.l === letter));
}
function revealAnswer(rec, container) {
  const box = container.querySelector(`.opts[data-qid="${rec.id}"]`);
  box.querySelectorAll(".opt").forEach(b => {
    b.classList.add("locked");
    if (b.dataset.l === rec.answer) b.classList.add("right");
    else if (b.dataset.l === answers[rec.id]) b.classList.add("wrong");
  });
  const t = T();
  let extra = "";
  if (rec.type === "gap") {
    const lvl = rec.vocabLevel === "outside-8000" ? t.outside : rec.vocabLevel;
    extra = `<div>${t.correctAnswer}: (${rec.answer}) ${esc(rec.answerWord || "")} <span class="tag">${t.wordLevel}: ${esc(lvl || "")}</span></div>`;
  } else if (rec.stem) {
    extra = `<div><b>${esc(rec.stem)}</b></div>`;
  }
  const ex = document.createElement("div");
  ex.className = "explain";
  ex.innerHTML = `${extra}<div>${t.explanation}: ${esc(expl(rec))}</div>`;
  box.after(ex);
}

/* ---------- LISTENING (exam) ---------- */
function showListeningIntro(next) {
  app.classList.remove("wide");
  rerender = () => showListeningIntro(next);
  const t = T();
  app.innerHTML = `<div class="card stage"><span class="badge">${t.listening}</span>
    <div class="big">${t.title}</div>
    <ul class="rules">${t.listeningRules.map(r => `<li>${esc(countFill(r, recListening().length, recReading().length))}</li>`).join("")}</ul>
    <button class="btn" id="go">${t.startListening}</button></div>`;
  $("#go").onclick = () => { rerender = null; runListening(next); };
}

async function runListening(next) {
  const lastGroup = DATA.listening[DATA.listening.length - 1];
  const total = lastGroup.questions[lastGroup.questions.length - 1].no;   // numbers are baked into the audio
  for (let gi = 0; gi < DATA.listening.length; gi++) {
    const g = DATA.listening[gi];
    const first = g.questions[0].no, last = g.questions[g.questions.length - 1].no;
    const t = T();
    app.innerHTML = `<div class="card stage"><span class="badge">${partLabel(g)}</span>
      <div class="big">${LANG === "zh" ? `${t.question}${first}–${last}${t.questions}` : `${t.questions} ${first}–${last}`}</div>
      <div>${t.playingPassage}</div><div class="bar" id="bar"><i></i></div>
      <div style="color:var(--text-sub)">${first}/${total}</div></div>`;
    await playAudio(g.audio, setBar);
    for (const q of g.questions) {
      let locked = false;
      const rec = { id: q.id, options: q.options };
      app.innerHTML = `<div class="card stage"><span class="badge">${partLabel(g)}</span>
        <div class="big">${LANG === "zh" ? `${t.question}${q.no}${t.questions}` : `${t.question} ${q.no} / ${total}`}</div>
        <div>${t.playingQuestion}</div><div class="bar" id="bar"><i></i></div>
        <div style="margin:6px 0">${t.nextIn} <span class="countdown" id="cd">–</span></div>
        <div style="text-align:left">${optsHtml(rec, "two")}</div></div>`;
      const box = $(`.opts[data-qid="${q.id}"]`);
      box.querySelectorAll(".opt").forEach(b => b.onclick = () => {
        if (locked) return;
        answers[q.id] = b.dataset.l;
        markSelected(q.id, b.dataset.l);
      });
      await playAudio(q.audio, setBar);
      await countdown(FAST ? 0.3 : 5);
      locked = true;
      box.querySelectorAll(".opt").forEach(b => b.classList.add("locked"));
    }
    if (gi < DATA.listening.length - 1) {
      app.innerHTML = `<div class="card stage"><div class="big">${T().nextGroup}</div></div>`;
      await sleep(1500);
    }
  }
  app.innerHTML = `<div class="card stage"><div class="big">${T().sectionDone}</div></div>`;
  await sleep(1200);
  next();
}

/* ---------- READING (exam + practice) ---------- */
function showReadingIntro(next) {
  rerender = () => showReadingIntro(next);
  const t = T();
  app.innerHTML = `<div class="card stage"><span class="badge">${t.reading}</span>
    <div class="big">${t.title}</div>
    <ul class="rules">${t.readingRules.map(r => `<li>${esc(countFill(r, recListening().length, recReading().length))}</li>`).join("")}</ul>
    <button class="btn" id="go">${t.startReading}</button></div>`;
  $("#go").onclick = () => { rerender = null; renderReadingPage({ practice: false, onSubmit: next }); };
}

function renderReadingPage({ practice, type, onSubmit }) {
  const recs = recReading(type);
  const byId = Object.fromEntries(recs.map(r => [r.id, r]));
  const groups = [];
  if (!type || type === "gap") DATA.reading.gap.forEach(g => groups.push({ kind: "gap", g }));
  if (!type || type === "comp") DATA.reading.comp.forEach(g => groups.push({ kind: "comp", g }));
  const recsOf = grp => (grp.kind === "gap" ? grp.g.blanks : grp.g.questions).map(x => byId[x.id]);
  const rangeOf = grp => { const n = recsOf(grp).map(r => r.no); return [Math.min(...n), Math.max(...n)]; };
  let cur = 0;
  let timerHandle = null;

  app.classList.add("wide");
  app.innerHTML = `<div class="rtop"><span id="rtopl"></span><div class="nav" id="rnav"></div></div><div id="rbody"></div><div class="navbar" id="rbar"></div>`;

  const drawNav = () => {
    $("#rnav").innerHTML = groups.map((gp, i) => {
      const [a, b] = rangeOf(gp), rr = recsOf(gp), done = rr.filter(r => answers[r.id]).length;
      const cls = i === cur ? "cur" : done === rr.length ? "done" : done ? "part" : "";
      return `<button class="navb ${cls}" data-i="${i}">${a}${a === b ? "" : "–" + b}</button>`;
    }).join("");
  };

  const draw = () => {
    const t = T(), grp = groups[cur], rs = recsOf(grp);
    $("#rtopl").innerHTML = practice ? "" : `<span class="badge">${t.reading}</span><div class="timer" id="timer"></div>`;
    drawNav();
    let left, right;
    if (grp.kind === "gap") {
      const numOf = Object.fromEntries(grp.g.blanks.map(b => [b.n, b.no]));
      left = `<div class="passage">${esc(grp.g.passage).replace(/\{(\d+)\}/g, (m, n) => `<span class="blank">${numOf[n]}</span>`)}</div>`;
      right = rs.map(r => `<div class="q gap"><span class="qno">${r.no}.</span>${optsHtml(r, "four")}</div>`).join("");
    } else {
      left = `<div class="passage">${esc(grp.g.passage)}</div>`;
      right = rs.map(r => `<div class="q"><div class="qhead"><span class="qno">${r.no}.</span>${esc(r.stem)}</div>${optsHtml(r, "two")}</div>`).join("");
    }
    $("#rbody").innerHTML = `<div class="part-title">${grp.kind === "gap" ? t.partGap : t.partComp} · ${cur + 1}/${groups.length}</div>
      <div class="split"><div class="pcol">${left}</div><div class="qcol">${right}</div></div>`;
    if (practice) rs.forEach(r => { if (answers[r.id]) revealAnswer(r, document.querySelector(`.opts[data-qid="${r.id}"]`).parentElement); });
    const last = cur === groups.length - 1;
    $("#rbar").innerHTML = `<button class="btn secondary" id="prev" ${cur === 0 ? "disabled" : ""}>‹ ${t.prevGroup}</button>
      <span style="flex:1"></span>
      <button class="btn secondary" id="next" ${last ? "disabled" : ""}>${t.nextGroup2} ›</button>
      <button class="btn" id="fin">${practice ? t.summary : t.submit}</button>`;
    tick();
  };

  const finish = () => { clearInterval(timerHandle); app.onclick = null; rerender = null; app.classList.remove("wide"); (practice ? () => showResults(recs) : onSubmit)(); };
  let left = recs.length * SECONDS_PER_READING_Q;
  const tick = () => {
    const el = $("#timer");
    if (!el) return;
    const m = String(Math.floor(left / 60)).padStart(2, "0"), s = String(left % 60).padStart(2, "0");
    el.textContent = `${T().timeLeft} ${m}:${s}`;
    el.classList.toggle("low", left <= 300);
  };
  if (!practice) {
    timerHandle = setInterval(() => { left -= 1; tick(); if (left <= 0) finish(); }, 1000);
  }
  rerender = draw;

  app.onclick = e => {
    const nb = e.target.closest(".navb");
    if (nb) { cur = Number(nb.dataset.i); draw(); window.scrollTo(0, 0); return; }
    if (e.target.closest("#prev")) { if (cur > 0) { cur--; draw(); window.scrollTo(0, 0); } return; }
    if (e.target.closest("#next")) { if (cur < groups.length - 1) { cur++; draw(); window.scrollTo(0, 0); } return; }
    if (e.target.closest("#fin")) {
      const un = recs.filter(r => !answers[r.id]).length;
      if (!practice && un && !FAST && !confirm(`${T().unanswered}: ${un}`)) return;
      finish();
      return;
    }
    const b = e.target.closest(".opt");
    if (!b) return;
    const box = b.closest(".opts");
    const qid = box.dataset.qid;
    if (practice) {
      if (answers[qid]) return;
      answers[qid] = b.dataset.l;
      revealAnswer(byId[qid], box.parentElement);
    } else {
      answers[qid] = b.dataset.l;
      markSelected(qid, b.dataset.l);
    }
    drawNav();
  };
  draw();
}

/* ---------- LISTENING (practice) ---------- */
function renderListeningPractice(type) {
  const t = T();
  const recs = recListening(type);
  const groups = DATA.listening.filter(g => g.type === type);
  let html = `<div class="part-title">${type === "dialogue" ? t.part1D : t.part2M}</div>`;
  groups.forEach(g => {
    html += `<div class="card"><audio controls preload="none" src="${g.audio}"></audio>
      <details class="script"><summary>${t.showScript}</summary>${g.script.map(s =>
        `<div class="script-line">${s.spk ? `<b>${s.spk === "M" ? "♂" : "♀"}</b>` : ""}${esc(s.text)}</div>`).join("")}</details>`;
    g.questions.forEach(q => {
      html += `<div class="q"><div class="qhead"><span class="qno">${q.no}.</span></div>
        <audio controls preload="none" src="${q.audio}"></audio>${optsHtml({ id: q.id, options: q.options })}</div>`;
    });
    html += `</div>`;
  });
  html += `<p style="text-align:center"><button class="btn" id="sum">${t.summary}</button></p>`;
  app.innerHTML = html;
  const byId = Object.fromEntries(recs.map(r => [r.id, r]));
  app.onclick = e => {
    const b = e.target.closest(".opt");
    if (!b) return;
    const box = b.closest(".opts");
    const qid = box.dataset.qid;
    if (answers[qid]) return;
    answers[qid] = b.dataset.l;
    revealAnswer(byId[qid], box.parentElement);
  };
  $("#sum").onclick = () => showResults(recs);
}

/* ---------- RESULTS ---------- */
function showResults(recs) {
  app.classList.remove("wide");
  rerender = () => showResults(recs);
  app.onclick = null;
  const t = T();
  const ok = r => answers[r.id] === r.answer;
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
  const sec = name => { const rs = recs.filter(r => r.section === name); return { n: rs.length, c: rs.filter(ok).length }; };
  const L_ = sec("listening"), R_ = sec("reading");
  const tot = { n: recs.length, c: recs.filter(ok).length };

  const box = (label, s) => s.n ? `<div class="s"><b>${s.c}/${s.n}</b>${label} · ${pct(s.c, s.n)}%</div>` : "";
  let html = `<span class="badge">${t.results}</span><h1>${t.title}</h1>
    <div class="scorebox">${box(t.listening, L_)}${box(t.reading, R_)}${(L_.n && R_.n) ? box(t.total, tot) : ""}</div>`;

  const table = (title, keyFn, labelFn) => {
    const m = {};
    recs.forEach(r => { const k = keyFn(r); (m[k] = m[k] || { n: 0, c: 0 }); m[k].n++; if (ok(r)) m[k].c++; });
    return `<h2>${title}</h2><table class="stat"><tr><th></th><th>${t.correctOf}</th><th>${t.accuracy}</th></tr>${
      Object.entries(m).map(([k, v]) => `<tr><td>${esc(labelFn(k))}</td><td>${v.c}/${v.n}</td>
        <td><div class="meter ${pct(v.c, v.n) < 60 ? "low" : ""}"><i style="width:${pct(v.c, v.n)}%"></i></div></td></tr>`).join("")}</table>`;
  };
  html += table(t.byType, r => r.type, k => t.type[k] || k);
  html += table(t.bySkill, r => r.skill, k => t.skill[k] || k);

  html += `<h2>${t.review}</h2><p class="notice">${t.explainNote}</p>`;
  recs.forEach(r => {
    const user = answers[r.id];
    const good = user === r.answer;
    const opts = r.options.map((o, i) => {
      const cls = L[i] === r.answer ? "right" : (L[i] === user ? "wrong" : "");
      return `<div class="opt locked ${cls}"><span class="l">(${L[i]})</span><span>${esc(o)}</span></div>`;
    }).join("");
    let head = r.stem ? esc(r.stem) : "";
    let extra = "";
    if (r.type === "gap") {
      const lvl = r.vocabLevel === "outside-8000" ? t.outside : r.vocabLevel;
      extra = `<div>${esc(r.answerWord || "")} <span class="tag">${t.wordLevel}: ${esc(lvl || "")}</span></div>`;
    }
    let script = "";
    if (r.group) {
      script = `<details class="script"><summary>${t.showScript}</summary>${r.group.script.map(s =>
        `<div class="script-line">${s.spk ? `<b>${s.spk === "M" ? "♂" : "♀"}</b>` : ""}${esc(s.text)}</div>`).join("")}</details>`;
    }
    html += `<div class="q"><div class="qhead"><span class="qno">${r.no}.</span>${head}
      <span class="${good ? "mark-ok" : "mark-no"}">${good ? "✓" : "✗"}</span><span class="tag">${esc(t.skill[r.skill] || r.skill)}</span></div>
      <div class="opts">${opts}</div>
      <div class="explain">${t.yourAnswer}: ${user ? "(" + user + ")" : t.unanswered} · ${t.correctAnswer}: (${r.answer})
        ${extra}<div>${t.explanation}: ${esc(expl(r))}</div>${script}</div></div>`;
  });
  html += `<p style="text-align:center"><a class="btn secondary" href="index.html">${t.home}</a>
    <button class="btn" id="retry">${t.retry}</button></p>`;
  app.innerHTML = html;
  $("#retry").onclick = () => location.reload();
  window.scrollTo(0, 0);
}

/* ---------- boot ---------- */
async function boot() {
  const setBrand = () => { $("#brand").textContent = T().brand; document.title = T().title + " — Nova Nursery"; };
  mountLangSwitch($("#langSwitch"), () => { setBrand(); if (rerender) rerender(); });
  setBrand();
  const parts = await Promise.all(SET_IDS.map(id => fetch(`data/${id}.json`).then(r => r.json())));
  DATA = parts.length === 1 ? parts[0] : mergeSets(parts);
  const all = () => recListening().concat(recReading());
  switch (MODE) {
    case "full": showListeningIntro(() => showReadingIntro(() => showResults(all()))); break;
    case "listening": showListeningIntro(() => showResults(recListening())); break;
    case "reading": showReadingIntro(() => showResults(recReading())); break;
    case "p-dialogue": renderListeningPractice("dialogue"); break;
    case "p-monologue": renderListeningPractice("monologue"); break;
    case "p-gap": renderReadingPage({ practice: true, type: "gap" }); break;
    case "p-comp": renderReadingPage({ practice: true, type: "comp" }); break;
    default: app.textContent = "Unknown mode";
  }
}
boot();
