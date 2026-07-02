"use client";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, CartesianGrid,
} from "recharts";
import { useApp } from "@/context/Providers";
import { SKILL_KEYS } from "@/lib/ai/engine";

export function SkillRadar({ skills }) {
  const { t } = useApp();
  const data = SKILL_KEYS.map((k) => ({ skill: t(k), value: skills[k] }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#d7f2e7" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "#4b5563" }} />
        <Radar dataKey="value" stroke="#2aa583" fill="#4cbd9b" fillOpacity={0.45} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function IndexTrend({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef5f2" />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip />
        <Line type="monotone" dataKey="index" stroke="#2aa583" strokeWidth={3} dot={{ r: 4, fill: "#1d856a" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ImprovementBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef5f2" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis domain={[50, 80]} tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip />
        <Line type="monotone" dataKey="index" stroke="#3b94e0" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SkillHeatBar({ data, mostImproved, weakest }) {
  const { t } = useApp();
  const rows = data.map((d) => ({ ...d, label: t(d.skill) }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} layout="vertical" margin={{ left: 24, right: 12 }}>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 11, fill: "#4b5563" }} />
        <Tooltip />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {rows.map((r, i) => (
            <Cell key={i} fill={r.skill === mostImproved ? "#2aa583" : r.skill === weakest ? "#eaa92e" : "#b0e6d2"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
