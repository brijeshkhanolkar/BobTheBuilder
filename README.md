# BobTheBuilder - Resume Analyzer & Job Matcher

A premium resume analysis tool powered by GPT-4o-mini. Upload your resume, paste a job description, and get an instant AI-powered analysis.

## Features
- AI match score (0-100)
- Skill gap analysis (Match Map)
- Keyword coverage
- Top 5 ranked improvements
- Resume health check
- Interview question prep
- Save analyses to localStorage

## Deploy on Vercel (1 minute)

1. Fork or clone this repo
2. Go to [vercel.com](https://vercel.com) and import the GitHub repo
3. In **Project Settings > Environment Variables**, add:
   ```
   OPENAI_API_KEY = sk-your-key-here
   ```
4. Click **Deploy** - done!

## Run Locally

```bash
git clone https://github.com/brijeshkhanolkar/BobTheBuilder.git
cd BobTheBuilder
npm install

# Create .env file
cp .env.example .env
# Add your OpenAI key to .env

npm run dev
```

Open http://localhost:3000

## Demo Resumes

4 ready-made Indian candidate PDFs are in `public/resumes/`:
- `arjun_sharma_frontend.pdf` - Frontend Dev, 2 yrs
- `priya_mehta_backend.pdf`   - Backend Dev, 3 yrs
- `rahul_gupta_fullstack.pdf` - Full Stack, 4 yrs
- `sneha_patel_datascience.pdf` - Data Scientist, 2 yrs

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- OpenAI GPT-4o-mini (via Vercel serverless function)
- React Router
- localStorage for saved analyses

## Architecture

```
Frontend (Vite/React)
    |
    v
/api/analyze  <-- Vercel Serverless Function (API key stays here, server-side)
    |
    v
OpenAI API
```

The API key is NEVER exposed to the browser.
