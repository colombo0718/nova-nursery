"""Build the Band C mock exam data + audio.

Usage:  python build_mock_exam.py [--no-audio]
Reads  content_listening.json / content_reading.json  (first option of every
question is the correct one), shuffles options with a fixed seed, tags target
vocabulary with the TOCFL 8000-word list level, renders listening audio with
edge-tts and writes  mock-exam/data/bandc-set1.js .
"""
import asyncio
import hashlib
import json
import random
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT_DIR = ROOT / "mock-exam"
AUDIO_DIR = OUT_DIR / "audio"
DATA_JS = OUT_DIR / "data" / "bandc-set1.js"
MANIFEST = HERE / ".audio_manifest.json"
WORDLIST = ROOT / "tocfl-material-gen" / "vocabulary" / "華語八千詞(內含注音字型檔)" / "華語八千詞表20240923.xlsx"

NARRATOR = "zh-TW-HsiaoYuNeural"
LETTERS = ["A", "B", "C", "D"]
NUM_ZH = {1: "一", 2: "兩", 3: "三", 4: "四", 5: "五", 6: "六"}
ORD_ZH = {1: "第一題", 2: "第二題", 3: "第三題", 4: "第四題"}
LEVEL_ABBR = ["準1", "準2", "入", "基", "進", "高", "流"]

NO_AUDIO = "--no-audio" in sys.argv


def load_levels():
    import openpyxl

    wb = openpyxl.load_workbook(WORDLIST, read_only=True, data_only=True)
    table = {}
    for idx, abbr in enumerate(LEVEL_ABBR):
        ws = wb[wb.sheetnames[idx]]
        col = 1 if idx <= 3 else 0
        for r in ws.iter_rows(min_row=2, values_only=True):
            v = r[col] if len(r) > col else None
            if not v:
                continue
            for w in re.split(r"[/、]", str(v)):
                w = w.strip()
                if w and w not in table:
                    table[w] = abbr
    return table


LEVELS = load_levels()


def tag_focus(words):
    return [{"w": w, "lv": LEVELS.get(w, "-")} for w in words]


def balanced_targets(n, seed):
    """Correct-answer positions, as evenly spread over A-D as possible, in random order."""
    pool = [i % 4 for i in range(n)]
    random.Random(seed).shuffle(pool)
    return pool


TARGETS = {"listening": balanced_targets(25, 11), "reading": balanced_targets(25, 23)}
_cursor = {"listening": 0, "reading": 0}
_section = ["listening"]


def shuffle_question(q, key):
    opts = list(q["options"])
    correct = opts[0]
    others = opts[1:]
    random.Random(key).shuffle(others)
    sec = _section[0]
    target = TARGETS[sec][_cursor[sec]]
    _cursor[sec] += 1
    others.insert(target, correct)
    return others, target


def build_question(q, key):
    opts, ans = shuffle_question(q, key)
    return {
        "stem": q.get("stem", ""),
        "options": opts,
        "answer": ans,
        "skill": q.get("skill", ""),
        "focus": tag_focus(q.get("focus", [])),
        "explain": q["explain"],
    }


# ---------------------------------------------------------------- audio
manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-600:])


async def tts_to(path: Path, text: str, voice: str):
    import edge_tts

    for attempt in range(4):
        try:
            await edge_tts.Communicate(text, voice).save(str(path))
            if path.stat().st_size > 500:
                return
        except Exception:
            await asyncio.sleep(2 * (attempt + 1))
    raise RuntimeError(f"tts failed: {text[:20]}")


async def tts_many(jobs, limit=4):
    sem = asyncio.Semaphore(limit)

    async def one(f, text, voice):
        async with sem:
            await tts_to(f, text, voice)

    await asyncio.gather(*(one(*j) for j in jobs))


def silence(path: Path, seconds: float):
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(seconds),
         "-c:a", "libmp3lame", "-b:a", "48k", str(path)])


def render(name: str, parts, tmp: Path):
    """parts: list of ('say', voice, text) | ('gap', seconds). Returns relative audio path."""
    sig = hashlib.sha1(json.dumps(parts, ensure_ascii=False).encode("utf-8")).hexdigest()
    out = AUDIO_DIR / f"{name}.mp3"
    rel = f"audio/{name}.mp3"
    if out.exists() and manifest.get(name) == sig:
        return rel
    if NO_AUDIO:
        return rel
    files = [tmp / f"{name}_{i}.mp3" for i in range(len(parts))]
    for f, p in zip(files, parts):
        if p[0] == "gap":
            silence(f, p[1])
    jobs = [(f, p[2], p[1]) for f, p in zip(files, parts) if p[0] == "say"]
    asyncio.run(tts_many(jobs))
    lst = tmp / f"{name}.txt"
    lst.write_text("\n".join(f"file '{f.as_posix()}'" for f in files), encoding="utf-8")
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-ar", "24000", "-ac", "1",
         "-c:a", "libmp3lame", "-b:a", "48k", str(out)])
    manifest[name] = sig
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    for f in files:
        f.unlink(missing_ok=True)
    lst.unlink(missing_ok=True)
    return rel


