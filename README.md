# نُضج — Nudj

**An AI Financial Readiness platform for children.** Kids turn daily tasks into money decisions (spend / save / donate / invest); an AI engine measures and grows their financial behavior through a **Financial Readiness Index**. Parents get coaching tips, banks get an anonymous CSR impact dashboard.

> ⚠️ The Financial Readiness Index is an **educational behavioral index — not a credit score**, and is never used for lending or eligibility. No real money, no real accounts, no sensitive child data. All data is mock.

Hackathon MVP · Bilingual **Arabic-first (RTL) + English** · Built for Saudi banks & financial-literacy programs.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

Everything runs offline with mock data — **no API keys required.**

## The four screens (+ landing)

| Route | Who | What |
|---|---|---|
| `/` | All | Landing + role switcher + language toggle |
| `/parent` | Parent | Create child, add tasks, assign points, AI insight summary |
| `/child` | Child | Points, tasks, the 4-way decision, fun feedback, goal & streak |
| `/insights` | Parent/AI | Behavior style, 8-skill radar, Index trend, challenge + parent tip |
| `/bank` | Bank | Aggregated anonymous metrics + auto CSR summary |

Use the **role chips in the top bar** (or the cards on the landing page) to switch personas, and the **EN/ع toggle** to flip language + layout direction.

## How the AI works (rule-based, deterministic)

`lib/ai/engine.js` is the brain — fully offline:

- **8 skills** (saving, planning, spending control, delayed gratification, wants-vs-needs, risk awareness, responsibility, goal-based decisions), each 0–100, updated by an exponential moving average after every decision.
- **Financial Readiness Index** = weighted average of the 8 skills × an engagement bonus from the streak.
- **Behavior style** classified from the recent decision mix (Quick Spender, Goal Saver, Balanced Planner, Generous Giver, Curious Investor).
- **Challenge + parent tip** target the child's *weakest* skill.

### Optional real LLM
`POST /api/ai/analyze` returns the same insight via the rule-based engine. To plug in a real model later, add `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`, call it with the prompt templates from the strategy doc, and fall back to `analyze()` on error. The demo never depends on a key.

## Structure

```
app/            landing, parent, child, insights, bank, api/ai/analyze
components/      TopBar, ui (Card/IndexGauge/etc.), Charts, Confetti
context/         Providers (locale + RTL + mock store + actions)
lib/i18n/        bilingual strings
lib/ai/          engine.js (scoring, classification, challenges, CSR summary)
lib/mockData.js  seed child + aggregated bank metrics (mirrors the DB schema)
```

## Tech stack
Next.js 14 (App Router) · React 18 · Tailwind CSS · Framer Motion · Recharts · lucide-react.

## Swapping in a real backend
The mock store in `context/Providers.jsx` mirrors the documented Postgres/Supabase schema 1:1 — replace the in-memory actions with API/Supabase calls and the UI keeps working unchanged.
```
