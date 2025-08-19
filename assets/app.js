// ===============================
// Version & Evolution Table
// ===============================
const APP_VERSION = 'V1.19.5';

// Evolution mapping
const EVOLUTIONS = [
  { min: 1,  max: 1,  tier: 'Egg',        emoji: '🐣',   desc: 'Starter som et lille æg' },
  { min: 2,  max: 3,  tier: 'Chick',      emoji: '🐥',   desc: 'Klækker til kylling' },
  { min: 4,  max: 6,  tier: 'Small bird', emoji: '🐦',   desc: 'Vokser til lille fugl' },
  { min: 7,  max: 9,  tier: 'Swift',      emoji: '🕊',   desc: 'Bliver hurtig og smidig' },
  { min: 10, max: 12, tier: 'Owl',        emoji: '🦉',   desc: 'Klog fugl, milepæl' },
  { min: 13, max: 15, tier: 'Eagle',      emoji: '🦅',   desc: 'Stærk og majestætisk' },
  { min: 16, max: 19, tier: 'Phoenix',    emoji: '🐦‍🔥', desc: 'Mytisk, brændende fugl' },
  { min: 20, max: Infinity, tier: 'Dragon', emoji: '🐉', desc: 'Endgame, kæmpe belønning' },
];
function getEvolutionForLevel(level){
  return EVOLUTIONS.find(e => level >= e.min && level <= e.max) || EVOLUTIONS[0];
}

// ===============================
// Categories & Questions
// ===============================
const CATEGORIES = {
  mixed: { key: 'mixed', title: 'Blandet',   icon: '🎲', desc: 'Et miks af forskellige emner.' },
  math:  { key: 'math',  title: 'Matematik', icon: '➕', desc: 'Regning, tal og formler.' },
  geo:   { key: 'geo',   title: 'Geografi',  icon: '🌍', desc: 'Lande, byer og natur.' },
};

// Spørgsmål pr. kategori
const QUESTIONS_BY_CATEGORY = {
  mixed: [
    { text: 'Hvad er 7 + 5?', options: ['10','12','13','14'], correctIndex: 1 },
    { text: 'Hvilken planet kaldes den røde planet?', options: ['Venus','Jorden','Mars','Saturn'], correctIndex: 2 },
    { text: 'Hvad hedder Danmarks hovedstad?', options: ['Aarhus','København','Odense','Esbjerg'], correctIndex: 1 },
    { text: 'Hvilket sprog taler man i Spanien?', options: ['Fransk','Italiensk','Spansk','Tysk'], correctIndex: 2 },
    { text: 'Hvor mange minutter er der i en time?', options: ['30','45','60','90'], correctIndex: 2 },
    { text: 'Hvad kaldes resultatet af et multiplikationsstykke?', options: ['Sum','Kvotient','Produkt','Differens'], correctIndex: 2 },
    { text: 'Hvilket dyr er kendt for at have en lang hals?', options: ['Giraf','Hest','Kanin','Krokodille'], correctIndex: 0 },
    { text: 'Hvad er vandets frysepunkt i °C?', options: ['0°C','10°C','-10°C','32°C'], correctIndex: 0 },
    { text: 'Hvilket hav ligger mellem Europa og Afrika?', options: ['Stillehavet','Middelhavet','Atlanten','Det Indiske Ocean'], correctIndex: 1 },
    { text: 'Hvad er 9 × 3?', options: ['18','21','27','36'], correctIndex: 2 },
  ],
  math: [
    { text: 'Hvad er 8 × 6?', options: ['42','46','48','54'], correctIndex: 2 },
    { text: 'Hvad er kvadratroden af 81?', options: ['7','8','9','10'], correctIndex: 2 },
    { text: 'Hvad er 15% af 200?', options: ['20','25','30','35'], correctIndex: 2 },
    { text: 'Hvad er 3³?', options: ['6','9','27','81'], correctIndex: 2 },
    { text: 'Hvad er 100 / 4?', options: ['15','20','25','30'], correctIndex: 1 },
    { text: 'Hvad er 12 − 7?', options: ['3','4','5','6'], correctIndex: 2 },
    { text: 'Hvad er 2 × (5 + 3)?', options: ['16','13','8','10'], correctIndex: 0 },
    { text: 'Hvilken type tal er π?', options: ['Rationelt','Irrationelt','Primtal','Naturligt tal'], correctIndex: 1 },
    { text: 'Hvad er 10²?', options: ['20','100','1000','10'], correctIndex: 1 },
    { text: 'Hvad er medianen af [2, 5, 9]?', options: ['2','5','7','9'], correctIndex: 1 },
  ],
  geo: [
    { text: 'Hvilket land har hovedstaden Madrid?', options: ['Portugal','Spanien','Italien','Frankrig'], correctIndex: 1 },
    { text: 'Hvad hedder verdens længste flod?', options: ['Nilen','Amazonas','Yangtze','Mississippi'], correctIndex: 1 },
    { text: 'Hvilket hav ligger øst for Afrika?', options: ['Atlanterhavet','Indiske Ocean','Stillehavet','Ishavet'], correctIndex: 1 },
    { text: 'Hvilket land er både i Europa og Asien?', options: ['Spanien','Rusland','Grækenland','Irland'], correctIndex: 1 },
    { text: 'Hvad hedder Italiens hovedstad?', options: ['Rom','Milano','Venedig','Napoli'], correctIndex: 0 },
    { text: 'Hvilket land har flest øer?', options: ['Filippinerne','Sverige','Indonesien','Japan'], correctIndex: 1 },
    { text: 'Hvor ligger Sahara?', options: ['Sydamerika','Australien','Afrika','Asien'], correctIndex: 2 },
    { text: 'Hvad er hovedstaden i Norge?', options: ['Oslo','Bergen','Trondheim','Stavanger'], correctIndex: 0 },
    { text: 'Mount Everest ligger i…', options: ['Indien','Nepal/ Kina','Bhutan','Pakistan'], correctIndex: 1 },
    { text: 'Hvilket land har byen Reykjavík?', options: ['Finland','Island','Norge','Danmark'], correctIndex: 1 },
  ],
};

