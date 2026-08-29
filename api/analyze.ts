import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are CareerFit, an expert resume analyst and career coach.
Given a resume and job description, return ONLY valid JSON matching this exact schema:
{
  "score": number (0-100),
  "matchedSkills": string[],
  "missingSkills": string[],
  "partialSkills": string[],
  "foundKeywords": string[],
  "weakKeywords": string[],
  "missingKeywords": string[],
  "metrics": {
    "skills": number (0-100),
    "keywords": number (0-100),
    "responsibilities": number (0-100),
    "experience": number (0-100)
  },
  "topFixes": [
    { "id": number, "title": string, "impact": "HIGH"|"MEDIUM"|"LOW", "why": string, "suggestion": string }
  ],
  "interviewQuestions": [
    { "id": number, "text": string, "why": string, "preparation": string }
  ]
}
Rules:
- score = weighted average: skills 40% + keywords 25% + responsibilities 20% + experience 15%
- Return exactly 5 topFixes ranked by impact (HIGH first)
- Return exactly 5 interviewQuestions tailored to the actual job
- matchedSkills = skills present in both resume and job
- missingSkills = required by job but absent from resume
- partialSkills = in resume but not strongly evidenced
- Be specific, actionable, and tailored to the exact content provided.
- Return ONLY the JSON object, no markdown fences, no explanation.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { resume, job } = req.body ?? {};
  if (!resume || !job) return res.status(400).json({ error: "Missing resume or job" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenAI API key not configured" });

  const userContent = `
RESUME:
Name: ${resume.name}
Experience: ${resume.experienceYears} years
Skills: ${resume.skills?.join(", ")}
Projects: ${resume.projects?.join("\n")}
Summary: ${resume.summary}

JOB DESCRIPTION:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${job.requiredSkills?.join(", ")}
Description: ${job.description}
`;

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 1800,
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "";
    // Strip markdown fences if model adds them
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error("OpenAI error:", err?.message);
    return res.status(500).json({ error: err?.message ?? "Analysis failed" });
  }
}
