"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import { Card, ProgressBar } from "@/components/ui";
import Confetti from "@/components/Confetti";
import { useApp } from "@/context/Providers";
import { analyze } from "@/lib/ai/engine";
import { CheckCircle2, Flame, Sparkles } from "lucide-react";

const CHOICES = [
  { key: "spend", emoji: "🛍️", color: "bg-rose2-100 text-rose2-500 border-rose2-300" },
  { key: "save", emoji: "🐷", color: "bg-brand-100 text-brand-700 border-brand-300" },
  { key: "donate", emoji: "💝", color: "bg-sky2-100 text-sky2-500 border-sky2-300" },
  { key: "invest", emoji: "📈", color: "bg-sun-100 text-sun-500 border-sun-300" },
];

export default function ChildPage() {
  const { t, child, completeTask, recordDecision } = useApp();
  const [decideFor, setDecideFor] = useState(null); // {points}
  const [confetti, setConfetti] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const pending = child.tasks.filter((x) => x.status !== "done");
  const insight = useMemo(() => analyze({ skills: child.skills, decisions: child.decisions, streak: child.streak }), [child]);

  function onComplete(task) {
    completeTask(task.id);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1600);
    setDecideFor({ points: task.points });
  }

  function choose(type) {
    const pts = decideFor.points;
    recordDecision(type, pts);
    setDecideFor(null);
    const next = analyze({ skills: child.skills, decisions: [...child.decisions, { type, points: pts }], streak: child.streak });
    setFeedback({ type, cheer: next.cheer, challenge: next.challenge });
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1600);
  }

  return (
    <>
      <TopBar />
      <Confetti show={confetti} />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Hero */}
        <Card className="text-center bg-gradient-to-br from-sky2-100 to-white">
          <div className="text-6xl animate-pop">{child.avatar}</div>
          <div className="mt-2 text-2xl font-extrabold text-brand-800">{t("childTitle")} {t(child.display_name)}!</div>
          <div className="mt-3 inline-flex items-center gap-4">
            <div className="rounded-2xl bg-white px-5 py-3 shadow-card">
              <div className="text-3xl font-extrabold text-brand-600">{child.points_balance}</div>
              <div className="text-xs text-gray-500">{t("pointsBalance")}</div>
            </div>
            <div className="rounded-2xl bg-white px-5 py-3 shadow-card flex items-center gap-2">
              <Flame className="text-sun-500" />
              <div>
                <div className="text-2xl font-extrabold text-sun-500">{child.streak}</div>
                <div className="text-xs text-gray-500">{t("streak")}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Goal */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-brand-800">{t("myGoal")}: {child.goal.emoji} {t(child.goal.title)}</span>
            <span className="text-sm text-gray-500">{child.goal.saved_points}/{child.goal.target_points}</span>
          </div>
          <ProgressBar value={child.goal.saved_points} max={child.goal.target_points} />
        </Card>

        {/* Tasks */}
        <Card>
          <h2 className="font-extrabold text-brand-800 mb-3">{t("tasks")}</h2>
          {pending.length === 0 && <p className="text-gray-400">🎉 {t("completed")}!</p>}
          <ul className="space-y-2">
            {pending.map((task) => (
              <li key={task.id} className="flex items-center justify-between rounded-xl bg-brand-50/60 px-3 py-2.5">
                <span className="font-semibold text-gray-700">{t(task.title)}</span>
                <div className="flex items-center gap-2">
                  <span className="chip bg-white text-brand-700 border border-brand-100">+{task.points}</span>
                  <button onClick={() => onComplete(task)} className="btn-primary !py-1.5 !px-3">
                    <CheckCircle2 size={16} /> {t("iDidIt")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Decision modal */}
        <AnimatePresence>
          {decideFor && (
            <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div initial={{ y: 40, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, opacity: 0 }}
                className="card p-6 w-full max-w-md text-center">
                <div className="text-sm text-gray-500">+{decideFor.points} {t("points")} 🎉</div>
                <h3 className="text-xl font-extrabold text-brand-800 mt-1 mb-4">{t("whatToDo")}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {CHOICES.map((c) => (
                    <button key={c.key} onClick={() => choose(c.key)}
                      className={`rounded-xl2 border-2 p-4 font-bold ${c.color} hover:scale-105 transition`}>
                      <div className="text-3xl mb-1">{c.emoji}</div>
                      {t(c.key)}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFeedback(null)}>
              <motion.div initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="card p-7 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                <div className="text-5xl mb-2">{CHOICES.find((c) => c.key === feedback.type).emoji}</div>
                <h3 className="text-2xl font-extrabold text-brand-700">{t("greatChoice")}</h3>
                <p className="text-gray-600 mt-1">{t(feedback.cheer)}</p>
                <div className="mt-4 rounded-xl bg-brand-50 p-4 text-start">
                  <div className="flex items-center gap-2 text-brand-700 font-bold mb-1"><Sparkles size={16} /> {t("yourChallenge")}</div>
                  <p className="text-gray-700 text-sm">{t(feedback.challenge)}</p>
                </div>
                <button className="btn-primary w-full mt-4" onClick={() => setFeedback(null)}>{t("nice")}</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