// Aktiv kategori
let activeCategory = 'mixed';
let currentQuestions = [];

// ===============================
// Theme (Dark/Light)
// ===============================
const THEME_KEY = 'esblag_theme';
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('darkModeToggle');
  if (btn){ btn.textContent = (theme === 'dark') ? '☀️ Light' : '🌙 Dark'; }
  try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light'){ applyTheme(saved); return; }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// ===============================
// State, Stats & XP Helpers
// ===============================
let currentUser = null;

const STORAGE_KEY = 'esblag_user_v1';
const XP_PER_CORRECT = 10;   // +10 XP pr. korrekt svar
const STREAK_STEP = 0.2;     // +20% XP pr. streak-niveau
const STREAK_MAX_FOR_2X = 5; // 5 perfekte runder giver 2.0x

// Progressive XP-kurve: 1→2: 50, 2→3: 70, 3→4: 90, ...
function xpRequiredForLevel(level){ return 50 + Math.max(0,(level-1))*20; }
function totalXpForLevel(level){ let t=0; for(let L=1; L<level; L++) t+=xpRequiredForLevel(L); return t; }
function getLevel(xp){ let L=1; while(xp >= totalXpForLevel(L+1)) L++; return L; }
function getXPIntoLevel(xp){ const L=getLevel(xp); return xp - totalXpForLevel(L); }
function getXPPercent(xp){
  const L=getLevel(xp);
  const into=getXPIntoLevel(xp);
  const need=xpRequiredForLevel(L);
  return Math.round(100*into/need);
}

// Storage + auth
function loadUser(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw) : null; }
  catch(e){ return null; }
}
function saveUser(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser)); }
function logout(){ localStorage.removeItem(STORAGE_KEY); currentUser=null; showSection('auth'); updateHeader(); }

