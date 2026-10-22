/* ============================================================
   WellnessAI Studio — app.js
   AI-Powered Student Wellness Platform
   Modules: Posture AI | Stretch Trainer | Lighting Detector |
            Gamification | FitMove Exercise Counter
   ============================================================ */
'use strict';

// ============================================================
// LANDMARK INDICES (MediaPipe Pose)
// ============================================================
const LM = {
    NOSE:0, L_EYE:1, R_EYE:2, L_EAR:7, R_EAR:8,
    L_SHOULDER:11, R_SHOULDER:12, L_ELBOW:13, R_ELBOW:14,
    L_WRIST:15,    R_WRIST:16,
    L_HIP:23,  R_HIP:24,
    L_KNEE:25, R_KNEE:26,
    L_ANKLE:27, R_ANKLE:28
};

// SVG Icon Helper Definitions for UI & Modules
const SVG_ICONS = {
    check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    camera: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    water: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    stretch: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="4" r="2"/><path d="M5 20l4-3 3 1 3-1 4 3"/><path d="M9 14l3-4 3 4"/></svg>',
    fitness: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12"/></svg>',
    posture: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="2.5"/><path d="M12 7.5v8"/><path d="M9 11l3 1 3-1"/><path d="M10 21.5l2-6 2 6"/></svg>',
    eco: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/></svg>',
    voice: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>',
    target: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    award: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    fire: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    sun: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18h6M10 22h4M15 11a5 5 0 1 0-6 0c0 1.5 1 2.5 1 3h4c0-.5 1-1.5 1-3z"/></svg>',
    cross: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    smile: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    meh: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    frown: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
};

// ============================================================
// STRETCH DEFINITIONS — each has a detector function
// ============================================================
const STRETCHES = [
    {
        id:'neck_left', name:'Neck Left Tilt', icon: SVG_ICONS.arrowLeft,
        desc:'Slowly tilt your head to your LEFT side',
        detect(r){
            const n=lm(r,LM.NOSE), ls=lm(r,LM.L_SHOULDER), rs=lm(r,LM.R_SHOULDER);
            if(!n||!ls||!rs) return false;
            // User's left = higher x in raw landmark space (MediaPipe L_SHOULDER has higher x on right of camera)
            return n.x > (ls.x+rs.x)/2 + 0.07;
        }
    },
    {
        id:'neck_right', name:'Neck Right Tilt', icon: SVG_ICONS.arrowRight,
        desc:'Slowly tilt your head to your RIGHT side',
        detect(r){
            const n=lm(r,LM.NOSE), ls=lm(r,LM.L_SHOULDER), rs=lm(r,LM.R_SHOULDER);
            if(!n||!ls||!rs) return false;
            return n.x < (ls.x+rs.x)/2 - 0.07;
        }
    },
    {
        id:'shrug', name:'Shoulder Shrug', icon: SVG_ICONS.stretch,
        desc:'Raise BOTH shoulders up toward your ears',
        detect(r){
            const ls=lm(r,LM.L_SHOULDER), rs=lm(r,LM.R_SHOULDER), n=lm(r,LM.NOSE);
            if(!ls||!rs||!n) return false;
            const sy=(ls.y+rs.y)/2;
            return (sy - n.y) < 0.15; // shoulders close to nose level
        }
    },
    {
        id:'arms_up', name:'Arms Up Stretch', icon: SVG_ICONS.fitness,
        desc:'Raise BOTH arms fully above your head',
        detect(r){
            const lw=lm(r,LM.L_WRIST), rw=lm(r,LM.R_WRIST);
            const ls=lm(r,LM.L_SHOULDER), rs=lm(r,LM.R_SHOULDER);
            if(!ls||!rs) return false;
            const lUp = lw ? lw.y < ls.y-0.07 : false;
            const rUp = rw ? rw.y < rs.y-0.07 : false;
            return lUp && rUp;
        }
    },
    {
        id:'twist', name:'Seated Spinal Twist', icon: SVG_ICONS.repeat,
        desc:'Twist your torso to EITHER side',
        detect(r){
            const ls=lm(r,LM.L_SHOULDER), rs=lm(r,LM.R_SHOULDER);
            if(!ls||!rs) return false;
            return Math.abs(ls.y - rs.y) > 0.09;
        }
    }
];

// ============================================================
// ACHIEVEMENTS
// ============================================================
const ACHIEVEMENTS = [
    { id:'first',    icon: SVG_ICONS.star,     name:'First Step',     desc:'Earn your first point',           cond:s=>s.points>=1 },
    { id:'posture5', icon: SVG_ICONS.posture,  name:'Good Posture',   desc:'Maintain posture for 5 minutes',  cond:s=>s.posturePoints>=50 },
    { id:'stretch3', icon: SVG_ICONS.stretch,  name:'Stretch Master', desc:'Complete 3 stretch sessions',     cond:s=>s.stretchPoints>=180 },
    { id:'reps50',   icon: SVG_ICONS.fitness,  name:'Iron Will',      desc:'Complete 50 total reps',          cond:s=>s.totalReps>=50 },
    { id:'streak3',  icon: SVG_ICONS.fire,     name:'3-Day Streak',   desc:'Use app 3 days in a row',        cond:s=>s.streak>=3 },
    { id:'pts100',   icon: SVG_ICONS.award,    name:'Century Club',   desc:'Earn 100 total points',           cond:s=>s.points>=100 },
    { id:'pts500',   icon: SVG_ICONS.award,    name:'Elite Wellness', desc:'Earn 500 total points',           cond:s=>s.points>=500 },
    { id:'reps100',  icon: SVG_ICONS.fitness,  name:'Fitness Hero',   desc:'Complete 100 total reps',        cond:s=>s.totalReps>=100 },
    { id:'noAlert',  icon: SVG_ICONS.target,   name:'Perfect Session',desc:'Zero posture alerts in a session',cond:s=>s.alerts===0&&s.points>0 }
];

// ============================================================
// POSTURE TIPS ROTATION
// ============================================================
const TIPS = [
    'Sit up straight with your back fully supported by your chair.',
    'Keep your screen at eye level to avoid neck strain.',
    'Place your feet flat on the floor or a footrest.',
    'Keep your shoulders relaxed, not raised or hunched forward.',
    'Your elbows should be at about 90° when using the keyboard.',
    'Take a 20-second eye break every 20 minutes — look 20 feet away.',
    'Keep your screen 50–70 cm from your eyes.',
    'Blink often — screen time reduces blink rate and causes dry eyes.',
    'Stand and stretch at least once every 30 minutes.',
    'Adjust your chair so your hips are slightly higher than your knees.',
];

// ============================================================
// STATE
// ============================================================
const S = {
    // Persistent (localStorage)
    points:       parseInt(localStorage.getItem('wa_pts')  || '0'),
    streak:       parseInt(localStorage.getItem('wa_str')  || '0'),
    streakCountedToday: false,
    totalReps:    parseInt(localStorage.getItem('wa_reps') || '0'),
    lastDate:     localStorage.getItem('wa_date') || '',

    // Session
    posturePoints:0, stretchPoints:0, fitmovePoints:0,
    penalties:0, alerts:0,

    // Posture
    postureScore: 0,
    postureHistory: [],
    lastAlertTime: 0,
    lastPointTime: Date.now(),
    lastRecordTime: 0,
    lastLightTime: 0,
    tipIndex: 0,

    // Camera / MediaPipe
    cameraReady: false,
    poseInitialized: false,
    poseResults: null,
    currentPanel: 'dashboard',
    
    // Anime Avatar and Advanced Features
    selectedAvatarChar: 'goku',
    selectedGokuForm: 'normal',
    ecoOverlayActive: false,
    lastFaceDetectedTime: Date.now(),
    pomPausedByEco: false,
    voiceActive: false,
    recognition: null,

    // Hydration
    waterMl: parseInt(localStorage.getItem('wa_water_ml') || '0'),
    waterGoal: 2000,
    waterTimerSec: 45 * 60,
    waterInterval: null,
    waterPoints: 0,

    // Ergonomic Calculator
    ergoHeight: parseInt(localStorage.getItem('wa_ergo_height') || '165'),
    ergoUnit: localStorage.getItem('wa_ergo_unit') || 'cm',
    ergoSetup: localStorage.getItem('wa_ergo_setup') || 'laptop_stand',

    // Pomodoro
    pomRunning: false,
    pomSec: 25*60,
    pomInterval: null,

    // FitMove
    fitActive:   false,
    fitExercise: 'squat',
    fitTarget:   10,
    fitReps:     0,
    fitState:    'up',   // 'up' | 'down' | 'in' | 'out'
    fitStart:    null,

    // Stretch
    stretchActive: false,
    stretchIdx:    0,
    stretchStars:  [],
    holdInterval:  null,
    holdSec:       0,

    // Charts
    postureChart: null,
    progChart:    null,

    // Activity log
    activities: [],
};

// ============================================================
// HELPERS
// ============================================================
const $  = id => document.getElementById(id);
const lm = (r,i) => { if(!r?.poseLandmarks) return null; const p=r.poseLandmarks[i]; return (p&&p.visibility>0.3)?p:null; };

function calcAngle(A,B,C){
    const rad = Math.atan2(C.y-B.y,C.x-B.x)-Math.atan2(A.y-B.y,A.x-B.x);
    let deg = Math.abs(rad*180/Math.PI);
    return deg>180 ? 360-deg : deg;
}

