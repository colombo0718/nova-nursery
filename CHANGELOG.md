# CHANGELOG.md — 里程碑與架構決策紀錄

---

## 2026-11-05

### 新產品線：MockExam（TOCFL Band C 模擬考試）
- 依官方 Band C 題型原創出題（非官方，頁面明示）；`mini01` 題組＝聽力 25＋閱讀 25，完整考試流程、分題型練習、成績與能力分析、三語介面（en/vi/zh）
- 聽力音檔用 edge-tts（zh-TW 男/女/旁白三聲）＋ffmpeg 串接，題目與選項由旁白念，照官方規則只播一遍、選項後停 5 秒
- 題庫→音檔→網頁資料的建置腳本在 `MockExam/tools/build.py`，之後擴充題組只需新增 items JSON
- 決策：先做半套（25＋25）把流程跑通再補滿 50＋50；TTS 先 edge-tts，labs 的 GPT-SoVITS 備用（不支援越南語、需參考音檔）

### 資料核對
- 《趣學TOCFL流利精通級詞彙》323 詞只有 63 詞對得上華語八千詞表 2.0——書用的是國教院詞表 6、7 級（累計 9,473／14,470 詞），八千詞表 2.0 只到 7,517 詞

---

## 2026-11-05

### TOCFL Band C 模擬考試網頁 v0.1（流程打通版，預覽站）
- `mock-exam/`：完整模擬（聽力＋閱讀）／僅聽力／僅閱讀／分題型練習四種入口；聽力考試模式依官方規則（每段只播一遍、題目只在音檔、選項後倒數 5 秒），閱讀 30 分鐘計時；成績頁依題型／技能／詞彙等級（對八千詞表）分析，逐題解析（英／越）與聽力逐字稿
- 題庫 50 題全部原創（聽力：對話 5 組×2＋獨白 5 組×3；閱讀：選詞填空 2 篇×5＋閱讀理解 5 篇×3），官方題庫只參考題型與難度；音檔由 edge-tts（zh-TW 男女聲）產生；題庫來源與建置腳本在 `scripts/mockexam/`
- 預覽網址 `mockexam-preview.nova-nursery.pages.dev/mock-exam/`（未上正式站）；越南文說明為機器初稿待母語者審閱

---

## 2026-09-11（晚間，核對 Sentence Summoner 上線版現況）

