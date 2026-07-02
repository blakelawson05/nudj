"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { Card, SectionTitle, IndexGauge, BehaviorChip } from "@/components/ui";
import { useApp } from "@/context/Providers";
import { analyze, computeIndex } from "@/lib/ai/engine";
import { Plus, CheckCircle2, Circle, Sparkles, Lightbulb } from "lucide-react";

export default function ParentPage() {
  const { t, child, addTask, createChild } = useApp();
  const [showChild, setShowChild] = useState(false);
  const [form, setForm] = useState({ ar: "", en: "", points: 10 });
  const [cprofile, setCprofile] = useState({ name: "", age: 9, avatar: "🦊" });

  const index = useMemo(() => computeIndex(child.skills, child.streak), [child]);
  const insight = useMemo(() => analyze({ skills: child.skills, decisions: child.decisions, streak: child.streak }), [child]);

  return (
    <>
      <TopBar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <h1 className="text-2xl font-extrabold text-brand-800">{t("parentTitle")}</h1>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Child + index */}
          <Card className="md:col-span-1 text-center">
            <div className="text-5xl">{child.avatar}</div>
            <div className="mt-2 text-xl font-extrabold text-brand-800">{t(child.display_name)}</div>
            <div className="text-sm text-gray-500">{t("age")}: {child.age}</div>
            <div className="my-4 flex justify-center"><IndexGauge value={index} /></div>
            <div className="text-sm font-bold text-gray-500">{t("readinessIndex")}</div>
            <div className="mt-3"><BehaviorChip style={insight.behaviorStyle} /></div>
            <button onClick={() => setShowChild((s) => !s)} className="btn-ghost mt-4 w-full">
              <Plus size={16} /> {t("addChild")}
            </button>
            {showChild && (
              <div className="mt-3 space-y-2 text-start">
                <input className="w-full rounded-xl border border-brand-200 px-3 py-2" placeholder={t("childName")}
                  value={cprofile.name} onChange={(e) => setCprofile({ ...cprofile, name: e.target.value })} />
                <div className="flex gap-2">
                  <input type="number" className="w-20 rounded-xl border border-brand-200 px-3 py-2" placeholder={t("age")}
                    value={cprofile.age} onChange={(e) => setCprofile({ ...cprofile, age: e.target.value })} />
                  <input className="w-20 rounded-xl border border-brand-200 px-3 py-2 text-center"
                    value={cprofile.avatar} onChange={(e) => setCprofile({ ...cprofile, avatar: e.target.value })} />
                  <button className="btn-primary flex-1" onClick={() => { createChild(cprofile); setShowChild(false); }}>{t("create")}</button>
                </div>
              </div>
            )}
          </Card>

          {/* Tasks */}
          <Card className="md:col-span-2">
            <SectionTitle>{t("tasks")}</SectionTitle>
            <ul className="space-y-2">
              {child.tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between rounded-xl bg-brand-50/60 px-3 py-2.5">
                  <span className="flex items-center gap-2 font-semibold text-gray-700">
                    {task.status === "done"
                      ? <CheckCircle2 className="text-brand-500" size={18} />
                      : <Circle className="text-gray-300" size={18} />}
                    {t(task.title)}
                  </span>
                  <span className="chip bg-white text-brand-700 border border-brand-100">{task.points} {t("points")}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid sm:grid-cols-4 gap-2 items-end">
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500">{t("taskTitleAr")}</label>
                <input className="w-full rounded-xl border border-brand-200 px-3 py-2" dir="rtl"
                  value={form.ar} onChange={(e) => setForm({ ...form, ar: e.target.value })} />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs text-gray-500">{t("taskTitleEn")}</label>
                <input className="w-full rounded-xl border border-brand-200 px-3 py-2" dir="ltr"
                  value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <input type="number" className="w-16 rounded-xl border border-brand-200 px-2 py-2 text-center"
                  value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
                <button className="btn-primary"
                  onClick={() => { if (form.ar || form.en) { addTask(form); setForm({ ar: "", en: "", points: 10 }); } }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* AI insight */}
        <Card className="bg-gradient-to-br from-brand-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <SectionTitle sub={t("notCreditNote")}>
              <span className="inline-flex items-center gap-2"><Sparkles className="text-brand-500" size={18} /> {t("aiInsight")}</span>
            </SectionTitle>
            <Link href="/insights" className="btn-primary">{t("viewFullInsight")}</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div className="rounded-xl bg-white p-4 border border-brand-100">
              <div className="flex items-center gap-2 text-brand-700 font-bold mb-1"><Sparkles size={16} /> {t("yourChallenge")}</div>
              <p className="text-gray-700">{t(insight.challenge)}</p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-brand-100">
              <div className="flex items-center gap-2 text-sun-500 font-bold mb-1"><Lightbulb size={16} /> {t("parentTip")}</div>
              <p className="text-gray-700">{t(insight.parentTip)}</p>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