function dist2d(A,B){ return Math.sqrt((A.x-B.x)**2+(A.y-B.y)**2); }

let toastTimer = null;
function showToast(icon,title,msg){
    const iconEl = $('toastIcon');
    if(iconEl){
        if(typeof icon === 'string' && icon.startsWith('<svg')){
            iconEl.innerHTML = icon;
        } else if(SVG_ICONS[icon]){
            iconEl.innerHTML = SVG_ICONS[icon];
        } else {
            // Map legacy emojis or plain keys to appropriate SVGs
            const map = {
                '💡': SVG_ICONS.bulb,
                '🌞': SVG_ICONS.sun,
                '☀️': SVG_ICONS.sun,
                '🌙': SVG_ICONS.moon,
                '⚠️': SVG_ICONS.warning,
                '✅': SVG_ICONS.check,
                '❌': SVG_ICONS.cross,
                '📷': SVG_ICONS.camera,
                '💧': SVG_ICONS.water,
                '🧘': SVG_ICONS.stretch,
                '🏋️': SVG_ICONS.fitness,
                '⭐': SVG_ICONS.star,
                '🎉': SVG_ICONS.award,
                '🎊': SVG_ICONS.award,
                '🔥': SVG_ICONS.fire,
                '🍃': SVG_ICONS.eco,
                '🎙️': SVG_ICONS.voice,
                'ℹ️': SVG_ICONS.info,
                '😕': SVG_ICONS.frown
            };
            iconEl.innerHTML = map[icon] || SVG_ICONS.info;
        }
    }
    $('toastTitle').textContent=title;
    $('toastMsg').textContent=msg;
    const t=$('alertToast');
    t.classList.add('show');
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>t.classList.remove('show'), 4200);
}

// ============================================================
// GAMIFICATION
// ============================================================
function addPoints(amt,label,icon='star'){
    if(amt>0) registerDailyEngagement();
    S.points = Math.max(0, S.points+amt);
    localStorage.setItem('wa_pts', S.points);
    syncPointsUI();
    updateTree();
    if(label){
        const cleanLabel = label.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
        addActivity(cleanLabel, (amt>0?'+':'')+amt+' pts');
    }
    checkAchievements();
}

function syncPointsUI(){
    $('sidebarPoints').textContent = S.points;
    $('dashPoints').textContent    = S.points;
}

function addActivity(text, pts){
    S.activities.unshift({text,pts,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})});
    if(S.activities.length>8) S.activities.pop();
    const el=$('activityList');
    el.innerHTML = S.activities.map(a=>`
        <div class="activity-item">
            <span class="act-text">${a.text}</span>
            <span class="act-pts">${a.pts}</span>
        </div>`).join('');
}

const TREE_LEVELS = [
    { max:20,        level:'Stage I: Seedling',    scale:0.52, op:0.55 },
    { max:50,        level:'Stage II: Sprout',      scale:0.70, op:0.72 },
    { max:120,       level:'Stage III: Sapling',    scale:0.88, op:0.88 },
    { max:300,       level:'Stage IV: Young Tree',  scale:1.00, op:1.00 },
    { max:Infinity,  level:'Stage V: Mature Flora', scale:1.18, op:1.00 },
];

function updateTree(){
    const p=S.points;
    const idx = TREE_LEVELS.findIndex(t=>p<t.max);
    const cur = TREE_LEVELS[idx===-1?TREE_LEVELS.length-1:idx];

    const tree=$('wellnessTree');
    if(tree){ tree.style.transform=`scale(${cur.scale})`; tree.style.opacity=cur.op; }
    const badge=$('treeLevelBadge');
    if(badge) badge.textContent=cur.level;

    const nextEl=$('treeNextLevel');
    if(nextEl){
        if(cur.max===Infinity){
            nextEl.textContent='Optimal specimen maturity reached';
        } else {
            nextEl.textContent=`${cur.max - p} pts to ${TREE_LEVELS[idx+1].level.replace(/Stage [IVX]+:\s*/,'')}`;
        }
    }
}

function checkAchievements(){
    const grid=$('achGrid');
    if(!grid) return;
    grid.innerHTML = ACHIEVEMENTS.map(a=>{
        const ok=a.cond(S);
        return `<div class="ach-item ${ok?'unlocked':'locked'}" title="${a.desc}">
            <div class="ach-icon">${a.icon}</div>
            <div class="ach-name">${a.name}</div>
        </div>`;
    }).join('');
}

// ============================================================
// LIGHTING DETECTOR
// ============================================================
function checkLighting(canvas){
    if(!canvas||canvas.width===0) return;
    try{
        const ctx = (canvas === CANVASES.posture ? CTXS.posture
                   : canvas === CANVASES.stretch ? CTXS.stretch
                   : canvas === CANVASES.fitmove ? CTXS.fitmove
                   : canvas.getContext('2d', { willReadFrequently: true }));
        const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;
        let sum=0,count=0;
        for(let i=0;i<d.length;i+=4*16){
            sum+=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
            count++;
        }
        const bright=count>0?sum/count:128;
        const dot=$('lightingDot'), txt=$('lightingText');
        if(bright<60){
            dot.className='lighting-dot dark';
            txt.textContent='Low Ambient Lux';
            showToast('bulb','Room Too Dark!','Increase workspace illumination to protect eyesight.');
        } else if(bright>200){
            dot.className='lighting-dot bright';
            txt.textContent='Glare Detected';
            showToast('sun','Too Much Glare!','Adjust screen tilt or blinds to minimize glare.');
        } else {
            dot.className='lighting-dot good';
            txt.textContent='Optimal Illumination';
        }
    } catch(e){}
}

// ============================================================
// POSTURE MODULE
// ============================================================
function analyzePosture(r){
    const earL=lm(r,LM.L_EAR), earR=lm(r,LM.R_EAR);
    const shL=lm(r,LM.L_SHOULDER), shR=lm(r,LM.R_SHOULDER);
    const hipL=lm(r,LM.L_HIP);
    const nose=lm(r,LM.NOSE);
    const eyeL=lm(r,LM.L_EYE), eyeR=lm(r,LM.R_EYE);

    if(!shL&&!shR) return null;

    let score=100, spineAngle=null, headSt='good', distSt='good';
    let tip = TIPS[S.tipIndex % TIPS.length];

    const shMidX = ((shL?.x||0)+(shR?.x||0))/(shL&&shR?2:1);
    const shMidY = ((shL?.y||0)+(shR?.y||0))/(shL&&shR?2:1);
    const shWidth = shL&&shR ? dist2d(shL, shR) : 0.25;

    const ear = earL||earR;
    const sh  = shL||shR;

    // ---- 1. Robust Spine/Neck Slouch check ----
    // If the real hip is hidden under desk (visibility < 0.4), construct a virtual vertical spine reference
    if(ear && sh){
        const refHip = (hipL && hipL.visibility > 0.4) ? hipL : { x: sh.x, y: sh.y + 0.5 };
        spineAngle = Math.round(calcAngle(ear, sh, refHip));
        if(spineAngle < 145){ 
            score -= 35; 
            tip = 'Critical slouch detected. Re-align spinal axis upright.'; 
        } else if(spineAngle < 155){ 
            score -= 15; 
            tip = 'Straighten thoracic spine to reduce lumbar load.'; 
        }
    }

    // ---- 2. Distance-independent Head Height check (normalized ratio) ----
    if(nose && shL && shR){
        const gap = shMidY - nose.y;
        const ratio = gap / shWidth; // Normalized by shoulder width to remove distance scaling error
        
        if(ratio < 0.32){ 
            score -= 25; 
            headSt = 'low'; 
            tip = 'Elevate head position. Cervical forward drop detected.'; 
        } else if(ratio < 0.42){ 
            score -= 10; 
            headSt = 'low'; 
            tip = 'Keep chin neutral and aligned with breastbone.'; 
        }
    }

    // ---- 3. Screen distance: eye separation ----
    if(eyeL && eyeR){
        const eDist = dist2d(eyeL,eyeR);
        if(eDist > 0.185){ 
            score -= 20; 
            distSt = 'close'; 
            tip = 'Excessive screen proximity. Maintain 50-70cm clearance.'; 
        } else if(eDist < 0.05){ 
            distSt = 'far'; 
            tip = 'Position is too distant for accurate sensor analysis.'; 
        }
    }

    // ---- 4. Leaning Sideways (Shoulder level asymmetry) ----
    if(shL && shR){
        const leanSlope = Math.abs(shL.y - shR.y) / shWidth;
        if(leanSlope > 0.12){
            score -= 15;
            tip = 'Lateral spine curvature detected. Level shoulders evenly.';
        }
    }

    score = Math.max(0,Math.min(100,score));
    return { score, spineAngle, headSt, distSt, tip };
}

