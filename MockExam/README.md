# MockExam（暫名）— TOCFL Band C 模擬考試

> Nova Nursery 底下的產品線（跟 `StoryLearn/` 同級）。資料夾名稱是暫定，還沒有正式產品名。

## 這是什麼

依 TOCFL Band C（流利精通級）官方題型，**原創**出題做成的網頁模擬考試。**非官方**，題目全部自製，不照抄官方試題或《趣學TOCFL》的句子。

- 聽力：對話、段落（每段只播一次；題目與選項由旁白念出，選項念完停 5 秒；題本畫面只顯示選項）
- 閱讀：選詞填空、閱讀理解（計時、交卷後自動算分）
- 成績頁：聽力/閱讀分數、依題型與依能力分析、逐題檢討（含聽力腳本、解析、選詞填空的詞彙等級）
- 練習模式：分題型、不計時、可重播音檔、作答後立即顯示答案與解析
- 介面語言：英文／越南文／中文；題目與解析目前只有繁體中文

## 目前題組

`mini01`：聽力 25 題（對話 5 組×2 題、段落 5 組×3 題）＋閱讀 25 題（選詞填空 2 篇×5 空、閱讀理解 5 篇×3 題）。是把整個流程跑通用的半套題組，官方一整套是各 50 題。

## 怎麼運作

```
tools/items_mini01.json   原始題庫（人工撰寫，含答案、能力標籤、解析）
tools/build.py            讀題庫 → 選項位置平衡打散 → edge-tts 產音檔 → 輸出 data/ 與 audio/
data/mini01.json          網頁讀取的題組資料（已打散選項）
audio/mini01/*.mp3        音檔（旁白 zh-TW-HsiaoYuNeural、男聲 YunJheNeural、女聲 HsiaoChenNeural）
index.html / exam.html    首頁與考試頁；app.js 引擎、i18n.js 介面字串、style.css
```

新增題組：複製 `tools/items_mini01.json` 改成 `items_xxx.json`，執行 `python tools/build.py items_xxx.json`（需要 `pip install edge-tts openpyxl`、ffmpeg/ffprobe）。音檔已存在就不重產，要重產加 `--force`。edge-tts 偶爾回「沒收到音訊」，腳本會自動重試。

網址參數：`exam.html?set=mini01&mode=full|listening|reading|p-dialogue|p-monologue|p-gap|p-comp`；加 `&fast=1` 是測試用（音檔 16 倍速、倒數縮短）。

## 規則與限制

- 命題參考：官方 Band C 模擬題庫格式（聽力 50 題約 60 分、閱讀 50 題 60 分；四選一）。官方檔案下載在 repo 外，有版權、不進 git
- 沒有官方分數換算，頁面明示「非官方」
- 選詞填空的詞彙等級用華語八千詞表 2.0 標註；詞表外的標 `outside-8000`
- 聽力音檔是 edge-tts（需微軟線上服務才能**重新產生**；網頁播放本身只讀靜態 mp3，不需連線）

## 待辦

- [ ] 擴充到完整 50＋50 題組、增加更多題組
- [ ] 解析的英文與越南文翻譯
- [ ] 聽力音檔人工試聽檢查（目前只驗證過長度與播放流程，沒有逐段聽過）
- [ ] 正式產品名；是否掛上主站導覽
