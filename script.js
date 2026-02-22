// AquaSave - Main JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCalculator();
  initTips();
  initChecklist();
  initScrollEffects();
  initContactForm();
  initQuiz();
  initLeaderboard();
  initAIAssistant();
});

/* =====================================================
   NAVIGATION
===================================================== */
function initNavigation() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (!mobileMenuBtn || !navLinks) return;

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuBtn.textContent = navLinks.classList.contains("active")
      ? "✕"
      : "☰";
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileMenuBtn.textContent = "☰";
    });
  });

  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}

/* =====================================================
   WATER CALCULATOR
===================================================== */
function initCalculator() {
  const btn = document.getElementById("calculateBtn");
  const inputs = ["showers", "showerDuration"];

  if (btn) btn.addEventListener("click", calculateWaterUsage);

  inputs.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) elem.addEventListener("input", calculateWaterUsage);
  });
}

function calculateWaterUsage() {
  const showers = +document.getElementById("showers")?.value || 0;
  const duration = +document.getElementById("showerDuration")?.value || 0;

  const dailyTotal = showers * duration * 9;
  const monthlyTotal = dailyTotal * 30;
  const yearlyTotal = dailyTotal * 365;

  animateNumber("dailyUsage", dailyTotal);
  animateNumber("monthlyUsage", monthlyTotal);
  animateNumber("yearlyUsage", yearlyTotal);

  const feedback = document.getElementById("feedback");
  if (!feedback) return;

  if (dailyTotal < 50) {
    feedback.textContent =
      "Excellent! You're a water conservation champion!";
    feedback.style.color = "#27ae60";
  } else if (dailyTotal < 100) {
    feedback.textContent =
      "Good! Keep up with your water conservation efforts.";
    feedback.style.color = "#3498db";
  } else {
    feedback.textContent =
      "Try to reduce your daily water usage with our tips!";
    feedback.style.color = "#e74c3c";
  }
}

function animateNumber(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = Math.round(value).toLocaleString();
}

/* =====================================================
   TIPS
===================================================== */
function initTips() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tip-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const panel = document.getElementById(btn.dataset.tab);
      if (panel) panel.classList.add("active");
    });
  });

  if (tabBtns.length) tabBtns[0].click();
}

/* =====================================================
   CHECKLIST
===================================================== */
function initChecklist() {
  loadChecklistState();
  updateProgress();

  document
    .querySelectorAll('.checklist-item input[type="checkbox"]')
    .forEach((cb) => {
      cb.addEventListener("change", () => {
        updateProgress();
        saveChecklistState();
      });
    });
}

function updateProgress() {
  const boxes = document.querySelectorAll(
    '.checklist-item input[type="checkbox"]'
  );
  const percentEl = document.getElementById("progressPercent");
  const savingsEl = document.getElementById("potentialSavings");

  let checked = 0;
  let savings = 0;

  boxes.forEach((b) => {
    if (b.checked) {
      checked++;
      savings += +b.closest(".checklist-item")?.dataset?.savings || 0;
    }
  });

  const percent = boxes.length
    ? Math.round((checked / boxes.length) * 100)
    : 0;

  if (percentEl) percentEl.textContent = percent;
  if (savingsEl) savingsEl.textContent = savings + " litres";

  const circle = document.querySelector(".progress-circle circle:nth-child(2)");
  if (circle) {
    const circumference = 2 * Math.PI * 45;
    circle.style.strokeDashoffset =
      circumference - (percent / 100) * circumference;
  }
}

function saveChecklistState() {
  const state = {};
  document
    .querySelectorAll('.checklist-item input[type="checkbox"]')
    .forEach((cb) => (state[cb.id] = cb.checked));

  localStorage.setItem("aquasave-checklist", JSON.stringify(state));
}

function loadChecklistState() {
  const data = localStorage.getItem("aquasave-checklist");
  if (!data) return;

  const state = JSON.parse(data);
  Object.keys(state).forEach((id) => {
    const cb = document.getElementById(id);
    if (cb) cb.checked = state[id];
  });
}

