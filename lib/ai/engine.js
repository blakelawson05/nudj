// ─────────────────────────────────────────────────────────────
// Nudj AI engine — rule-based, deterministic, runs fully offline.
// IMPORTANT: This is an EDUCATIONAL behavioral model only.
// It is NOT a credit score and must never be used for lending or eligibility.
// (An optional real-LLM path can wrap analyze(); the rule-based core is the fallback.)
// ─────────────────────────────────────────────────────────────

export const SKILL_KEYS = [
  "saving", "planning", "spending_control", "delayed_gratification",
  "wants_vs_needs", "risk_awareness", "responsibility", "goal_decision",
];

const WEIGHTS = {
  saving: 0.18, delayed_gratification: 0.16, planning: 0.15,
  spending_control: 0.14, goal_decision: 0.12, wants_vs_needs: 0.10,
  responsibility: 0.08, risk_awareness: 0.07,
};

// How each decision type signals each skill (target value the EMA moves toward).
const SIGNALS = {
  save:   { saving: 95, delayed_gratification: 90, goal_decision: 88, planning: 80, spending_control: 78 },
  spend:  { spending_control: 45, wants_vs_needs: 50, responsibility: 70, planning: 48 },
  donate: { responsibility: 95, wants_vs_needs: 85, planning: 72, goal_decision: 60 },
  invest: { risk_awareness: 92, planning: 85, delayed_gratification: 78, goal_decision: 75 },
};

const ALPHA = 0.25; // EMA smoothing — growth is gradual & visible over weeks

// Update the 8 skill scores given the latest decision.
export function applyDecision(skills, decisionType) {
  const next = { ...skills };
  const signal = SIGNALS[decisionType] || {};
  for (const key of SKILL_KEYS) {
    if (signal[key] != null) {
      next[key] = Math.round(next[key] + ALPHA * (signal[key] - next[key]));
    } else {
      // gentle decay toward the mean for skills not exercised
      next[key] = Math.round(next[key] + 0.03 * (60 - next[key]));
    }
    next[key] = Math.max(0, Math.min(100, next[key]));
  }
  return next;
}

// Weighted Financial Readiness Index (0–100) with an engagement bonus.
export function computeIndex(skills, streak = 0) {
  let base = 0;
  for (const key of SKILL_KEYS) base += (skills[key] || 0) * WEIGHTS[key];
  const engagement = 0.9 + 0.1 * Math.min(streak / 7, 1);
  return Math.round(Math.max(0, Math.min(100, base * engagement)));
}

// Classify behavior style from the recent decision mix.
export function classifyBehavior(decisions) {
  const recent = decisions.slice(-8);
  const n = recent.length || 1;
  const ratio = (t) => recent.filter((d) => d.type === t).length / n;
  const r = { spend: ratio("spend"), save: ratio("save"), donate: ratio("donate"), invest: ratio("invest") };
  if (r.spend > 0.5) return "Quick Spender";
  if (r.save > 0.4) return "Goal Saver";
  if (r.donate > 0.3) return "Generous Giver";
  if (r.invest > 0.25) return "Curious Investor";
  return "Balanced Planner";
}

export function weakestSkill(skills) {
  return SKILL_KEYS.reduce((a, b) => (skills[a] <= skills[b] ? a : b));
}
export function strongestSkill(skills) {
  return SKILL_KEYS.reduce((a, b) => (skills[a] >= skills[b] ? a : b));
}

// Personalized challenge (child voice) targeting the weakest skill.
const CHALLENGES = {
  saving: { ar: "ادّخر مكافأتك القادمة كاملة قبل أن تصرف أي شيء — وافتح وسام «الادّخار».", en: "Save your whole next reward before spending anything — unlock the Saving badge." },
  planning: { ar: "خطّط لهدف صغير هذا الأسبوع واكتب كم نقطة تحتاج للوصول إليه.", en: "Pick one small goal this week and plan how many points you need." },
  spending_control: { ar: "هذا الأسبوع، فكّر 10 ثوانٍ قبل أي عملية صرف — هل تحتاجها فعلاً؟", en: "This week, wait 10 seconds before any spend — do you really need it?" },
  delayed_gratification: { ar: "جرّب أن تدّخر 3 مكافآت متتالية قبل أن تصرف — تحدّي الصبر!", en: "Try saving 3 rewards in a row before spending — the Patience challenge!" },
  wants_vs_needs: { ar: "اصنع قائمتين: «أحتاجه» و«أريده»، وضع كل عملية شراء في مكانها.", en: "Make two lists — Needs and Wants — and sort your next buys." },
  risk_awareness: { ar: "جرّب استثماراً افتراضياً صغيراً وراقب كيف يتغيّر — ماذا تعلّمت؟", en: "Try one small virtual investment and watch what happens — what did you learn?" },
  responsibility: { ar: "أكمل كل مهامك اليوم بدون تذكير — أنت المسؤول!", en: "Finish all today's tasks with no reminders — you're in charge!" },
  goal_decision: { ar: "اربط نقاطك بهدفك الكبير: كم تبقّى للوصول؟", en: "Connect your points to your big goal — how far left to go?" },
};