function updatePostureUI(r){
    const res = analyzePosture(r);
    if(!res) return;
    const { score, spineAngle, headSt, distSt, tip } = res;
    S.postureScore = score;

    // Update posture score gauge
    const path=$('gaugePath');
    if(path){
        const offset=251-(score/100)*251;
        path.style.strokeDashoffset=offset;
    }
    $('gaugeValue').textContent=score;
    $('scoreStatus').textContent=
        score>=80?'Optimal Alignment':score>=60?'Moderate Ergonomic Strain':'Suboptimal Posture — Correct Now';

    // Metric cards
    if(spineAngle!==null){
        $('spineAngle').textContent=spineAngle+'°';
        $('spineBar').style.width=Math.min(100,(spineAngle/180)*100)+'%';
        const ok=spineAngle>=155;
        $('spineStatus').textContent=ok?'Good':spineAngle>=140?'Warning':'Poor';
        $('spineStatus').className='metric-status '+(ok?'good':spineAngle>=140?'warning':'danger');
    }
    $('headPos').textContent = headSt==='good'?'Upright':'Too Low';
    $('headBar').style.width  = headSt==='good'?'85%':'40%';
    $('headStatus').textContent=headSt==='good'?'Good':'Adjust';
    $('headStatus').className='metric-status '+(headSt==='good'?'good':'warning');

    $('screenDist').textContent = distSt==='good'?'Perfect':distSt==='close'?'Too Close':'Too Far';
    $('distBar').style.width    = distSt==='good'?'80%':distSt==='close'?'98%':'20%';
    $('distStatus').textContent = distSt==='good'?'Good':'Adjust';
    $('distStatus').className   = 'metric-status '+(distSt==='good'?'good':'warning');

    $('postureTip').textContent=tip;

    // Alert handling
    const now=Date.now();
    const isBad=score<60;
    const badge=$('postureAlertBadge');
    const box=$('postureBox');
    if(badge) badge.style.display=isBad?'inline-flex':'none';
    if(box)   isBad?box.classList.add('bad-posture'):box.classList.remove('bad-posture');

    if(isBad && now-S.lastAlertTime>15000){
        S.lastAlertTime=now;
        S.alerts++;
        S.penalties+=5;
        $('dashAlerts').textContent=S.alerts;
        $('bdPenalty').textContent=S.penalties;
        addPoints(-5,'Posture deviation detected','warning');
        showToast('warning','Poor Posture Alert!',tip);
    }

    // Posture reward: +10pts per 60s of good posture
    if(!isBad && now-S.lastPointTime>60000){
        S.lastPointTime=now;
        S.posturePoints+=10;
        $('bdPosture').textContent=S.posturePoints;
        addPoints(10,'60 seconds optimal posture maintained','posture');
    }

    // Record history every 5s
    if(now-S.lastRecordTime>5000){
        S.lastRecordTime=now;
        S.postureHistory.push(score);
        if(S.postureHistory.length>24) S.postureHistory.shift();
        updateCharts();
    }

    // Update anime avatar state
    triggerAvatarUpdate();
}

// ============================================================
// FITMOVE MODULE
// ============================================================
function processFitMove(r){
    if(!S.fitActive) return;
    let feedback='', phase='';

    // --- SQUAT ---
    if(S.fitExercise==='squat'){
        const hL=lm(r,LM.L_HIP),kL=lm(r,LM.L_KNEE),aL=lm(r,LM.L_ANKLE);
        const hR=lm(r,LM.R_HIP),kR=lm(r,LM.R_KNEE),aR=lm(r,LM.R_ANKLE);
        let kAng=null;
        if(hL&&kL&&aL) kAng=calcAngle(hL,kL,aL);
        else if(hR&&kR&&aR) kAng=calcAngle(hR,kR,aR);

        if(kAng!==null){
            if(S.fitState==='up'&&kAng<105){ S.fitState='down'; feedback='Target depth reached! Rise upright.'; phase='down'; }
            else if(S.fitState==='down'&&kAng>160){ S.fitState='up'; countRep(); feedback='Repetition verified. Begin next descent.'; phase='up'; }
            else if(!feedback){
                feedback=kAng>150?'Bend knees into parallel squat':'Descend smoothly into position';
                phase=kAng>150?'up':'down';
            }
        } else { feedback='Turn slightly sideways to camera'; phase='ready'; }
    }

    // --- ARM RAISES ---
    else if(S.fitExercise==='arms'){
        const lw=lm(r,LM.L_WRIST),rw=lm(r,LM.R_WRIST);
        const ls=lm(r,LM.L_SHOULDER),rs=lm(r,LM.R_SHOULDER);
        if(ls&&rs){
            const lUp=lw?lw.y<ls.y-0.05:false;
            const rUp=rw?rw.y<rs.y-0.05:false;
            const lDn=lw?lw.y>ls.y+0.05:true;
            const rDn=rw?rw.y>rs.y+0.05:true;
            const bothUp=lUp&&rUp, bothDn=lDn&&rDn;

            if(S.fitState==='down'&&bothUp){ S.fitState='up'; feedback='Overhead extension achieved! Lower arms.'; phase='up'; }
            else if(S.fitState==='up'&&bothDn){ S.fitState='down'; countRep(); feedback='Repetition complete. Elevate arms again.'; phase='down'; }
            else if(!feedback){
                feedback=S.fitState==='down'?'Raise both arms overhead':'Lower both arms to your sides';
                phase=S.fitState;
            }
        } else { feedback='Face the camera directly'; phase='ready'; }
    }

    // --- JUMPING JACKS ---
    else if(S.fitExercise==='jacks'){
        const lw=lm(r,LM.L_WRIST),rw=lm(r,LM.R_WRIST);
        const la=lm(r,LM.L_ANKLE),ra=lm(r,LM.R_ANKLE);
        const ls=lm(r,LM.L_SHOULDER),rs=lm(r,LM.R_SHOULDER);
        if(ls&&rs){
            const sw=Math.abs(ls.x-rs.x);
            const armsUp=(lw&&rw)?(lw.y<ls.y&&rw.y<rs.y):false;
            const legsW=(la&&ra)?Math.abs(la.x-ra.x)>sw*1.5:false;
            const isOut=armsUp&&legsW;
            const isIn=!armsUp&&!legsW;

            if(S.fitState==='in'&&isOut){ S.fitState='out'; feedback='Spread achieved! Return inward.'; phase='out'; }
            else if(S.fitState==='out'&&isIn){ S.fitState='in'; countRep(); feedback='Repetition complete. Jump outward again.'; phase='in'; }
            else if(!feedback){
                feedback=S.fitState==='in'?'Jump outwards with arms raised':'Recover inward to neutral stance';
                phase=S.fitState;
            }
        } else { feedback='Step back so your full body is visible'; phase='ready'; }
    }

    // --- PUSHUPS ---
    else if(S.fitExercise==='pushup'){
        const sL=lm(r,LM.L_SHOULDER), eL=lm(r,LM.L_ELBOW), wL=lm(r,LM.L_WRIST);
        const sR=lm(r,LM.R_SHOULDER), eR=lm(r,LM.R_ELBOW), wR=lm(r,LM.R_WRIST);
        let eAng=null;
        if(sL&&eL&&wL) eAng=calcAngle(sL,eL,wL);
        else if(sR&&eR&&wR) eAng=calcAngle(sR,eR,wR);

        if(eAng!==null){
            if(S.fitState==='up'&&eAng<95){ S.fitState='down'; feedback='Full depth reached. Press upward.'; phase='down'; }
            else if(S.fitState==='down'&&eAng>145){ S.fitState='up'; countRep(); feedback='Repetition complete. Lower with control.'; phase='up'; }
            else if(!feedback){
                feedback=S.fitState==='up'?'Bend elbows to lower your chest':'Straighten arms to complete press';
                phase=S.fitState;
            }
        } else { feedback='Place camera sideways and lie on floor'; phase='ready'; }
    }

    $('formHint').textContent=feedback;
    $('phaseLabel').textContent=phase.toUpperCase();
    const dot=$('phaseDot');
    dot.className='phase-dot '+(phase==='up'||phase==='out'?'up':'down');
}

function countRep(){
    S.fitReps++;
    const el=$('repCount');
    el.textContent=S.fitReps;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
    $('repPbar').style.width=Math.min(100,(S.fitReps/S.fitTarget)*100)+'%';
    if(S.fitReps>=S.fitTarget) completeFitSession();
}

function completeFitSession(){
    S.fitActive=false;
    const elapsed=Math.round((Date.now()-S.fitStart)/1000);
    S.totalReps+=S.fitReps;
    localStorage.setItem('wa_reps',S.totalReps);
    $('dashReps').textContent=S.totalReps;
    S.fitmovePoints+=30;
    $('bdFitmove').textContent=S.fitmovePoints;
    addPoints(30,`${S.fitReps} ${S.fitExercise} reps completed`,'fitness');

    $('sdReps').textContent=S.fitReps;
    $('sdTime').textContent=elapsed+'s';
    $('sdPts').textContent='+30';
    $('sessionDone').style.display='block';
    $('stopFitBtn').style.display='none';
    $('startFitBtn').style.display='block';
    $('startFitBtn').innerHTML=`${SVG_ICONS.fitness} New Set`;

    showToast('award','Exercise Complete!',`Completed ${S.fitReps} repetitions in ${elapsed}s. Earned +30 points.`);
    checkAchievements();
}

// ============================================================
// STRETCH MODULE
// ============================================================
function renderStretchList(){
    const el=$('stretchList');
    el.innerHTML=STRETCHES.map((s,i)=>{
        const done=i<S.stretchIdx;
        const active=i===S.stretchIdx&&S.stretchActive;
        const starCount=S.stretchStars[i]||0;
        const starsHtml = starCount>0 ? `<span class="s-stars-badge">${SVG_ICONS.star} ${starCount}/3</span>` : '';
        return `<div class="stretch-item ${done?'done':''} ${active?'active':''}">
            <div class="s-num">${done?SVG_ICONS.check:i+1}</div>
            <div class="s-info">
                <div class="s-name">${s.icon} <span>${s.name}</span></div>
                <div class="s-desc">${s.desc}</div>
            </div>
            <div class="s-stars">${starsHtml}</div>
        </div>`;
    }).join('');
}

