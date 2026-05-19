// ============================================================
//  OS QUIZ — Application Logic
// ============================================================

// ---------- State ----------
const state = {
  selectedLecture: null,    // number | "all"
  selectedCount: 20,        // number | "all"
  mode: "study",            // "study" | "exam"
  questions: [],            // current quiz pool
  currentIdx: 0,
  score: 0,
  answers: [],              // [{qId, userChoice, correct, lecture, question, options, correctIdx, explanation}]
  startTime: 0,
  timerInterval: null,
  answered: false,          // whether the current question has been answered
};

// ---------- Elements ----------
const $ = (id) => document.getElementById(id);

// ---------- Theme ----------
function loadTheme() {
  const saved = localStorage.getItem("os-quiz-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("os-quiz-theme", next);
}

// ---------- Init ----------
function init() {
  loadTheme();
  renderLectureCards();
  loadBestScore();
  attachStartScreenHandlers();
  attachQuizHandlers();
  attachResultsHandlers();
  $("themeBtn").addEventListener("click", toggleTheme);

  // Total questions stat
  $("statTotal").textContent = QUIZ_QUESTIONS.length;
  updateStartSummary();
}

function loadBestScore() {
  const best = localStorage.getItem("os-quiz-best");
  $("statBest").textContent = best ? best + "%" : "—";
}

// ---------- Lecture cards ----------
function renderLectureCards() {
  const grid = $("lectureGrid");
  grid.innerHTML = "";

  // "All" card first
  const totalQs = QUIZ_QUESTIONS.length;
  const allCard = makeLectureCard({
    id: "all",
    badge: "00",
    title: "All lectures",
    topics: "Memory · I/O · Files · Windows · Security · Networks",
    count: totalQs,
    color: "var(--accent)",
  });
  grid.appendChild(allCard);

  // Per-lecture cards
  Object.entries(TOPICS).forEach(([lecId, info]) => {
    const lec = Number(lecId);
    const count = QUIZ_QUESTIONS.filter((q) => q.lecture === lec).length;
    const topicsText = info.sections.join(" · ");
    const card = makeLectureCard({
      id: lec,
      badge: "L" + lec,
      title: info.name,
      topics: topicsText,
      count,
      color: info.color,
    });
    grid.appendChild(card);
  });
}

function makeLectureCard({ id, badge, title, topics, count, color }) {
  const btn = document.createElement("button");
  btn.className = "lecture-card";
  btn.dataset.lecture = id;
  btn.style.setProperty("--lc-color", color);
  btn.innerHTML = `
    <div class="lc-header">
      <div class="lc-badge">${badge}</div>
      <div class="lc-count">${count} Q</div>
    </div>
    <div class="lc-title">${title}</div>
    <div class="lc-topics">${topics}</div>
  `;
  btn.addEventListener("click", () => selectLecture(id, btn));
  return btn;
}

function selectLecture(id, cardEl) {
  state.selectedLecture = id;
  document
    .querySelectorAll(".lecture-card")
    .forEach((c) => c.classList.remove("selected"));
  cardEl.classList.add("selected");
  $("startBtn").disabled = false;
  updateStartSummary();
}

// ---------- Start screen handlers ----------
function attachStartScreenHandlers() {
  // count chips
  document.querySelectorAll(".count-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".count-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const v = chip.dataset.count;
      state.selectedCount = v === "all" ? "all" : Number(v);
      updateStartSummary();
    });
  });

  // mode radios
  document.querySelectorAll('input[name="mode"]').forEach((r) => {
    r.addEventListener("change", () => {
      state.mode = r.value;
      updateStartSummary();
    });
  });

  // start
  $("startBtn").addEventListener("click", startQuiz);
}

function updateStartSummary() {
  const lec = state.selectedLecture;
  const lecText = !lec ? "No lecture chosen" : lec === "all" ? "All lectures" : `Lecture ${lec} · ${TOPICS[lec].name}`;
  const cntText = state.selectedCount === "all" ? "all questions" : `${state.selectedCount} questions`;
  const modeText = state.mode === "study" ? "Study mode" : "Exam mode";
  $("startSummary").textContent = `${lecText} · ${cntText} · ${modeText}`;
}

