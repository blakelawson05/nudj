import { analyze } from "@/lib/ai/engine";

// POST /api/ai/analyze
// Body: { skills, decisions, streak }
// Returns the educational behavioral insight. Rule-based by default.
// To wire a real LLM later: if process.env.OPENAI_API_KEY (or ANTHROPIC_API_KEY)
// exists, call it with lib/ai prompt templates, then fall back to analyze() on error.
export async function POST(req) {
  try {
    const body = await req.json();
    const result = analyze({
      skills: body.skills || {},
      decisions: body.decisions || [],
      streak: body.streak || 0,
    });
    return Response.json({ ok: true, source: "rule-based", ...result });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 400 });
  }
}