def question_audio(gid, qi, built_q, tmp):
    parts = [("say", NARRATOR, f"{ORD_ZH[qi + 1]}。{built_q['stem']}"), ("gap", 0.6)]
    for i, o in enumerate(built_q["options"]):
        parts.append(("say", NARRATOR, f"{LETTERS[i]}，{o}"))
        parts.append(("gap", 0.45))
    return render(f"{gid}_q{qi + 1}", parts, tmp)


def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "data").mkdir(parents=True, exist_ok=True)
    tmp = HERE / "_tmp_audio"
    tmp.mkdir(exist_ok=True)

    lis = json.loads((HERE / "content_listening.json").read_text(encoding="utf-8"))
    rea = json.loads((HERE / "content_reading.json").read_text(encoding="utf-8"))

    listening = []
    for d in lis["dialogues"]:
        qs = [build_question(q, f"{d['id']}-{i}") for i, q in enumerate(d["questions"])]
        n = len(qs)
        parts = [("say", NARRATOR, f"請聽這段對話，然後回答下面的{NUM_ZH[n]}個問題。"), ("gap", 1.0)]
        for ln in d["lines"]:
            parts.append(("say", d["voices"][ln["s"]], ln["t"]))
            parts.append(("gap", 0.5))
        listening.append({
            "id": d["id"], "type": "dialogue", "kind": "對話",
            "transcript": [{"s": ln["s"], "t": ln["t"]} for ln in d["lines"]],
            "audioPassage": render(f"{d['id']}_p", parts, tmp),
            "audioQuestions": [question_audio(d["id"], i, q, tmp) for i, q in enumerate(qs)],
            "questions": qs,
        })
    for m in lis["monologues"]:
        qs = [build_question(q, f"{m['id']}-{i}") for i, q in enumerate(m["questions"])]
        n = len(qs)
        intro = m["text"].startswith("請聽")
        parts = []
        if not intro:
            parts += [("say", NARRATOR, f"請聽這段{m['kind']}，然後回答下面的{NUM_ZH[n]}個問題。"), ("gap", 1.0)]
        parts.append(("say", m["voice"], m["text"]))
        listening.append({
            "id": m["id"], "type": "monologue", "kind": m["kind"],
            "transcript": [{"s": "N", "t": m["text"]}],
            "audioPassage": render(f"{m['id']}_p", parts, tmp),
            "audioQuestions": [question_audio(m["id"], i, q, tmp) for i, q in enumerate(qs)],
            "questions": qs,
        })

    _section[0] = "reading"
    gaps = []
    for g in rea["gaps"]:
        gaps.append({
            "id": g["id"], "text": g["text"],
            "questions": [build_question(q, f"{g['id']}-{i}") for i, q in enumerate(g["questions"])],
        })
    passages = []
    for p in rea["passages"]:
        passages.append({
            "id": p["id"], "text": p["text"],
            "questions": [build_question(q, f"{p['id']}-{i}") for i, q in enumerate(p["questions"])],
        })

    data = {
        "meta": {"band": "C", "set": 1, "title": "TOCFL Band C style mock — Set 1 (original items)"},
        "listening": listening, "gaps": gaps, "passages": passages,
    }
    DATA_JS.write_text(
        "window.MOCK_EXAM = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8"
    )

    # sanity report
    dist = {k: 0 for k in LETTERS}
    nq = 0
    for grp in listening + gaps + passages:
        for q in grp["questions"]:
            dist[LETTERS[q["answer"]]] += 1
            nq += 1
    lvl = {}
    for grp in listening + gaps + passages:
        for q in grp["questions"]:
            for f in q["focus"]:
                lvl[f["lv"]] = lvl.get(f["lv"], 0) + 1
    report = f"questions={nq} answer_dist={dist} focus_levels={lvl}"
    (HERE / "_build_report.txt").write_text(report, encoding="utf-8")
    print("ok", nq)


if __name__ == "__main__":
    main()
