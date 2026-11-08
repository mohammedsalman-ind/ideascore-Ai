# IdeaScore AI

> **"Don't Just Build Ideas. Validate Them."**

IdeaScore AI is a full-stack, production-quality AI-powered idea research, validation, comparison, and improvement platform. It takes a problem-first approach: users describe a real-world frustration or problem in plain language, and the platform autonomously discovers potential solutions, performs real-world web research via TinyFish, computes deterministic evaluation scores, runs multi-model roasts (Groq + Gemini), and provides turnaround improvements with version history.

---

## Key Features

1. **Problem-First Input**: Submit a problem description without needing an existing business idea.
2. **Problem Understanding (Gemini)**: Extracts root causes, affected personas, target user groups, industry domain, pain points, and severity.
3. **3–5 Diverse Solutions (Gemini)**: Generates distinct architectural approaches (AI platform, conversational/messaging assistant, peer accountability hub, browser micro-tool).
4. **Market Research Engine (TinyFish)**:
   - **TinySearch (`api.search.tinyfish.ai`)**: Discovers real-world competitors, existing products, and active industry discussions.
   - **TinyFetch (`api.fetch.tinyfish.ai`)**: Renders websites and extracts clean markdown for pricing tiers and features.
   - **Traceable Citations**: Preserves source titles, live URLs, site names, and extracted facts.
5. **Deterministic Evaluation Engine (Gemini + Backend Weights)**:
   - Problem Significance: **15%**
   - Market Potential: **15%**
   - Innovation: **15%**
   - Technical Feasibility: **15%**
   - Scalability: **10%**
   - Revenue Potential: **15%**
   - Competitive Positioning: **10%**
   - Social Impact: **5%**
   - **Total**: **100%**. Final score is calculated deterministically by the Python backend: $\text{Weighted Score} = \sum (\text{Factor Score} \times \text{Weight})$.
6. **Multi-Model Idea Roast**:
   - **Groq (Llama 3.3)**: Brutally honest critic (sharp wit, startup failure modes, customer rejection points).
   - **Gemini 2.5**: Strategic critic (monetization holes, defensibility gaps, unit economics).
   - Combined report with **Reality Check Score (0–100)**, top 5 failure modes, and points of agreement/disagreement.
7. **"Fix My Idea" Improvement Engine**:
   - Turnaround engine pivots the concept to solve roasted vulnerabilities.
   - Re-evaluates deterministically and displays score comparison ($\Delta$ points).
   - Preserves complete version history ($v1, v2, v3\dots$).
8. **Comparative Analysis**: Compare 2–5 solutions with category winner badges, radar chart overlays, and trade-off synthesis.
9. **Additional Intelligence Modules**:
   - **Market Gap Finder**: Discovers unaddressed white space.
   - **Feasibility Analyzer**: Engineering scope, stack, dependencies, effort.
   - **Business Model Generator**: Freemium, B2B licensing, usage, one-time models compared.
   - **SWOT Analysis**: Strengths, weaknesses, opportunities, threats.
   - **Customer Validation**: 5 Mom-Test interview questions and low-cost smoke tests.
   - **AI Shark Tank**: Interactive investor panel simulation (Elena Vance & Marcus Reed).
10. **Executive PDF Export**: Clean, printable venture validation reports.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, HTTPX, fpdf2.
- **AI & Research**:
  - TinyFish Search & Fetch APIs.
  - Google Gemini 2.5 Flash.
  - Groq (Llama 3.3 70B Versatile).
- **Storage**: In-memory + persistent snapshot store with Supabase PostgreSQL schema & RLS.

---

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env`:

```bash
TINYFISH_API_KEY=your_tinyfish_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

*Note: IdeaScore AI includes a built-in development sandbox mode so you can immediately explore the complete dashboard and all workflows even before adding API keys.*

### 2. Run the Application

#### Option A: One-Click Launch (Windows)
Double-click `start.bat`.

#### Option B: Manual Launch

Start the FastAPI backend:
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Start the Vite development frontend:
```bash
cd frontend
npm run dev
```

Open:
- Web Application: [http://localhost:5173](http://localhost:5173) (or [http://localhost:8000](http://localhost:8000))
- Swagger API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Verification & Testing

Run the full end-to-end acceptance suite:
```bash
python backend/tests/test_api.py
```

