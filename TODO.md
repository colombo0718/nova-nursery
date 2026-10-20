# TODO.md — 待辦事項

---

## Pinyin Poker 64

- [ ] 生成 A4 彩色列印版 PDF（`create8A4pdf.html` 已有雛形，確認輸出品質）
- [ ] 製作使用說明 PDF（列印方式、剪裁建議、基本玩法、授權條款）
- [ ] 打包為 zip 並上架 Gumroad
  > 需等 PDF + 說明書都完成
- [ ] 撰寫 Gumroad 商品頁文案（中/英）
- [ ] 確認 `pp64_ll/`（LeafLune 版）與 `pp64/`（Nova Nursery 版）差異，決定是否分開上架
- [ ] 製作印刷廠用 CMYK 300dpi PDF（`fronts_300dpi_CMYK.pdf` + `back_300dpi_CMYK.pdf`）
  > 待數位版先上架驗證需求後再做

---

## Sentence Summoner 造句對戰

> ✅ 2026-07-26：已上線 [strategy-space.leaflune.org/SentenceSummoner/vi_zh-hans/](https://strategy-space.leaflune.org/SentenceSummoner/vi_zh-hans/)，走 StrategySpace（SS）平台而非本地 `Card/` 原型。
> ✅ 2026-09-11 核對完畢：以下項目全部**已由上線版取代**（`D:\strategy-space\SentenceSummoner\` 是獨立專案，非本專案維護範圍）——名詞卡數值定案為 32 張固定四維（無 HSK 等級掛鉤）、動詞/形容詞各 16 張定案（**無副詞卡、無陷阱卡**，設計已捨棄這兩類）、卡牌美術已用 OpenMoji 完成、試玩版已是正式教學/訓練/對戰三模式。本地 `notes/漢語單詞遊戲卡造句對戰系統 v1.0.md` 僅存歷史對照價值，以下待辦不再適用，予以清空。

---

## Chinese Flashcard MVP

- [ ] 確定 60 個旅遊主題單字（機場 + 飯店）
- [ ] 補充 meaning_en 與短例句（中 + 英）
- [ ] 補上標記欄位（hsk_level、domain、scene、pos）
- [ ] 匯出 CSV 與 Anki 套牌
- [ ] 排版 A4 PDF 單字表
- [ ] 上架 Gumroad / 分享連結測試

---

## Nova Nursery 官網

- [x] 建立 GitHub repo，串接 Cloudflare Pages 自動部署 — 網域已確認為 `nova-nursery.leaflune.org`
- [ ] **部署改名內容到線上**：git 上的品牌改名/內容修正都還沒真的跑 wrangler 部署，`nova-nursery.leaflune.org` 目前仍顯示舊版 XuanXuexi 內容（2026-09-11 發現）
- [x] 規劃頁面結構（首頁 / 課程 / 周邊產品 / 關於）
- [x] 實作首頁 HTML/CSS（Hero、品牌介紹、課程預覽區、三支柱、products grid）
- [x] 越南文版首頁（`/vi`）— 2026-07-26 上線，字體修正（Be Vietnam Pro）已套用
- [x] TOCFL C1 模擬試題頁（`/vi/c1-mock-exam.html`）— 自製 5 段 30 題、非官方真題
- [ ] 建立 `courses.js` 課程資料檔，頁面從資料自動渲染卡片
  > 目前 `levels`/`products` 是內嵌在 HTML `<script>` 裡的 JS 陣列、非獨立資料檔；未來新增課程只改資料，不動 HTML
- [ ] 建立 `products.js` 周邊產品資料檔（同上原則）
- [ ] 周邊產品頁：連結至 Gumroad 各商品
- [ ] RWD（手機版）調整 — 尚未實測手機瀏覽器
- [ ] 建立第一個示範單元（HSK1，旅遊情境）
  > 待官網骨架完成後
- [ ] 設計點數回饋機制原型
  > 擱置，待課程平台需求明確後再做
- [ ] 英文版首頁補上 Sentence Summoner 連結（目前只有 `/vi` 版有接上 strategy-space 連結，英文版 `index.html` 尚未同步）
- [ ] 評量測驗 / 應考輔助功能規劃
  > 2026-07-26 colombo 明確定位 XX（Nova Nursery）為「教材→評量→應考輔助」一條龍平台，終局銜接學校/企業；目前只有 C1 模擬試題一項零星產出，尚無系統性評量/應考輔助規劃，需要新一輪課綱討論落實

---

## 專案管理與文件

- [ ] 補全 `專案管理 Project Manager.md` 中的 HackMD 連結
- [ ] 建立 `LL_Projects_Index_v1.md`（各品牌專案一頁式說明書）
- [ ] 撰寫各品牌 spec 文件（`LL_Brand_XX_spec_v1.md` 等）
- [ ] 建立 `LL_SOP_Template_v1.md`

---

## 擱置

- **RR / GG / SS 技術平台實作**：概念藍圖完整，但需要更多技術資源，暫緩。
- **LL 幣經濟系統**：需要平台基礎建設先到位才有意義。
- **TOCFL 教材生成**（`tocfl-material-gen/`）：功能完整但目前非主力，暫不擴充。
