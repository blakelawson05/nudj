"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import { Card, SectionTitle, IndexGauge, BehaviorChip } from "@/components/ui";
import { SkillRadar, IndexTrend } from "@/components/Charts";
import { useApp } from "@/context/Providers";
import { analyze, computeIndex } from "@/lib/ai/engine";
import { Sparkles, Lightbulb, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

export default function InsightsPage() {
  const { t, child } = useApp();
  const [ready, setReady] = useState(false);
  useEffect(() => { const id = setTimeout(() => setReady(true), 900); return () => clearTimeout(id); }, []);

  const index = useMemo(() => computeIndex(child.skills, child.streak), [child]);
  const insight = useMemo(() => analyze({ skills: child.skills, decisions: child.decisions, streak: child.streak }), [child]);

  return (
    <>
      <TopBar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-brand-800">{t("insightTitle")}</h1>
          <span className="chip bg-sun-100 text-sun-500">⚠ {t("notCreditNote")}</span>
        </div>

        {!ready ? (
          <Card className="text-center py-16">
            <Loader2 className="mx-auto animate-spin text-brand-500" size={36} />
            <p className="mt-3 font-bold text-brand-700">{t("analyzing")}</p>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="grid md:grid-cols-3 gap-5">
              <Card className="text-center">
                <div className="flex justify-center mb-2"><IndexGauge value={index} /></div>
                <div className="font-bold text-gray-500">{t("readinessIndex")}</div>
                <div className="mt-3"><BehaviorChip style={insight.behaviorStyle} /></div>
                <div className={`mt-3 chip ${insight.indexDelta >= 0 ? "bg-brand-100 text-brand-700" : "bg-rose2-100 text-rose2-500"}`}>
                  {insight.indexDelta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {insight.indexDelta >= 0 ? "+" : ""}{insight.indexDelta}
                </div>
              </Card>
              <Card className="md:col-span-2">
                <SectionTitle>{t("skillBreakdown")}</SectionTitle>
                <SkillRadar skills={child.skills} />
                <div className="flex justify-between text-sm mt-1">
                  <span className="chip bg-brand-100 text-brand-700"><TrendingUp size={14} /> {t("strongestSkill")}: {t(insight.strongestSkill)}</span>
                  <span className="chip bg-sun-100 text-sun-500"><TrendingDown size={14} /> {t("weakestSkill")}: {t(insight.weakestSkill)}</span>
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle>{t("indexTrend")}</SectionTitle>
              <IndexTrend data={child.indexHistory} />
            </Card>

            <div className="grid sm:grid-cols-2 gap-5">
              <Card className="bg-gradient-to-br from-brand-50 to-white">
                <div className="flex items-center gap-2 text-brand-700 font-extrabold mb-2"><Sparkles size={18} /> {t("challenge")}</div>
                <p className="text-gray-700">{t(insight.challenge)}</p>
              </Card>
              <Card className="bg-gradient-to-br from-sun-100 to-white">
                <div className="flex items-center gap-2 text-sun-500 font-extrabold mb-2"><Lightbulb size={18} /> {t("recommendation")}</div>
                <p className="text-gray-700">{t(insight.parentTip)}</p>
              </Card>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
}