// Parent tip (adult voice) for the same weakest skill.
const PARENT_TIPS = {
  saving: { ar: "شجّع طفلك على «ادّخار أولاً»: خصّص جزءاً من كل مكافأة للهدف قبل الصرف.", en: "Encourage a 'save first' habit: set aside part of every reward toward the goal before spending." },
  planning: { ar: "اجلسا معاً وحدّدا هدفاً أسبوعياً واضحاً — التخطيط يقوّي القرار.", en: "Sit together and set one clear weekly goal — planning strengthens decisions." },
  spending_control: { ar: "طبّقا قاعدة «انتظر يوماً» قبل أي عملية شراء هذا الأسبوع.", en: "Try a 'wait one day' rule before any purchase this week." },
  delayed_gratification: { ar: "كافئا الصبر: امدحا طفلك عندما يؤجّل الصرف من أجل الهدف.", en: "Reward patience: praise your child when they delay spending for the goal." },
  wants_vs_needs: { ar: "تحدّثا عن الفرق بين الحاجة والرغبة في مواقف الحياة اليومية.", en: "Talk about needs vs wants in everyday situations together." },
  risk_awareness: { ar: "اشرحا فكرة المخاطرة بأمثلة بسيطة وآمنة عبر الاستثمار الافتراضي.", en: "Explain risk with simple, safe examples using the virtual investment." },
  responsibility: { ar: "امنحا طفلك مسؤولية مهمة واحدة بالكامل هذا الأسبوع.", en: "Give your child full ownership of one responsibility this week." },
  goal_decision: { ar: "ذكّرا طفلك دائماً بهدفه الكبير عند كل قرار للنقاط.", en: "Remind your child of their big goal at every points decision." },
};

const CHEERS = {
  save:   { ar: "اقتربت أكثر من هدفك! 🐷", en: "You're closer to your goal! 🐷" },
  spend:  { ar: "استمتع — لقد استحققتها! 🛍️", en: "Enjoy it — you earned it! 🛍️" },
  donate: { ar: "قلبك كبير! شكراً لعطائك 💝", en: "Big heart! Thanks for giving 💝" },
  invest: { ar: "مستكشف ذكي! لنرَ كيف ينمو 📈", en: "Smart explorer! Let's see it grow 📈" },
};

// Main entry: analyze the latest decision and return a full insight payload.
export function analyze({ skills, decisions, streak = 0 }) {
  const newSkills = decisions.length ? applyDecision(skills, decisions[decisions.length - 1].type) : skills;
  const index = computeIndex(newSkills, streak);
  const prevIndex = computeIndex(skills, streak);
  const weak = weakestSkill(newSkills);
  const strong = strongestSkill(newSkills);
  return {
    skills: newSkills,
    index,
    indexDelta: index - prevIndex,
    behaviorStyle: classifyBehavior(decisions),
    weakestSkill: weak,
    strongestSkill: strong,
    challenge: CHALLENGES[weak],
    parentTip: PARENT_TIPS[weak],
    cheer: decisions.length ? CHEERS[decisions[decisions.length - 1].type] : CHEERS.save,
  };
}

// Deterministic CSR summary for the bank dashboard (rule-based fallback for the LLM prompt).
export function csrSummary(m, locale = "en") {
  if (locale === "ar") {
    return `خلال آخر 30 يوماً، شارك ${m.totalFamilies.toLocaleString("ar")} أسرة في البرنامج بمعدّل تفاعل ${m.engagementRate}%. ` +
      `ارتفع متوسط مؤشر الجاهزية المالية للأطفال بمقدار ${m.avgImprovement} نقطة، وكانت مهارة «${m.mostImprovedLabel}» الأكثر تحسّناً. ` +
      `يدعم البرنامج أهداف رؤية 2030 للثقافة المالية، مع التركيز القادم على تطوير مهارة «${m.needsEducationLabel}».`;
  }
  return `Over the last 30 days, ${m.totalFamilies.toLocaleString()} families took part with a ${m.engagementRate}% engagement rate. ` +
    `Children's average Financial Readiness Index rose by ${m.avgImprovement} points, with "${m.mostImprovedLabel}" the most-improved skill. ` +
    `The program advances Vision 2030 financial-literacy goals; the next focus is strengthening "${m.needsEducationLabel}".`;
}