// ===============================
// UI helpers
// ===============================
function updateHeader(){
  const badge = document.getElementById('userBadge');
  const logoutBtn = document.getElementById('logoutBtn');
  if(currentUser){
    const lvl = getLevel(currentUser.xp || 0);
    const evo = getEvolutionForLevel(lvl);
    const streak = currentUser.streak || 0;
    const streakTxt = streak>0 ? ` • 🔥${streak}` : '';
    badge.textContent = `${evo.emoji} ${currentUser.name} • ${currentUser.age} år • Lvl ${lvl} • ${evo.tier}${streakTxt}`;
    badge.style.display = '';
    logoutBtn.style.display = '';
  }else{
    badge.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
}

function updateStreakBars(){
  if(!currentUser) return;
  const s = currentUser.streak || 0;
  const multiplier = Math.min(1 + STREAK_STEP * s, 2.0);
  const progress = Math.min(100, Math.round((s / STREAK_MAX_FOR_2X) * 100));

  // Welcome
  const scw = document.getElementById('streakCountWelcome');
  const sbw = document.getElementById('streakBonusWelcome');
  const smw = document.getElementById('streakMaxWelcome');
  const sfw = document.getElementById('streakFillWelcome');
  if (scw) scw.textContent = s;
  if (sbw) sbw.textContent = 'x' + multiplier.toFixed(1);
  if (smw) smw.style.display = (multiplier >= 2.0 ? '' : 'none');
  if (sfw){
    sfw.style.width = progress + '%';
    sfw.classList.toggle('maxed', multiplier >= 2.0);
  }

  // Result
  const scr = document.getElementById('streakCountResult');
  const sbr = document.getElementById('streakBonusResult');
  const smr = document.getElementById('streakMaxResult');
  const sfr = document.getElementById('streakFillResult');
  if (scr) scr.textContent = s;
  if (sbr) sbr.textContent = 'x' + multiplier.toFixed(1);
  if (smr) smr.style.display = (multiplier >= 2.0 ? '' : 'none');
  if (sfr){
    sfr.style.width = progress + '%';
    sfr.classList.toggle('maxed', multiplier >= 2.0);
  }

  // Quiz top badge
  const sbq = document.getElementById('streakBadgeQuiz');
  if (sbq) sbq.textContent = s;
}

function updatePetWidgets(){
  if(!currentUser) return;
  const level = getLevel(currentUser.xp || 0);
  const percent = getXPPercent(currentUser.xp || 0);
  const into = getXPIntoLevel(currentUser.xp || 0);
  const need = xpRequiredForLevel(level);
  const evo = getEvolutionForLevel(level);

  // Welcome
  document.getElementById('welcomeName').textContent = currentUser.name;
  document.getElementById('petEmoji').textContent = evo.emoji;
  document.getElementById('levelText').textContent = level;
  document.getElementById('tierLine').textContent = `${evo.tier} — ${evo.desc}`;
  document.getElementById('xpFill').style.width = percent + '%';
  document.getElementById('xpLabel').textContent = `${into} / ${need} XP til næste level`;

  // Result
  document.getElementById('petEmojiResult').textContent = evo.emoji;
  document.getElementById('levelTextResult').textContent = level;
  document.getElementById('tierLineResult').textContent = `${evo.tier} — ${evo.desc}`;
  document.getElementById('xpFillResult').style.width = percent + '%';
  document.getElementById('xpLabelResult').textContent = `${into} / ${need} XP til næste level`;

  // Streak bars
  updateStreakBars();
}

// Sektioner (+ lås før login)
let lastSection = 'welcome';
function showSection(id){
  const loggedIn = !!currentUser;
  const all = ['welcome','auth','quiz','result','about','achievements','categories'];
  const allowed = loggedIn ? all : ['auth'];
  const target = allowed.includes(id) ? id : 'auth';

  all.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = (sec === target) ? '' : 'none';
  });

  if (target !== 'achievements') lastSection = target;
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// Level-up effekter
function playLevelUpEffects(){
  ['petEmoji','petEmojiResult'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'pop 800ms ease';
  });
  launchConfetti(140);
}
function launchConfetti(n=120){
  for(let i=0;i<n;i++){
    const piece = document.createElement('div');
    const size = 6 + Math.random()*6;
    piece.className = 'confetti';
    piece.style.left = (Math.random()*100) + 'vw';
    piece.style.top = '-12px';
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
    piece.style.opacity = '0.9';
    piece.style.borderRadius = '2px';
    piece.style.animationDuration = (1.8 + Math.random()*1.2) + 's';
    document.body.appendChild(piece);
    setTimeout(()=> piece.remove(), 3200);
  }
}

// ===============================
// Category Helpers
// ===============================
function setActiveCategory(key){
  activeCategory = CATEGORIES[key] ? key : 'mixed';
  if (currentUser){
    currentUser.lastCategory = activeCategory;
    saveUser();
  }
  const label = document.getElementById('qCatLabel');
  if (label) label.textContent = CATEGORIES[activeCategory].title;
}

function getActiveQuestions(){
  return QUESTIONS_BY_CATEGORY[activeCategory] || QUESTIONS_BY_CATEGORY.mixed || [];
}