/* =====================================================
   SCROLL EFFECTS
===================================================== */
function initScrollEffects() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".fact-card, .tip-item, .resource-card")
    .forEach((el) => observer.observe(el));
}

/* =====================================================
   CONTACT FORM
===================================================== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName")?.value.trim();
    const email = document.getElementById("contactEmail")?.value.trim();
    const message = document.getElementById("contactMessage")?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    form.submit();
  });
}

/* =====================================================
   🤖 AI ASSISTANT — WORKING VERSION
===================================================== */
function initAIAssistant() {
  const toggleBtn = document.getElementById("aiToggleBtn");
  const closeBtn = document.getElementById("aiCloseBtn");
  const chatBox = document.getElementById("aiChatBox");
  const sendBtn = document.getElementById("aiSendBtn");
  const input = document.getElementById("aiInput");

  if (!toggleBtn || !closeBtn || !chatBox || !sendBtn || !input) return;

  toggleBtn.addEventListener("click", () => {
    chatBox.classList.toggle("active");
    if (chatBox.classList.contains("active")) input.focus();
  });

  closeBtn.addEventListener("click", () => {
    chatBox.classList.remove("active");
  });

  sendBtn.addEventListener("click", sendAIMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendAIMessage();
  });
}

async function sendAIMessage() {
  const input = document.getElementById("aiInput");
  const messages = document.getElementById("aiMessages");
  const sendBtn = document.getElementById("aiSendBtn");

  const message = input.value.trim();
  if (!message) return;

  // user bubble
  const userDiv = document.createElement("div");
  userDiv.className = "ai-message user-message";
  userDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
  messages.appendChild(userDiv);

  input.value = "";
  sendBtn.disabled = true;

  // bot bubble with spinner
  const botDiv = document.createElement("div");
  botDiv.className = "ai-message bot-message";
  const botText = document.createElement("p");
  botText.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Thinking...';
  botDiv.appendChild(botText);
  messages.appendChild(botDiv);
  messages.scrollTop = messages.scrollHeight;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
   const response = await fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }), 
  signal: controller.signal,
}); 
clearTimeout(timeoutId);

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    let text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    // remove leading/trailing quotation marks if any
    text = text.replace(/^['"]+|['"]+$/g, "");
    // replace markdown headings with placeholders before escaping
    text = text.replace(/^### (.*?)$/gm, '___H3_START___$1___H3_END___');
    text = text.replace(/^## (.*?)$/gm, '___H2_START___$1___H2_END___');
    text = text.replace(/^# (.*?)$/gm, '___H1_START___$1___H1_END___');
    // replace ** markers with placeholders before escaping
    text = text.replace(/\*\*(.*?)\*\*/g, '___BOLD_START___$1___BOLD_END___');
    // italic markers *text* can be removed or converted if needed
    text = text.replace(/\*(.*?)\*/g, '$1');
    // if the response is all caps, convert to sentence case
    if (text && text === text.toUpperCase()) {
      text = text.toLowerCase();
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    // escape the text (safe for display)
    text = escapeHtml(text);
    // now replace placeholders with actual HTML tags
    text = text.replace(/___H3_START___(.*?)___H3_END___/g, '<h3 style="margin-top:10px;margin-bottom:5px;font-weight:600;">$1</h3>');
    text = text.replace(/___H2_START___(.*?)___H2_END___/g, '<h2 style="margin-top:10px;margin-bottom:5px;font-weight:700;">$1</h2>');
    text = text.replace(/___H1_START___(.*?)___H1_END___/g, '<h1 style="margin-top:10px;margin-bottom:5px;font-weight:700;">$1</h1>');
    text = text.replace(/___BOLD_START___/g, '<strong>');
    text = text.replace(/___BOLD_END___/g, '</strong>');
    // set as HTML and convert newlines to breaks
    botText.innerHTML = text.replace(/\n/g, "<br>");
  } catch (err) {
    let errorMsg = "⚠️ Error connecting to AI.";
    if (err.name === "AbortError") {
      errorMsg = "⏱️ Response took too long. Please try again.";
    } else if (!navigator.onLine) {
      errorMsg = "📡 No internet connection.";
    }
    botText.textContent = errorMsg;
    console.error(err);
  }

  sendBtn.disabled = false;
  messages.scrollTop = messages.scrollHeight;
}

/* =====================================================
   UTILS
===================================================== */

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
/* =====================================================
   🔥 INSANE QUIZ SYSTEM
===================================================== */

const quizData = [
  {
    question: "What percentage of Earth's water is freshwater?",
    options: ["3%", "10%", "50%", "97%"],
    answer: 0,
  },
  {
    question: "Best way to save water while brushing?",
    options: ["Use hot water", "Turn off tap", "Brush faster", "None"],
    answer: 1,
  },
  {
    question: "How much water does a leaky faucet waste per year?",
    options: ["500 liters", "3,000 liters", "10,000+ liters", "100 liters"],
    answer: 2,
  },
  {
    question: "Recommended shower duration to conserve water?",
    options: ["10 minutes", "5 minutes", "15 minutes", "20 minutes"],
    answer: 1,
  },
  {
    question: "Agriculture accounts for approximately what % of water usage?",
    options: ["20%", "40%", "70%", "90%"],
    answer: 2,
  },
  {
    question: "Which activity uses the most household water?",
    options: ["Brushing teeth", "Toilet flushing", "Drinking", "Washing hands"],
    answer: 1,
  },
  {
    question: "Fixing leaks can save how much water annually?",
    options: ["Hundreds of liters", "Thousands of liters", "10 liters", "None"],
    answer: 1,
  },
  {
    question: "Best time to water plants?",
    options: ["Noon", "Afternoon", "Early morning", "Midnight"],
    answer: 2,
  },
  {
    question: "What is the water content in an average person's body?",
    options: ["30%", "50%", "60%", "80%"],
    answer: 2,
  },
  {
    question: "How much water does washing a car with a hose waste?",
    options: ["20 liters", "50 liters", "100+ liters", "5 liters"],
    answer: 2,
  },
  {
    question: "What is a low-flow faucet aerator designed to do?",
    options: ["Increase water pressure", "Mix air with water", "Heat water faster", "Filter water"],
    answer: 1,
  },
  {
    question: "How much water does a toilet leak waste per day?",
    options: ["5 liters", "25 liters", "50+ liters", "1 liter"],
    answer: 2,
  },
  {
    question: "What percentage of household water is used indoors?",
    options: ["40%", "50%", "70%", "90%"],
    answer: 3,
  },
  {
    question: "Which appliance uses the most water in most homes?",
    options: ["Dishwasher", "Washing machine", "Toilet", "Shower"],
    answer: 2,
  },
  {
    question: "How much water is needed to produce 1 kg of beef?",
    options: ["500 liters", "7,000 liters", "15,000 liters", "25,000 liters"],
    answer: 2,
  },
  {
    question: "What is the best way to thaw frozen food?",
    options: ["Under running water", "In the refrigerator", "On the counter", "In a microwave"],
    answer: 1,
  },
  {
    question: "How much water does a dripping faucet waste per year?",
    options: ["500 liters", "3,000 liters", "10,000 liters", "20,000 liters"],
    answer: 2,
  },
  {
    question: "What does mulch do for plants?",
    options: ["Adds nutrients", "Retains moisture", "Kills weeds", "Attracts insects"],
    answer: 1,
  },
  {
    question: "How much water does a typical dishwasher use per load?",
    options: ["5 liters", "15 liters", "25 liters", "50 liters"],
    answer: 2,
  },
  {
    question: "What is the main benefit of installing a rain barrel?",
    options: ["Save money on water", "Collect free water", "Improve water quality", "All of the above"],
    answer: 3,
  },
  {
    question: "How many gallons does a modern toilet flush use?",
    options: ["3-5 gallons", "6-8 gallons", "10-12 gallons", "15+ gallons"],
    answer: 0,
  },
  {
    question: "What percentage of water on Earth is usable freshwater?",
    options: ["1%", "3%", "0.5%", "10%"],
    answer: 2,
  },
  {
    question: "How much water is needed to produce a cotton shirt?",
    options: ["500 liters", "2,000 liters", "7,000 liters", "1,000 liters"],
    answer: 2,
  },
];

let currentQuestionIndex = 0;
let quizScore = 0;

let quizQuestions = [];
const QUESTIONS_PER_QUIZ = 6;

let streak = 0;
let bestScore = Number(localStorage.getItem("aquasave-best-score") || 0);

let questionTimer = null;
const QUESTION_TIME = 15;
let timeLeft = QUESTION_TIME;

/* ================== INIT ================== */

function initQuiz() {
  const startBtn = document.getElementById("startQuizBtn");
  const container = document.getElementById("quiz-container");

  if (!startBtn || !container) return;

  startBtn.addEventListener("click", startQuiz);
  // leaderboard on quiz page removed; render only if element present
  if (document.getElementById("leaderboard-list")) renderLeaderboard();
}

function initLeaderboard() {
  // called on the separate leaderboard page
  if (document.getElementById("leaderboard-list")) {
    renderLeaderboard();
  }
}

/* ================== SHUFFLE ================== */

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ================== START ================== */

function startQuiz() {
  currentQuestionIndex = 0;
  quizScore = 0;
  streak = 0;

  quizQuestions = shuffleArray(quizData).slice(0, QUESTIONS_PER_QUIZ);

  showQuestion();
}

/* ================== SHOW QUESTION ================== */

function showQuestion() {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  clearInterval(questionTimer);
  timeLeft = QUESTION_TIME;

  const q = quizQuestions[currentQuestionIndex];

  container.innerHTML = `
    <div class="quiz-topbar">
      <div>Question ${currentQuestionIndex + 1}/${QUESTIONS_PER_QUIZ}</div>
      <div>⏱️ <span id="timer">${timeLeft}</span>s</div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width:${((currentQuestionIndex)/QUESTIONS_PER_QUIZ)*100}%"></div>
    </div>

    <p class="question-text">${q.question}</p>

    <div class="options-grid">
      ${q.options
        .map(
          (opt, i) =>
            `<button class="option-btn" data-i="${i}">${opt}</button>`
        )
        .join("")}
    </div>

    <button id="nextQuestionBtn" disabled>Next Question</button>
  `;

  questionTimer = setInterval(updateTimer, 1000);

  container.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => selectOption(btn));
  });

  document
    .getElementById("nextQuestionBtn")
    .addEventListener("click", nextQuestion);
}

/* ================== TIMER ================== */

function updateTimer() {
  timeLeft--;
  const t = document.getElementById("timer");
  if (t) t.textContent = timeLeft;

  if (timeLeft <= 0) {
    handleTimeout();
  }
}

// mark unanswered question and proceed after delay
function handleTimeout() {
  clearInterval(questionTimer);
  streak = 0;

  const container = document.getElementById("quiz-container");
  if (!container) return;

  // disable buttons and show the correct answer
  container.querySelectorAll(".option-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === quizQuestions[currentQuestionIndex].answer) {
      btn.classList.add("correct-answer");
    }
  });

  // automatically advance to next question after brief pause
  setTimeout(() => {
    const nextBtn = document.getElementById("nextQuestionBtn");
    if (nextBtn) nextBtn.disabled = false;
    nextQuestion();
  }, 1500);
}

