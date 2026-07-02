"use client";
import { motion } from "framer-motion";

const COLORS = ["#2aa583", "#3b94e0", "#eaa92e", "#e25c8a", "#7fd4b8"];

export default function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 26 });
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.2;
        const color = COLORS[i % COLORS.length];
        return (
          <motion.span
            key={i}
            initial={{ y: -40, opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", opacity: 0, rotate: 360 }}
            transition={{ duration: 1.6 + Math.random(), delay, ease: "easeIn" }}
            style={{ position: "absolute", left: `${left}%`, width: 10, height: 14, background: color, borderRadius: 2 }}
          />
        );
      })}
    </div>
  );
}
