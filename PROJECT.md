# PROJECT.md — Nova Nursery 星苑（XX，原 xuanxuexi 宣學習 → HanHub 漢匯 → Nova Nursery 星苑）

> 最後更新：2026-09-11
> 本檔供 Claude（AI）閱讀，了解本專案在 LL 宇宙中的位置、架構與開發規範。

---

## 1. LL 三軸定位

| 軸 | 座標 | 說明 |
|----|------|------|
| 空間軸 | **對外品牌** | 直面市場的子品牌，主要客群是中文學習者（英文/越南文母語） |
| 時間軸 | **重啟中、官網已上線** | 官網 [nova-nursery.leaflune.org](https://nova-nursery.leaflune.org) 已上線（英文版 + 越南文版 `/vi`），Sentence Summoner 已在 strategy-space.leaflune.org 上線；其餘產品線（Pinyin Poker、Chinese Flashcard）仍在推進 |
| 內容軸 | **學習軸（主）+ 玩樂軸（副）** | XX 是 LL 整體中「學習」的對外旗艦；玩樂副線體現在卡牌/遊戲化（Pinyin Poker、Sentence Summoner） |

XX 在 LL 宇宙中的角色：**「學習」這條軸目前對外只有 XX 一個品牌**——XX 走得起來，LL 整體的「Edutainment」才真正完整。

---

## 1a. 品牌命名：Nova Nursery 星苑（2026-09-11 colombo 定案）

品牌名歷經 xuanxuexi 宣學習 → HanHub 漢匯 → **Nova Nursery 星苑**，本次為定案版本，每一層都有意涵：

- **Nova**（拉丁文，突然爆亮的新星）：說的是學員——每個在這裡學習的人，都有可能在某個時刻成為那顆爆亮的星
- **Nursery**（苗圃、育嬰室）：不是補習班，是讓人在安全、有養分的環境裡慢慢長出能力的地方，育人如育苗
- **星苑**：「苑」是有圍牆的花園、精心照料的場域，星苑 = 培育星星的園地；諧音「心願」（xīn yuàn）——學語言從來不只是技能，是想靠近一個人、打開一個世界、成為不一樣的自己
- **在 LL 宇宙中的位置**：LeafLune = Leaf（土地、生長）+ Lune（月、宇宙）。Nova Nursery 承接 **Leaf 側**（在地、有機、培育），Strategy Space 承接 **Lune 側**（宇宙、競技、無邊）——兩者各守一半靈魂，共同撐起 LeafLune 的 Edutainment 世界觀

---

## 2. 一段話定位

XX 是面向外國人（英文/越南文母語）的完整線上中文學習平台，簡體繁體皆可學。從**學習教材 → 評量測驗 → 應考輔助**一條龍，終局目標是輸送「中文流利且懂 AI 與科技」的人才，銜接學校深造或企業服務。語言不是目的，而是進入生活與職場的門票；AI 不是噱頭，而是放大效率的工具。

目前已上線：官網（含越南文版）、TOCFL C1 模擬試題（自製、非官方真題）、Sentence Summoner（造句對戰，於 strategy-space.leaflune.org）。仍在推進：**Pinyin Poker 64**（80% 完成，卡在 PDF 與 Gumroad 上架）、**Chinese Flashcard L1 Travel 60 字**（最快 MVP 切片）。

> 2026-07-26：定位從「學習平台」擴充為「人才管線」——教材/評量/應考輔助之外，明確終局是銜接學校與企業，此擴充尚未回填進課程地圖與內容產線設計，待下次課綱討論落實。

---

## 3. 核心 IP：小春老師

> XX 跟 LL 最大的差異：**LL 是 colombo 第一人稱，XX 是小春老師代言**。

- 小春老師是 XX 所有教學內容的**唯一權威主講者**
- 規則：所有「知識解說、學習目標、重點整理、錯誤提醒」一律由小春老師出場
- 確保學習者的信任感與一致性
- **形象未定型**：影片中長怎樣、是真人還是 AI 角色、卡通風格還是寫實風格——尚未決定
  - 形象不定，後續所有 XX 內容（影片、卡片插圖、官網主視覺）都無法量產
  - 這是 image-studio **路徑 B（GPU ComfyUI + LoRA）** 真正值得提前的最強理由

---

## 4. 課程地圖架構（HSK × 情境 × AI 漸進三層）

詳見 [`notes/宣學習課程地圖架構v2.0（整併版）.md`](notes/宣學習課程地圖架構v2.0（整併版）.md)——整併三級總覽、9 冊 131 章骨架、12 主題螺旋矩陣、評量/應考輔助缺口盤點。v2.0 開頭列了 4 處新舊決策張力（越南文公開與否、品牌屬性、TOCFL 錨點、客群語言）尚待 colombo 拍板，下次課綱討論務必先對齊這幾點。

| 級別 | HSK | 情境 | AI 涉及 |
|------|-----|------|---------|
| 初級 | 1-3 | 生活生存、日常溝通 | 無 |
| 中級 | 4-6 | 校園/工廠/辦公室過渡 | 作為話題出現，不依賴 |
| 高級 | 7-9 | 專業職場、跨部門協作 | 正式導入為任務工具 |

四條主線：語言能力 / 情境成長 / AI 融合 / 動力與留存（任務制 + 點數）。

每個單元的標準結構（可量產模板）：小春老師開場 → 新單字句型 → 情境對話 → 朗讀練習 → 練習題 → 單元小測 → 完成回饋。

---

## 5. 內容產線（單源多出）

XX 採用「**一份素材、兩條變現路徑**」的單源多出產線：

```
上游（量產層）
  教學投影片 + 講稿
  ├─ content-engine 生成（HSK 級別 / 情境 / 文法點 模板化）
  └─ image-studio 生成（小春老師形象、場景插圖、卡片視覺）

  ↓ 同一份素材分流

分流 A：影片化 → 會員訂閱內容
  投影片 + 旁白 → ffmpeg 拼接 → 會員訂閱制（YouTube 會員 / 自有訂閱平台）

分流 B：直送真人課
  投影片直接交給 Xuan → 線上課真人教學
  + colombo 課程末尾中文母語者 cameo 互動

→ 一份備課素材 = 兩條收入流
→ Xuan 備課時間從 hr 級壓到 min 級（核心優化目標）
```

**產線設計原則**：
- 投影片 + 講稿是最小可複用單元，影片和真人課都從這裡分支
- 量產層由 content-engine + image-studio 自動化，Xuan 只負責「出鏡」這個她最擅長的環節
- colombo cameo 是差異化賣點（一般越南中介機構無法提供母語者對話）

---

## 6. 對外/對內接口（跟 LL 其他專案的關係）

### 上游依賴（XX 等待這些就位）

| 專案 | XX 需要它做什麼 |
|------|----------------|
| `image-studio` | 小春老師角色形象（LoRA 一致性）、卡牌插圖、官網主視覺、課程縮圖 |
| `content-engine` | HSK 單元批量生成模板、多語言翻譯（中/英/越）、跨平台撒播（TikTok/小紅書 學中文社群） |

### 下游服務（XX 提供給 LL 整體）

- LL 學習軸的對外旗艦
- 越南文通路（colombo 女友是越南人，是 LL 整體中稀缺的多語資源節點）
- 卡牌/桌遊產品線在 LL 整體的代表

---

## 7. 目錄結構與關鍵檔案

```
nova-nursery/
├── index.html                               ← XX 官網（英文版、已上線）
├── vi/                                      ← 越南文版官網（已上線）
│   ├── index.html                           ← 越南文首頁
│   └── c1-mock-exam.html                    ← TOCFL C1 模擬試題（自製、非官方真題、5 段 30 題）
│
├── Card/                                    ← Pinyin Poker 64 網頁原型
│   ├── index.html                           ← 拼音卡牌生成器（互動預覽）
│   ├── pinyinPoker64.html                   ← 64 張牌完整展示
│   ├── pinyinPoker64_download.html          ← 附下載功能版本
│   ├── create8A4pdf.html                    ← A4 PDF 生成工具（雛形）
│   ├── pinyinDeck.js                        ← 64 張牌資料（主版）
│   ├── pp64/                                ← 已生成的 64 張 PNG（XX 版）
│   └── pp64_ll/                             ← 已生成的 64 張 PNG（LL 版）
│
├── notes/                                   ← 產品規劃文件（2026-07-26 從根目錄歸檔）
│   ├── 宣學習（XuanXuexi）課程地圖架構 v1.0（對齊 HSK 3.0）.md
│   ├── 漢語單詞遊戲卡造句對戰系統 v1.0.md
│   ├── Chinese Flashcard 商業模式規劃 & 卡片三維分類定義.md
│   ├── LeafLune 卡牌／桌遊產品輸出標準 v1.0.md
│   ├── 拼音學習卡_*.md                      ← Pinyin Poker 多版本規劃
│   └── 漢語拼音 Emoji 學習卡（64 張）.md
│
├── curriculum/                              ← 逐冊教材大綱（規劃中、尚未建檔，見 §13）
├── tocfl_bank/                              ← TOCFL 官方素材庫（2026-07-26 從 C:\Users\USER\tocfl_bank 移入，554 檔）
├── tocfl-material-gen/                      ← TOCFL 教材生成工具（暫不擴充）
├── scripts/                                 ← 各種輔助腳本
├── playwright-state/                        ← Playwright 狀態存放
├── gemini-downloads/                        ← Gemini 下載產物
│
├── CLAUDE.md / PROJECT.md / TODO.md / CHANGELOG.md / README.md
└── NovaNursery_emoji.png                    ← XX 品牌 Emoji
```

> LL 宇宙層級戰略文件（`LL_Universe_MasterPlan_v1.md` 等 5 份）已於 2026-07-26 搬離本專案至 `matrix-manager/inbox/`——這些文件跟 Nova Nursery 對外品牌內容無關，留在會被部署的目錄裡是外流風險。

---

## 8. 核心產品規格

### 7.1 Pinyin Poker 64（最接近出貨，80% 完成）

- 64 張卡牌，4 花色 × 16 張
  - L 聽力（水 💧）/ S 口說（火 🔥）/ R 閱讀（土 🌱）/ W 書寫（風 🌬）
- 每張卡：主音、漢字、拼音、Emoji
- 識別碼：`[花色][十六進位]`，例 `L3` = 聽力組第 4 張
- 規格：63×88mm 標準撲克牌、出血 3mm、300dpi、CMYK
- ✅ 64 張 PNG 已生成（`pp64/` + `pp64_ll/`）
- ✅ 網頁互動原型完成
- ⏳ 缺：A4 PDF 輸出、使用說明 PDF、Gumroad 上架文案、商品頁

### 7.2 Sentence Summoner 造句對戰（已上線，權威規格在別的專案）

- **已上線**：strategy-space.leaflune.org，四種語言版（en/zh-hant、vi/zh-hant、zh-hans/vi、zh-hans/en）
- **權威規格**：`D:\strategy-space\SentenceSummoner\GAME-RULES.md` / `DECK-DESIGN.md` / `TODO.md`——這是獨立專案（strategy-space），非本專案維護範圍
- 本專案 [`notes/漢語單詞遊戲卡造句對戰系統 v1.0.md`](notes/漢語單詞遊戲卡造句對戰系統 v1.0.md) 只是 2025-11 最初概念草案，已被上線版大幅取代（64 張卡改為 32 名詞/16 動詞/16 形容詞、無副詞卡與陷阱卡、加入護甲池/速度閃避/LLM 對手等機制），僅供歷史對照，**不代表現行玩法**
- **歸屬未定案（2026-09-11 討論中）**：Sentence Summoner 目前掛在 strategy-space（SS）底下，但定位上更貼近 Nova Nursery 的語言教學內容；且 **SS（strategy-space）與 SS（Sentence Summoner）縮寫本身衝突**，未來很可能把 Sentence Summoner 專案搬來歸屬 Nova Nursery——**已有共識方向、但不急，尚未排時程**

### 7.3 Chinese Flashcard MVP（規格清楚、4 週可成）

詳見 [`Chinese Flashcard 商業模式規劃 & 卡片三維分類定義.md`](Chinese Flashcard 商業模式規劃 & 卡片三維分類定義.md)

- 三維分類：難度（HSK/internal_level）× 領域場景（domain/scene/speech_function）× 文法（unit_type/pos/grammar_point/grammar_structure/register）
- MVP 鎖定：**L1 Travel — Airport & Hotel 60 Words**
- 客群：英文介面、自學中文初學者
- 4 週實作：選字 → 補例句翻譯 → 匯出 CSV/Anki/PDF → Gumroad
- **這是 XX 重啟時最快可驗證商業模式的切片**

---

## 9. 技術細節

- **語言**：純 HTML/CSS/JS（無框架、無 build）
- **工具腳本**：Python（Neocities 下載、Playwright）
- **部署**：Cloudflare Pages，已上線 `nova-nursery.leaflune.org`（英文版 + `/vi` 越南文版）
  - `wrangler pages deploy . --project-name=nova-nursery --branch=master`
  - **⚠️ 絕不可對 repo 根目錄直接跑 `wrangler pages deploy .`**——根目錄過去混有 LL 內部文件與 25MB+ 大型素材檔，會導致外流與部署卡關。固定流程：複製 `index.html` / `Card/` / `vi/` 到乾淨的暫存資料夾（例：`C:\Users\USER\_nova-nursery_deploy`）再部署，部署完刪除暫存資料夾
- **卡牌印刷規格**：CMYK 300dpi PDF、出血 3mm
- **越南文支援**：已上線（`vi/` 資料夾，字體用 Google Fonts「Be Vietnam Pro」確保聲調符號正確渲染，女友協助翻譯與校對）

---

## 10. 開發規範

- **commit 訊息**：繁體中文
- **不要動已生成的 PNG**（`pp64/`、`pp64_ll/`）除非要重新生成整批
- **新卡牌資料修改**：改 `pinyinDeck.js` 後重新生成 PNG
- **卡牌命名**：`[花色][十六進位].png`，例 `L3.png`、`WF.png`
- **兩套品牌共存**：`pp64/` 是 XX 版、`pp64_ll/` 是 LL 版（Emoji 圖集不同）
- **小春老師形象一致性**：定型後寫進 `image-studio/prompts/styles/xiaochun-laoshi.md` 跨專案共用

---

## 11. 已知坑與注意事項

- PROJECT.md 之前 (2026-04-05 版) 早於 LL 三軸架構與 content-engine 誕生，已於 2026-05-08 全面對齊
- 「小春老師」形象未定型是 XX 重啟的最大阻塞
- TOCFL 教材生成工具（`tocfl-material-gen/`）功能完整但目前非主力，暫不擴充
- ✅ 舊規劃 .md 已於 2026-07-26 歸檔進 `notes/`（見 §7、§13）
- **部署安全**：repo 根目錄含大型素材檔（HSK 大綱 PDF、越南文教材 PDF/PPTX，最大 32MB+）與 `tocfl_bank/`（554 檔）。CF Pages 單檔 25MiB 上限，且直接部署根目錄有內部文件外流風險——務必走 §9 的乾淨資料夾部署流程
- ~~Sentence Summoner 已在 strategy-space.leaflune.org 上線，但本專案本地 `notes/` 內的規格文件是否為最新版本、跟上線版是否一致，尚未核對~~ → 2026-09-11 已核對：本地 v1.0 是歷史草案，已被上線版大幅取代，見 §7.2

---

## 12. 重啟切入順序（建議）

1. **定小春老師形象** — 上游中的上游，不定型後續無法量產
2. **用 19 題框架走 XX 旗艦內容系列定位** — XX 的「vibe coding」是什麼？
3. **Chinese Flashcard L1 Travel MVP 並行** — 4 週可成，先有東西能賣 + 驗證商業模式
4. **Pinyin Poker 64 收尾上架** — 工具問題（PDF + Gumroad），可在等小春老師形象期間完成
5. ~~官網建立~~ — ✅ 已完成（英文版 + 越南文版皆已上線）

---

## 13. 相關文件

- 課程地圖（權威版）：[notes/宣學習課程地圖架構v2.0（整併版）.md](notes/宣學習課程地圖架構v2.0（整併版）.md)
- 課程地圖（舊版，僅供歷史對照）：[notes/宣學習課程地圖架構 v1.0.md](notes/宣學習（XuanXuexi）課程地圖架構 v1.0（對齊 HSK 3.0）.md)
- 第一冊大綱：[`curriculum/book-01-hsk1.md`](curriculum/book-01-hsk1.md)（初級固定 10 章/冊，2026-08-07 依拍板規則重編）
- 造句對戰規格（歷史草案，已被取代）：[notes/漢語單詞遊戲卡造句對戰系統 v1.0.md](notes/漢語單詞遊戲卡造句對戰系統 v1.0.md)——權威版見 `D:\strategy-space\SentenceSummoner\GAME-RULES.md`
- Flashcard 商業模式：[notes/Chinese Flashcard 商業模式規劃.md](notes/Chinese Flashcard 商業模式規劃 & 卡片三維分類定義.md)
- 課綱設計會議紀錄（9 冊 131 章骨架、尚未定案）：`C:/Users/USER/matrix-manager/meetings/2026-05-08-xx-revival-and-curriculum-design.md`
- LL 整體架構：`C:/Users/USER/matrix-manager/UNIVERSE.md`
- 內容引擎戰略：`C:/Users/USER/matrix-manager/docs/ll-content-engine.md`
