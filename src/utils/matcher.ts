import { Resume, Job, Analysis, Fix, Question } from "../types";

// ─── Local fallback (used if API fails) ───────────────────────────────────────
const KNOWN_SKILLS = [
  "react","javascript","typescript","node.js","python","java","sql",
  "mongodb","aws","docker","git","rest apis","graphql","html","css",
  "testing","performance optimization",
];
function detect(text: string) { const l=text.toLowerCase(); return KNOWN_SKILLS.filter(s=>l.includes(s)); }
function cap(s: string) { return s.charAt(0).toUpperCase()+s.slice(1); }

export const EXPLANATIONS: Record<string,string> = {
  "React":                   "Your resume demonstrates solid React experience through multiple projects.",
  "JavaScript":              "JavaScript is clearly evident in your skill list and project work.",
  "TypeScript":              "TypeScript is not explicitly mentioned — add it if you have practical experience.",
  "REST APIs":               "REST API usage is mentioned in both projects — strong match.",
  "Git":                     "Git is listed in your skill set.",
  "Testing":                 "No testing frameworks mentioned. Add Jest or React Testing Library.",
  "AWS":                     "AWS is not present in your resume. This is a required skill.",
  "Performance optimization":"Performance work is not explicitly described. Add specific examples.",
};

function localFallback(resume: Resume, job: Job): Analysis {
  const text = [...resume.skills,...resume.projects,resume.summary].join(" ");
  const detected = detect(text);
  const required = job.requiredSkills.map(s=>s.toLowerCase());
  const matched  = detected.filter(s=>required.includes(s));
  const missing  = required.filter(s=>!detected.includes(s)).map(cap);
  const partial  = detected.filter(s=>!required.includes(s)).map(cap);
  const sp = Math.round((matched.length/Math.max(required.length,1))*100);
  const ep = resume.experienceYears>=2?100:60;
  const rp = Math.round((matched.length/Math.max(job.responsibilities.length,1))*100);
  const score = Math.round(sp*0.40+sp*0.25+Math.min(rp,100)*0.20+ep*0.15);
  const fixes: Fix[] = missing.slice(0,5).map((skill,i)=>({
    id:i+1, title:`Add ${skill} experience`,
    impact:(i<2?"HIGH":i<4?"MEDIUM":"LOW") as Fix["impact"],
    why:`The job requires ${skill}, which is absent from your resume.`,
    suggestion:`Include a bullet point or project where you specifically used ${skill}.`,
  }));
  const questions: Question[] = [
    {id:1,text:`Tell me about your experience with ${job.requiredSkills[0]}.`,why:"Assesses primary skill depth.",preparation:"Prepare 2-3 specific projects with outcomes."},
    {id:2,text:`How have you used ${job.requiredSkills[1]??"REST APIs"} in production?`,why:"Tests practical knowledge.",preparation:"Describe error handling and data patterns."},
    {id:3,text:`What is your experience with ${job.requiredSkills[2]??"TypeScript"}?`,why:"Identifies secondary skill depth.",preparation:"Mention strict mode and typing patterns."},
    {id:4,text:"How do you approach frontend performance optimization?",why:"Evaluates engineering maturity.",preparation:"Talk about lazy loading, memoization, code splitting."},
    {id:5,text:"Describe a challenging technical problem you solved.",why:"Assesses problem-solving mindset.",preparation:"Use STAR format: Situation, Task, Action, Result."},
  ];
  return {
    score, matchedSkills:matched.map(cap), missingSkills:missing,
    partialSkills:partial, foundKeywords:matched.map(cap),
    weakKeywords:partial, missingKeywords:missing,
    metrics:{skills:sp,keywords:sp,responsibilities:Math.min(rp,100),experience:ep},
    topFixes:fixes, interviewQuestions:questions,
    timestamp:new Date().toISOString(), jobTitle:job.title, company:job.company,
  };
}

// ─── Main analyze — calls /api/analyze on Vercel, OpenAI directly in local dev ─
export async function analyze(resume: Resume, job: Job): Promise<Analysis> {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, job }),
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    return {
      ...data,
      timestamp: new Date().toISOString(),
      jobTitle: job.title,
      company: job.company,
    } as Analysis;
  } catch (err) {
    console.error("API call failed, using local fallback:", err);
    return localFallback(resume, job);
  }
}