// ---------- Start quiz ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  // Build pool
  let pool = state.selectedLecture === "all"
    ? QUIZ_QUESTIONS.slice()
    : QUIZ_QUESTIONS.filter((q) => q.lecture === state.selectedLecture);

  pool = shuffle(pool);

  if (state.selectedCount !== "all") {
    pool = pool.slice(0, Math.min(state.selectedCount, pool.length));
  }

  // Shuffle options inside each question, remember new correct index
  state.questions = pool.map((q) => {
    const indices = q.options.map((_, i) => i);
    const shuffled = shuffle(indices);
    const newOptions = shuffled.map((i) => q.options[i]);
    const newCorrect = shuffled.indexOf(q.correct);
    return { ...q, options: newOptions, correct: newCorrect };
  });

  // Reset state
  state.currentIdx = 0;
  state.score = 0;
  state.answers = [];
  state.startTime = Date.now();
  state.answered = false;

  // Switch screen
  switchScreen("screen-quiz");

  // Start timer
  startTimer();

  // Render first question
  renderQuestion();
}

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    $("quizTimer").textContent = formatTime(elapsed);
  }, 1000);
}
function stopTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
}
function formatTime(s) {
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, "0");
  return `${m}:${ss}`;
}

// ---------- Render question ----------
function renderQuestion() {
  const q = state.questions[state.currentIdx];
  state.answered = false;

  // Meta
  $("quizLectureTag").textContent = `Lecture ${q.lecture}`;
  $("quizLectureTag").style.background = hexAlpha(TOPICS[q.lecture].color, 0.14);
  $("quizLectureTag").style.color = TOPICS[q.lecture].color;
  $("quizTopic").textContent = q.topic;
  $("quizProgressText").textContent = `${state.currentIdx + 1} / ${state.questions.length}`;
  $("quizScore").textContent = state.score;

  // Progress bar
  const pct = ((state.currentIdx) / state.questions.length) * 100;
  $("progressFill").style.width = pct + "%";

  // Question
  $("qNum").textContent = "Q" + String(state.currentIdx + 1).padStart(2, "0");
  $("qText").textContent = q.question;

  // Options
  const optBox = $("qOptions");
  optBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.idx = i;
    btn.innerHTML = `<span class="option-key">${i + 1}</span><span class="option-text">${opt}</span>`;
    btn.addEventListener("click", () => selectAnswer(i));
    optBox.appendChild(btn);
  });

  // Reset feedback
  $("qFeedback").hidden = true;
  $("qFeedback").classList.remove("correct", "wrong");
  $("nextBtn").disabled = true;

  // Update Next label
  $("nextBtn").firstChild && ($("nextBtn").childNodes[0].nodeValue =
    state.currentIdx === state.questions.length - 1 ? "Finish " : "Next ");
}

// ---------- Answer handling ----------
function selectAnswer(idx) {
  if (state.answered) return;
  state.answered = true;

  const q = state.questions[state.currentIdx];
  const correctIdx = q.correct;
  const isCorrect = idx === correctIdx;

  if (isCorrect) state.score++;

  // Visual marking
  const buttons = document.querySelectorAll(".option");
  buttons.forEach((b) => b.classList.add("disabled"));
  buttons[correctIdx].classList.add("correct");
  if (!isCorrect) buttons[idx].classList.add("wrong");

  // Score update
  $("quizScore").textContent = state.score;

  // Save answer
  state.answers.push({
    qId: q.id,
    lecture: q.lecture,
    topic: q.topic,
    question: q.question,
    options: q.options,
    userChoice: idx,
    correctIdx: correctIdx,
    isCorrect,
    explanation: q.explanation,
  });

  // Show feedback (study mode only)
  if (state.mode === "study") {
    const fb = $("qFeedback");
    fb.hidden = false;
    fb.classList.add(isCorrect ? "correct" : "wrong");
    $("feedbackHead").textContent = isCorrect ? "Correct" : "Not quite";
    $("feedbackText").textContent = q.explanation;
  }

  $("nextBtn").disabled = false;
}

