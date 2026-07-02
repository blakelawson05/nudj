"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/Providers";
import { Languages, Home } from "lucide-react";

const ROLES = [
  { key: "parent", path: "/parent" },
  { key: "child", path: "/child" },
  { key: "bank", path: "/bank" },
];

export default function TopBar() {
  const { t, locale, toggleLocale, setRole } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-brand-700 text-xl">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white">ن</span>
          {t("appName")}
        </Link>

        <nav className="hidden sm:flex items-center gap-1 bg-brand-50 rounded-full p-1">
          {ROLES.map((r) => {
            const active = pathname === r.path;
            return (
              <button
                key={r.key}
                onClick={() => { setRole(r.key); router.push(r.path); }}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                  active ? "bg-brand-500 text-white shadow" : "text-brand-700 hover:bg-white"
                }`}
              >
                {t("role" + r.key.charAt(0).toUpperCase() + r.key.slice(1))}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/" className="btn-ghost !px-3 !py-2" aria-label="home"><Home size={16} /></Link>
          <button onClick={toggleLocale} className="btn-ghost !px-3 !py-2">
            <Languages size={16} /> {locale === "ar" ? "EN" : "ع"}
          </button>
        </div>
      </div>
    </header>
  );
}
