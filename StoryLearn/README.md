# StoryLearn（暫名）— 聽故事學語言

> Nova Nursery 底下的產品線，定位比照 Sentence Summoner 之於 strategy-space：獨立資料夾、獨立玩法，共用母專案的品牌與部署。
> 這個資料夾名稱是暫定，還沒有正式產品名，改名成本低，之後定案再改。

## 這是什麼

以 video-factory 的「多語言有聲故事書」（MLAS，Multilingual Audio Storybooks）系列為原料，做成互動網頁：使用者看 YouTube 嵌入影片、同步顯示旁白字幕，點單字彈出五語言（英/繁中/日/韓/越）對照卡並可試聽發音。

上游內容生產（故事、五語言影片、字幕、YouTube 上架）仍歸 `D:\video-factory` 負責，不要重工。詳見交接文件 `D:\video-factory\docs\語言學習網頁-交接prompt.md`。

## 目前狀態（2026-09-11）

`index.html` 是**第一版雛形**，只做了一篇故事（MLAS001《The Song No One Could Hear》）、只有英文音軌：

- 影片用 YouTube iframe 嵌入（`video_id` 取自 `D:\video-factory\fables_en\catalog.json`），不在本地存 mp4——避開 CF Pages 單檔 25MiB 限制，也不重複上傳已經在 YouTube 的內容
- 字幕同步是**整幀級別**（12 幀、每幀一段旁白），不是逐字時間戳——`captions.srt` 本身只有這個精度，見交接文件的已知限制
- 點單字看五語言卡：目前只有 8 個字有資料（來自 `catalog.json` 的 `vocabulary` 欄位），其他字點了沒反應
- 發音用瀏覽器內建 `speechSynthesis`（不是 TTS 產線產出的獨立音檔）——先驗證「點字看卡片+聽發音」這個互動本身成不成立，音檔品質之後再說

## 跟 Nova Nursery 核心定位的落差（待 colombo 判斷）

Nova Nursery 主線是「幫 EN/VI 母語者學中文」，但 MLAS 素材是五語言對稱設計（不特別偏重中文）。這一版雛形先用英文音軌驗證互動架構最快，但如果要真的貼近 NN 定位，正式版可能該預設**中文音軌**（`zh` video_id）＋ 英/越語釋義——中文旁白沒有空格分詞，點字判斷要借用 Sentence Summoner 已經解決過的「子字串比對」技巧（見 `D:\strategy-space\SentenceSummoner\README.md` 「比對邏輯」一節），不能直接用英文版的空格分詞邏輯。

## 還沒做的（依交接文件的開放問題）

- [ ] 逐字時間戳（目前只有整幀精度）——要不要做、值不值得投入 Whisper word-level alignment
- [ ] 真的 TTS 逐字音檔（目前是瀏覽器 speechSynthesis 代打）
- [ ] 中文音軌版本（子字串比對詞邊界）
- [ ] 100 篇故事規模化 vs 先小規模試點驗證教學效果
- [ ] 要不要在 `matrix-manager/memory/agents-register.json` 正式登記
- [ ] 公開給頻道觀眾 vs 先當內部工具
