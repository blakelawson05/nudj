"use client";
import { useApp } from "@/context/Providers";

export function Card({ className = "", children }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, sub }) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-extrabold text-brand-800">{children}</h2>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

const STYLE_COLORS = {
  "Quick Spender": "bg-rose2-100 text-rose2-500",
  "Goal Saver": "bg-brand-100 text-brand-700",
  "Balanced Planner": "bg-sky2-100 text-sky2-500",
  "Generous Giver": "bg-rose2-100 text-rose2-500",
  "Curious Investor": "bg-sun-100 text-sun-500",
};
export function BehaviorChip({ style }) {
  const { t } = useApp();
  return <span className={`chip ${STYLE_COLORS[style] || "bg-brand-100 text-brand-700"}`}>✦ {t(style)}</span>;
}

// Radial 0–100 gauge for the Financial Readiness Index.
export function IndexGauge({ value, size = 132 }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6f2ee" strokeWidth="12" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2aa583" strokeWidth="12"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-brand-700">{value}</span>
        <span className="text-[11px] text-gray-400">/100</span>
      </div>
    </div>
  );
}

export function TrustBadges() {
  const { t } = useApp();
  const items = ["noMoney", "noCredit", "privacy", "vision"];
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {items.map((k) => (
        <span key={k} className="chip bg-white/80 text-brand-700 border border-brand-100">✓ {t(k)}</span>
      ))}
    </div>
  );
}

export function ProgressBar({ value, max, color = "bg-brand-500" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-3 rounded-full bg-brand-100 overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}
