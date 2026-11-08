-- IdeaScore AI Supabase PostgreSQL Schema with Row Level Security (RLS)

-- 1. Analyses Table
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_text TEXT NOT NULL,
    target_region TEXT DEFAULT 'Global',
    stage TEXT DEFAULT 'created',
    progress_percentage INTEGER DEFAULT 0,
    status_message TEXT,
    problem_understanding JSONB,
    final_recommendation JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Solutions Table
CREATE TABLE IF NOT EXISTS public.solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    how_it_works TEXT,
    target_users JSONB,
    core_features JSONB,
    unique_value_proposition TEXT,
    required_technology JSONB,
    possible_revenue_model TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Research Evidence Table (TinyFish)
CREATE TABLE IF NOT EXISTS public.research_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
    source_title TEXT NOT NULL,
    source_url TEXT,
    site_name TEXT,
    extracted_information TEXT,
    evidence_category TEXT,
    is_verified_fact BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Evaluations Table
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE UNIQUE,
    weighted_score NUMERIC(5, 2) NOT NULL,
    factor_scores JSONB NOT NULL,
    confidence_level TEXT,
    research_coverage TEXT,
    evaluation_explanation TEXT,
    strengths JSONB,
    weaknesses JSONB,
    major_risks JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Roast Reports Table (Groq + Gemini Multi-model)
CREATE TABLE IF NOT EXISTS public.roast_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE UNIQUE,
    reality_check_score NUMERIC(5, 2) NOT NULL,
    brutal_verdict TEXT NOT NULL,
    biggest_weakness TEXT NOT NULL,
    top_five_failure_reasons JSONB,
    groq_critique JSONB,
    gemini_critique JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Solution Versions & Improvements Table
CREATE TABLE IF NOT EXISTS public.solution_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    changes_made JSONB,
    original_score NUMERIC(5, 2),
    improved_score NUMERIC(5, 2),
    score_delta NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roast_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solution_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only select, insert, and update their own records
CREATE POLICY "Users can access their own analyses" ON public.analyses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access solutions for their analyses" ON public.solutions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.analyses
            WHERE analyses.id = solutions.analysis_id
            AND analyses.user_id = auth.uid()
        )
    );