function renderCategories(){
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const keys = Object.keys(CATEGORIES);
  grid.innerHTML = keys.map(k => {
    const c = CATEGORIES[k];
    const count = (QUESTIONS_BY_CATEGORY[k] || []).length;
    return `
      <button class="cat-card" type="button" data-cat="${c.key}">
        <div class="cat-ico">${c.icon}</div>
        <div class="cat-meta">
          <div class="cat-title">${c.title}</div>
          <div class="cat-desc">${c.desc} • ${count} spørgsmål</div>
        </div>
      </button>
    `;
  }).join('');

  // Single handler (prevents duplicate listeners)
  grid.onclick = (e) => {
    const btn = e.target.closest('.cat-card');
    if (!btn) return;
    const key = btn.getAttribute('data-cat');
    setActiveCategory(key);
    startQuiz();
  };
}

// ===============================
// Quiz Engine
// ===============================
let qIndex = 0;
let selections = [];

function startQuiz(){
  if (!currentUser) return showSection('auth');
  currentQuestions = getActiveQuestions();
  if (!currentQuestions.length){
    showToast('Denne kategori har ingen spørgsmål endnu.');
    return;
  }
  qIndex = 0;
  selections = new Array(currentQuestions.length).fill(null);
  const label = document.getElementById('qCatLabel');
  if (label) label.textContent = CATEGORIES[activeCategory].title;
  renderQuestion();
  showSection('quiz');
}

function renderQuestion(){
  const q = currentQuestions[qIndex];
  document.getElementById('qText').textContent = q.text;
  document.getElementById('qProgress').textContent = `${qIndex+1} / ${currentQuestions.length}`;

  const box = document.getElementById('qOptions');
  box.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-btn' + (selections[qIndex]===i ? ' selected' : '');
    btn.textContent = opt;

    const select = () => {
      selections[qIndex] = i;
      [...box.querySelectorAll('.answer-btn')].forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };

    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); select(); });
    btn.addEventListener('click', (e) => { e.preventDefault(); select(); });

    box.appendChild(btn);
  });

  document.getElementById('nextBtn').textContent = (qIndex === currentQuestions.length - 1) ? 'Afslut' : 'Næste';
}

function nextQuestion(){
  if(qIndex < currentQuestions.length - 1){
    qIndex++;
    renderQuestion();
  }else{
    finishQuiz();
  }
}

function finishQuiz(){
  let correct = 0;
  const wrongItems = [];
  currentQuestions.forEach((q, i) => {
    if(selections[i] === q.correctIndex){
      correct++;
    } else {
      wrongItems.push({
        q: q.text,
        your: (Number.isInteger(selections[i]) ? q.options[selections[i]] : '—'),
        right: q.options[q.correctIndex]
      });
    }
  });

  const xpBefore = currentUser.xp || 0;
  const levelBefore = getLevel(xpBefore);

  const baseXP = correct * XP_PER_CORRECT;

  // Streak (perfekte runder)
  let streak = currentUser.streak || 0;
  const perfect = (correct === currentQuestions.length);
  if (perfect) streak = streak + 1;
  else streak = 0;
  currentUser.streak = streak;

  // Stats
  currentUser.stats = currentUser.stats || { totalAnswered: 0, totalCorrect: 0, quizzesCompleted: 0, bestStreak: 0, perfectRounds: 0 };
  currentUser.stats.totalAnswered += currentQuestions.length;
  currentUser.stats.totalCorrect += correct;
  currentUser.stats.quizzesCompleted += 1;
  currentUser.stats.bestStreak = Math.max(currentUser.stats.bestStreak, correct);
  if (perfect) currentUser.stats.perfectRounds += 1;

  const multiplier = Math.min(1 + STREAK_STEP * streak, 2.0);
  const earned = Math.round(baseXP * multiplier);

  currentUser.xp = xpBefore + earned;
  saveUser();

  const levelAfter = getLevel(currentUser.xp || 0);
  const titleEl = document.getElementById('resultTitle');
  if (titleEl) titleEl.textContent = perfect ? 'Perfekt! 🌟' : 'Flot klaret! 🎯';

  document.getElementById('correctCount').textContent = correct;
  document.getElementById('totalCount').textContent = currentQuestions.length;
  document.getElementById('xpEarned').textContent = earned;

  // Fejloversigt
  const wrongWrap = document.getElementById('wrongAnswers');
  const wrongList = document.getElementById('wrongList');
  if(wrongItems.length === 0){
    wrongWrap.style.display = 'none';
    wrongList.innerHTML = '';
  }else{
    wrongWrap.style.display = '';
    wrongList.innerHTML = wrongItems.map(item => `
      <li style="margin-bottom:10px; background:#fff1f2; border:1px solid #fecdd3; padding:8px 10px; border-radius:10px;">
        <div style="font-weight:800;">${item.q}</div>
        <div style="color:#b91c1c;">Dit svar: ${item.your}</div>
        <div style="color:#065f46; font-weight:800;">Korrekt svar: ${item.right}</div>
      </li>
    `).join('');
  }

  // UI update
  updateHeader();
  updatePetWidgets();

  // Level-up effekter
  if (levelAfter > levelBefore){
    const evoBefore = getEvolutionForLevel(levelBefore);
    const evoAfter  = getEvolutionForLevel(levelAfter);
    const evoMsg = evoBefore.tier !== evoAfter.tier ? ` • Evolved: ${evoBefore.tier} → ${evoAfter.tier} ${evoAfter.emoji}` : '';
    showToast(`🎉 Level up! ${levelBefore} → ${levelAfter}${evoMsg}`);
    playLevelUpEffects();
  }

  // Achievements
  checkAndUnlockAchievements();

  showSection('result');
}