function processStretch(r){
    if(!S.stretchActive||S.stretchIdx>=STRETCHES.length) return;
    const cur=STRETCHES[S.stretchIdx];
    const detected=cur.detect(r);

    if(detected&&!S.holdInterval){
        // Begin hold countdown
        S.holdSec=5;
        $('holdSec').textContent=5;
        $('holdCount').style.display='block';
        $('holdBarWrap').style.display='block';
        $('holdBarFill').style.width='100%';
        $('sfbIcon').innerHTML=SVG_ICONS.check;
        $('sfbTitle').textContent='Stretch Detected — Hold Position';
        $('sfbDesc').textContent=`Maintain holding the ${cur.name}...`;

        S.holdInterval=setInterval(()=>{
            S.holdSec--;
            $('holdSec').textContent=S.holdSec;
            $('holdBarFill').style.width=(S.holdSec/5)*100+'%';
            if(S.holdSec<=0){
                clearInterval(S.holdInterval); S.holdInterval=null;
                $('holdCount').style.display='none';
                $('holdBarWrap').style.display='none';
                finishStretch(3); // perfect hold → 3 stars
            }
        },1000);
    } else if(!detected&&S.holdInterval){
        // Broke the hold
        const heldFor=5-S.holdSec;
        clearInterval(S.holdInterval); S.holdInterval=null;
        $('holdCount').style.display='none';
        $('holdBarWrap').style.display='none';
        $('sfbIcon').innerHTML=SVG_ICONS.warning;
        $('sfbTitle').textContent='Hold Interrupted';
        $('sfbDesc').textContent=`Re-engage position: ${cur.desc}`;
        if(heldFor>=3) finishStretch(2); // partial → 2 stars
        else if(heldFor>=1) finishStretch(1); // short → 1 star
        // else: reset and try again (don't count this attempt)
    } else if(!detected){
        $('sfbIcon').innerHTML=cur.icon;
        $('sfbTitle').textContent=cur.name;
        $('sfbDesc').textContent=cur.desc;
    }
}

function finishStretch(stars){
    S.stretchStars[S.stretchIdx]=stars;
    S.stretchIdx++;
    addPoints(10,`${STRETCHES[S.stretchIdx-1].name} completed`,'stretch');
    S.stretchPoints+=10;
    $('bdStretch').textContent=S.stretchPoints;

    if(S.stretchIdx>=STRETCHES.length){
        // Full session complete!
        S.stretchActive=false;
        addPoints(50,'Full stretch routine completed','award');
        S.stretchPoints+=50;
        $('bdStretch').textContent=S.stretchPoints;
        $('sfbIcon').innerHTML=SVG_ICONS.award;
        $('sfbTitle').textContent='Routine Completed';
        $('sfbDesc').textContent='Excellent mobility routine completed. +60 points earned!';
        $('startStretchBtn').style.display='block';
        $('startStretchBtn').innerHTML=`${SVG_ICONS.repeat} Restart Routine`;
        showToast('award','Stretch Complete!','Full routine finished. +60 points earned.');
        checkAchievements();
    }
    renderStretchList();
}

// ============================================================
// CHARTS
// ============================================================
function initCharts(){
    Chart.defaults.color = '#847A70';
    Chart.defaults.font.family = "'Source Sans 3', system-ui, sans-serif";

    const makeChart=(canvasId,color)=>{
        const ctx=$(canvasId)?.getContext('2d');
        if(!ctx) return null;
        const grad=ctx.createLinearGradient(0,0,0,200);
        grad.addColorStop(0,color+'33');
        grad.addColorStop(1,color+'00');
        return new Chart(ctx,{
            type:'line',
            data:{
                labels:[],
                datasets:[{
                    data:[],
                    borderColor:color,
                    backgroundColor:grad,
                    borderWidth:2,fill:true,tension:0.45,
                    pointRadius:2,pointBackgroundColor:color,
                    pointBorderColor:'transparent'
                }]
            },
            options:{
                responsive:true, maintainAspectRatio:false,
                animation:{duration:300},
                plugins:{legend:{display:false}},
                scales:{
                    x:{display:false},
                    y:{
                        min:0,max:100,
                        grid:{color:'#DDD4C4'},
                        ticks:{font:{size:11,family:"'JetBrains Mono', monospace"},color:'#847A70'}
                    }
                }
            }
        });
    };

    S.postureChart = makeChart('postureChart','#1E5E41');
    S.progChart    = makeChart('progressChart','#B47214');
}

function updateCharts(){
    const data=S.postureHistory;
    const labels=data.map((_,i)=>i*5+'s');
    [S.postureChart,S.progChart].forEach(c=>{
        if(!c) return;
        c.data.labels=labels;
        c.data.datasets[0].data=data;
        c.update('none');
    });
}

// ============================================================
// MEDIAPIPE POSE SETUP
// ============================================================
const CANVASES = {};
const CTXS = {};