/* ================== SELECT ================== */

function selectOption(btn) {
  // 🚫 If already answered, do nothing
  if (document.querySelector(".options-grid.locked")) return;

  clearInterval(questionTimer);

  const grid = btn.closest(".options-grid");
  grid.classList.add("locked"); // 🔒 lock all options

  const selected = +btn.dataset.i;
  const correctIndex = quizQuestions[currentQuestionIndex].answer;
  const isCorrect = selected === correctIndex;

  // Disable ALL buttons immediately
  grid.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
  });

  // Mark selected
  btn.classList.add(isCorrect ? "correct" : "incorrect");

  // Always reveal correct answer
  grid.querySelectorAll(".option-btn").forEach((b, i) => {
    if (i === correctIndex) {
      b.classList.add("correct-answer");
    }
  });

  // Score logic
  if (isCorrect) {
    streak++;
    quizScore += 1;
  } else {
    streak = 0;
  }

  // Enable next button
  const nextBtn = document.getElementById("nextQuestionBtn");
  if (nextBtn) nextBtn.disabled = false;
}

/* ================== NEXT ================== */

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < QUESTIONS_PER_QUIZ) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

/* ================== FINISH ================== */

function finishQuiz() {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  const finalScore = Math.round(quizScore * 100) / 100;

  if (finalScore > bestScore) {
    bestScore = finalScore;
    localStorage.setItem("aquasave-best-score", bestScore);
  }

  // show score and ask for player name
  container.innerHTML = `
    <div class="quiz-complete" style="text-align:center;">
      <h3>Quiz Complete! 🎉</h3>
      <p style="font-size:2em;margin:20px 0;">
        Score: <strong>${finalScore}/${QUESTIONS_PER_QUIZ}</strong>
      </p>
      <p>🔥 Best Score: ${bestScore}</p>
      <div id="nameEntry" style="margin-top:20px;">
        <input id="playerName" type="text" placeholder="Enter your name" maxlength="20" style="padding:8px 12px;border-radius:var(--border-radius);border:1px solid #ccc;width:200px;">
        <button id="saveNameBtn" style="padding:8px 16px;margin-left:10px;">Save</button>
      </div>
      <div id="postSave" style="display:none;margin-top:15px;">
        <button id="playAgainBtn" style="margin-top:15px;">Play Again</button>
      </div>
    </div>
  `;

  document.getElementById("saveNameBtn").addEventListener("click", () => {
    const nameInput = document.getElementById("playerName");
    const name = nameInput.value.trim() || "Anonymous";
    updateLeaderboard(name, finalScore);
    renderLeaderboard();
    document.getElementById("nameEntry").style.display = "none";
    const post = document.getElementById("postSave");
    post.style.display = "block";
    document.getElementById("playAgainBtn").addEventListener("click", startQuiz);
  });
}