// ===============================
// Achievements (MVP) + Queue Popup
// ===============================
const ACHIEVEMENTS = [
  { id:'first_answer', icon:'🎯', title:'First Step', desc:'Svar på dit første spørgsmål.', isUnlocked:(u)=> (u?.stats?.totalAnswered||0) >= 1 },
  { id:'ten_answers',  icon:'🧩', title:'Getting Warm', desc:'Svar på 10 spørgsmål i alt.', isUnlocked:(u)=> (u?.stats?.totalAnswered||0) >= 10 },
  { id:'correct_25',   icon:'✅', title:'Sharpshooter', desc:'Svar rigtigt på 25 spørgsmål i alt.', isUnlocked:(u)=> (u?.stats?.totalCorrect||0) >= 25 },
  { id:'first_quiz',   icon:'🚀', title:'First Quiz', desc:'Gennemfør en quiz.', isUnlocked:(u)=> (u?.stats?.quizzesCompleted||0) >= 1 },
  { id:'perfect_round',icon:'💯', title:'Perfect!', desc:'Gennemfør en perfekt runde (alle rigtige).', isUnlocked:(u)=> (u?.stats?.perfectRounds||0) >= 1 },
  { id:'on_fire',      icon:'🔥', title:'On Fire', desc:'Opnå en streak på 5 perfekte runder.', isUnlocked:(u)=> (u?.streak||0) >= 5 },
  { id:'level_5',      icon:'🦉', title:'Level 5', desc:'Nå level 5.', isUnlocked:(u)=> getLevel(u?.xp||0) >= 5 },
];

function getAchState(){
  if (!currentUser) return { unlocked: {} };
  currentUser.achievements = currentUser.achievements || { unlocked: {} };
  return currentUser.achievements;
}

function checkAndUnlockAchievements(){
  const state = getAchState();
  const newly = [];

  ACHIEVEMENTS.forEach(a => {
    const already = !!state.unlocked[a.id];
    const ok = a.isUnlocked(currentUser);
    if (ok && !already){
      state.unlocked[a.id] = { at: Date.now() };
      newly.push(a);
    }
  });

  if (newly.length){
    saveUser();
    renderAchievements();
    newly.forEach(a => queueAchPopup(a));
  }
}

