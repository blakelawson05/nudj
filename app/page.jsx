"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/context/Providers";
import { TrustBadges } from "@/components/ui";
import { Languages, Users, Baby, Building2, ArrowLeft } from "lucide-react";

const ROLES = [
  { key: "parent", path: "/parent", icon: Users, emoji: "👩‍👧", color: "from-brand-100 to-brand-50" },
  { key: "child", path: "/child", icon: Baby, emoji: "🦊", color: "from-sky2-100 to-white" },
  { key: "bank", path: "/bank", icon: Building2, emoji: "🏦", color: "from-sun-100 to-white" },
];

export default function Landing() {
  const { t, locale, toggleLocale, setRole } = useApp();
  const router = useRouter();
  const go = (r) => { setRole(r.key); router.push(r.path); };

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-brand-700 text-2xl">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">ن</span>
          {t("appName")}
        </div>
        <button onClick={toggleLocale} className="btn-ghost"><Languages size={16} /> {locale === "ar" ? "English" : "العربية"}</button>
      </div>

      <section className="max-w-3xl mx-auto px-4 pt-8 pb-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
          className="text-4xl sm:text-5xl font-extrabold text-brand-800 leading-tight">
          {t("tagline")}
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600">{t("heroSub")}</p>
        <div className="mt-3 inline-block chip bg-sun-100 text-sun-500">⚠ {t("notCreditNote")}</div>
        <div className="mt-6"><TrustBadges /></div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pt-2 pb-16">
        <h2 className="text-center font-bold text-gray-500 mb-4">{t("chooseRole")}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {ROLES.map((r, i) => (
            <motion.button key={r.key} onClick={() => go(r)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 * i }}
              className={`card text-start p-6 bg-gradient-to-br ${r.color} hover:shadow-soft transition group`}>
              <div className="text-4xl mb-3">{r.emoji}</div>
              <div className="flex items-center gap-2">
                <r.icon className="text-brand-600" size={20} />
                <span className="text-xl font-extrabold text-brand-800">
                  {t("role" + r.key.charAt(0).toUpperCase() + r.key.slice(1))}
                </span>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-brand-600 font-bold">
                {t("enter")} <ArrowLeft size={16} className="rtl:rotate-0 ltr:rotate-180" />
              </div>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          Nudj · {t("notCreditNote")}
        </p>
      </section>
    </main>
  );
}