function drawToCanvas(r, canvas, ctx){
    if(!canvas||!ctx) return;
    const vid=$('input_video');
    if(vid.videoWidth>0&&canvas.width!==vid.videoWidth){
        canvas.width=vid.videoWidth;
        canvas.height=vid.videoHeight;
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(r.image,0,0,canvas.width,canvas.height);

    if(r.poseLandmarks){
        // Draw connections
        const CONN=[
            [LM.NOSE,LM.L_EYE],[LM.NOSE,LM.R_EYE],
            [LM.L_EYE,LM.L_EAR],[LM.R_EYE,LM.R_EAR],
            [LM.L_SHOULDER,LM.R_SHOULDER],
            [LM.L_SHOULDER,LM.L_ELBOW],[LM.L_ELBOW,LM.L_WRIST],
            [LM.R_SHOULDER,LM.R_ELBOW],[LM.R_ELBOW,LM.R_WRIST],
            [LM.L_SHOULDER,LM.L_HIP],[LM.R_SHOULDER,LM.R_HIP],
            [LM.L_HIP,LM.R_HIP],
            [LM.L_HIP,LM.L_KNEE],[LM.L_KNEE,LM.L_ANKLE],
            [LM.R_HIP,LM.R_KNEE],[LM.R_KNEE,LM.R_ANKLE]
        ];
        const W=canvas.width, H=canvas.height;
        ctx.save();
        ctx.strokeStyle='#1E5E41';
        ctx.lineWidth=2.5;
        for(const [a,b] of CONN){
            const A=r.poseLandmarks[a], B=r.poseLandmarks[b];
            if(!A||!B||A.visibility<0.3||B.visibility<0.3) continue;
            ctx.beginPath();
            ctx.moveTo(A.x*W, A.y*H);
            ctx.lineTo(B.x*W, B.y*H);
            ctx.stroke();
        }
        // Draw landmark dots
        ctx.fillStyle='#BA2D1D';
        for(const p of r.poseLandmarks){
            if(p.visibility<0.3) continue;
            ctx.beginPath();
            ctx.arc(p.x*W, p.y*H, 3.5, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function onPoseResults(r){
    S.poseResults=r;

    // Eco Mode presence detection check
    const personDetected = r.poseLandmarks && r.poseLandmarks[LM.NOSE] && r.poseLandmarks[LM.NOSE].visibility > 0.45;
    if(personDetected){
        S.lastFaceDetectedTime = Date.now();
        if(S.ecoOverlayActive){
            deactivateEcoMode();
        }
    } else {
        checkEcoTimeout();
    }

    // Pick active canvas
    const panel=S.currentPanel;
    let canvas, ctx;
    if(panel==='posture'||panel==='dashboard'){
        canvas=CANVASES.posture; ctx=CTXS.posture;
    } else if(panel==='stretch'){
        canvas=CANVASES.stretch; ctx=CTXS.stretch;
    } else if(panel==='fitmove'){
        canvas=CANVASES.fitmove; ctx=CTXS.fitmove;
    } else {
        canvas=CANVASES.posture; ctx=CTXS.posture;
    }

    drawToCanvas(r,canvas,ctx);

    // Lighting check every 4 seconds
    const now=Date.now();
    if(now-S.lastLightTime>4000){
        S.lastLightTime=now;
        checkLighting(canvas);
    }

    // Run modules
    updatePostureUI(r);
    if(panel==='stretch') processStretch(r);
    if(panel==='fitmove') processFitMove(r);

    // First camera connect
    if(!S.cameraReady){
        S.cameraReady=true;
        const dot=$('camDot');
        if(dot) dot.className='cam-dot online';
        const stTxt=$('camStatusText');
        if(stTxt) stTxt.textContent='Camera Online';
        
        // Hide all camera placeholders across all panels
        $('posturePlaceholder')?.style.setProperty('display', 'none');
        $('stretchPlaceholder')?.style.setProperty('display', 'none');
        $('fitmovePlaceholder')?.style.setProperty('display', 'none');
        $('dashCamPrompt')?.style.setProperty('display', 'none');

        const stopBtn=$('camStopBtn');
        if(stopBtn) stopBtn.style.display='block';
        showToast('check','Camera Connected!','Biomechanics sensor telemetry is now active.');
        addActivity('Camera telemetry connected','');
    }
}

let mediaCamera = null;

function openCameraModal(){
    if (S.cameraReady || S.poseInitialized) {
        showToast('info','Camera Active','The camera tracking is already enabled.');
        return;
    }
    const modal = $('cameraPrivacyModal');
    if(modal) modal.style.display = 'flex';
}

function requestCameraPermission(){
    if (S.cameraReady || S.poseInitialized) {
        showToast('info','Camera Active','The camera tracking is already enabled.');
        return;
    }
    showToast('camera','Camera Request','Please authorize camera permission in the browser prompt.');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            // Stop temporary stream so we don't lock it, and let MediaPipe Pose handle the stream
            stream.getTracks().forEach(track => track.stop());
            initPose();
        })
        .catch(err => {
            showToast('cross','Camera Denied!','Please click the site permissions icon in the address bar to allow Camera.');
            console.error('Camera permission request error:', err);
        });
}

function initPose(){
    if (S.poseInitialized) return;
    S.poseInitialized = true;
    const video=$('input_video');
    const pose=new Pose({
        locateFile:(f)=>`https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${f}`
    });
    pose.setOptions({
        modelComplexity:1,
        smoothLandmarks:true,
        enableSegmentation:false,
        smoothSegmentation:false,
        minDetectionConfidence:0.5,
        minTrackingConfidence:0.5
    });
    pose.onResults(onPoseResults);

    mediaCamera=new Camera(video,{
        onFrame:async()=>{ await pose.send({image:video}); },
        width:640, height:480
    });
    mediaCamera.start().catch(err=>{
        showToast('cross','Camera Denied!','Please click the site permissions icon in your URL bar and select "Allow" for Camera.');
        console.error('Camera error:',err);
    });
}

// Fully stops the webcam stream and resets camera UI back to "off" state.
function stopCamera(){
    if(mediaCamera){ mediaCamera.stop(); mediaCamera=null; }
    S.cameraReady=false;
    S.poseInitialized=false;
    S.poseResults=null;

    const dot=$('camDot');
    if(dot) dot.className='cam-dot';
    const txt=$('camStatusText');
    if(txt) txt.textContent='Camera Offline';
    const stopBtn=$('camStopBtn');
    if(stopBtn) stopBtn.style.display='none';
    
    // Restore all camera placeholders
    $('posturePlaceholder')?.style.setProperty('display', 'flex');
    $('stretchPlaceholder')?.style.setProperty('display', 'flex');
    $('fitmovePlaceholder')?.style.setProperty('display', 'flex');
    $('dashCamPrompt')?.style.setProperty('display', 'block');

    showToast('camera','Camera Stopped','Sensor feed has been deactivated.');
    addActivity('Camera feed disconnected','');
}

// ============================================================
// POMODORO TIMER
// ============================================================
function updateTimerDisplay(){
    const m=String(Math.floor(S.pomSec/60)).padStart(2,'0');
    const s=String(S.pomSec%60).padStart(2,'0');
    $('timerValue').textContent=`${m}:${s}`;
}

function initPomodoro(){
    $('timerBtn').addEventListener('click',()=>{
        if(S.pomRunning){
            clearInterval(S.pomInterval); S.pomRunning=false;
            S.pomSec=25*60; updateTimerDisplay();
            $('timerBtn').textContent='Start';
        } else {
            S.pomRunning=true;
            $('timerBtn').textContent='Stop';
            S.pomInterval=setInterval(()=>{
                // Eco mode check when pomodoro is running and camera is offline / no frames
                if(Date.now() - S.lastFaceDetectedTime > 6000){
                    checkEcoTimeout();
                }
                S.pomSec--;
                updateTimerDisplay();
                if(S.pomSec<=0){
                    clearInterval(S.pomInterval); S.pomRunning=false;
                    S.pomSec=25*60; updateTimerDisplay();
                    $('timerBtn').textContent='Start';
                    $('stretchModal').style.display='flex';
                    showToast('stretch','Break Time!','25 minutes completed — time for a mobility stretch!');
                }
            },1000);
        }
    });
}

// ============================================================
// SMART HYDRATION & WATER DRINKING REMINDER
// ============================================================
function playWaterSound(){
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
    } catch(e){}
}

function updateWaterUI(){
    // Check if new day
    const today = new Date().toDateString();
    const lastWaterDate = localStorage.getItem('wa_water_date');
    if(lastWaterDate !== today){
        S.waterMl = 0;
        localStorage.setItem('wa_water_ml', '0');
        localStorage.setItem('wa_water_date', today);
    }

    const pct = Math.min(100, Math.round((S.waterMl / S.waterGoal) * 100));
    
    // Header widget
    const badge = $('waterIntakeBadge');
    if(badge) badge.textContent = `${S.waterMl}/${S.waterGoal}ml`;
    const headerBar = $('waterHeaderBar');
    if(headerBar) headerBar.style.width = pct + '%';
    
    // Dashboard stat
    const dashW = $('dashWater');
    if(dashW) dashW.innerHTML = `${S.waterMl}<span style="font-size:11px;font-weight:500;color:var(--tx2);">/${S.waterGoal}ml</span>`;
}

function updateWaterTimerDisplay(){
    const m = String(Math.floor(S.waterTimerSec / 60)).padStart(2, '0');
    const s = String(S.waterTimerSec % 60).padStart(2, '0');
    const el = $('waterTimerVal');
    if(el) el.textContent = `${m}:${s}`;
}

function logWater(amount = 250){
    S.waterMl = Math.min(S.waterGoal + 1500, S.waterMl + amount);
    localStorage.setItem('wa_water_ml', S.waterMl);
    localStorage.setItem('wa_water_date', new Date().toDateString());
    
    S.waterPoints += 15;
    const bdW = $('bdWater');
    if(bdW) bdW.textContent = S.waterPoints;
    
    playWaterSound();
    updateWaterUI();
    addPoints(15, `+${amount}ml Water Logged`, 'water');
    addActivity(`Drank ${amount}ml water`, `${S.waterMl} / ${S.waterGoal}ml logged`);
    
    if(S.waterMl === S.waterGoal || S.waterMl === S.waterGoal + 250){
        showToast('award', 'Hydration Goal Achieved!', `You reached ${S.waterGoal}ml of water intake today.`);
    } else {
        showToast('water', 'Hydration Logged', `+${amount}ml recorded (${S.waterMl}/${S.waterGoal}ml). Well done!`);
    }
}

function triggerWaterAlert(){
    playWaterSound();
    showToast('water', 'Hydration Interval', '45 minutes elapsed. Hydrate with clean water for optimal cognitive focus.');
    addActivity('Hydration reminder triggered', 'Time to drink water');
}

function initWaterReminder(){
    updateWaterUI();
    updateWaterTimerDisplay();

    // Log button in header
    $('waterLogBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        logWater(250);
    });

    // Click on reminder widget to reset timer or quick log
    $('waterReminderWrap')?.addEventListener('click', () => {
        logWater(250);
    });

    // Start 1-second interval countdown for water drinking
    if(S.waterInterval) clearInterval(S.waterInterval);
    S.waterInterval = setInterval(() => {
        S.waterTimerSec--;
        updateWaterTimerDisplay();
        if(S.waterTimerSec <= 0){
            S.waterTimerSec = 45 * 60; // Reset to 45 mins
            updateWaterTimerDisplay();
            triggerWaterAlert();
        }
    }, 1000);
}

// ============================================================
// SMART ERGONOMIC SETUP CALCULATOR (ErgoCalc)
// ============================================================
function cmToFtIn(cm){
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${ft}' ${inches}"`;
}

function updateErgoCalc(){
    const H = S.ergoHeight; // in cm
    const unit = S.ergoUnit; // 'cm' or 'in'
    const setup = S.ergoSetup;

    // OSHA & ISO 9241-5 Ergonomic Formula Calculations
    const chairCm = H * 0.255;
    const deskCm  = H * 0.415;
    const eyeCm   = H * 0.690;
    const distCm  = H * 0.380;

    // Format output strings
    const fmt = (valCm) => {
        if(unit === 'cm'){
            return `${valCm.toFixed(1)} cm`;
        } else {
            const inches = (valCm / 2.54).toFixed(1);
            return `${inches}"`;
        }
    };

    // Update Result Cards
    if($('resChairHeight')) $('resChairHeight').textContent = fmt(chairCm);
    if($('resDeskHeight'))  $('resDeskHeight').textContent  = fmt(deskCm);
    if($('resEyeLevel'))    $('resEyeLevel').textContent    = fmt(eyeCm);
    if($('resScreenDist'))  $('resScreenDist').textContent  = fmt(distCm);

    // Height display
    if($('ergoHeightDisplay')) $('ergoHeightDisplay').textContent = H;
    if($('ergoHeightUnitLabel')) $('ergoHeightUnitLabel').textContent = 'cm';
    if($('ergoHeightAltLabel')) $('ergoHeightAltLabel').textContent = `(${cmToFtIn(H)})`;

    // Dynamic Blueprint SVG Adjustments
    // Base reference: Ground floor y = 300
    const chairY = 300 - (chairCm * 2.1);
    const deskY  = 300 - (deskCm * 2.05);
    const headY  = chairY - 120;
    const eyeY   = headY - 2;
    const spineY = chairY;

    // Update SVG elements dynamically
    const chairSeat = $('chairSeat');
    if(chairSeat){
        chairSeat.setAttribute('y', chairY);
    }
    const chairStem = $('chairStem');
    if(chairStem){
        chairStem.setAttribute('y2', chairY + 5);
    }
    const chairBack = $('chairBack');
    if(chairBack){
        chairBack.setAttribute('d', `M 150 ${chairY} L 145 ${chairY - 80} Q 148 ${chairY - 95} 152 ${chairY - 100}`);
    }

    // Desk elements
    const deskTop = $('deskTop');
    if(deskTop){
        deskTop.setAttribute('y', deskY);
    }
    const deskLeg = $('deskLeg');
    if(deskLeg){
        deskLeg.setAttribute('y1', deskY + 8);
    }

    // Student anatomy
    const svgHead = $('svgHead');
    if(svgHead){
        svgHead.setAttribute('cy', headY);
    }
    const svgEye = $('svgEye');
    if(svgEye){
        svgEye.setAttribute('cy', eyeY);
    }
    const svgSpine = $('svgSpine');
    if(svgSpine){
        svgSpine.setAttribute('y1', headY + 18);
        svgSpine.setAttribute('y2', spineY);
    }
    const svgThigh = $('svgThigh');
    if(svgThigh){
        svgThigh.setAttribute('y1', spineY);
        svgThigh.setAttribute('y2', spineY);
    }
    const svgShin = $('svgShin');
    if(svgShin){
        svgShin.setAttribute('y1', spineY);
    }
    const svgArm = $('svgArm');
    if(svgArm){
        svgArm.setAttribute('points', `190,${headY + 35} 210,${deskY + 5} 270,${deskY + 5}`);
    }

    // Monitor positioning depending on setup
    const screenGroup = $('screenGroup');
    if(screenGroup){
        let screenYOffset = 0;
        if(setup === 'laptop_desk'){
            screenYOffset = deskY - 145; // lower screen
        } else if(setup === 'laptop_stand'){
            screenYOffset = deskY - 165; // elevated on stand
        } else {
            screenYOffset = deskY - 175; // full desktop monitor
        }
        screenGroup.setAttribute('transform', `translate(0, ${screenYOffset})`);
    }

    // Sight line
    const svgSight = $('svgSightLine');
    if(svgSight){
        svgSight.setAttribute('y1', eyeY);
        const targetScreenY = setup === 'laptop_desk' ? deskY - 20 : eyeY - 5;
        svgSight.setAttribute('y2', targetScreenY);
    }

    // Dimension Lines text
    const cDim = $('svgChairDimText');
    if(cDim) cDim.textContent = fmt(chairCm);
    const dDim = $('svgDeskDimText');
    if(dDim) dDim.textContent = fmt(deskCm);
    const distDim = $('svgDistDimText');
    if(distDim) distDim.textContent = fmt(distCm);

    // Dynamic Recommendation Tip
    const tipEl = $('bpDynamicTip');
    if(tipEl){
        let setupAdvice = '';
        if(setup === 'laptop_desk'){
            setupAdvice = '<strong>Ergonomic Notice:</strong> Operating a laptop flat directly on desk level induces 35°-45° cervical flexion. Elevate display using a stand or riser.';
        } else if(setup === 'laptop_stand'){
            setupAdvice = `<strong>Optimal Configuration:</strong> Elevated laptop display paired with external peripherals at ${fmt(deskCm)} maintains neutral spinal alignment and relaxed wrists.`;
        } else {
            setupAdvice = `<strong>Desktop Workspace:</strong> Position monitor ~${fmt(distCm)} away with top edge at eye level (~${fmt(eyeCm)} from floor).`;
        }
        tipEl.innerHTML = setupAdvice;
    }
}

function initErgoCalc(){
    const slider = $('ergoHeightSlider');
    if(slider){
        slider.value = S.ergoHeight;
        slider.addEventListener('input', (e) => {
            S.ergoHeight = parseInt(e.target.value);
            localStorage.setItem('wa_ergo_height', S.ergoHeight);
            
            // Sync preset buttons
            document.querySelectorAll('.preset-btn').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.height) === S.ergoHeight);
            });
            
            updateErgoCalc();
        });
    }

    // Unit toggle (Metric vs Imperial)
    $('unitCmBtn')?.addEventListener('click', () => {
        S.ergoUnit = 'cm';
        localStorage.setItem('wa_ergo_unit', 'cm');
        $('unitCmBtn').classList.add('active');
        $('unitFtBtn').classList.remove('active');
        updateErgoCalc();
    });
    $('unitFtBtn')?.addEventListener('click', () => {
        S.ergoUnit = 'in';
        localStorage.setItem('wa_ergo_unit', 'in');
        $('unitFtBtn').classList.add('active');
        $('unitCmBtn').classList.remove('active');
        updateErgoCalc();
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const h = parseInt(btn.dataset.height);
            S.ergoHeight = h;
            if(slider) slider.value = h;
            localStorage.setItem('wa_ergo_height', h);
            updateErgoCalc();
        });
    });

    // Workspace setup buttons
    document.querySelectorAll('.setup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.setup-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            S.ergoSetup = btn.dataset.setup;
            localStorage.setItem('wa_ergo_setup', S.ergoSetup);
            updateErgoCalc();
        });
    });

    updateErgoCalc();
}