function renderAchievements(){
  const grid = document.getElementById('achGrid');
  if (!grid) return;
  const state = getAchState();

  grid.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = !!state.unlocked[a.id];
    const cls = 'badge-card' + (unlocked ? '' : ' badge-locked');
    const label = unlocked ? 'Unlocked' : 'Locked';
    return `
      <div class="${cls}">
        <div class="badge-ico">${a.icon}</div>
        <div class="badge-meta">
          <div class="badge-title">${a.title}</div>
          <div class="badge-desc">${a.desc}</div>
          <div class="badge-state ${unlocked ? 'unlocked' : 'locked'}">${label}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ----- Popup Queue -----
const achQueue = [];
let achShowing = false;

function queueAchPopup(a){
  achQueue.push(a);
  if (!achShowing) processAchQueue();
}

function processAchQueue(){
  if (!achQueue.length) { achShowing = false; return; }
  achShowing = true;
  const a = achQueue.shift();
  showAchPopup(a).then(() => {
    setTimeout(processAchQueue, 180);
  });
}

function showAchPopup(a){
  return new Promise((resolve) => {
    const el = document.getElementById('achPopup');
    el.innerHTML = `
      <div class="badge-ico" aria-hidden="true">${a.icon}</div>
      <div>
        <div class="badge-title">Unlocked: ${a.title}</div>
        <div class="small muted">${a.desc}</div>
      </div>
    `;
    el.classList.remove('hide');
    el.classList.add('show');
    const visibleMs = 2000;
    const transitionMs = 250;
    setTimeout(() => {
      el.classList.remove('show');
      el.classList.add('hide');
      setTimeout(() => resolve(), transitionMs);
    }, visibleMs);
  });
}

// ===============================
// Events & Init
// ===============================
document.getElementById('logoutBtn')?.addEventListener('click', logout);

// Auth (local)
const authForm = document.getElementById('authForm');
const authError = document.getElementById('authError');
authForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = authForm.name.value.trim();
  const age = parseInt(authForm.age.value, 10);

  if(!name || !Number.isFinite(age)){
    authError.textContent = 'Udfyld venligst navn og alder.';
    authError.style.display = '';
    return;
  }
  if(age < 8 || age > 99){
    authError.textContent = 'Alderen virker forkert. Prøv igen.';
    authError.style.display = '';
    return;
  }
  authError.style.display = 'none';

  currentUser = {
    name, age, xp: 0, streak: 0, lastCategory: activeCategory,
    stats: { totalAnswered: 0, totalCorrect: 0, quizzesCompleted: 0, bestStreak: 0, perfectRounds: 0 },
    achievements: { unlocked: {} }
  };
  saveUser();
  updateHeader();
  updatePetWidgets();
  renderAchievements();
  renderCategories();
  showSection('welcome');
});

document.getElementById('authReset')?.addEventListener('click', () => { if (authError) authError.style.display = 'none'; });

// Start quiz → kategorier
document.getElementById('startQuizBtn')?.addEventListener('click', () => {
  if (!currentUser) { showSection('auth'); return; }
  renderCategories();
  showSection('categories');
});

document.getElementById('retryBtn')?.addEventListener('click', () => startQuiz());
document.getElementById('homeBtn')?.addEventListener('click', () => showSection('welcome'));
document.getElementById('cancelQuizBtn')?.addEventListener('click', () => showSection('welcome'));

// Næste
document.getElementById('nextBtn')?.addEventListener('click', (e) => { e.preventDefault(); nextQuestion(); });

// Dark mode toggle
document.getElementById('darkModeToggle')?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// Nav (Achievements)
document.getElementById('navAchBtn')?.addEventListener('click', () => {
  if (!currentUser){
    showToast('Lav en profil først for at se achievements.');
    showSection('auth');
    return;
  }
  renderAchievements();
  showSection('achievements');
});

// Back fra kategorier
document.getElementById('backFromCategories')?.addEventListener('click', () => showSection('welcome'));

// Back fra achievements
document.getElementById('backFromAchievements')?.addEventListener('click', () => showSection(lastSection));

// App Init
(function init(){
  initTheme();

  const existing = loadUser();
  if(existing){
    currentUser = existing;
    if (typeof currentUser.xp !== 'number') currentUser.xp = 0;
    if (typeof currentUser.streak !== 'number') currentUser.streak = 0;
    currentUser.stats = currentUser.stats || { totalAnswered: 0, totalCorrect: 0, quizzesCompleted: 0, bestStreak: 0, perfectRounds: 0 };
    currentUser.achievements = currentUser.achievements || { unlocked: {} };
    activeCategory = currentUser.lastCategory || 'mixed';

    updateHeader();
    updatePetWidgets();
    renderAchievements();
    renderCategories();
    const label = document.getElementById('qCatLabel');
    if (label) label.textContent = CATEGORIES[activeCategory].title;
    showSection('welcome');
  }else{
    showSection('auth');
  }

  // Preload questions & prepare initial UI
  currentQuestions = getActiveQuestions();
})();
