"use client";
import TopBar from "@/components/TopBar";
import { Card, SectionTitle } from "@/components/ui";
import { ImprovementBar, SkillHeatBar } from "@/components/Charts";
import { useApp } from "@/context/Providers";
import { csrSummary } from "@/lib/ai/engine";
import { Users, Activity, Gauge, TrendingUp, Award, BookOpen, Download, ShieldCheck } from "lucide-react";

function Metric({ icon: Icon, label, value, tone = "brand" }) {
  const tones = {
    brand: "text-brand-600 bg-brand-100", sky: "text-sky2-500 bg-sky2-100",
    sun: "text-sun-500 bg-sun-100", rose: "text-rose2-500 bg-rose2-100",
  };
  return (
    <Card className="flex items-center gap-3">
      <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${tones[tone]}`}><Icon size={20} /></span>
      <div>
        <div className="text-2xl font-extrabold text-brand-800">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </Card>
  );
}

export default function BankPage() {
  const { t, locale, bankMetrics: m } = useApp();
  const summary = csrSummary(
    { ...m, mostImprovedLabel: t(m.mostImproved), needsEducationLabel: t(m.needsEducation) },
    locale
  );

  return (
    <>
      <TopBar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-brand-800">{t("bankTitle")}</h1>
          <span className="chip bg-brand-100 text-brand-700"><ShieldCheck size={14} /> {t("anonymousNote")}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric icon={Users} label={t("totalFamilies")} value={m.totalFamilies.toLocaleString(locale === "ar" ? "ar" : "en")} tone="brand" />
          <Metric icon={Activity} label={t("engagementRate")} value={`${m.engagementRate}%`} tone="sky" />
          <Metric icon={Gauge} label={t("avgIndex")} value={m.avgIndex} tone="sun" />
          <Metric icon={TrendingUp} label={t("avgImprovement")} value={`+${m.avgImprovement}`} tone="brand" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <SectionTitle>{t("avgIndex")} — {t("avgImprovement")}</SectionTitle>
            <ImprovementBar data={m.improvementSeries} />
          </Card>
          <Card>
            <SectionTitle>{t("skillBreakdown")}</SectionTitle>
            <SkillHeatBar data={m.skillHeatmap} mostImproved={m.mostImproved} weakest={m.needsEducation} />
            <div className="flex justify-between text-sm mt-1">
              <span className="chip bg-brand-100 text-brand-700"><Award size={14} /> {t("mostImproved")}: {t(m.mostImproved)}</span>
              <span className="chip bg-sun-100 text-sun-500"><BookOpen size={14} /> {t("needsEducation")}: {t(m.needsEducation)}</span>
            </div>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-brand-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <SectionTitle sub={t("anonymousNote")}>{t("csrSummary")}</SectionTitle>
            <button onClick={() => window.print()} className="btn-primary"><Download size={16} /> {t("exportReport")}</button>
          </div>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </Card>
      </main>
    </>
  );
}
