// Seed mock data — mirrors the DB schema. No PII beyond first name + age.
export const SEED_CHILD = {
  id: "c1",
  display_name: { ar: "ليلى", en: "Layla" },
  age: 9,
  avatar: "🦊",
  points_balance: 120,
  streak: 5,
  goal: { title: { ar: "دراجة جديدة", en: "New bike" }, target_points: 300, saved_points: 180, emoji: "🚲" },
  skills: {
    saving: 78, planning: 64, spending_control: 60, delayed_gratification: 71,
    wants_vs_needs: 58, risk_awareness: 45, responsibility: 80, goal_decision: 74,
  },
  tasks: [
    { id: "t1", title: { ar: "ترتيب السرير", en: "Make the bed" }, points: 10, status: "done" },
    { id: "t2", title: { ar: "إنهاء الواجب", en: "Finish homework" }, points: 20, status: "done" },
    { id: "t3", title: { ar: "المساعدة في التسوق", en: "Help with groceries" }, points: 15, status: "pending" },
    { id: "t4", title: { ar: "قراءة 15 دقيقة", en: "Read for 15 min" }, points: 10, status: "pending" },
  ],
  decisions: [
    { type: "save", points: 20, date: "2026-06-08" },
    { type: "save", points: 10, date: "2026-06-09" },
    { type: "donate", points: 5, date: "2026-06-10" },
    { type: "spend", points: 15, date: "2026-06-11" },
    { type: "invest", points: 10, date: "2026-06-12" },
  ],
  indexHistory: [
    { day: "W1", index: 58 }, { day: "W2", index: 61 },
    { day: "W3", index: 64 }, { day: "W4", index: 66 }, { day: "Now", index: 68 },
  ],
};

// Aggregated, anonymous bank metrics (a VIEW — never individual rows).
export const BANK_METRICS = {
  totalFamilies: 1250,
  activeFamilies: 913,
  engagementRate: 73,
  avgIndex: 67,
  avgImprovement: 9.4,
  mostImproved: "saving",
  needsEducation: "risk_awareness",
  donationsCount: 4800,
  improvementSeries: [
    { month: "Jan", index: 58 }, { month: "Feb", index: 60 }, { month: "Mar", index: 62 },
    { month: "Apr", index: 64 }, { month: "May", index: 66 }, { month: "Jun", index: 67 },
  ],
  skillHeatmap: [
    { skill: "saving", value: 76 }, { skill: "planning", value: 68 },
    { skill: "spending_control", value: 64 }, { skill: "delayed_gratification", value: 70 },
    { skill: "wants_vs_needs", value: 61 }, { skill: "risk_awareness", value: 49 },
    { skill: "responsibility", value: 79 }, { skill: "goal_decision", value: 72 },
  ],
};
