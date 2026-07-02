"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS } from "@/lib/i18n/strings";
import { SEED_CHILD, BANK_METRICS } from "@/lib/mockData";
import { applyDecision, computeIndex } from "@/lib/ai/engine";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export default function Providers({ children }) {
  const [locale, setLocale] = useState("ar"); // Arabic-first
  const [role, setRole] = useState("parent");
  const [child, setChild] = useState(() => structuredClone(SEED_CHILD));
  const [lastInsight, setLastInsight] = useState(null);

  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  // t() — translate a key or a {ar,en} object
  function t(key) {
    if (key && typeof key === "object") return key[locale] ?? key.en ?? "";
    const entry = STRINGS[key];
    return entry ? entry[locale] : key;
  }
  const toggleLocale = () => setLocale((l) => (l === "ar" ? "en" : "ar"));

  // ── store actions ──
  function addTask({ ar, en, points }) {
    setChild((c) => ({
      ...c,
      tasks: [...c.tasks, { id: "t" + Date.now(), title: { ar, en }, points: Number(points) || 0, status: "pending" }],
    }));
  }
  function completeTask(taskId) {
    setChild((c) => {
      const task = c.tasks.find((x) => x.id === taskId);
      if (!task || task.status === "done") return c;
      return {
        ...c,
        points_balance: c.points_balance + task.points,
        tasks: c.tasks.map((x) => (x.id === taskId ? { ...x, status: "done" } : x)),
      };
    });
  }
  function createChild({ name, age, avatar }) {
    setChild((c) => ({ ...c, display_name: { ar: name, en: name }, age: Number(age) || c.age, avatar: avatar || c.avatar }));
  }

  // Record a decision → run the AI engine → update skills, index, goal.
  function recordDecision(type, points) {
    setChild((c) => {
      if (c.points_balance < points) points = c.points_balance;
      const decisions = [...c.decisions, { type, points, date: new Date().toISOString().slice(0, 10) }];
      const newSkills = applyDecision(c.skills, type);
      const newIndex = computeIndex(newSkills, c.streak);
      const goal = { ...c.goal };
      if (type === "save") goal.saved_points = Math.min(goal.target_points, goal.saved_points + points);
      const updated = {
        ...c,
        points_balance: Math.max(0, c.points_balance - points),
        decisions,
        skills: newSkills,
        goal,
        indexHistory: [...c.indexHistory.slice(-4), { day: "Now", index: newIndex }],
      };
      return updated;
    });
  }

  const value = useMemo(
    () => ({
      locale, dir, t, toggleLocale,
      role, setRole,
      child, addTask, completeTask, createChild, recordDecision,
      lastInsight, setLastInsight,
      bankMetrics: BANK_METRICS,
    }),
    [locale, dir, role, child, lastInsight]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
