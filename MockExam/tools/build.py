"""Build the mock-exam data + audio from items_*.json.

Usage:  python build.py items_mini01.json [--force]
Needs:  pip install edge-tts openpyxl ; ffmpeg + ffprobe on PATH.
Outputs: ../data/<set_id>.json , ../audio/<set_id>/*.mp3
"""
import asyncio
import json
import os
import random
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import edge_tts

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
FORCE = "--force" in sys.argv
SRC = HERE / sys.argv[1]
items = json.loads(SRC.read_text(encoding="utf-8"))
SET = items["set_id"]
AUDIO_DIR = ROOT / "audio" / SET
DATA_DIR = ROOT / "data"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

V_M, V_F, V_NARR = "zh-TW-YunJheNeural", "zh-TW-HsiaoChenNeural", "zh-TW-HsiaoYuNeural"
MONO_VOICE = {"LM1": V_M, "LM2": V_F, "LM3": V_M, "LM4": V_F, "LM5": V_NARR}
LETTERS = "ABCD"
ZH_NUM = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]


def zh_num(n: int) -> str:
    if n <= 10:
        return ZH_NUM[n]
    if n < 20:
        return "十" + ZH_NUM[n - 10]
    t, o = divmod(n, 10)
    return ZH_NUM[t] + "十" + (ZH_NUM[o] if o else "")