/* ================== LEADERBOARD ================== */

function loadLeaderboard() {
  const raw = JSON.parse(localStorage.getItem("aquasave-leaderboard") || "[]");
  // clean any existing names that may contain leading numbers
  const cleaned = raw.map(item => ({
    name: sanitizeName(item.name),
    score: item.score,
  }));
  // if cleaning removed prefixes, rewrite storage so issue doesn't recur
  if (JSON.stringify(cleaned) !== JSON.stringify(raw)) {
    localStorage.setItem("aquasave-leaderboard", JSON.stringify(cleaned));
  }
  return cleaned;
}

function sanitizeName(raw) {
  // remove any leading numbering/punctuation groups, e.g. "1. ", "2) ", "03 - ",
  // or repeated prefixes that might appear after storage.
  return raw.replace(/^\s*(?:[0-9]+[\.)\-\s]*)+/, '').trim();
}


function updateLeaderboard(name, score) {
  const list = loadLeaderboard();
  const cleanName = sanitizeName(name) || "Anonymous";
  list.push({ name: cleanName, score });
  list.sort((a, b) => b.score - a.score);
  localStorage.setItem(
    "aquasave-leaderboard",
    JSON.stringify(list.slice(0, 10))
  );
}

function renderLeaderboard() {
  const list = loadLeaderboard();
  const ol = document.getElementById("leaderboard-list");
  if (!ol) return;

  if (!list.length) {
    ol.innerHTML = "<li>No scores yet. Be the first!</li>";
    return;
  }

  ol.innerHTML = list
    .map((item, idx) => {
      const name = sanitizeName(item.name);
      return `<li>${idx + 1}. ${name} - ${item.score}</li>`;
    })
    .join("");
}

console.log("💧 AquaSave Loaded - Ready!");