function nextQuestion() {
  if (!state.answered) return;
  if (state.currentIdx < state.questions.length - 1) {
    state.currentIdx++;
    renderQuestion();
    // Smooth scroll to top of question card on mobile
    document.querySelector(".quiz-body")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    showResults();
  }
}

// ---------- Quiz handlers ----------
function attachQuizHandlers() {
  $("nextBtn").addEventListener("click", nextQuestion);
  $("quitBtn").addEventListener("click", () => {
    if (confirm("Quit the quiz? Your progress will be lost.")) {
      stopTimer();
      switchScreen("screen-start");
    }
  });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (!$("screen-quiz").classList.contains("active")) return;
    const k = e.key;
    if (["1", "2", "3", "4"].includes(k)) {
      const idx = Number(k) - 1;
      const buttons = document.querySelectorAll(".option");
      if (buttons[idx] && !state.answered) {
        buttons[idx].click();
      }
    } else if (k === "Enter") {
      if (!$("nextBtn").disabled) nextQuestion();
    }
  });
}

// ---------- Results ----------
function showResults() {
  stopTimer();
  const total = state.questions.length;
  const correct = state.score;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);

  $("bigScoreNum").textContent = correct;
  $("bigScoreOf").textContent = total;
  $("bigPercent").textContent = pct + "%";
  $("rsCorrect").textContent = correct;
  $("rsWrong").textContent = wrong;
  $("rsTime").textContent = formatTime(elapsed);

  // Message
  let msg;
  if (pct >= 90)      msg = "Excellent — you really know this material.";
  else if (pct >= 75) msg = "Great work. A few details to revisit.";
  else if (pct >= 60) msg = "Solid effort. Review the explanations below.";
  else if (pct >= 40) msg = "Keep going — every wrong answer is a fixable gap.";
  else                msg = "Time for a deeper review. The explanations are there for you.";
  $("resultsMessage").textContent = msg;

  // Best score
  const prevBest = Number(localStorage.getItem("os-quiz-best") || 0);
  if (pct > prevBest) {
    localStorage.setItem("os-quiz-best", String(pct));
  }
  loadBestScore();

  // Reset review section state
  $("reviewSection").hidden = true;
  $("reviewBtn").style.display = "";

  switchScreen("screen-results");
}

function buildReview() {
  const list = $("reviewList");
  list.innerHTML = "";
  state.answers.forEach((a, i) => {
    const item = document.createElement("div");
    item.className = "review-item " + (a.isCorrect ? "correct" : "wrong");

    const yourText = a.options[a.userChoice];
    const rightText = a.options[a.correctIdx];

    item.innerHTML = `
      <div class="review-head">
        <span class="review-status ${a.isCorrect ? "correct" : "wrong"}">
          ${a.isCorrect ? "✓ Correct" : "✗ Wrong"}
        </span>
        <span class="review-lecture">Lecture ${a.lecture} · ${a.topic}</span>
        <span class="review-lecture">Q${String(i + 1).padStart(2, "0")}</span>
      </div>
      <div class="review-q">${a.question}</div>
      <div class="review-ans-row">
        <div class="review-ans your ${a.isCorrect ? "right" : "wrong"}">
          <div class="review-ans-label">Your answer</div>
          <div class="review-ans-text">${escapeHtml(yourText)}</div>
        </div>
        ${!a.isCorrect ? `
        <div class="review-ans right">
          <div class="review-ans-label">Correct answer</div>
          <div class="review-ans-text">${escapeHtml(rightText)}</div>
        </div>
        ` : ""}
      </div>
      <div class="review-expl">${escapeHtml(a.explanation)}</div>
    `;
    list.appendChild(item);
  });
}

function attachResultsHandlers() {
  $("reviewBtn").addEventListener("click", () => {
    buildReview();
    $("reviewSection").hidden = false;
    $("reviewBtn").style.display = "none";
    $("reviewSection").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("retryBtn").addEventListener("click", () => {
    // Restart with same configuration
    startQuiz();
  });

  $("homeBtn").addEventListener("click", () => {
    switchScreen("screen-start");
  });
}

// ---------- Helpers ----------
function switchScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Convert hex to rgba for accent tint
function hexAlpha(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------- Boot ----------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