// ============================================================
// PANEL NAVIGATION
// ============================================================
function switchPanel(id){
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    const p=$('panel-'+id), n=$('nav-'+id);
    if(p) p.classList.add('active');
    if(n) n.classList.add('active');
    S.currentPanel=id;
}

// ============================================================
// FITMOVE UI SETUP
// ============================================================
function initFitMove(){
    document.querySelectorAll('.ex-btn').forEach(btn=>btn.addEventListener('click',()=>{
        document.querySelectorAll('.ex-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        S.fitExercise=btn.dataset.ex;
        S.fitState=S.fitExercise==='jacks'?'in':'up';
    }));

    document.querySelectorAll('.rep-btn').forEach(btn=>btn.addEventListener('click',()=>{
        document.querySelectorAll('.rep-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        S.fitTarget=parseInt(btn.dataset.reps);
        $('repTarget').textContent=S.fitTarget;
    }));

    $('startFitBtn').addEventListener('click',()=>{
        if(!S.cameraReady && !S.poseInitialized){
            openCameraModal();
        }
        S.fitActive=true; S.fitReps=0;
        S.fitStart=Date.now();
        S.fitState=S.fitExercise==='jacks'?'in':'up';
        $('repCount').textContent='0';
        $('repPbar').style.width='0%';
        $('sessionDone').style.display='none';
        $('startFitBtn').style.display='none';
        $('stopFitBtn').style.display='block';
        $('formHint').textContent='Exercise started! Follow the instructions above.';
        switchPanel('fitmove');
    });

    $('stopFitBtn').addEventListener('click',()=>{
        S.fitActive=false;
        $('startFitBtn').style.display='block';
        $('startFitBtn').innerHTML=`${SVG_ICONS.fitness} Start Exercise`;
        $('stopFitBtn').style.display='none';
        $('formHint').textContent='Exercise stopped.';
    });

    $('newSetBtn').addEventListener('click',()=>{
        $('sessionDone').style.display='none';
        S.fitReps=0; $('repCount').textContent='0';
        $('repPbar').style.width='0%';
    });
}

// ============================================================
// STRETCH UI SETUP
// ============================================================
function initStretch(){
    renderStretchList();

    $('startStretchBtn').addEventListener('click',()=>{
        if(!S.cameraReady && !S.poseInitialized){
            openCameraModal();
        }
        S.stretchActive=true; S.stretchIdx=0; S.stretchStars=[];
        if(S.holdInterval){ clearInterval(S.holdInterval); S.holdInterval=null; }
        $('holdCount').style.display='none';
        $('holdBarWrap').style.display='none';
        $('sfbIcon').innerHTML=STRETCHES[0].icon;
        $('sfbTitle').textContent=STRETCHES[0].name;
        $('sfbDesc').textContent=STRETCHES[0].desc;
        $('startStretchBtn').style.display='none';
        renderStretchList();
        switchPanel('stretch');
    });

    $('goStretchBtn').addEventListener('click',()=>{
        $('stretchModal').style.display='none';
        if(!S.cameraReady && !S.poseInitialized){
            openCameraModal();
        }
        S.stretchActive=true; S.stretchIdx=0; S.stretchStars=[];
        $('sfbIcon').innerHTML=STRETCHES[0].icon;
        $('sfbTitle').textContent=STRETCHES[0].name;
        $('sfbDesc').textContent=STRETCHES[0].desc;
        $('startStretchBtn').style.display='none';
        renderStretchList();
        switchPanel('stretch');
    });

    $('skipStretchBtn').addEventListener('click',()=>{
        $('stretchModal').style.display='none';
        addPoints(-10,'Skipped stretch break','warning');
        showToast('warning','Stretch Skipped','-10 points. Prioritize mobility in your next session.');
    });
}

// ============================================================
// STREAK LOGIC
// ============================================================
function initStreak(){
    const today=new Date().toDateString();
    S.streakCountedToday = (S.lastDate===today);
    $('sidebarStreak').textContent=S.streak;
    $('dashStreak').textContent=S.streak;
}

function registerDailyEngagement(){
    if(S.streakCountedToday) return;
    S.streakCountedToday = true;
    const today=new Date().toDateString();
    const yesterday=new Date(Date.now()-86400000).toDateString();
    if(S.lastDate===yesterday) S.streak++;
    else S.streak=1;
    S.lastDate=today;
    localStorage.setItem('wa_date',today);
    localStorage.setItem('wa_str',S.streak);
    $('sidebarStreak').textContent=S.streak;
    $('dashStreak').textContent=S.streak;
    if(S.streak>1) showToast('fire','Streak Extended!',`${S.streak}-day streak active. Consistency verified.`);
}

// ============================================================
// LOADING SCREEN
// ============================================================
function animateLoading(){
    let progress=0;
    const bar=$('loadingBar');
    const tips=[
        "Calibration: Verify spinal alignment while initializing.",
        "Loading MediaPipe neural biomechanics framework...",
        "Calibrating real-time skeletal telemetry matrix...",
        "Synthesizing environmental lux sensory processing...",
        "Ergonomic fact: Neutral posture reduces cognitive fatigue by 40%."
    ];
    let ti=0;
    const iv=setInterval(()=>{
        progress+=Math.random()*12+4;
        if(progress>95) progress=95;
        bar.style.width=progress+'%';
        if(ti<tips.length&&progress>ti*20){
            $('loadingTip').textContent=tips[ti++];
        }
    },400);
    return { bar, iv };
}

// ============================================================
// GREETING
// ============================================================
function setGreeting(){
    const h=new Date().getHours();
    $('greeting').textContent = h<12?'Good morning, Scholar':h<17?'Good afternoon, Scholar':'Good evening, Scholar';
}

// ============================================================
// NAVIGATION SETUP
// ============================================================
function initNav(){
    document.querySelectorAll('.nav-item').forEach(btn=>{
        btn.addEventListener('click',()=>switchPanel(btn.dataset.panel));
    });
}

// ============================================================
// TIP ROTATOR
// ============================================================
function initTipRotator(){
    setInterval(()=>{
        S.tipIndex++;
        if(!S.poseResults){
            $('postureTip').textContent=TIPS[S.tipIndex%TIPS.length];
        }
    },9000);
}

// ============================================================
// ECO-SAVING SCREEN DIMMER (RESOURCE OPTIMIZATION)
// ============================================================
function checkEcoTimeout(){
    const isEcoEnabled = $('ecoModeToggle')?.checked;
    if(!isEcoEnabled || S.ecoOverlayActive || !S.cameraReady) return;
    
    // Dim the screen if no person has been detected for 6 seconds
    if(Date.now() - S.lastFaceDetectedTime > 6000){
        activateEcoMode();
    }
}

function activateEcoMode(){
    S.ecoOverlayActive = true;
    $('ecoOverlay').classList.add('active');
    
    // Pause Pomodoro study timer if running
    if(S.pomRunning){
        clearInterval(S.pomInterval);
        S.pomRunning = false;
        S.pomPausedByEco = true;
        $('timerBtn').textContent = 'Start';
        showToast('eco', 'Eco Pause', 'Timer suspended while user is absent.');
    }
    showToast('eco', 'Eco Mode Active', 'Display dimmed to conserve energy.');
}

function deactivateEcoMode(){
    S.ecoOverlayActive = false;
    $('ecoOverlay').classList.remove('active');
    S.lastFaceDetectedTime = Date.now(); // reset timer
    
    // Resume Pomodoro study timer if paused by Eco Mode
    if(S.pomPausedByEco){
        S.pomPausedByEco = false;
        S.pomRunning = true;
        $('timerBtn').textContent = 'Stop';
        S.pomInterval = setInterval(()=>{
            // Check for presence in timer loop too in case webcam feed is inactive
            if(Date.now() - S.lastFaceDetectedTime > 6000){
                checkEcoTimeout();
            }
            S.pomSec--;
            updateTimerDisplay();
            if(S.pomSec<=0){
                clearInterval(S.pomInterval); S.pomRunning=false;
                S.pomSec=25*60; updateTimerDisplay();
                $('timerBtn').textContent='Start';
                $('stretchModal').style.display='flex';
                showToast('stretch','Break Time!','25 minutes completed — time for a mobility stretch!');
            }
        },1000);
        showToast('sun', 'Welcome Back!', 'Study timer resumed.');
    }
}

// ============================================================
// VOICE-CONTROLLED HANDS-FREE NAVIGATION (SpeechRecognition)
// ============================================================
function toggleVoiceControl(){
    if(!S.recognition){
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(!SpeechRecognition){
            showToast('cross', 'Speech Recognition', 'Your browser does not support Speech Recognition.');
            return;
        }
        S.recognition = new SpeechRecognition();
        S.recognition.continuous = true;
        S.recognition.interimResults = false;
        S.recognition.lang = 'en-US';
        
        S.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript.trim().toLowerCase();
            handleVoiceCommand(text);
        };
        
        S.recognition.onstart = () => {
            S.voiceActive = true;
            $('voiceToggleBtn').classList.add('active', 'listening');
            $('voiceLabel').textContent = 'Listening...';
            showToast('voice', 'Voice Control', 'Say commands like "posture", "dashboard", "goku"!');
        };
        
        S.recognition.onend = () => {
            $('voiceToggleBtn').classList.remove('listening');
            if(S.voiceActive){
                try { S.recognition.start(); } catch(e){}
            } else {
                $('voiceToggleBtn').classList.remove('active');
                $('voiceLabel').textContent = 'Voice OFF';
            }
        };
        
        S.recognition.onerror = (e) => {
            console.error('Speech error:', e.error);
            if(e.error === 'not-allowed'){
                showToast('cross', 'Microphone Denied', 'Microphone access is required for voice control.');
                S.voiceActive = false;
                S.recognition.stop();
            }
        };
    }
    
    if(S.voiceActive){
        S.voiceActive = false;
        S.recognition.stop();
        showToast('voice', 'Voice Control', 'Voice Commands deactivated.');
    } else {
        try {
            S.recognition.start();
        } catch(e){
            console.error(e);
        }
    }
}

function handleVoiceCommand(cmd){
    console.log('Voice Command received:', cmd);
    let action = '';
    
    if(cmd.includes('dashboard') || cmd.includes('home')){
        switchPanel('dashboard');
        action = 'Go to Dashboard';
    } else if(cmd.includes('posture') || cmd.includes('camera') || cmd.includes('avatar')){
        switchPanel('posture');
        action = 'Go to Posture Panel';
    } else if(cmd.includes('stretch') || cmd.includes('break')){
        switchPanel('stretch');
        action = 'Go to Stretch Breaks';
    } else if(cmd.includes('fitmove') || cmd.includes('workout') || cmd.includes('exercise')){
        switchPanel('fitmove');
        action = 'Go to FitMove Workout';
    } else if(cmd.includes('progress') || cmd.includes('report') || cmd.includes('achievement')){
        switchPanel('progress');
        action = 'Go to Progress';
    } else if(cmd.includes('squat')){
        switchPanel('fitmove');
        document.querySelectorAll('.ex-btn').forEach(b => b.classList.remove('active'));
        $('ex-squat').classList.add('active');
        S.fitExercise = 'squat';
        S.fitState = 'up';
        action = 'Select Squats';
    } else if(cmd.includes('pushup') || cmd.includes('push up')){
        switchPanel('fitmove');
        document.querySelectorAll('.ex-btn').forEach(b => b.classList.remove('active'));
        $('ex-pushup').classList.add('active');
        S.fitExercise = 'pushup';
        S.fitState = 'up';
        action = 'Select Pushups';
    } else if(cmd.includes('jumping jack') || cmd.includes('jack')){
        switchPanel('fitmove');
        document.querySelectorAll('.ex-btn').forEach(b => b.classList.remove('active'));
        $('ex-jacks').classList.add('active');
        S.fitExercise = 'jacks';
        S.fitState = 'in';
        action = 'Select Jumping Jacks';
    } else if(cmd.includes('arm raise') || cmd.includes('arms')){
        switchPanel('fitmove');
        document.querySelectorAll('.ex-btn').forEach(b => b.classList.remove('active'));
        $('ex-arms').classList.add('active');
        S.fitExercise = 'arms';
        S.fitState = 'up';
        action = 'Select Arm Raises';
    } else if(cmd.includes('goku')){
        $('avatarCharacterSelect').value = 'goku';
        const event = new Event('change');
        $('avatarCharacterSelect').dispatchEvent(event);
        action = 'Select Goku';
    } else if(cmd.includes('gojo')){
        $('avatarCharacterSelect').value = 'gojo';
        const event = new Event('change');
        $('avatarCharacterSelect').dispatchEvent(event);
        action = 'Select Gojo';
    } else if(cmd.includes('shinchan') || cmd.includes('shin chan')){
        $('avatarCharacterSelect').value = 'shinchan';
        const event = new Event('change');
        $('avatarCharacterSelect').dispatchEvent(event);
        action = 'Select Shinchan';
    } else if(cmd.includes('normal form') || cmd.includes('goku normal')){
        if($('avatarCharacterSelect').value === 'goku'){
            $('gokuFormSelect').value = 'normal';
            const event = new Event('change');
            $('gokuFormSelect').dispatchEvent(event);
            action = 'Goku Normal Form';
        }
    } else if(cmd.includes('ssj') || cmd.includes('super saiyan')){
        if($('avatarCharacterSelect').value === 'goku'){
            $('gokuFormSelect').value = 'ssj';
            const event = new Event('change');
            $('gokuFormSelect').dispatchEvent(event);
            action = 'Goku Super Saiyan';
        }
    } else if(cmd.includes('ultra instinct') || cmd.includes('ui')){
        if($('avatarCharacterSelect').value === 'goku'){
            $('gokuFormSelect').value = 'ui';
            const event = new Event('change');
            $('gokuFormSelect').dispatchEvent(event);
            action = 'Goku Ultra Instinct';
        }
    } else if(cmd.includes('start')){
        if(S.currentPanel === 'fitmove' && !S.fitActive){
            $('startFitBtn').click();
            action = 'Start Workout';
        } else if(S.currentPanel === 'stretch' && !S.stretchActive){
            $('startStretchBtn').click();
            action = 'Start Stretching';
        }
    } else if(cmd.includes('calculator') || cmd.includes('ergo') || cmd.includes('desk') || cmd.includes('chair')){
        switchPanel('ergocalc');
        action = 'Go to Ergo Calculator';
    } else if(cmd.includes('water') || cmd.includes('drink') || cmd.includes('hydrate')){
        logWater(250);
        action = 'Log 250ml Water';
    } else if(cmd.includes('stop') || cmd.includes('pause')){
        if(S.currentPanel === 'fitmove' && S.fitActive){
            $('stopFitBtn').click();
            action = 'Stop Workout';
        }
    }
    
    if(action){
        showToast('voice', 'Voice Command', action + ' ("' + cmd + '")');
    }
}

// ============================================================
// ERGONOMIC CARTOON AVATARS — Real Image Rendering
// ============================================================

// Speech lines per character + posture state
const AVATAR_LINES = {
    goku: {
        good: [
            "Posture power level is OVER 9000! Keep it up!",
            "Your spine is aligned like a true Saiyan — amazing!",
            "This is the Ultra Instinct of sitting straight!"
        ],
        bad: [
            "Kakarot, your posture is dropping! Straighten UP!",
            "Slouching won't help you go Super Saiyan! Sit straight!",
            "Even Vegeta sits better than this. SPINE STRAIGHT!"
        ]
    },
    gojo: {
        good: [
            "Domain Expansion: Infinite Alignment! Flawless posture!",
            "Hmph. Six Eyes approved. You're the strongest sitter.",
            "Don't worry, with this posture — you're already the best!"
        ],
        bad: [
            "My Six Eyes can see every degree of your slouch. Fix it!",
            "Even Sukuna would frown at this posture. Sit UP!",
            "A little straightening and we'd be on the same level. Come on."
        ]
    },
    shinchan: {
        good: [
            "Hehehe! I'm sitting straight — Misae won't hit me today!",
            "Action Kamen pose! Upright and ready for Chocobi!",
            "Look Misae, I have perfect posture! Can I get extra snacks?"
        ],
        bad: [
            "Oh no! Misae is coming with her knuckle-bump!",
            "Ouch! My back is bending like a wriggly squiggle!",
            "If I keep slouching, even Shiro the dog sits better than me!"
        ]
    }
};

// Map every character + form + posture state to its video file
const AVATAR_VIDEOS = {
    goku: {
        normal:  { good: 'assets/videos/goku-normal-good.mp4',   bad: 'assets/videos/goku-exhausted-bad.mp4' },
        ssj:     { good: 'assets/videos/goku-ssj-good.mp4',      bad: 'assets/videos/goku-exhausted-bad.mp4' },
        ui:      { good: 'assets/videos/goku-ui-good.mp4',       bad: 'assets/videos/goku-exhausted-bad.mp4' },
    },
    gojo: {
        default: { good: 'assets/videos/gojo-good.mp4',          bad: 'assets/videos/gojo-bad.mp4' },
    },
    shinchan: {
        default: { good: 'assets/videos/shinchan-good.mp4',      bad: 'assets/videos/shinchan-bad.mp4' },
    }
};

// Track last rendered state so we don't rebuild the DOM every posture frame
let _lastAvatarKey = '';

function triggerAvatarUpdate(){
    const char   = $('avatarCharacterSelect')?.value || 'goku';
    const form   = $('gokuFormSelect')?.value        || 'normal';
    const isGood = S.postureScore >= 75 || !S.cameraReady;
    const state  = isGood ? 'good' : 'bad';

    // Unique key — only re-render if something actually changed
    const key = `${char}-${form}-${state}`;
    if(key === _lastAvatarKey) return;   // nothing changed → let the video keep playing
    _lastAvatarKey = key;

    // Pick speech line
    const lines      = AVATAR_LINES[char][state];
    const speechText = lines[Math.floor(Date.now() / 15000) % lines.length];

    // Resolve the video/image source
    const formKey = char === 'goku' ? form : 'default';
    const src     = AVATAR_VIDEOS[char]?.[formKey]?.[state] || '';
    const isVideo = src.endsWith('.mp4');

    // CSS classes for styling hooks
    const postureClass = isGood ? 'posture-good' : 'posture-bad';
    const formClass    = char === 'goku' ? `form-${form}` : '';
    const charClass    = `char-${char}`;
    const auraHTML     = char === 'goku' ? '<div class="aura-ring"></div>' : '';

    const displayBox = $('avatarDisplayBox');
    if(!displayBox) return;

    if(isVideo){
        // Build a <video> element — autoplay, loop, muted, natural speed (no playbackRate override)
        displayBox.innerHTML = `
            <div class="avatar-img-wrap ${charClass} ${formClass} ${postureClass}">
                ${auraHTML}
                <video
                    autoplay
                    loop
                    muted
                    playsinline
                    preload="auto"
                    style="max-height:220px;width:100%;object-fit:contain;border-radius:14px;display:block;"
                    src="${src}"
                ></video>
            </div>`;
        // Force play (some browsers need an explicit call after innerHTML injection)
        const vid = displayBox.querySelector('video');
        if(vid) vid.play().catch(()=>{});
    } else {
        // Fallback: static image (used for Gojo good-posture still)
        displayBox.innerHTML = `
            <div class="avatar-img-wrap ${charClass} ${formClass} ${postureClass}">
                ${auraHTML}
                <img src="${src}" alt="${char}" draggable="false"
                     style="max-height:220px;width:100%;object-fit:contain;border-radius:14px;display:block;">
            </div>`;
    }

    const speechEl = $('avatarSpeechText');
    if(speechEl) speechEl.textContent = `"${speechText}"`;
}


// ============================================================
// MAIN INIT
// ============================================================
window.addEventListener('DOMContentLoaded',()=>{
    // Cache canvases
    CANVASES.posture=$('posture_canvas');
    CANVASES.stretch=$('stretch_canvas');
    CANVASES.fitmove=$('fitmove_canvas');
    CTXS.posture=CANVASES.posture?.getContext('2d', { willReadFrequently: true });
    CTXS.stretch=CANVASES.stretch?.getContext('2d', { willReadFrequently: true });
    CTXS.fitmove=CANVASES.fitmove?.getContext('2d', { willReadFrequently: true });

    // Loading animation
    const load=animateLoading();

    // Setup UI
    setGreeting();
    initStreak();
    initNav();
    initPomodoro();
    initWaterReminder();
    initErgoCalc();
    initFitMove();
    initStretch();
    initCharts();
    updateTree();
    checkAchievements();
    syncPointsUI();
    $('dashReps').textContent=S.totalReps;

    // Tip rotator
    initTipRotator();

    // Initialize Anime Avatar
    triggerAvatarUpdate();
    
    // Avatar selection handlers — reset key so the video always reloads on manual change
    $('avatarCharacterSelect')?.addEventListener('change', (e) => {
        const char = e.target.value;
        const gG = $('gokuFormGroup');
        if (gG) gG.style.display = char === 'goku' ? 'flex' : 'none';
        _lastAvatarKey = '';   // force a fresh video load
        triggerAvatarUpdate();
    });
    $('gokuFormSelect')?.addEventListener('change', () => {
        _lastAvatarKey = '';   // force a fresh video load
        triggerAvatarUpdate();
    });
    
    // Voice Control event handler
    $('voiceToggleBtn')?.addEventListener('click', toggleVoiceControl);

    // Camera request click triggers
    $('btnRequestCamera')?.addEventListener('click', openCameraModal);
    $('camStatusPill')?.addEventListener('click', openCameraModal);
    $('mobileCamPill')?.addEventListener('click', openCameraModal);
    document.querySelectorAll('.btn-req-cam').forEach(btn => {
        btn.addEventListener('click', openCameraModal);
    });

    $('mobileMenuBtn')?.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        if(sidebar){
            sidebar.classList.toggle('open');
        }
    });

    $('confirmCameraBtn')?.addEventListener('click', ()=>{
        $('cameraPrivacyModal').style.display='none';
        requestCameraPermission();
    });
    $('cancelCameraBtn')?.addEventListener('click', ()=>{
        $('cameraPrivacyModal').style.display='none';
    });
    $('camStopBtn')?.addEventListener('click', stopCamera);

    // Show app after 2.5s (models need time to start downloading)
    setTimeout(()=>{
        load.bar.style.width='100%';
        clearInterval(load.iv);
        $('loadingTip').textContent='Biomechanics neural models loaded successfully.';
        setTimeout(()=>{
            $('loadingScreen').style.opacity='0';
            $('loadingScreen').style.transition='opacity 0.5s';
            setTimeout(()=>{ $('loadingScreen').style.display='none'; $('appShell').style.display='flex'; },500);
        },600);
    },2500);

    // MediaPipe is initialized only when the user explicitly grants camera permission.
    // (Calling initPose() on page load caused WASM "dependency not ready" console warnings
    //  before any camera permission was granted.)
});
