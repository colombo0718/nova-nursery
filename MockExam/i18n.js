/* Minimal i18n for the UI chrome. Exam content (zh-Hant) is not translated. */
const I18N = {
  en: {
    title: "TOCFL Band C Mock Exam", brand: "Nova Nursery",
    subtitle: "Original practice questions modelled on the TOCFL Band C (Fluent / Mastery) format. Unofficial.",
    disclaimer: "All questions are original and written by Nova Nursery. This is not an official TOCFL exam and has no connection to SC-TOP; scores here cannot be converted to an official TOCFL level.",
    fullExam: "Full mock (mini set)", fullExamDesc: "Listening 25 + Reading 25. Listening follows exam rules: each recording plays once, 5 seconds after each question.",
    listeningOnly: "Listening exam (25 Q)", readingOnly: "Reading exam (25 Q, 30 min)",
    practiceTitle: "Practice by question type", practiceDesc: "No timer. Replay audio, check answers and read explanations right away.",
    pDialogue: "Listening · Dialogue", pMonologue: "Listening · Monologue", pGap: "Reading · Gap Filling", pComp: "Reading · Comprehension",
    start: "Start", startListening: "Start listening section", startReading: "Start reading section", submit: "Submit answers",
    timeLeft: "Time left", question: "Question", questions: "Questions",
    listeningRules: [
      "25 questions, four choices each (A–D). Choose one answer.",
      "Each recording is played only once. You cannot replay or pause.",
      "The question and the four choices are read aloud; the choices also appear on screen. Then you have 5 seconds before the next question.",
      "Make sure your sound is on, then press the button below."],
    readingRules: ["25 questions, 30 minutes.", "Four choices each. Choose one answer.", "You can change answers until you submit or time runs out."],
    part1D: "Part 1 · Dialogue", part2M: "Part 2 · Monologue", partGap: "Part 1 · Gap Filling", partComp: "Part 2 · Reading Comprehension",
    playingPassage: "Playing the recording…", playingQuestion: "Playing the question…", nextIn: "Next question in", nextGroup: "Next recording…",
    tapToPlay: "Tap to play", sectionDone: "Listening section finished.",
    results: "Results", score: "Score", listening: "Listening", reading: "Reading", total: "Total",
    bySkill: "By skill", byType: "By question type", correctOf: "Correct", accuracy: "Accuracy",
    review: "Review", yourAnswer: "Your answer", correctAnswer: "Correct answer", unanswered: "No answer",
    explanation: "Explanation", showScript: "Show script", check: "Check answer", showAnswer: "Show answer",
    home: "Back to menu", retry: "Try again", wordLevel: "Word level (TOCFL 8000 list)", outside: "outside the 8000 list",
    explainNote: "Explanations are currently in Chinese; English and Vietnamese versions are planned.",
    summary: "See summary",
    type: { dialogue: "Dialogue", monologue: "Monologue", gap: "Gap Filling", comp: "Reading Comprehension" },
    skill: { detail: "Detail", inference: "Inference", main_idea: "Main idea", attitude: "Attitude / tone", purpose: "Purpose", reference: "Reference",
             adverb: "Adverbs", conjunction: "Conjunctions", noun: "Nouns", verb: "Verbs" }
  },
  vi: {
    title: "Đề thi thử TOCFL Band C", brand: "Nova Nursery",
    subtitle: "Câu hỏi tự biên soạn theo định dạng TOCFL Band C (Lưu loát / Tinh thông). Không chính thức.",
    disclaimer: "Toàn bộ câu hỏi do Nova Nursery tự biên soạn. Đây không phải đề thi TOCFL chính thức và không liên quan đến SC-TOP; điểm số ở đây không thể quy đổi sang cấp độ TOCFL chính thức.",
    fullExam: "Thi thử đầy đủ (bộ mini)", fullExamDesc: "Nghe 25 + Đọc 25. Phần nghe theo đúng quy tắc: mỗi đoạn chỉ phát một lần, nghỉ 5 giây sau mỗi câu.",
    listeningOnly: "Thi phần Nghe (25 câu)", readingOnly: "Thi phần Đọc (25 câu, 30 phút)",
    practiceTitle: "Luyện theo dạng câu hỏi", practiceDesc: "Không tính giờ. Nghe lại, kiểm tra đáp án và xem giải thích ngay.",
    pDialogue: "Nghe · Hội thoại", pMonologue: "Nghe · Đoạn văn", pGap: "Đọc · Điền từ", pComp: "Đọc · Đọc hiểu",
    start: "Bắt đầu", startListening: "Bắt đầu phần Nghe", startReading: "Bắt đầu phần Đọc", submit: "Nộp bài",
    timeLeft: "Thời gian còn lại", question: "Câu", questions: "Các câu",
    listeningRules: [
      "25 câu, mỗi câu có bốn lựa chọn (A–D). Chọn một đáp án.",
      "Mỗi đoạn ghi âm chỉ phát một lần. Không thể nghe lại hay tạm dừng.",
      "Câu hỏi và bốn lựa chọn được đọc to; các lựa chọn cũng hiện trên màn hình. Sau đó bạn có 5 giây trước câu tiếp theo.",
      "Hãy bật loa, rồi nhấn nút bên dưới."],
    readingRules: ["25 câu, 30 phút.", "Mỗi câu có bốn lựa chọn. Chọn một đáp án.", "Bạn có thể đổi đáp án cho đến khi nộp bài hoặc hết giờ."],
    part1D: "Phần 1 · Hội thoại", part2M: "Phần 2 · Đoạn văn", partGap: "Phần 1 · Điền từ", partComp: "Phần 2 · Đọc hiểu",
    playingPassage: "Đang phát đoạn ghi âm…", playingQuestion: "Đang đọc câu hỏi…", nextIn: "Câu tiếp theo sau", nextGroup: "Đoạn ghi âm tiếp theo…",
    tapToPlay: "Nhấn để phát", sectionDone: "Đã hoàn thành phần Nghe.",
    results: "Kết quả", score: "Điểm", listening: "Nghe", reading: "Đọc", total: "Tổng",
    bySkill: "Theo kỹ năng", byType: "Theo dạng câu hỏi", correctOf: "Đúng", accuracy: "Tỉ lệ đúng",
    review: "Xem lại", yourAnswer: "Bạn chọn", correctAnswer: "Đáp án đúng", unanswered: "Chưa trả lời",
    explanation: "Giải thích", showScript: "Xem lời thoại", check: "Kiểm tra", showAnswer: "Xem đáp án",
    home: "Về menu", retry: "Làm lại", wordLevel: "Cấp độ từ (danh sách 8000 từ TOCFL)", outside: "ngoài danh sách 8000 từ",
    explainNote: "Phần giải thích hiện bằng tiếng Trung; bản tiếng Anh và tiếng Việt sẽ được bổ sung.",
    summary: "Xem tổng kết",
    type: { dialogue: "Hội thoại", monologue: "Đoạn văn", gap: "Điền từ", comp: "Đọc hiểu" },
    skill: { detail: "Chi tiết", inference: "Suy luận", main_idea: "Ý chính", attitude: "Thái độ / giọng điệu", purpose: "Mục đích", reference: "Đại từ thay thế",
             adverb: "Phó từ", conjunction: "Liên từ", noun: "Danh từ", verb: "Động từ" }
  },
  zh: {
    title: "TOCFL 流利精通級模擬考試", brand: "Nova Nursery 星苑",
    subtitle: "依 TOCFL Band C（流利精通級）題型原創設計的練習題。非官方。",
    disclaimer: "所有題目皆由 Nova Nursery 原創，並非 TOCFL 官方試題，與國家華語測驗推動工作委員會無關；此處分數不能換算為官方 TOCFL 等級。",
    fullExam: "完整模擬（迷你題組）", fullExamDesc: "聽力 25 題＋閱讀 25 題。聽力照考試規則：每段只播一次，每題選項念完停 5 秒。",
    listeningOnly: "聽力測驗（25 題）", readingOnly: "閱讀測驗（25 題、30 分鐘）",
    practiceTitle: "分題型練習", practiceDesc: "不計時，可重播音檔、立即核對答案與解析。",
    pDialogue: "聽力・對話", pMonologue: "聽力・段落", pGap: "閱讀・選詞填空", pComp: "閱讀・閱讀理解",
    start: "開始", startListening: "開始聽力測驗", startReading: "開始閱讀測驗", submit: "交卷",
    timeLeft: "剩餘時間", question: "第", questions: "題",
    listeningRules: [
      "共 25 題，每題四個選項（A–D），請選出一個正確答案。",
      "每段音檔只播放一遍，不能重播或暫停。",
      "題目與四個選項會念出來，選項也會顯示在畫面上；念完後有 5 秒作答時間，接著進入下一題。",
      "請確認已開啟聲音，再按下方按鈕。"],
    readingRules: ["共 25 題，作答時間 30 分鐘。", "每題四個選項，請選出一個正確答案。", "交卷或時間結束前，都可以更改答案。"],
    part1D: "第一部分・對話", part2M: "第二部分・段落", partGap: "第一部分・選詞填空", partComp: "第二部分・閱讀理解",
    playingPassage: "正在播放音檔…", playingQuestion: "正在播放題目…", nextIn: "下一題倒數", nextGroup: "即將播放下一段…",
    tapToPlay: "點擊播放", sectionDone: "聽力測驗結束。",
    results: "成績", score: "分數", listening: "聽力", reading: "閱讀", total: "總計",
    bySkill: "依能力分析", byType: "依題型分析", correctOf: "答對", accuracy: "正確率",
    review: "逐題檢討", yourAnswer: "你的答案", correctAnswer: "正確答案", unanswered: "未作答",
    explanation: "解析", showScript: "顯示腳本", check: "核對答案", showAnswer: "顯示答案",
    home: "回選單", retry: "再試一次", wordLevel: "詞彙等級（華語八千詞表）", outside: "八千詞表以外",
    explainNote: "解析目前為中文；英文與越南文版本規劃中。",
    summary: "查看總結",
    type: { dialogue: "對話", monologue: "段落", gap: "選詞填空", comp: "閱讀理解" },
    skill: { detail: "細節理解", inference: "推論", main_idea: "主旨", attitude: "態度語氣", purpose: "目的", reference: "指代",
             adverb: "副詞", conjunction: "連詞", noun: "名詞", verb: "動詞" }
  }
};

function pickLang() {
  const saved = localStorage.getItem("nn_lang");
  if (saved && I18N[saved]) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("vi") ? "vi" : nav.startsWith("zh") ? "zh" : "en";
}
let LANG = pickLang();
const T = () => I18N[LANG];

function mountLangSwitch(el, onChange) {
  el.innerHTML = ["en", "vi", "zh"].map(l => `<button data-l="${l}" class="${l === LANG ? "active" : ""}">${l === "zh" ? "中文" : l.toUpperCase()}</button>`).join("");
  el.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    LANG = b.dataset.l;
    localStorage.setItem("nn_lang", LANG);
    document.documentElement.lang = LANG === "zh" ? "zh-Hant" : LANG;
    mountLangSwitch(el, onChange);
    onChange();
  }));
}