### 確認造句對戰規格已被上線版取代
- 到 `D:\strategy-space\SentenceSummoner\`（獨立專案）核對 `GAME-RULES.md`/`DECK-DESIGN.md`/`TODO.md`，確認實際上線玩法已跟本專案 `notes/` 內 2025-11 的最初概念草案完全不同世代：64 張卡改為 32 名詞/16 動詞/16 形容詞（**捨棄副詞卡與陷阱卡**）、加入護甲池破甲、速度閃避骰、詛咒、暫時 buff、溢出傷害（踐踏）、教學/訓練/對戰三模式、四種語言版架構、LLM 對手與裁判（souls-hall）已接入
- 更新 PROJECT.md §7.2/§11/§13、TODO.md，標明本地舊稿僅供歷史對照、指向 strategy-space 專案內的權威規格檔，清空已被取代的舊待辦

---

## 2026-09-11（下午，內容複查修正）

### 修正發現的內容問題
- **救回誤刪的造句對戰規格文件**：2026-07-26 清理時把 `漢語單詞遊戲卡造句對戰系統 v1.0.md` 與 `_v1.0.md` 兩份重複檔案**都刪了**（本意應是去重留一份），導致 PROJECT.md/TODO.md 連結斷了一個多月。從 git 歷史（`4dd45b6` 的上一版）復原內容到 `notes/漢語單詞遊戲卡造句對戰系統 v1.0.md`
- **修正越南文官網誤導文案**：`vi/index.html` 首頁 promo banner 原寫「trích từ bộ đề thi thử chính thức TOCFL」（取自官方 TOCFL 模擬試題庫），但該題目其實是自製原創、非官方真題，跟考題頁本身的免責聲明矛盾，已改為「Đề tự biên soạn theo phong cách TOCFL Band C」
- **修正斷連結**：`curriculum/book-01-hsk1.md` §9、`PROJECT.md` §8.2 各有一處連結漏了 `notes/` 路徑前綴，已補上
- **修正拼音卡資料**：`pinyinDeck.js` W 組 hex F「圍」的拼音 `wei` 補上聲調 `wéi`，跟其他卡片體例一致

---

## 2026-09-11

### 品牌定名 Nova Nursery 星苑（colombo 拍板，取代過渡名 HanHub 漢匯）
- 品牌沿革：xuanxuexi 宣學習 → HanHub 漢匯 → **Nova Nursery 星苑**（定案）
- 命名意涵詳見 `PROJECT.md` §1a：Nova=爆亮新星（學員）、Nursery=安全育苗環境、星苑=諧音「心願」；在 LL 宇宙中承接 Leaf 側（在地培育），對應 Strategy Space 的 Lune 側（宇宙競技）
- 專案資料夾更名為 `nova-nursery/`（原 repo 名 XuanXuexi）
- 品牌資產檔更名：`XuanXuexi_emoji.png` → `NovaNursery_emoji.png`、`Card/xuanxuexi_emoji.png` → `Card/nova-nursery_emoji.png`
- 官網（`index.html` / `en/index.html` / `vi/index.html` / `vi/c1-mock-exam.html`）與 Pinyin Poker 卡牌生成頁（`Card/pinyinPoker64.html` / `pinyinPoker64_download.html`）品牌文字全面替換為 Nova Nursery
- PROJECT.md / README.md / TODO.md 同步更新；`curriculum/book-01-hsk1.md` 書名標題更新
- **待確認**：CF Pages 專案與 DNS 是否已跟進改名（暫定網域 `novanursery.leaflune.org`，尚未核實實際部署狀態）；`notes/` 內歷史規劃文件（課程地圖 v1.0/v2.0、市場研究）維持原檔名與內文舊名——視為歷史沉澱文件，不追溯改名

---

## 2026-07-26

### 官網越南文版 + TOCFL C1 模擬試題上線
- `vi/index.html`：越南文首頁上線，跟英文版共用設計系統
- `vi/c1-mock-exam.html`：TOCFL C1（Band C）模擬試題頁，5 段克漏字 30 題，**自製原創題目**（非官方真題，改寫自對官方 Band C 說明 PDF 的難度/出題邏輯理解）
- 修正越南文聲調符號渲染大小不一問題：導入 Google Fonts「Be Vietnam Pro」（完整越南文字符集支援）
- 英文版首頁 Sentence Summoner 產品卡接上實際上線連結（strategy-space.leaflune.org）

### 專案檔案整理
- LL 宇宙戰略文件（`LL_Universe_MasterPlan_v1.md` 等 5 份）搬離本專案至 `matrix-manager/inbox/`——這些文件跟 xuanxuexi 對外品牌無關，留在會被部署的目錄裡是外流風險
- 7 份產品規劃 .md（課程地圖、造句對戰規格、Flashcard 商業模式等）從根目錄歸檔進 `notes/`
- 刪除 2 份重複的「漢語單詞遊戲卡造句對戰系統」文件（`v1.0.md` / `_v1.0.md`）
- `C:\Users\USER\tocfl_bank`（TOCFL 官方素材庫、554 檔）移入本專案 `tocfl_bank/`
- 建立「乾淨資料夾部署」SOP：`wrangler pages deploy .` 絕不可對 repo 根目錄直接執行，需先複製 `index.html`/`Card/`/`vi/` 到暫存資料夾再部署，避免大型素材檔超過 CF Pages 25MiB 限制、以及內部文件外流

### 定位擴充
- colombo 明確定位 XX 為完整線上中文學習平台：教材 → 評量測驗 → 應考輔助，終局輸送「中文流利 + 懂 AI 科技」人才銜接學校/企業；客群明確為英文/越南文母語者，簡繁通吃

---

## 2026-05-08

### XX 重啟與課綱設計會議
- 揭露 XX 品牌背景：為 colombo 越南女友 Xuan 量身打造的姐妹品牌（非單純 LL 子品牌）
- 確立課綱對齊 **HSK**（非 TOCFL）
- 設計 9 冊 131 章螺旋式課綱骨架：初級 3 冊 38 章／中級 3 冊 45 章／高級 3 冊 48 章
- 12 主題 × 9 級別螺旋矩陣（同主題隨級別複雜化）
- 理論依據：Bruner Spiral Curriculum + Bengio Curriculum Learning
- 詳見會議紀錄：`matrix-manager/meetings/2026-05-08-xx-revival-and-curriculum-design.md`（**課綱尚未定案**，待對齊每冊章數、AI 線織入方式等事項）
- PROJECT.md 全面對齊 LL 三軸架構與 content-engine

---

## 2026-04-05

### 文件體系建立
- 建立 `CLAUDE.md`（AI 協作規範）、`PROJECT.md`（專案架構說明）、`README.md`、`TODO.md`、`CHANGELOG.md`
- 明確規範 Gemini / Codex 分工原則與 PROJECT.md 更新 SOP

---

## 2026-04-04

### Pinyin Poker 64 卡牌圖完成
- `Card/pp64/`：64 張 XuanXuexi 版 PNG 生成完畢
- `Card/pp64_ll/`：64 張 LeafLune 版 PNG 生成完畢
- 網頁原型完成（`index.html`、`pinyinPoker64.html`、`manyMoji.html` 等）
- 從 Neocities 備份至本地（`download_neocities_folder.py`）

---

## 2026-03-29

### TOCFL 教材生成工具
- `tocfl-material-gen/` 建立，含 `download_resources.py` 與範例素材

---

## 2026-03-25

### LL 宇宙規劃文件定稿
- `LL_Universe_MasterPlan_v1.md`：宇宙總藍圖 v1
- `LL生態系架構.md`：五大平台架構與三大閉環
- `LeafLune Universe 關係架構總覽.md`：品牌 × 平台 × IP × 商品層次
- `宣學習課程地圖架構 v1.0.md`：HSK 3.0 課程骨架
- `漢語單詞遊戲卡造句對戰系統 v1.0.md`：Sentence Summoner 完整規格
- `LeafLune 卡牌桌遊產品輸出標準 v1.0.md`：卡牌出版 SOP
- `Chinese Flashcard 商業模式規劃.md`：Flashcard MVP 與三維分類系統

---

## 架構決策紀錄

### 卡牌規格採用標準撲克牌尺寸（63 × 88 mm）
決策原因：市場通用規格，印刷廠備有標準模具，成本最低，使用者熟悉。

### 64 張分成 L/S/R/W 四花色各 16 張
決策原因：對應漢語學習四大技能（聽/說/讀/寫），十六進位識別碼（0–F）天然對應，視覺分類清晰。

### 卡牌資料分為兩套（pinyinDeck.js / pinyinDeck_ds.js）
決策原因：兩套 Emoji 圖集（xuanxuexi_emoji.png vs leaflune_emoji.png），對應不同品牌輸出需求。

### Sentence Summoner 數值只用加減法 + d6 骰子
決策原因：目標用戶是學生，運算要夠簡單；只用 d6 降低道具門檻。
