// ===============================
// Version & Evolution Table
// ===============================
const APP_VERSION = 'V1.16.0';

// Evolution mapping
const EVOLUTIONS = [
  { min: 1,  max: 1,  tier: 'Egg',        emoji: '🐣', desc: 'Starter som et lille æg' },
  { min: 2,  max: 3,  tier: 'Chick',      emoji: '🐥', desc: 'Klækker til kylling' },
  { min: 4,  max: 6,  tier: 'Small bird', emoji: '🐦', desc: 'Vokser til lille fugl' },
  { min: 7,  max: 9,  tier: 'Swift',      emoji: '🕊', desc: 'Bliver hurtig og smidig' },
  { min: 10, max: 12, tier: 'Owl',        emoji: '🦉', desc: 'Klog fugl, milepæl' },
  { min: 13, max: 15, tier: 'Eagle',      emoji: '🦅', desc: 'Stærk og majestætisk' },
  { min: 16, max: 19, tier: 'Phoenix',    emoji: '🐦‍🔥', desc: 'Mytisk, brændende fugl' },
  { min: 20, max: Infinity, tier: 'Dragon', emoji: '🐉', desc: 'Endgame, kæmpe belønning' },
];
function getEvolutionForLevel(level){
  return EVOLUTIONS.find(e => level >= e.min && level <= e.max) || EVOLUTIONS[0];
}

// ===============================
// State & XP Helpers
// ===============================
let currentUser = null;

const STORAGE_KEY = 'esblag_user_v1';
const XP_PER_CORRECT = 10;               // +10 XP pr. korrekt svar
const STREAK_STEP = 0.2;                 // +20% XP pr. streak-niveau
the STREAK_MAX_FOR_2X = 5;             // 5 perfekte runder giver 2.0x

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

// UI helpers
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
    sfw.classList.toggle('maxed', multiplier >= 2.0); // pulser/shimmer når max
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
    sfr.classList.toggle('maxed', multiplier >= 2.0); // pulser/shimmer når max
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

function showSection(id){
  ['welcome','auth','quiz','result','about'].forEach(sec => {
    document.getElementById(sec).style.display = (sec === id) ? '' : 'none';
  });
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
    el.offsetHeight;
    el.style.animation = 'pop 800ms ease';
  });
  // Konfetti kun ved level-up (ikke ved streak)
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
// Quiz Engine
// ===============================
const QUESTIONS = [
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
];

let qIndex = 0;
let selections = [];

function startQuiz(){
  qIndex = 0;
  selections = new Array(QUESTIONS.length).fill(null);
  renderQuestion();
  showSection('quiz');
}

// Store, klikbare svar-knapper
function renderQuestion(){
  const q = QUESTIONS[qIndex];
  document.getElementById('qText').textContent = q.text;
  document.getElementById('qProgress').textContent = `${qIndex+1} / ${QUESTIONS.length}`;

  const box = document.getElementById('qOptions');
  box.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-btn' + (selections[qIndex]===i ? ' selected' : '');
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      selections[qIndex] = i;
      // opdater visuel markering
      [...box.querySelectorAll('.answer-btn')].forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    box.appendChild(btn);
  });

  document.getElementById('nextBtn').textContent = (qIndex === QUESTIONS.length - 1) ? 'Afslut' : 'Næste';
}

function nextQuestion(){
  if(qIndex < QUESTIONS.length - 1){
    qIndex++;
    renderQuestion();
  }else{
    finishQuiz();
  }
}

function finishQuiz(){
  // Tæl rigtige og saml forkerte
  let correct = 0;
  const wrongItems = [];
  QUESTIONS.forEach((q, i) => {
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

  // Basis- XP for rigtige svar
  const baseXP = correct * XP_PER_CORRECT;

  // Streak-regler
  let streak = currentUser.streak || 0;
  const perfect = (correct === QUESTIONS.length);
  if (perfect){
    streak = streak + 1;           // +1 streak
  } else {
    streak = 0;                    // reset streak
  }
  currentUser.streak = streak;

  // Multiplier: x(1 + 0.2 * streak), max 2.0x
  const multiplier = Math.min(1 + STREAK_STEP * streak, 2.0);
  const earned = Math.round(baseXP * multiplier);

  // Opdater XP og gem
  currentUser.xp = xpBefore + earned;
  saveUser();

  // Resultatvisning
  const levelAfter = getLevel(currentUser.xp || 0);
  const titleEl = document.getElementById('resultTitle');
  if (titleEl) titleEl.textContent = perfect ? 'Perfekt! 🌟' : 'Flot klaret! 🎯';

  document.getElementById('correctCount').textContent = correct;
  document.getElementById('totalCount').textContent = QUESTIONS.length;
  document.getElementById('xpEarned').textContent = earned; // kun XP-tal

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

  // Opdater UI-state
  updateHeader();
  updatePetWidgets(); // inkluderer updateStreakBars()

  // Level-up effekter (kun naturlig level-up)
  if (levelAfter > levelBefore){
    const evoBefore = getEvolutionForLevel(levelBefore);
    const evoAfter  = getEvolutionForLevel(levelAfter);
    const evoMsg = evoBefore.tier !== evoAfter.tier ? ` • Evolved: ${evoBefore.tier} → ${evoAfter.tier} ${evoAfter.emoji}` : '';
    showToast(`🎉 Level up! ${levelBefore} → ${levelAfter}${evoMsg}`);
    playLevelUpEffects();
  }

  showSection('result');
}

// Events
document.getElementById('logoutBtn').addEventListener('click', logout);
const authForm = document.getElementById('authForm');
const authError = document.getElementById('authError');
authForm.addEventListener('submit', (e) => {
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

  currentUser = { name, age, xp: 0, streak: 0 };
  saveUser();
  updateHeader();
  updatePetWidgets();
  showSection('welcome');
});
document.getElementById('authReset').addEventListener('click', () => {
  authError.style.display = 'none';
});

document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
document.getElementById('aboutBtn').addEventListener('click', () => showSection('about'));
document.getElementById('backHomeBtn').addEventListener('click', () => showSection('welcome'));

document.getElementById('nextBtn').addEventListener('click', nextQuestion);
document.getElementById('cancelQuizBtn').addEventListener('click', () => showSection('welcome'));

document.getElementById('retryBtn').addEventListener('click', startQuiz);
document.getElementById('homeBtn').addEventListener('click', () => showSection('welcome'));

// App Init
(function init(){
  const existing = loadUser();
  if(existing){
    currentUser = existing;
    if (typeof currentUser.xp !== 'number') currentUser.xp = 0;
    if (typeof currentUser.streak !== 'number') currentUser.streak = 0;
    updateHeader();
    updatePetWidgets();
    showSection('welcome');
  }else{
    showSection('auth');
  }
  renderQuestion();
})();