# ---------- 1. balance the position of correct answers ----------
def balanced_targets(n: int, rng: random.Random):
    seq = (list(LETTERS) * (n // 4 + 1))[:n]
    rng.shuffle(seq)
    return seq


def remap(q, target):
    opts = q["options"]
    ci = LETTERS.index(q["answer"])
    correct = opts[ci]
    rest = [o for i, o in enumerate(opts) if i != ci]
    ti = LETTERS.index(target)
    new = rest[:ti] + [correct] + rest[ti:]
    q["options"] = new
    q["answer"] = target


rng = random.Random(20261105)
l_qs = [q for g in items["listening"] for q in g["questions"]]
for q, t in zip(l_qs, balanced_targets(len(l_qs), rng)):
    remap(q, t)
r_qs = [b for g in items["reading"]["gap"] for b in g["blanks"]] + \
       [q for g in items["reading"]["comp"] for q in g["questions"]]
for q, t in zip(r_qs, balanced_targets(len(r_qs), rng)):
    remap(q, t)

# ---------- 2. vocabulary level lookup (huayu 8000 list 2.0) ----------
LEVELS = ["Novice1", "Novice2", "Level1", "Level2", "Level3", "Level4", "Level5"]
word_level = {}
try:
    import openpyxl
    xl = ROOT.parent / "tocfl-material-gen" / "vocabulary" / "華語八千詞(內含注音字型檔)" / "華語八千詞表20240923.xlsx"
    wb = openpyxl.load_workbook(xl, read_only=True, data_only=True)
    for idx, name in enumerate(LEVELS):
        ws = wb[wb.sheetnames[idx]]
        col = 1 if idx <= 3 else 0
        for r in ws.iter_rows(min_row=2, values_only=True):
            v = r[col] if len(r) > col else None
            if v:
                for w in re.split(r"[/、]", str(v)):
                    word_level.setdefault(w.strip(), name)
except Exception as e:  # level tags are optional
    print("vocab level lookup skipped:", e)

# ---------- 3. audio helpers ----------
def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


async def tts_to(text, voice, path):
    for attempt in range(5):
        try:
            await edge_tts.Communicate(text, voice).save(str(path))
            await asyncio.sleep(0.6)
            return
        except Exception as e:
            print(f"  tts retry {attempt + 1} ({type(e).__name__}) voice={voice} text={text[:30]!r}", flush=True)
            if attempt == 4:
                raise
            await asyncio.sleep(3 * (attempt + 1))


def silence(path, sec):
    ff("-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(sec),
       "-ar", "24000", "-ac", "1", "-b:a", "48k", str(path))


async def build_audio(out_path: Path, parts, tmp: Path):
    """parts: list of ('say', text, voice) | ('pause', seconds)"""
    if out_path.exists() and not FORCE:
        return
    files = []
    for i, p in enumerate(parts):
        f = tmp / f"{out_path.stem}_{i}.mp3"
        if p[0] == "say":
            raw = tmp / f"{out_path.stem}_{i}_raw.mp3"
            await tts_to(p[1], p[2], raw)
            ff("-i", str(raw), "-ar", "24000", "-ac", "1", "-b:a", "48k", str(f))
        else:
            silence(f, p[1])
        files.append(f)
    lst = tmp / f"{out_path.stem}_list.txt"
    lst.write_text("\n".join(f"file '{x.as_posix()}'" for x in files), encoding="utf-8")
    ff("-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out_path))


def duration(path: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True)
    return round(float(r.stdout.strip()), 2)


async def main():
    out = {"set_id": SET, "title": items["title"], "listening": [], "reading": {"gap": [], "comp": []}}
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        qno = 0
        for g in items["listening"]:
            gid = g["id"]
            # passage audio
            parts = [("say", g["intro"], V_NARR), ("pause", 1.0)]
            if g["type"] == "dialogue":
                for spk, line in g["turns"]:
                    parts.append(("say", line, V_M if spk == "M" else V_F))
                    parts.append(("pause", 0.5))
            else:
                parts.append(("say", g["text"], MONO_VOICE.get(gid, V_NARR)))
            p_path = AUDIO_DIR / f"{gid}.mp3"
            await build_audio(p_path, parts, tmp)
            grp = {"id": gid, "type": g["type"], "intro": g["intro"],
                   "audio": f"audio/{SET}/{gid}.mp3", "duration": duration(p_path),
                   "script": [{"spk": s, "text": t} for s, t in g["turns"]] if g["type"] == "dialogue" else [{"spk": "", "text": g["text"]}],
                   "questions": []}
            for qi, q in enumerate(g["questions"], 1):
                qno += 1
                opts_say = "。".join(f"{LETTERS[i]}，{o}" for i, o in enumerate(q["options"])) + "。"
                parts = [("say", f"第{zh_num(qno)}題。{q['stem']}", V_NARR), ("pause", 0.6),
                         ("say", opts_say, V_NARR)]
                q_path = AUDIO_DIR / f"{gid}_q{qi}.mp3"
                await build_audio(q_path, parts, tmp)
                grp["questions"].append({
                    "id": f"{gid}_q{qi}", "no": qno, "stem": q["stem"], "options": q["options"],
                    "answer": q["answer"], "skill": q["skill"], "explain": q["explain"],
                    "audio": f"audio/{SET}/{gid}_q{qi}.mp3", "duration": duration(q_path)})
            out["listening"].append(grp)
            print("built", gid)

        rno = 0
        for g in items["reading"]["gap"]:
            blanks = []
            for b in g["blanks"]:
                rno += 1
                ans_word = b["options"][LETTERS.index(b["answer"])]
                blanks.append({"id": f"{g['id']}_b{b['n']}", "no": rno, "n": b["n"], "options": b["options"],
                               "answer": b["answer"], "skill": b["skill"], "explain": b["explain"],
                               "answer_word": ans_word, "vocab_level": word_level.get(ans_word, "outside-8000")})
            out["reading"]["gap"].append({"id": g["id"], "passage": g["passage"], "blanks": blanks})
        for g in items["reading"]["comp"]:
            qs = []
            for q in g["questions"]:
                rno += 1
                qs.append({"id": f"{g['id']}_q{len(qs) + 1}", "no": rno, "stem": q["stem"], "options": q["options"],
                           "answer": q["answer"], "skill": q["skill"], "explain": q["explain"]})
            out["reading"]["comp"].append({"id": g["id"], "passage": g["passage"], "questions": qs})

    (DATA_DIR / f"{SET}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    n_l = sum(len(g["questions"]) for g in out["listening"])
    n_r = rno
    print(f"done: listening={n_l} reading={n_r}")


asyncio.run(main())
